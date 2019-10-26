package top.hudk.dictionary.jdbc.rowmapper;

import org.springframework.jdbc.core.RowMapper;
import top.hudk.dictionary.entity.Table;


import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * 作用: “表”字段转换
 *
 * @author hudk
 * @date 2019/10/23 22:37
 */
public class TableRowMapper implements RowMapper<Table>{
    @Override
    public Table mapRow(ResultSet rs, int rowNum) throws SQLException {
        Table table = new Table();
        table.setId(rs.getString("TABLE_NAME"));
        table.setTablecode(rs.getString("TABLE_NAME"));
        table.setTablename(rs.getString("TABLE_COMMENT"));
        return table;
    }
}
