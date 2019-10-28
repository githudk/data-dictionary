package top.hudk.dictionary.jdbc.factory;


import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import top.hudk.dictionary.entity.DatabaseConnectionInfo;
import top.hudk.dictionary.entity.DefHikariConfig;
import top.hudk.dictionary.util.DataSourceType;
import top.hudk.dictionary.util.Ping;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;

/**
 * 作用:多数据源管理，根据不同数据源信息，返回相应的数据源的连接池。
 *
 * @author hudk
 * @date 2019/10/23 22:42
 */
@Component
public class DataSourcefactory {

    private Logger logger = LoggerFactory.getLogger(DataSourcefactory.class);
    @Autowired
    private DefHikariConfig defConf;

    private HashMap<String, HikariDataSource> hikariDataSourceMap = new HashMap<String, HikariDataSource>();

    /**
     * 根据不同数据源信息，(创建)返回相应的数据源对象（的连接池）
     *
     * @param databaseConnectionInfo
     * @return
     * @throws SQLException
     */
    public HikariDataSource getDataSource(DatabaseConnectionInfo databaseConnectionInfo) throws Exception {
        String key = databaseConnectionInfo.getId();
        if (!hikariDataSourceMap.containsKey(key)) {
            synchronized (DataSourcefactory.class) {
                if (!hikariDataSourceMap.containsKey(key)) {
                    HikariDataSource dataSource = createHikariDataSource(databaseConnectionInfo);
                    hikariDataSourceMap.put(key, dataSource);
                }
            }
        }
        int idle = hikariDataSourceMap.get(key).getHikariPoolMXBean().getIdleConnections();
        int active = hikariDataSourceMap.get(key).getHikariPoolMXBean().getActiveConnections();
        int total = hikariDataSourceMap.get(key).getHikariPoolMXBean().getTotalConnections();
        String dbtype = databaseConnectionInfo.getDbtype();

        logger.info("获取到"+ dbtype +"数据源,id:"+key);
        logger.debug("取连接前 总连接数：" + total +", 空闲的接数：" +idle+", 活动的接数：" +active+";");

        return hikariDataSourceMap.get(key);
    }

    public Boolean hasContainsKey(String key){
        return hikariDataSourceMap.containsKey(key);
    }

    public void remove(String key){
        hikariDataSourceMap.remove(key);
    }
    /**
     * 根据数据源信息，创建对应的连接池，并返回。
     * 支持: Mysql、Oracle、SQLServer
     *
     * @param databaseConnectionInfo
     * @return
     */
    public   HikariDataSource createHikariDataSource(DatabaseConnectionInfo databaseConnectionInfo) throws Exception {
        String ip = databaseConnectionInfo.getDbadrr();
        Ping.pingTest(ip);
        HikariDataSource ds;
        //自定义数据源配置信息
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
                    + "; DatabaseName=" + databaseConnectionInfo.getDbname());
        }
        conf.setUsername(databaseConnectionInfo.getUsername());
        conf.setPassword(databaseConnectionInfo.getPassword());

        conf.setReadOnly(defConf.isReadOnly());//只读
        conf.setConnectionTimeout(defConf.getConnectionTimeout());//从连接池取出连接的最长等待时间，超过此事件则会报错
        conf.setIdleTimeout(defConf.getIdleTimeout());//连接允许在池中闲置的最长时间，0表示永久允许闲置
        conf.setMinimumIdle(defConf.getMinimumIdle());//池中维护的最小空闲连接数
        conf.setMaximumPoolSize(defConf.getMaximumPoolSize());//池中最大连接数，包括闲置和使用中的连接

        logger.info("创建连接池，类型：" + dbtype);
        //根据数据源信息，创建连接池
        try{
            ds = new HikariDataSource(conf);
        }catch (Exception e){

            logger.info("连接创建失败；");
            throw new Exception("连接创建失败；");
        }

        logger.info("连接池:" + ds.getPoolName() + "创建完成；");
        return ds;
    }
}
