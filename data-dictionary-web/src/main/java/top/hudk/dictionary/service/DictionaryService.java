package top.hudk.dictionary.service;

import com.alibaba.fastjson.JSON;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import top.hudk.dictionary.entity.Column;
import top.hudk.dictionary.entity.DatabaseConnectionInfo;
import top.hudk.dictionary.entity.Table;
import top.hudk.dictionary.jdbc.DataBase;
import top.hudk.dictionary.store.StoreFile;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


/**
 * 作用:
 *
 * @author hudk
 * @date 2019/10/18 15:45
 */
@Service
public class DictionaryService {

    @Autowired
    StoreFile storeFile;

    @Autowired
    DataBase dataBase;

    public void save(DatabaseConnectionInfo databaseConnectionInfo) throws IOException {
        databaseConnectionInfo.setId(new Integer(storeFile.getNumber() + 1).toString());
        storeFile.saveToFile(databaseConnectionInfo.toString());
    }

    public List<DatabaseConnectionInfo> getAll() throws IOException {
        List<String> list = storeFile.getALL();
        List<DatabaseConnectionInfo> dbList = dbList = new ArrayList<DatabaseConnectionInfo>();
        if (list != null && list.size() > 0) {
            for (int i = 1; i < list.size(); i++) {
                String str = list.get(i);
                if(str.contains("delete")){
                    continue;
                }
                String strDataJson = str.substring(str.indexOf("】") + 1);
                Map maps = (Map) JSON.parse(strDataJson);
                Map data = (Map) maps.get("data");
                DatabaseConnectionInfo databaseConnectionInfo = new DatabaseConnectionInfo();
                databaseConnectionInfo.setId(((Integer)data.get("id")).toString());
                databaseConnectionInfo.setDbtype((String) data.get("dbtype"));
                databaseConnectionInfo.setDbname((String) data.get("dbname"));
                databaseConnectionInfo.setDbport((String) data.get("dbport"));
                databaseConnectionInfo.setDbadrr((String) data.get("dbadrr"));
                databaseConnectionInfo.setUsername((String) data.get("username"));
                databaseConnectionInfo.setPassword((String) data.get("password"));
                dbList.add(databaseConnectionInfo);
            }
        }
        return dbList;
    }

    public List<Table> getTables(String currentDB) throws Exception {
        List<Table> tables = new ArrayList<>();
        List<DatabaseConnectionInfo> dblist = getAll();
        DatabaseConnectionInfo dbinfo = null;
        for(DatabaseConnectionInfo db : dblist){
            if(currentDB.equals(db.getId())){
                dbinfo = db;
            }
        }
        return dataBase.getTables(dbinfo);
    }


    public List<Table> getTablesByText(String currentDB,String text) throws Exception {
        List<Table> tables = new ArrayList<Table>();
        List<DatabaseConnectionInfo> dblist = getAll();
        DatabaseConnectionInfo dbinfo = null;
        for(DatabaseConnectionInfo db : dblist){
            if(currentDB.equals(db.getId())){
                dbinfo = db;
            }
        }
        return dataBase.getTablesByText(dbinfo,text);
    }


    public List<Column> getColumns(String currentDB,String tablename) throws Exception {
        List<Column> columns = new ArrayList<Column>();
        List<DatabaseConnectionInfo> dblist = getAll();
        DatabaseConnectionInfo dbinfo = null;
        for(DatabaseConnectionInfo db : dblist){
            if(currentDB.equals(db.getId())){
                dbinfo = db;
            }
        }
        return dataBase.getColumns(dbinfo,tablename);
    }
}
