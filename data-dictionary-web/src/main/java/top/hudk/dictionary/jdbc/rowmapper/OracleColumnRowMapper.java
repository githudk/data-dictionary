package top.hudk.dictionary.jdbc.rowmapper;

import org.springframework.jdbc.core.RowMapper;
import top.hudk.dictionary.entity.Column;

import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * 作用:
 *
 * @author hudk
 * @date 2019/10/23 23:06
 */
public class OracleColumnRowMapper implements RowMapper<Column> {
    @Override
    public Column mapRow(ResultSet rs, int rowNum) throws SQLException {
        Column column = new Column();
        column.setKey(rs.getString("NAME"));
        column.setColumnname(rs.getString("NAME"));
        column.setColumncomment(rs.getString("NAME"));
        column.setDatatype(rs.getString("NAME"));
        column.setDatalen(rs.getString("NAME"));
        return column;
    }
}
