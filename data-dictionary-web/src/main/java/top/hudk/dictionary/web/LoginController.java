package top.hudk.dictionary.web;

import org.springframework.web.bind.annotation.*;
import top.hudk.dictionary.entity.DatabaseConnectionInfo;
import top.hudk.dictionary.entity.Result;

import java.util.ArrayList;
import java.util.List;

/**
 * 作用:
 *
 * @author hudk
 * @date 2019/10/15 17:57
 */
@RestController
@RequestMapping("/admin")
public class LoginController {

    @GetMapping("/login")
    public Result login(@RequestParam(value = "username", required = true) String username,
                        @RequestParam(value = "password", required = true) String password) {
        String name = "admin";
        String psw = "123456";
        if (name.equals(username) && psw.equals(password)) {
            return new Result(1, "登陆成功");
        }
        return new Result(0, "用户名或密码错误");
    }


    @PostMapping("/adddb")
    public Result<DatabaseConnectionInfo> adddb(@RequestBody() DatabaseConnectionInfo databaseConnectionInfo) {
        System.out.println(databaseConnectionInfo.toString());
        Result result = new Result(1, "保存成功");
        databaseConnectionInfo.setId("4");
        result.setData(databaseConnectionInfo);
        return result;
    }

    /**
     * {
     * "dbadrr": "10.10.4.16",
     * "dbname": "orcl",
     * "dbport": "1521",
     * "dbtype": "oracle",
     * "password": "123456",
     * "username": "GREE"
     * },
     * {
     * "dbadrr": "39.106.229.84",
     * "dbname": "solo2",
     * "dbport": "3306",
     * "dbtype": "mysql",
     * "password": "111111",
     * "username": "hudk"
     * },
     * {
     * "dbadrr": "127.0.0.1",
     * "dbname": "qqq",
     * "dbport": "1433",
     * "dbtype": "sqlserver",
     * "password": "gh",
     * "username": "qqq"
     * }
     *
     * @return
     */
    @PostMapping("/getalldblist")
    public List<DatabaseConnectionInfo> getAllDBList() {
        List<DatabaseConnectionInfo> dblist = new ArrayList<DatabaseConnectionInfo>();

        DatabaseConnectionInfo atabaseConnectionInfo = new DatabaseConnectionInfo();
        atabaseConnectionInfo.setId("1");
        atabaseConnectionInfo.setDbadrr("10.10.4.16");
        atabaseConnectionInfo.setDbname("orcl");
        atabaseConnectionInfo.setDbport("1521");
        atabaseConnectionInfo.setDbtype("oracle");
        atabaseConnectionInfo.setPassword("123456");
        atabaseConnectionInfo.setUsername("GREE");
        dblist.add(atabaseConnectionInfo);

        DatabaseConnectionInfo atabaseConnectionInfo2 = new DatabaseConnectionInfo();
        atabaseConnectionInfo2.setId("2");
        atabaseConnectionInfo2.setDbadrr("39.106.229.84");
        atabaseConnectionInfo2.setDbname("solo2");
        atabaseConnectionInfo2.setDbport("3306");
        atabaseConnectionInfo2.setDbtype("mysql");
        atabaseConnectionInfo2.setPassword("111111");
        atabaseConnectionInfo2.setUsername("hudk");
        dblist.add(atabaseConnectionInfo2);

        DatabaseConnectionInfo atabaseConnectionInfo3 = new DatabaseConnectionInfo();
        atabaseConnectionInfo3.setId("3");
        atabaseConnectionInfo3.setDbadrr("127.0.0.1");
        atabaseConnectionInfo3.setDbname("orcl");
        atabaseConnectionInfo3.setDbport("1433");
        atabaseConnectionInfo3.setDbtype("sqlserver");
        atabaseConnectionInfo3.setPassword("123456");
        atabaseConnectionInfo3.setUsername("GREE");
        dblist.add(atabaseConnectionInfo3);

        return dblist;
    }


}
