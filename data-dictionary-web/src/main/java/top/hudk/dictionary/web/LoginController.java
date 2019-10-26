package top.hudk.dictionary.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import top.hudk.dictionary.entity.*;
import top.hudk.dictionary.service.DictionaryService;

/**
 * 作用:登陆校验
 *
 * @author hudk
 * @date 2019/10/15 17:57
 */
@RestController
@RequestMapping("/admin")
public class LoginController {

    @Autowired
    DictionaryService dBService;

    /**
     * 用户名和密码，通过配置文件方式进行设置。
     */
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



}
