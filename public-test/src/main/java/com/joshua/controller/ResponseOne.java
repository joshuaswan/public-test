package com.joshua.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by joshua on 2016/4/13.
 */

@Controller
@RequestMapping(path = "practice")
public class ResponseOne {

//    private ReadHtmlBySelenium readHtmlBySelenium;
//    private NodesHierarchyFacade nodesHierarchyFacade;
//
//    @Inject
//    public ResponseOne(ReadHtmlBySelenium readHtmlBySelenium, NodesHierarchyFacade nodesHierarchyFacade) {
//        this.readHtmlBySelenium = readHtmlBySelenium;
//        this.nodesHierarchyFacade = nodesHierarchyFacade;
//    }
//
//    @GET
//    public Response responsePractice(){
//        return Response.ok("hello").build();
//    }
//
//
//    @GET
//    @Path("html")
//    public void htmlTest() throws Exception {
//        readHtmlBySelenium.test();
//    }
//
//
//    @GET
//    @Path("table")
//    public void tableTest() throws Exception {
//        readHtmlBySelenium.testCase();
//    }
////    @GET
////    @Path("input-code")
//    public Response inputCode(){
//        nodesHierarchyFacade.updateTestProjectInputCode();
//        return Response.ok().build();
//    }
}
