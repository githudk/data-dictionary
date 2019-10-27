package top.hudk.dictionary.util;

import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;

/**
 * 作用:
 *
 * @author hudk
 * @date 2019/10/27 15:10
 */
public class Ping {

    public static boolean pingTest(String ip) throws Exception {
        int timeout = 3000;
        boolean result = false;
        try {
            result = InetAddress.getByName(ip).isReachable(timeout);
        } catch (IOException e) {
            throw  new Exception("数据库连接失败！");
        }
        if(!result){
            throw  new Exception("数据库连接失败！");
        }
        return result;
    }
}
