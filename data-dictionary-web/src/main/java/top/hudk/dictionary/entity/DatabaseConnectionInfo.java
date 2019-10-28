package top.hudk.dictionary.entity;

import lombok.Data;
import lombok.ToString;

/**
 * 作用:数据源数据对象
 *
 * @author hudk
 * @date 2019/10/16 22:04
 */
@Data
public class DatabaseConnectionInfo {

    private String id;

    private String username;

    private String password;

    private String dbadrr;

    private String dbport;

    private String dbname;

    private String dbtype;

    @Override
    public String toString() {
        String str = "{data:{" +
                "\"id\":\"" + id + "\"," +
                "\"username\":\"" + username + "\"," +
                "\"password\":\"" + password + "\"," +
                "\"dbadrr\":\"" + dbadrr + "\"," +
                "\"dbport\":\"" + dbport + "\"," +
                "\"dbname\":\"" + dbname + "\"," +
                "\"dbtype\":\"" + dbtype + "\"," +
                "}}";
        return str;
    }

}
