package top.hudk.dictionary.jdbc;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;
import top.hudk.dictionary.entity.Column;
import top.hudk.dictionary.entity.DatabaseConnectionInfo;
import top.hudk.dictionary.entity.Table;
import top.hudk.dictionary.jdbc.factory.DataSourcefactory;
import top.hudk.dictionary.jdbc.factory.RowMapperfactory;
import top.hudk.dictionary.jdbc.factory.SQLfactory;
import top.hudk.dictionary.jdbc.rowmapper.MySQLTableRowMapper;

import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

/**
 * 作用:
 *
 * @author hudk
 * @date 2019/10/23 21:56
 */
@Component
public class DataBase {

    public List<Table> getTables(DatabaseConnectionInfo databaseConnectionInfo) throws SQLException {
        HikariDataSource ds = DataSourcefactory.getDataSource(databaseConnectionInfo);
        JdbcTemplate JdbcTemplate = new JdbcTemplate(ds);
        String sql =SQLfactory.sqlForTables(databaseConnectionInfo);
        RowMapper rowMapper = RowMapperfactory.getTableRowMapper(databaseConnectionInfo);
        List<Table> tables = JdbcTemplate.query(sql,rowMapper);
        System.out.println("****************");
        System.out.println("执行close前");
        System.out.println("HikariDataSource:"+ds.isClosed());
        System.out.println("Connection"+ds.getConnection().isClosed());
        ds.getConnection().close();
        System.out.println("执行close后");
        System.out.println("HikariDataSource:"+ds.isClosed());
        System.out.println("Connection"+ds.getConnection().isClosed());
        return tables;
    }

    public List<Table> getTablesByText(DatabaseConnectionInfo databaseConnectionInfo,String text) throws SQLException {
        HikariDataSource ds = DataSourcefactory.getDataSource(databaseConnectionInfo);
        JdbcTemplate JdbcTemplate = new JdbcTemplate(ds);
        String sql =SQLfactory.sqlForTablesByText(databaseConnectionInfo,text);
        RowMapper rowMapper = RowMapperfactory.getTableRowMapper(databaseConnectionInfo);
        List<Table> tables = JdbcTemplate.query(sql,rowMapper);
        System.out.println("****************");
        System.out.println("执行close前");
        System.out.println("HikariDataSource:"+ds.isClosed());
        System.out.println("Connection"+ds.getConnection().isClosed());
        ds.getConnection().close();
        System.out.println("执行close后");
        System.out.println("HikariDataSource:"+ds.isClosed());
        System.out.println("Connection"+ds.getConnection().isClosed());
        return tables;
    }

    public List<Column> getColumns(DatabaseConnectionInfo databaseConnectionInfo,String tablename) throws SQLException {
        HikariDataSource ds = DataSourcefactory.getDataSource(databaseConnectionInfo);
        JdbcTemplate JdbcTemplate = new JdbcTemplate(ds);
        String sql =SQLfactory.sqlForColumns(databaseConnectionInfo, tablename);
        RowMapper rowMapper = RowMapperfactory.getColumnRowMapper(databaseConnectionInfo);
        List<Column> column = JdbcTemplate.query(sql,rowMapper);
        System.out.println("****************");
        System.out.println("执行close前");
        System.out.println("HikariDataSource:"+ds.isClosed());
        System.out.println("Connection"+ds.getConnection().isClosed());
        ds.getConnection().close();
        System.out.println("执行close后");
        System.out.println("HikariDataSource:"+ds.isClosed());
        System.out.println("Connection"+ds.getConnection().isClosed());
        return column;
    }

}
