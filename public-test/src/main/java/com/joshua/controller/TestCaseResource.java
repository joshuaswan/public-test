package com.joshua.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by joshua on 2016/5/5.
 */

@Controller
@RequestMapping(path = "test-case")
public class TestCaseResource {

//    private TestCaseFacade testCaseFacade;
//
//    @Inject
//    public TestCaseResource(TestCaseFacade testCaseFacade) {
//        this.testCaseFacade = testCaseFacade;
//    }
//
//    @GET
//    @Path("{testCaseId}")
//    public TestCase getTestCaseById(@PathParam("testCaseId") String testCaseId) {
//        return testCaseFacade.getTestCaseById(testCaseId);
//    }
//
//    @POST
//    @OnException("新增测试用例异常！")
//    public Response addTestCase(TestCase testCase) {
//        testCaseFacade.addTestCase(testCase);
//        return Response.ok().build();
//    }
//
//    @POST
//    @Path("code-path")
//    @OnException("执行测试用例异常！")
//    public Response runTestCase(TestCase testCase) {
//        testCaseFacade.runTestCase(testCase);
//        return Response.ok().build();
//    }
//
//    @PUT
//    @Path("test-case-list")
//    public void updateTestCaseList(List<TestCase> testCase) {
//        testCaseFacade.updateTestCaseList(testCase);
//    }
//
//    @PUT
//    @Path("test-result")
//    @OnException("清空测试结果失败！")
//    public void clearTestResult(List<TestCase> testCaseList) {
//        testCaseFacade.clearTestResult(testCaseList);
//    }
//
//    @PUT
//    @OnException("更新测试用例失败！")
//    public Response updateTestCase(TestCase testCase) {
//        testCaseFacade.updateTestCase(testCase);
//        return Response.ok().build();
//    }
//
//    @DELETE
//    @Path("{testCaseId}")
//    @OnException("删除测试用例失败！")
//    public Response deleteTestCase(@PathParam("testCaseId") String testCaseId) {
//        testCaseFacade.deleteTestCase(testCaseId);
//        return Response.ok().build();
//    }
//
//    @GET
//    @Path("result-photograph/{testCaseId}")
//    @OnException("查找测试用例截图失败！")
//    public StreamingOutput getTestCasePhotograph(@PathParam("testCaseId") String testCaseId) {
//        return testCaseFacade.getTestCasePhotograph(testCaseId);
//    }
//
//    @POST
//    @Path("test-code-list")
//    @OnException("自动化执行脚本异常！")
//    public int runTestCodeList(List<TestCase> testCaseList) {
//        return testCaseFacade.runTestCaseList(testCaseList);
//    }
}
