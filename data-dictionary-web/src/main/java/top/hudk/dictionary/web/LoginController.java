package top.hudk.dictionary.web;

import org.springframework.web.bind.annotation.*;
import top.hudk.dictionary.entity.LoginResult;

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
    public LoginResult login(@RequestParam("username")String name, @RequestParam("password")String psw){
        String username = "admin";
        String password = "123456";
        if(username.equals(name) && password.equals(psw)){
            return new LoginResult(1,"登陆成功");
        }
        return new LoginResult(0,"用户名或密码错误");
    }
}
