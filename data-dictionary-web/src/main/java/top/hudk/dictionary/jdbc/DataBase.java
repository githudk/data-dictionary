package top.hudk.dictionary.jdbc;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;
import top.hudk.dictionary.entity.Column;
import top.hudk.dictionary.entity.DatabaseConnectionInfo;
import top.hudk.dictionary.entity.Table;
import top.hudk.dictionary.jdbc.factory.DataSourcefactory;
import top.hudk.dictionary.jdbc.factory.SQLfactory;
import top.hudk.dictionary.jdbc.rowmapper.ColumnRowMapper;
import top.hudk.dictionary.jdbc.rowmapper.TableRowMapper;

import java.sql.SQLException;
import java.util.List;

/**
 * 作用:查询表，字段，模糊查询
 *
 * @author hudk
 * @date 2019/10/23 21:56
 */
@Component
public class DataBase {

    @Autowired
    DataSourcefactory dataSourcefactory;

    private Logger logger = LoggerFactory.getLogger(DataSourcefactory.class);

    /**
     * 获取当下数据源中的所有表
     * @param databaseConnectionInfo
     * @return
     * @throws Exception
     */
    public List<Table> getTables(DatabaseConnectionInfo databaseConnectionInfo) throws Exception {


        String key = databaseConnectionInfo.getId();
        logger.info("从数据源: '"+ key +"' 中获取所有表; ");

        HikariDataSource ds = dataSourcefactory.getDataSource(databaseConnectionInfo);
        JdbcTemplate JdbcTemplate = new JdbcTemplate(ds);
        String sql = SQLfactory.sqlForTables(databaseConnectionInfo);
        RowMapper rowMapper = new TableRowMapper();
        List<Table> tables = JdbcTemplate.query(sql, rowMapper);

        int idle = ds.getHikariPoolMXBean().getIdleConnections();
        int active = ds.getHikariPoolMXBean().getActiveConnections();
        int total = ds.getHikariPoolMXBean().getTotalConnections();

        logger.debug("取连接后 总连接数：" + total +", 空闲的接数：" +idle+", 活动的接数：" +active+";");
        logger.info("从数据源: '"+ key +"' 中获取所有表，成功; ");
        return tables;
    }

    /**
     * 根据关键词，获取符合要求的表
     * @param databaseConnectionInfo
     * @param text
     * @return
     * @throws Exception
     */
    public List<Table> getTablesByText(DatabaseConnectionInfo databaseConnectionInfo, String text) throws Exception {

        String key = databaseConnectionInfo.getId();
        logger.info("从数据源: '"+ key +"' 中搜索内容，关键词："+ text +"; ");

        HikariDataSource ds = dataSourcefactory.getDataSource(databaseConnectionInfo);
        JdbcTemplate JdbcTemplate = new JdbcTemplate(ds);
        String sql = SQLfactory.sqlForTablesByText(databaseConnectionInfo, text);
        RowMapper rowMapper = new TableRowMapper();
        List<Table> tables = JdbcTemplate.query(sql, rowMapper);

        int idle = ds.getHikariPoolMXBean().getIdleConnections();
        int active = ds.getHikariPoolMXBean().getActiveConnections();
        int total = ds.getHikariPoolMXBean().getTotalConnections();

        logger.debug("取连接后 总连接数：" + total +", 空闲的接数：" +idle+", 活动的接数：" +active+";");

        logger.info("从数据源: '"+ key +"' 中搜索内容，关键词："+ text +"，成功; ");
        return tables;
    }

    /**
     * 获取当下数据源中，特定表中的所有字段
     * @param databaseConnectionInfo
     * @param tablename
     * @return
     * @throws Exception
     */
    public List<Column> getColumns(DatabaseConnectionInfo databaseConnectionInfo, String tablename) throws Exception {
        String key = databaseConnectionInfo.getId();
        logger.info("从数据源: '"+ key +"' ，表：'"+ tablename +"' 中查询“字段”; ");

        HikariDataSource ds = dataSourcefactory.getDataSource(databaseConnectionInfo);
        JdbcTemplate JdbcTemplate = new JdbcTemplate(ds);
        String sql = SQLfactory.sqlForColumns(databaseConnectionInfo, tablename);
        RowMapper rowMapper = new ColumnRowMapper();
        List<Column> column = JdbcTemplate.query(sql, rowMapper);

        int idle = ds.getHikariPoolMXBean().getIdleConnections();
        int active = ds.getHikariPoolMXBean().getActiveConnections();
        int total = ds.getHikariPoolMXBean().getTotalConnections();

        logger.debug("取连接后 总连接数：" + total +", 空闲的接数：" +idle+", 活动的接数：" +active+";");

        logger.info("从数据源: '"+ key +"' ，表：'"+ tablename +"' 中查询“字段”，成功; ");
        return column;
    }

}
