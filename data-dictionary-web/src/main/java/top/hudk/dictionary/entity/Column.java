package top.hudk.dictionary.entity;

import lombok.Data;

/**
 * 作用:字段数据对象
 *
 * @author hudk
 * @date 2019/10/23 23:01
 */
@Data
public class Column {

    private String key;
    private String columnname;
    private String columncomment;
    private String datatype;
    private String datalen;

    @Override
    public String toString() {
        String str = "{data:{" +
                "\"key\":" + key + "," +
                "\"columnname\":\"" + columnname + "\"," +
                "\"columncomment\":\"" + columncomment + "\"," +
                "\"datatype\":\"" + datatype + "\"," +
                "\"datalen\":\"" + datalen + "\"" +
                "}}";
        return str;
    }
}
