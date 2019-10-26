package top.hudk.dictionary.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import top.hudk.dictionary.entity.DatabaseConnectionInfo;
import top.hudk.dictionary.entity.Result;
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

    @PostMapping("/savedb")
    public Result<DatabaseConnectionInfo> adddb(@RequestBody() DatabaseConnectionInfo databaseConnectionInfo) {
        Result result = null;
        try {
            dBService.save(databaseConnectionInfo);
            result = new Result(1, "保存成功");
        } catch (IOException e) {
            result = new Result(0, "保存失败："+e.getMessage());
        }
        result.setData(databaseConnectionInfo);
        return result;
    }

    /**
     *
     * @return
     */
    @GetMapping("/getdblist")
    public List<DatabaseConnectionInfo> getAllDBList() throws IOException {
        return dBService.getAll();
    }

}
