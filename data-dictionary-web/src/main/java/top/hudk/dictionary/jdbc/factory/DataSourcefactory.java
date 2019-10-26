package top.hudk.dictionary.jdbc.factory;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.stereotype.Component;
import top.hudk.dictionary.entity.DatabaseConnectionInfo;
import top.hudk.dictionary.util.DataSourceType;

import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.Deque;
import java.util.HashMap;
import java.util.HashSet;

/**
 * 作用:
 *
 * @author hudk
 * @date 2019/10/23 22:42
 */
@Component
public class DataSourcefactory {

    private DataSourcefactory(){}
    @Autowired
    private static ThreadLocal<HashMap<String, DataSource>> ThreadLocal;
    private static HashMap<String, DataSource> dset = new HashMap<String, DataSource>();
    private static HashMap<String, HikariDataSource> dspool = new HashMap<String, HikariDataSource>();

    public static HikariDataSource getDataSource(DatabaseConnectionInfo databaseConnectionInfo) throws SQLException {
        String kay = databaseConnectionInfo.getId();
        if(!hasHikariDataSource(dspool,kay)){
            synchronized (DataSourcefactory.class) {
                if(!hasHikariDataSource(dspool,kay)){
                    HikariDataSource dataSource = createHikariDataSource(databaseConnectionInfo);
                    dspool.put(kay,dataSource);
                }
            }
        }
        return dspool.get(kay);
    }

    public static boolean hasDataSource(HashMap<String, DataSource> dset,String kay){
        boolean isContains =  dset.containsKey(kay);
        boolean isValid = true;
        if(isContains){
            try {
                dset.get(kay).getConnection();
            } catch (Exception e) {
                isValid = false;
            }
        }


        return isContains && isValid;
    }

    public static boolean hasHikariDataSource(HashMap<String, HikariDataSource> dspool,String kay){
        boolean isContains =  dspool.containsKey(kay);
        boolean isValid = true;
        if(isContains){
            try {
                dspool.get(kay).getConnection();
            } catch (Exception e) {
                isValid = false;
            }
        }


        return isContains && isValid;
    }

    public static DataSource createDataSource(DatabaseConnectionInfo databaseConnectionInfo) {
        DataSourceBuilder dsbuilder = DataSourceBuilder.create();
        String dbtype = databaseConnectionInfo.getDbtype();
        if (DataSourceType.MySQL.equals(dbtype)) {
            //dsbuilder.driverClassName(DataSourceType.MySQLDriverClassName);
            dsbuilder.url("jdbc:mysql://"
                    + databaseConnectionInfo.getDbadrr()
                    + ":" + databaseConnectionInfo.getDbport()
                    + "/" + databaseConnectionInfo.getDbname()
                    + "?useUnicode=true&characterEncoding=utf8&autoReconnect=true");
        }
        if (DataSourceType.Oracle.equals(dbtype)) {
            //dsbuilder.driverClassName(DataSourceType.OracleDriverClassName);
            dsbuilder.url("jdbc:oracle:thin:@"
                    + databaseConnectionInfo.getDbadrr()
                    + ":" + databaseConnectionInfo.getDbport()
                    + "/" + databaseConnectionInfo.getDbname());
        }
        if (DataSourceType.SQLServer.equals(dbtype)) {
            //dsbuilder.driverClassName(DataSourceType.SQLServerDriverClassName);
            dsbuilder.url("jdbc:microsoft:sqlserver://"
                    + databaseConnectionInfo.getDbadrr()
                    + ":" + databaseConnectionInfo.getDbport()
                    + "; DatabaseName="+ databaseConnectionInfo.getDbname());
        }
        dsbuilder.username(databaseConnectionInfo.getUsername());
        dsbuilder.password(databaseConnectionInfo.getPassword());
        return dsbuilder.build();
    }


    public static HikariDataSource createHikariDataSource(DatabaseConnectionInfo databaseConnectionInfo) {
        HikariDataSource ds;
        HikariConfig conf = new HikariConfig();
        String dbtype = databaseConnectionInfo.getDbtype();
        if (DataSourceType.MySQL.equals(dbtype)) {
            conf.setJdbcUrl("jdbc:mysql://"
                    + databaseConnectionInfo.getDbadrr()
                    + ":" + databaseConnectionInfo.getDbport()
                    + "/" + databaseConnectionInfo.getDbname()
                    + "?useUnicode=true&characterEncoding=utf8&autoReconnect=true");
        }
        if (DataSourceType.Oracle.equals(dbtype)) {
            conf.setJdbcUrl("jdbc:oracle:thin:@"
                    + databaseConnectionInfo.getDbadrr()
                    + ":" + databaseConnectionInfo.getDbport()
                    + "/" + databaseConnectionInfo.getDbname());
        }
        if (DataSourceType.SQLServer.equals(dbtype)) {
            conf.setJdbcUrl("jdbc:microsoft:sqlserver://"
                    + databaseConnectionInfo.getDbadrr()
                    + ":" + databaseConnectionInfo.getDbport()
                    + "; DatabaseName="+ databaseConnectionInfo.getDbname());
        }
        conf.setUsername(databaseConnectionInfo.getUsername());
        conf.setPassword(databaseConnectionInfo.getPassword());
        conf.setReadOnly(true);//只读
        conf.setConnectionTimeout(2000);//从连接池取出连接的最长等待时间，超过此事件则会报错
        conf.setIdleTimeout(60000);//连接允许在池中闲置的最长时间，0表示永久允许闲置
        conf.setMinimumIdle(10);//池中维护的最小空闲连接数
        conf.setMaximumPoolSize(60);//池中最大连接数，包括闲置和使用中的连接
        ds = new HikariDataSource(conf);
        return ds;
    }
}
