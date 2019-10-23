package top.hudk.dictionary.jdbc.factory;

import org.springframework.jdbc.core.RowMapper;
import top.hudk.dictionary.entity.DatabaseConnectionInfo;
import top.hudk.dictionary.jdbc.rowmapper.*;
import top.hudk.dictionary.util.DataSourceType;


/**
 * 作用:
 *
 * @author hudk
 * @date 2019/10/23 23:10
 */
public class RowMapperfactory {

    public static RowMapper getTableRowMapper(DatabaseConnectionInfo databaseConnectionInfo){
        String dbtype = databaseConnectionInfo.getDbtype();
        if (DataSourceType.MySQL.equals(dbtype)) {
            return new MySQLTableRowMapper();
        }
        if (DataSourceType.Oracle.equals(dbtype)) {
            return new OracleTableRowMapper();
        }
        if (DataSourceType.SQLServer.equals(dbtype)) {
            return new SQLServerTableRowMapper();
        }
        return null;
    }

    public static RowMapper getColumnRowMapper(DatabaseConnectionInfo databaseConnectionInfo){
        String dbtype = databaseConnectionInfo.getDbtype();
        if (DataSourceType.MySQL.equals(dbtype)) {
            return new MySQLColumnRowMapper();
        }
        if (DataSourceType.Oracle.equals(dbtype)) {
            return new OracleColumnRowMapper();
        }
        if (DataSourceType.SQLServer.equals(dbtype)) {
            return new SQLServerColumnRowMapper();
        }
        return null;
    }
}
