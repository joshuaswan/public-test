package com.joshua.data;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.*;
import java.text.SimpleDateFormat;

/**
 * 查询对应数据文件，这里面读取的是config.properties文件中的数据库信息，在这个文件中可以查询对应文件
 * 这里不是基于jpa的，是单纯的jdbc查询
 * 哦，我不用写运行时的查询方式了，这里面调用时没有运行环境，导致每次查询需要从新连接数据库
 * 使用用例系统调用时其实直接写对应的查询语句就可以了，哈哈
 * Created by joshua on 2015/11/18.
 */
public class SearchData {
    private static String username;
    private static String password;
    private static String url;
    private static final Logger LOGGER = LoggerFactory.getLogger(SearchData.class);
//    private Configuration configuration;

//
//    public SearchData() {
//        try {
//            configuration = new PropertiesConfiguration("config.properties");
//        } catch (ConfigurationException e) {
//            e.printStackTrace();
//        }
//        this.username = configuration.getString("databaseUser");
//        this.password = configuration.getString("databasePassword");
//        this.url = configuration.getString("databaseUrl");
//    }

    public static int singleData(String[] data, int loopNumber, String sql, String column) throws ClassNotFoundException, SQLException {

        Class.forName("oracle.jdbc.driver.OracleDriver");
        Connection con = DriverManager.getConnection(url, username, password);
        Statement stmt = con.createStatement();

        ResultSet rs = stmt.executeQuery(sql);
        int i = 0;
        for (int j = 0; j < 0 && rs.next(); ++j) {
            rs.getString(column);
        }
        for (; i < loopNumber && rs.next(); ++i) {
            data[i] = rs.getString(column);
        }
        rs.close();
        con.close();
        return i;
    }

    public static int multipleData(String[][] data, int loopNumber, int columnsNumber, String sql, String[] column) throws SQLException, ClassNotFoundException {
        Class.forName("oracle.jdbc.driver.OracleDriver");
        Connection con = DriverManager.getConnection(url, username, password);
        Statement stmt = con.createStatement();

        ResultSet rs = stmt.executeQuery(sql);
        int i = 0;
        for (int j = 0; j < 0 && rs.next(); ++j) {
            rs.getString(column[0]);
        }
        for (; i < loopNumber && rs.next(); ++i) {
            for (int j = 0; j < columnsNumber; ++j) {
                data[i][j] = rs.getString(column[j]);
            }
        }
        rs.close();
        con.close();
        return i;
    }

    public static String getToday() {
        java.util.Date d = new java.util.Date();
        System.out.println(d);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String dateNowStr = sdf.format(d);
        LOGGER.info("当前日期的标准格式：" + dateNowStr);
        return dateNowStr;
    }
}
