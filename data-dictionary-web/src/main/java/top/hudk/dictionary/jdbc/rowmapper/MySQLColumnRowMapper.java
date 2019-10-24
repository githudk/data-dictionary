package top.hudk.dictionary.jdbc.rowmapper;

import org.springframework.jdbc.core.RowMapper;
import top.hudk.dictionary.entity.Column;
import top.hudk.dictionary.entity.Table;

import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * 作用:
 *
 * @author hudk
 * @date 2019/10/23 23:06
 */
public class MySQLColumnRowMapper implements RowMapper<Column> {
    @Override
    public Column mapRow(ResultSet rs, int rowNum) throws SQLException {
        Column column = new Column();
        column.setKey(rs.getString("COLUMN_NAME") == null || "".equals(rs.getString("COLUMN_NAME")) ? "--" : rs.getString("COLUMN_NAME"));
        column.setColumnname(rs.getString("COLUMN_NAME") == null || "".equals(rs.getString("COLUMN_NAME")) ? "--" : rs.getString("COLUMN_NAME"));
        column.setColumncomment(rs.getString("COLUMN_COMMENT") == null || "".equals(rs.getString("COLUMN_COMMENT")) ? "--" : rs.getString("COLUMN_COMMENT"));
        column.setDatatype(rs.getString("COLUMN_TYPE") == null || "".equals(rs.getString("COLUMN_TYPE")) ? "--" : rs.getString("COLUMN_TYPE"));
        column.setDatalen(rs.getString("CHARACTER_OCTET_LENGTH") == null || "".equals(rs.getString("CHARACTER_OCTET_LENGTH")) ? "--" : rs.getString("CHARACTER_OCTET_LENGTH"));
        return column;
    }
}
