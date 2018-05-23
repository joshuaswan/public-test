//package com.joshua.service;
//
//import com.google.inject.persist.Transactional;
//import com.heren.his.domain.entity.TestResultInfo;
//import org.apache.commons.io.IOUtils;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//
//import javax.inject.Inject;
//import javax.persistence.EntityManager;
//import javax.sql.rowset.serial.SerialBlob;
//import java.io.File;
//import java.io.FileInputStream;
//import java.io.FileNotFoundException;
//import java.io.IOException;
//import java.sql.Blob;
//import java.sql.SQLException;
//
///**
// * Created by joshua on 2016/6/6.
// */
//public class TestResultInfoFacade extends BaseFacade {
//
//    private static final Logger logger = LoggerFactory.getLogger(TestResultInfoFacade.class);
//    private EntityManager entityManager;
//
//    @Inject
//    public TestResultInfoFacade(EntityManager entityManager) {
//        this.entityManager = entityManager;
//    }
//
//    @Transactional
//    public void savePhotograph(String testCaseId, String photograph){
//        Blob blob = null;
//        File photoFile = new File(photograph);
//        FileInputStream fileInputStream = null;
//        try {
//            fileInputStream = new FileInputStream(photoFile);
//        } catch (FileNotFoundException e) {
//            e.printStackTrace();
//        }
//
//        try {
//            blob = new SerialBlob(IOUtils.toByteArray(fileInputStream));
//        } catch (SQLException e) {
//            e.printStackTrace();
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//        TestResultInfo testResultInfo = new TestResultInfo(testCaseId,blob);
//        merge(testResultInfo);
//    }
//}
