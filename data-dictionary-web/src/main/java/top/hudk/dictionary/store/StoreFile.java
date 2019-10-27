package top.hudk.dictionary.store;

import com.sun.org.apache.bcel.internal.classfile.LineNumber;
import org.springframework.stereotype.Component;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * 作用:
 *
 * @author hudk
 * @date 2019/10/18 11:10
 */
@Component
public class StoreFile {

    private String fileName = "\\store.dblist";

    String relativelyPath = System.getProperty("user.dir");


    /**
     * 增加或修改
     * @param str
     * @param id
     * @throws IOException
     */
    public void saveOrEditToFile(String str,String id) throws IOException {
        System.out.println(relativelyPath);
        File file = new File(relativelyPath + fileName);
        if (!file.exists()) {
            file.createNewFile();
            List<String> replaced = new ArrayList<>();
            //replaced.add("1");
            replaced.add("【add at " + getNowTime() + "】" + str);
            Files.write(Paths.get(file.toURI()), replaced);
        } else {
            List<String> lines = Files.readAllLines(Paths.get(file.toURI()));
            List<String> replaced = new ArrayList<>();
            boolean rep = true;
            for(int i=0;i<lines.size();i++){
                if(lines.get(i).contains(id)){
                    replaced.add("【edit at " + getNowTime() + "】" + str);
                    rep = false;
                }else{
                    replaced.add(lines.get(i));
                }
            }
            if(rep){
                replaced.add("【add at " + getNowTime() + "】" + str);
            }
            Files.write(Paths.get(file.toURI()), replaced);
        }

    }

    /**
     * 获取总数量
     */
    public int getNumber() throws IOException {
        File file = new File(relativelyPath + fileName);
        if (!file.exists()) {
            return new Integer(0);
        }
        return Files.readAllLines(Paths.get(file.toURI())).size();
    }

    /**
     *
     * @param LineNumber
     * @param str
     * @throws IOException
     */
    public void replaceLine(int LineNumber, String str) throws IOException {
        if (LineNumber <= 0) {
            return;
        }
        File file = new File(relativelyPath + fileName);
        if (!file.exists()) {
            return;
        }
        List<String> lines = Files.readAllLines(Paths.get(file.toURI()));
        List<String> replaced = new ArrayList<>();
        int lineNo = 1;
        for (String line : lines) {
            if (lineNo == LineNumber + 1) {
                if(line.contains("delete")){
                    return;
                }
                if (str != null) {
                   replaced.add("【modify at " + getNowTime() + "】" + str);
                }
            } else {
                replaced.add(line);
            }
            lineNo++;
        }
        Files.write(Paths.get(file.toURI()), replaced);
    }

    /**
     * 删除
     * @param id
     * @throws IOException
     */
    public void deleteLine(String id) throws IOException {
        if (id == null || "".equals(id) || id.length() < 10) {
            return;
        }
        File file = new File(relativelyPath + fileName);
        if (!file.exists()) {
            return;
        }
        List<String> lines = Files.readAllLines(Paths.get(file.toURI()));
        List<String> replaced = new ArrayList<>();
        int numb = 0 ;
        for(int i=0;i<lines.size();i++){
            if(lines.get(i).contains(id)){
                numb++;
            }else{
                replaced.add(lines.get(i));
            }
        }
        if(numb==1){
            Files.write(Paths.get(file.toURI()), replaced);
        }

    }


    /**
     * 查
     * @return
     * @throws IOException
     */
    public List<String> getALL() throws IOException {
        List<String> lines = null;
        File file = new File(relativelyPath + fileName);
        if (!file.exists()) {
            file.createNewFile();
            List<String> replaced = new ArrayList<>();
            return lines;
        }
        lines = Files.readAllLines(Paths.get(file.toURI()));
        return lines;
    }

    public String getNowTime() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyy-MM-dd HH:mm:ss");
        String date = sdf.format(new Date());
        return date;
    }

}
