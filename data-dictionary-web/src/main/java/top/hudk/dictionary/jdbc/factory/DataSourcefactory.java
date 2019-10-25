package top.hudk.dictionary.jdbc.factory;

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

    private static final ThreadLocal<Deque<String>> CONTEXT_HOLDER = new ThreadLocal();
    private static HashMap<String, DataSource> dset = new HashMap<String, DataSource>();

    public static DataSource getDataSource(DatabaseConnectionInfo databaseConnectionInfo) throws SQLException {
        String kay = databaseConnectionInfo.getId();
        if(!hasDataSource(dset,kay)){
            synchronized (DataSourcefactory.class) {
                if(!hasDataSource(dset,kay)){
                    DataSource dataSource = createDataSource(databaseConnectionInfo);
                    dset.put(kay,dataSource);
                }
            }

        }
        return dset.get(kay);
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
}
