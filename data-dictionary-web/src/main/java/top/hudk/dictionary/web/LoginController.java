package top.hudk.dictionary.web;

import org.apache.coyote.Response;
import org.omg.CORBA.Request;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpRequest;
import org.springframework.web.bind.annotation.*;
import top.hudk.dictionary.entity.*;
import top.hudk.dictionary.jdbc.factory.DataSourcefactory;
import top.hudk.dictionary.service.DictionaryService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 作用:登陆校验
 *
 * @author hudk
 * @date 2019/10/15 17:57
 */
@RestController
@RequestMapping("")
public class LoginController {

    @Autowired
    DictionaryService dBService;

    private Logger logger = LoggerFactory.getLogger(DataSourcefactory.class);

    /**
     * 用户名和密码，通过配置文件方式进行设置。
     */
    @Autowired
    private User user;

    @GetMapping("/admin/login")
    public Result login(@RequestParam(value = "username", required = true) String username,
                        @RequestParam(value = "password", required = true) String password) {

        logger.info(">>>>>>>>>>>>>>开始登陆：" + username);

        if (user.getUsername().equals(username) && user.getPassword().equals(password)) {
            logger.info(">>>>>>>>>>>>>>登陆成功！");
            return new Result(1, "登陆成功");
        }
        logger.info(">>>>>>>>>>>>>>登陆失败！");
        return new Result(0, "用户名或密码错误");
    }

    @RequestMapping("/")
    public void goAdmin(HttpServletRequest request,HttpServletResponse response) throws IOException {
        response.sendRedirect(request.getContextPath()+"/login");
    }



}
