package top.hudk.dictionary.entity;

import lombok.Data;

/**
 * 作用:
 *
 * @author hudk
 * @date 2019/10/15 18:01
 */
@Data
public class Result {

    public Result(int status,String msg){
        this.status = status;
        this.msg = msg;
    }
    /**
     *登陆结果：1表示成功，0表示失败
     */
    private int status;

    /**
     * 登陆返回的消息
     */
    private String msg;


}
