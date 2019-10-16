package top.hudk.dictionary.web;

import org.springframework.web.bind.annotation.*;
import top.hudk.dictionary.entity.DatabaseConnectionInfo;
import top.hudk.dictionary.entity.Result;

/**
 * 作用:
 *
 * @author hudk
 * @date 2019/10/15 17:57
 */
@RestController
@RequestMapping("/admin")
public class LoginController {

    @PostMapping("/login")
    public Result login(@RequestParam("username")String name, @RequestParam("password")String psw){
        String username = "admin";
        String password = "123456";
        if(username.equals(name) && password.equals(psw)){
            return new Result(1,"登陆成功");
        }
        return new Result(0,"用户名或密码错误");
    }


    @PostMapping("/adddb")
    public Result adddb(@RequestBody() DatabaseConnectionInfo databaseConnectionInfo){
        System.out.println(databaseConnectionInfo.toString());
        return new Result(1,"保存成功");
    }
}
