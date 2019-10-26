package top.hudk.dictionary.entity;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * 作用: 自定义连接池配置
 *
 * @author hudk
 * @date 2019/10/26 22:55
 */
@Component
@ConfigurationProperties(prefix="defhikariconfig")
@Data
public class DefHikariConfig {

    /**
     * 池中维护的最小空闲连接数
     */
    private int minimumIdle;

    /**
     * 池中最大连接数，包括闲置和使用中的连接
     */
    private int maximumPoolSize;
    /**
     * 等待来自池的连接的最大毫秒数
     */
    private long connectionTimeout;
    /**
     * 连接允许在池中闲置的最长时间
     */
    private long idleTimeout;
    /**
     * 从池中获取的连接是否默认处于只读模式
     */
    private boolean readOnly;
}
