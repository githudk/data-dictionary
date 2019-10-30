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
        logger.info("创建连接池，类型：" + dbtype);
        logger.info("配置连接池：");
        if (DataSourceType.MySQL.equals(dbtype)) {
            String mysqlurl = "jdbc:mysql://"
                    + databaseConnectionInfo.getDbadrr()
                    + ":" + databaseConnectionInfo.getDbport()
                    + "/" + databaseConnectionInfo.getDbname()
                    + "?useUnicode=true&characterEncoding=utf8&autoReconnect=true";
            conf.setDriverClassName(DataSourceType.MySQLDriverClassName);
            conf.setJdbcUrl(mysqlurl);
            logger.info("数据源URL："+mysqlurl);
        }
        if (DataSourceType.Oracle.equals(dbtype)) {
            String oracleurl = "jdbc:oracle:thin:@"
                    + databaseConnectionInfo.getDbadrr()
                    + ":" + databaseConnectionInfo.getDbport()
                    + "/" + databaseConnectionInfo.getDbname();
            conf.setDriverClassName(DataSourceType.OracleDriverClassName);
            conf.setJdbcUrl(oracleurl);
            logger.info("数据源URL："+oracleurl);
        }
        if (DataSourceType.SQLServer.equals(dbtype)) {
            String sqlserverurl = "jdbc:microsoft:sqlserver://"
                    + databaseConnectionInfo.getDbadrr()
                    + ":" + databaseConnectionInfo.getDbport()
                    + "; DatabaseName=" + databaseConnectionInfo.getDbname();
            conf.setDriverClassName(DataSourceType.SQLServerDriverClassName);
            conf.setJdbcUrl(sqlserverurl);
            logger.info("数据源URL："+sqlserverurl);
        }
        conf.setUsername(databaseConnectionInfo.getUsername());
        logger.info("数据源用户："+databaseConnectionInfo.getUsername());
        conf.setPassword(databaseConnectionInfo.getPassword());
        logger.info("数据源密码："+databaseConnectionInfo.getPassword());

        conf.setReadOnly(defConf.isReadOnly());//只读
        logger.info("是否只读：" + defConf.isReadOnly());
        conf.setConnectionTimeout(defConf.getConnectionTimeout());//从连接池取出连接的最长等待时间，超过此事件则会报错
        logger.info("从连接池取出连接的最长等待时间：" + defConf.getConnectionTimeout());
        conf.setIdleTimeout(defConf.getIdleTimeout());//连接允许在池中闲置的最长时间，0表示永久允许闲置
        logger.info("连接允许在池中闲置的最长时间：" + defConf.getIdleTimeout());
        conf.setMinimumIdle(defConf.getMinimumIdle());//池中维护的最小空闲连接数
        logger.info("池中维护的最小空闲连接数：" + defConf.getMinimumIdle());
        conf.setMaximumPoolSize(defConf.getMaximumPoolSize());//池中最大连接数，包括闲置和使用中的连接
        logger.info("池中最大连接数：" + defConf.getMaximumPoolSize());
        logger.info("配置结束，开始创建");
        //根据数据源信息，创建连接池
        try{
            ds = new HikariDataSource(conf);
        }catch (Exception e){
            logger.info("连接池创建失败:"+e.getMessage());
            e.printStackTrace();
            throw new Exception("连接池创建失败；");
        }

        logger.info("连接池:" + ds.getPoolName() + "创建完成；");
        return ds;
    }
}
