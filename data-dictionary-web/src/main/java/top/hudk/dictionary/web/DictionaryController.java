package top.hudk.dictionary.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import top.hudk.dictionary.entity.Column;
import top.hudk.dictionary.entity.Table;
import top.hudk.dictionary.service.DictionaryService;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

/**
 * 作用: 查询数据库信息
 *
 * @author hudk
 * @date 2019/10/26 22:16
 */
@RestController
@RequestMapping("/dictionary")
public class DictionaryController {


    @Autowired
    DictionaryService dBService;

    /**
     * 根据当下的数据源ID，获取该数据源下的所有Table
     * @param currentDB
     * @return
     * @throws IOException
     * @throws SQLException
     */
    @GetMapping("/gettables")
    public List<Table> getTables(@RequestParam(required = true) String currentDB) throws IOException, SQLException {
        return dBService.getTables(currentDB);
    }


    /**
     * 根据当下的数据源ID，和关键词，模糊匹配table名、注释，Cloumn名、注释，并返回符合条件内容对应的Table信息.
     * @param currentDB
     * @param text
     * @return
     * @throws IOException
     * @throws SQLException
     */
    @GetMapping("/gettablesbytext")
    public List<Table> getTablesByText(@RequestParam(required = true) String currentDB,@RequestParam(required = true) String text) throws IOException, SQLException {
        return dBService.getTablesByText(currentDB,text);
    }

    /**
     * 根据当下的数据源ID，和table名，获取该数据源下该Table的字段信息
     * @param currentDB
     * @param tablename
     * @return
     * @throws IOException
     * @throws SQLException
     */
    @GetMapping("/getcolumns")
    public List<Column> getColumns(@RequestParam(required = true) String currentDB, @RequestParam(required = true) String tablename) throws IOException, SQLException {
        return dBService.getColumns(currentDB,tablename);
    }

}
