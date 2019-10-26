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
public class ColumnRowMapper implements RowMapper<Column> {
    @Override
    public Column mapRow(ResultSet rs, int rowNum) throws SQLException {
        Column column = new Column();
        column.setKey(rs.getString("COLUMN_NAME"));
        column.setColumnname(rs.getString("COLUMN_NAME"));
        column.setColumncomment(rs.getString("COLUMN_COMMENT"));
        column.setDatatype(rs.getString("DATA_TYPE"));
        column.setDatalen(rs.getString("DATA_LENGTH"));
        return column;
    }
}
