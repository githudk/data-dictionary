package top.hudk.dictionary.jdbc.factory;

import org.springframework.boot.jdbc.DataSourceBuilder;
import top.hudk.dictionary.entity.DatabaseConnectionInfo;
import top.hudk.dictionary.util.DataSourceType;

import javax.sql.DataSource;

/**
 * 作用:
 *
 * @author hudk
 * @date 2019/10/23 22:42
 */
public class DataSourcefactory {
    public static DataSource getDataSource(DatabaseConnectionInfo databaseConnectionInfo) {
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
            dsbuilder.driverClassName(DataSourceType.OracleDriverClassName);
            dsbuilder.url("jdbc:oracle:thin:@"
                    + databaseConnectionInfo.getDbadrr()
                    + ":" + databaseConnectionInfo.getDbport()
                    + "/" + databaseConnectionInfo.getDbname());
        }
        if (DataSourceType.SQLServer.equals(dbtype)) {
            dsbuilder.driverClassName(DataSourceType.SQLServerDriverClassName);
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
