package top.hudk.dictionary.jdbc.rowmapper;

import org.springframework.jdbc.core.RowMapper;
import top.hudk.dictionary.entity.Table;


import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * 作用:
 *
 * @author hudk
 * @date 2019/10/23 22:37
 */
public class MySQLTableRowMapper implements RowMapper<Table>{
    @Override
    public Table mapRow(ResultSet rs, int rowNum) throws SQLException {
        Table table = new Table();
        table.setId(rs.getString("Table_name"));
        table.setTablecode(rs.getString("Table_name"));
        table.setTablename(rs.getString("table_comment"));
        return table;
    }
}
