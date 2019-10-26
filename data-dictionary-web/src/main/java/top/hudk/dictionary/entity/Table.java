package top.hudk.dictionary.entity;

import lombok.Data;

/**
 * 作用:表数据对象
 *
 * @author hudk
 * @date 2019/10/23 20:48
 */
@Data
public class Table {

    private String  id;

    private String tablecode;

    private String tablename;

    @Override
    public String toString(){
        String str = "{data:{" +
                "\"id\":" +id+","+
                "\"tablecode\":\"" +tablecode+"\","+
                "\"tablename\":\"" +tablename+"\""+
                "}}";
        return str;
    }
}
