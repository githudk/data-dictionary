package top.hudk.dictionary.jdbc.factory;

import top.hudk.dictionary.entity.DatabaseConnectionInfo;
import top.hudk.dictionary.util.DataSourceType;

/**
 * 作用:
 *
 * @author hudk
 * @date 2019/10/23 22:44
 */
public class SQLfactory {

    public static String sqlForTables(DatabaseConnectionInfo databaseConnectionInfo) {
        String dbtype = databaseConnectionInfo.getDbtype();
        String dbname = databaseConnectionInfo.getDbname();
        String sql = "";
        if (DataSourceType.MySQL.equals(dbtype)) {
            sql = "SELECT  Table_name,table_comment,TABLE_SCHEMA  FROM information_schema.TABLES WHERE  TABLE_SCHEMA='" + dbname + "';";
        }
        if (DataSourceType.Oracle.equals(dbtype)) {

        }
        if (DataSourceType.SQLServer.equals(dbtype)) {

        }
        return sql;
    }

    public static String sqlForColumns(DatabaseConnectionInfo databaseConnectionInfo, String tablename) {
        String dbtype = databaseConnectionInfo.getDbtype();
        String dbname = databaseConnectionInfo.getDbname();
        String sql = "";
        if (DataSourceType.MySQL.equals(dbtype)) {
            sql = "SELECT COLUMN_NAME,COLUMN_COMMENT,COLUMN_TYPE,CHARACTER_OCTET_LENGTH FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='" + dbname + "' AND TABLE_NAME='" + tablename + "';";
        }
        if (DataSourceType.Oracle.equals(dbtype)) {

        }
        if (DataSourceType.SQLServer.equals(dbtype)) {

        }
        return sql;
    }
}
