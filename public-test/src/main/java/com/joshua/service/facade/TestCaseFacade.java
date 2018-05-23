//package com.joshua.service;
//
//import com.google.inject.persist.Transactional;
//import com.heren.his.CompositeModule;
//import com.heren.his.commons.exceptions.NotFoundException;
//import com.heren.his.commons.exceptions.SystemException;
//import com.heren.his.commons.util.StringUtils;
//import com.heren.his.domain.entity.TestCase;
//import com.heren.his.domain.entity.TestCaseSteps;
//import com.heren.his.domain.entity.TestResultInfo;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//
//import javax.inject.Inject;
//import javax.persistence.EntityManager;
//import javax.ws.rs.core.StreamingOutput;
//import java.lang.reflect.InvocationTargetException;
//import java.lang.reflect.Method;
//import java.util.ArrayList;
//import java.util.List;
//
///**
// * Created by joshua on 2016/4/26.
// */
//public class TestCaseFacade extends BaseFacade {
//
//    private static final Logger logger = LoggerFactory.getLogger(NodesHierarchyFacade.class);
//    private EntityManager entityManager;
//
//    @Inject
//    public TestCaseFacade(EntityManager entityManager) {
//        this.entityManager = entityManager;
//    }
//
//    public TestCase getTestCaseById(String testCaseId) {
//        return entityManager.find(TestCase.class, testCaseId);
//    }
//
//    @Transactional
//    public void addTestCase(TestCase testCase) {
//        persist(testCase);
//    }
//
//    @Transactional
//    public void updateTestCase(TestCase testCase) {
//        List<TestCaseSteps> testCaseStepsList = entityManager.find(TestCase.class, testCase.getTestCaseId()).getTestCaseStepsList();
//        if (testCaseStepsList.size() == 0) {
//
//        } else if (testCaseStepsList.size() < testCase.getTestCaseStepsList().size()) {
//            for (int i = testCaseStepsList.size(); i < testCase.getTestCaseStepsList().size(); i++) {
//                persist(testCase.getTestCaseStepsList().get(i));
//            }
//        } else if (testCaseStepsList.size() > testCase.getTestCaseStepsList().size()) {
//            for (int i = testCase.getTestCaseStepsList().size(); i < testCaseStepsList.size(); i++) {
//                remove(testCaseStepsList.get(i));
//            }
//        }
//        merge(testCase);
//    }
//
//    public StreamingOutput getTestCasePhotograph(String testCaseId) {
//        TestResultInfo testResultInfo = strictFindByPrimaryKey(TestResultInfo.class, testCaseId, "未找到指定测试用例截图信息");
//        if (testResultInfo.getResultPhotograph() == null) {
//            throw new NotFoundException(String.format("测试用例截图信息不存在testCaseId[%s]", testCaseId));
//        }
//        StreamingOutput streamingOutput = null;
//        try {
//            streamingOutput = StringUtils.getStreamingOutputByBlob(testResultInfo.getResultPhotograph());
//        } catch (SystemException e) {
//            throw new SystemException("读取测试用例截图信息失败");
//        }
//        return streamingOutput;
//    }
//
//    @Transactional
//    public void updateTestCaseList(List<TestCase> testCase) {
//
//    }
//
//    @Transactional
//    public void deleteTestCase(String testCaseId) {
//        TestCase testCase = entityManager.find(TestCase.class, testCaseId);
//        entityManager.remove(testCase);
//    }
//
//    public void runTestCase(TestCase testCase) {
//        //获取测试用例对应测试脚本地址指向的方法信息，并截取对应包名、类名、方法名
//        String[] classAndFunction = testCase.getCodePath().split("\\.");
//        Class testClass = null;
//        StringBuilder className = new StringBuilder();
//        Object resultObject = null;
//        String result = null;
//
//        for (int i = 0; i < classAndFunction.length - 1; i++) {
//            className.append(classAndFunction[i]).append(".");
//        }
//        //获取对应类名信息，方便获取对应类信息
//        className.deleteCharAt(className.toString().length() - 1);
//
//        //判断对应类信息是否存在
//        try {
//            testClass = Class.forName(className.toString());
//        } catch (ClassNotFoundException e) {
//            entityManager.getTransaction().begin();
//            testCase.setResult("对应类信息不存在！");
//            testCase.setRunStatus(0);
//            merge(testCase);
//            entityManager.getTransaction().commit();
//            throw new SystemException("对应类信息不存在！");
//        }
//
//        ArrayList<String> methodNameLists = new ArrayList<String>();
//        //获取对应类中包含的方法信息
//        Method[] methods = testClass.getDeclaredMethods();
//        for (int i = 0; i < methods.length; i++) {
//            methodNameLists.add(i, methods[i].getName());
//        }
//        int i = 0;
//        for (String methodName : methodNameLists) {
//            //判断对应方法是否在对应类中的方法列表
//            if (methodName.equals(classAndFunction[classAndFunction.length - 1])) {
//                Method invokeMethod = null;
//                try {
//                    //判断是否存储对应截屏
//                    if (testCase.getSavePhoto() == 1) {
//                        invokeMethod = testClass.getDeclaredMethod(methodName, String.class);
//                        resultObject = invokeMethod.invoke(CompositeModule.injector.getInstance(testClass), testCase.getTestCaseId());
//                    } else {
//                        invokeMethod = testClass.getDeclaredMethod(methodName);
//                        resultObject = invokeMethod.invoke(CompositeModule.injector.getInstance(testClass));
//                    }
//                } catch (NoSuchMethodException | IllegalAccessException e) {
//                    entityManager.getTransaction().begin();
//                    testCase.setResult("调用对应测试方法失败！");
//                    testCase.setRunStatus(0);
//                    merge(testCase);
//                    entityManager.getTransaction().commit();
//                    throw new SystemException("调用对应测试方法失败！");
//                } catch (InvocationTargetException e) {
//                    //截取对应调用方法抛出的异常，并且将异常信息存入到数据库中
//                    entityManager.getTransaction().begin();
//                    testCase.setResult(e.getTargetException().getMessage());
//                    testCase.setRunStatus(0);
//                    merge(testCase);
//                    entityManager.getTransaction().commit();
//                    throw new SystemException(e.getTargetException().getMessage());
//                }
//                break;
//            }
//            i++;
//        }
//        if (i == methodNameLists.size()) {
//            entityManager.getTransaction().begin();
//            testCase.setResult("对应测试方法不存在！");
//            testCase.setRunStatus(0);
//            merge(testCase);
//            entityManager.getTransaction().commit();
//            throw new SystemException("对应测试方法不存在！");
//        }
//
//        Method closeMethod = null;
//
//        result = (String) resultObject;
//        testCase.setResult(result);
//        testCase.setRunStatus(1);
//        entityManager.getTransaction().begin();
//        merge(testCase);
//        entityManager.getTransaction().commit();
//    }
//
//    public int runTestCaseList(List<TestCase> testCaseList) {
//        int i = 0;
//        for (TestCase testCase : testCaseList) {
//            try {
//                runTestCase(testCase);
//            } catch (SystemException e) {
//                i++;
//            }
//        }
//        return i;
//    }
//
//    @Transactional
//    public void clearTestResult(List<TestCase> testCaseList) {
//        for (TestCase testCase : testCaseList) {
//            testCase.setResult("");
//            testCase.setRunStatus(null);
//            if (testCase.getSavePhoto() == 1 && testCase.getResult() != null) {
//                TestResultInfo testResultInfo = entityManager.find(TestResultInfo.class, testCase.getTestCaseId());
//                if (testResultInfo != null) {
//                    remove(testResultInfo);
//                }
//            }
//            merge(testCase);
//        }
//    }
//}
