package top.hudk.dictionary.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import top.hudk.dictionary.entity.DatabaseConnectionInfo;
import top.hudk.dictionary.entity.Result;
import top.hudk.dictionary.entity.Table;
import top.hudk.dictionary.entity.User;
import top.hudk.dictionary.service.DBService;

import java.io.IOException;
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

    @Autowired
    DBService dBService;

    @Autowired
    private User user;

    @GetMapping("/login")
    public Result login(@RequestParam(value = "username", required = true) String username,
                        @RequestParam(value = "password", required = true) String password) {
        if (user.getUsername().equals(username) && user.getPassword().equals(password)) {
            return new Result(1, "登陆成功");
        }
        return new Result(0, "用户名或密码错误");
    }


    @PostMapping("/savedb")
    public Result<DatabaseConnectionInfo> adddb(@RequestBody() DatabaseConnectionInfo databaseConnectionInfo) {
        Result result = null;
        try {
            dBService.save(databaseConnectionInfo);
            result = new Result(1, "保存成功");
        } catch (IOException e) {
            result = new Result(0, "保存失败："+e.getMessage());
        }
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
    @PostMapping("/getdblist")
    public List<DatabaseConnectionInfo> getAllDBList() throws IOException {
        return dBService.getAll();
    }

    @PostMapping("/gettables")
    public List<Table> getTables(@RequestParam(required = true) String currentDB) throws IOException {
        return dBService.getTables(currentDB);
    }


}
