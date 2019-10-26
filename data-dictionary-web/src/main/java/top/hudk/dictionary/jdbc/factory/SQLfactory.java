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
            sql = "SELECT TABLE_NAME,IFNULL(TABLE_COMMENT,TABLE_NAME) TABLE_COMMENT,TABLE_SCHEMA " +
                    " FROM INFORMATION_SCHEMA.TABLES " +
                    "WHERE  TABLE_SCHEMA='" + dbname + "'";
        }
        if (DataSourceType.Oracle.equals(dbtype)) {
            sql = "SELECT DISTINCT T.TABLE_NAME, NVL(C.COMMENTS,T.TABLE_NAME) COMMENTS " +
                    "    FROM USER_TABLES T LEFT JOIN USER_TAB_COMMENTS C " +
                    "   ON T.TABLE_NAME = C.TABLE_NAME " +
                    "   ORDER BY TABLE_NAME ";
        }
        if (DataSourceType.SQLServer.equals(dbtype)) {

        }
        return sql;
    }


    public static String sqlForTablesByText(DatabaseConnectionInfo databaseConnectionInfo, String text) {
        String dbtype = databaseConnectionInfo.getDbtype();
        String dbname = databaseConnectionInfo.getDbname();
        String sql = "";
        if (DataSourceType.MySQL.equals(dbtype)) {
            sql = "SELECT DISTINCT " +
                    "  col.TABLE_NAME, " +
                    "  IFNULL(tab.TABLE_COMMENT, tab.TABLE_NAME) TABLE_COMMENT " +
                    "FROM " +
                    "  INFORMATION_SCHEMA.COLUMNS col " +
                    "  LEFT JOIN INFORMATION_SCHEMA.TABLES tab " +
                    "  ON tab.table_name = col.table_name " +
                    "  AND col.TABLE_SCHEMA = tab.TABLE_SCHEMA " +
                    "WHERE col.TABLE_SCHEMA = '" + dbname + "'  " +
                    "  AND (tab.TABLE_NAME LIKE '%" + text + "%' " +
                    "  OR tab.TABLE_COMMENT LIKE '%" + text + "%' " +
                    "  OR col.COLUMN_NAME LIKE '%" + text + "%' " +
                    "  OR col.COLUMN_COMMENT LIKE '%" + text + "%')";
        }
        if (DataSourceType.Oracle.equals(dbtype)) {
            sql = "    SELECT DISTINCT COLS.TABLE_NAME, NVL(TABCOM.COMMENTS,COLS.TABLE_NAME) COMMENTS " +
                    "  FROM USER_TAB_COLS COLS " +
                    "  LEFT JOIN USER_COL_COMMENTS COMM " +
                    "    ON COLS.COLUMN_NAME = COMM.COLUMN_NAME " +
                    "   AND COLS.TABLE_NAME = COMM.TABLE_NAME " +
                    "  LEFT JOIN USER_TABLES TAB " +
                    "    ON TAB.TABLE_NAME = COLS.TABLE_NAME " +
                    "  LEFT JOIN USER_TAB_COMMENTS TABCOM " +
                    "    ON TABCOM.TABLE_NAME = COLS.TABLE_NAME " +
                    " WHERE COLS.COLUMN_NAME LIKE '%" + text + "%' " +
                    "    OR COLS.TABLE_NAME LIKE '%" + text + "%' " +
                    "    OR TABCOM.COMMENTS LIKE '%" + text + "%' " +
                    "    OR COMM.COMMENTS LIKE '%" + text + "%' ";
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
            sql = "SELECT COLUMN_NAME,IFNULL(COLUMN_COMMENT,COLUMN_NAME) COLUMN_COMMENT,COLUMN_TYPE,CHARACTER_OCTET_LENGTH " +
                    "FROM INFORMATION_SCHEMA.COLUMNS " +
                    "WHERE TABLE_SCHEMA='" + dbname + "' " +
                    "AND TABLE_NAME='" + tablename + "'";
        }
        if (DataSourceType.Oracle.equals(dbtype)) {
            sql = "SELECT COLS.TABLE_NAME, " +
                    "       COLS.COLUMN_NAME, " +
                    "       nvl(COMM.COMMENTS, COLS.COLUMN_NAME) COMMENTS, " +
                    "       COLS.DATA_TYPE, " +
                    "       COLS.DATA_LENGTH " +
                    "  FROM USER_TAB_COLS COLS " +
                    "  LEFT JOIN USER_COL_COMMENTS COMM " +
                    "    ON COLS.COLUMN_NAME = COMM.COLUMN_NAME " +
                    "    and COLS.TABLE_NAME = COMM.table_name " +
                    "  WHERE COLS.TABLE_NAME = '" + tablename + "' ";
        }
        if (DataSourceType.SQLServer.equals(dbtype)) {

        }
        return sql;
    }
}
