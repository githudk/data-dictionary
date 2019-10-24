package top.hudk.dictionary.jdbc.rowmapper;

import org.springframework.jdbc.core.RowMapper;
import top.hudk.dictionary.entity.Table;

import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * 作用:
 *
 * @author hudk
 * @date 2019/10/23 22:34
 */
public class OracleTableRowMapper implements RowMapper<Table> {
    @Override
    public Table mapRow(ResultSet rs, int rowNum) throws SQLException {
        Table table = new Table();
        table.setId(rs.getString("TABLE_NAME"));
        table.setTablecode(rs.getString("TABLE_NAME"));
        table.setTablename(rs.getString("COMMENTS"));
        return table;
    }
}
