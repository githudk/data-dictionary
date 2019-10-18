package top.hudk.dictionary.entity;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * 作用:
 *
 * @author hudk
 * @date 2019/10/18 10:40
 */
@Component
@ConfigurationProperties(prefix="apploginuser")
@Data
public class User {

    private String username;

    private String password;

}
