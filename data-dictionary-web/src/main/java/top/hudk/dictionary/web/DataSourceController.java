package top.hudk.dictionary.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import top.hudk.dictionary.entity.DatabaseConnectionInfo;
import top.hudk.dictionary.entity.Result;
import top.hudk.dictionary.jdbc.factory.DataSourcefactory;
import top.hudk.dictionary.service.DictionaryService;

import java.io.IOException;
import java.util.List;

/**
 * 作用:
 *
 * @author hudk
 * @date 2019/10/26 22:13
 */
@RestController
@RequestMapping("/datasource")
public class DataSourceController {


    @Autowired
    DictionaryService dBService;

    private Logger logger = LoggerFactory.getLogger(DataSourcefactory.class);

    @PostMapping("/savedb")
    public Result<DatabaseConnectionInfo> adddb(@RequestBody() DatabaseConnectionInfo databaseConnectionInfo) {

        logger.info(">>>>>>>>>>>>>>请求处理开始：添加数据源;");

        Result result = null;
        try {

            dBService.save(databaseConnectionInfo);

            logger.info(">>>>>>>>>>>>>>添加成功;");

            result = new Result(1, "保存成功");
        } catch (IOException e) {

            logger.info(">>>>>>>>>>>>>>添加失败:"+e.getMessage());

            result = new Result(0, "保存失败："+e.getMessage());
        }
        result.setData(databaseConnectionInfo);

        logger.info(">>>>>>>>>>>>>>请求处理结束;");

        return result;
    }

    /**
     *
     * @return
     */
    @GetMapping("/getdblist")
    public List<DatabaseConnectionInfo> getAllDBList() throws IOException {

        logger.info(">>>>>>>>>>>>>>请求处理开始：获取数据源列表;");

        List<DatabaseConnectionInfo> list = dBService.getAll();

        logger.info(">>>>>>>>>>>>>>请求处理结束;");

        return list;
    }

}
