package top.hudk.dictionary.entity;

import lombok.Data;

/**
 * 作用:
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

}
