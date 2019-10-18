package top.hudk.dictionary.store;

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


    public void saveToFile(String str) throws IOException {
        System.out.println(relativelyPath);
        File file = new File(relativelyPath + fileName);
        if (!file.exists()) {
            file.createNewFile();
            List<String> replaced = new ArrayList<>();
            replaced.add("1");
            replaced.add("【add at " + getNowTime() + "】" + str);
            Files.write(Paths.get(file.toURI()), replaced);
        } else {
            List<String> lines = Files.readAllLines(Paths.get(file.toURI()));
            List<String> replaced = new ArrayList<>();
            //String lineone = lines.get(0);
            Integer i = new Integer(lines.get(0));
            i++;
            int lineNo = 0;
            for (String line : lines) {
                if (lineNo == 0) {
                    replaced.add(i.toString());
                } else {
                    replaced.add(line);
                }
                lineNo++;
            }
            replaced.add("【add at " + getNowTime() + "】" + str);
            Files.write(Paths.get(file.toURI()), replaced);
        }

    }

    public int getNumber() throws IOException {
        File file = new File(relativelyPath + fileName);
        if (!file.exists()) {
            return new Integer(0);
        }
        return Files.readAllLines(Paths.get(file.toURI())).size() - 1;
    }

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

    public void deleteLine(int LineNumber) throws IOException {
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
                line = line.substring(line.lastIndexOf("】")+1);
                replaced.add("【delete at " + getNowTime() + "】" + line);
            } else {
                replaced.add(line);
            }
            lineNo++;
        }
        Files.write(Paths.get(file.toURI()), replaced);
    }


    public List<String> getALL() throws IOException {
        List<String> lines = null;
        File file = new File(relativelyPath + fileName);
        if (!file.exists()) {
            file.createNewFile();
            List<String> replaced = new ArrayList<>();
            replaced.add("0");
            Files.write(Paths.get(file.toURI()), replaced);
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
