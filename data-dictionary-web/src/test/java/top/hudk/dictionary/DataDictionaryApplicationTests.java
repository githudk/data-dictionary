package top.hudk.dictionary;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import top.hudk.dictionary.store.StoreFile;

import java.io.IOException;

@RunWith(SpringRunner.class)
@SpringBootTest
public class DataDictionaryApplicationTests {

    @Autowired
    StoreFile storeFile;

    @Test
    public void contextLoads() throws IOException {

        storeFile.saveToFile("123456");

    }
    @Test
    public void contextLoads2() throws IOException {

        int s = storeFile.getNumber();
        System.out.println(s);

    }
    @Test
    public void contextLoads3() throws IOException {

        storeFile.replaceLine(2,"99");
    }
    @Test
    public void contextLoads4() throws IOException {

        storeFile.deleteLine(2);
    }

}
