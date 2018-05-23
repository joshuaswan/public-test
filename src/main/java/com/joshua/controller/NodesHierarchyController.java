package com.joshua.controller;


import com.joshua.entity.NodesHierarchy;
import com.joshua.repository.NodesHierarchyRepository;
import com.joshua.service.NodesHierarchyService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.websocket.server.PathParam;
import java.util.List;
import java.util.Optional;

/**
 * Created by joshua on 2016/5/6.
 */

@Controller
@RequestMapping(path = "nodes-hierarchy")
public class NodesHierarchyController {

    private static Logger logger = LoggerFactory.getLogger(NodesHierarchyController.class);

    private NodesHierarchyRepository nodesHierarchyRepository;
    private NodesHierarchyService nodesHierarchyService;

    @Autowired
    public NodesHierarchyController(NodesHierarchyRepository nodesHierarchyRepository, NodesHierarchyService nodesHierarchyService) {
        this.nodesHierarchyRepository = nodesHierarchyRepository;
        this.nodesHierarchyService = nodesHierarchyService;
    }

    @PostMapping(path = "add")
    public @ResponseBody String addNodesHierarchy(@RequestBody NodesHierarchy nodesHierarchy) {
        nodesHierarchyRepository.save(nodesHierarchy);
        return "success";
    }

    @PostMapping(path = "test-case")
    public @ResponseBody String updateTestCase(NodesHierarchy nodesHierarchy) {
        nodesHierarchyRepository.save(nodesHierarchy);
        return "success";
    }

    @PostMapping(path = "{id")
    public @ResponseBody String updateNodesHierarchy(@RequestParam String id, @RequestParam NodesHierarchy nodesHierarchy) {
        nodesHierarchyRepository.save(nodesHierarchy);
        return "ok";
    }

    @GetMapping(path = "test-project/{inputCode}")
    public @ResponseBody Iterable<NodesHierarchy> getTestProject(@RequestParam String inputCode) {

        return nodesHierarchyRepository.findAll();
    }

    @GetMapping(path = "all-test-project")
    public @ResponseBody Iterable<NodesHierarchy> queryAllTestProject() {
        return nodesHierarchyRepository.findAll();
    }

    /**
     * 默认选中查询
     */
    @GetMapping(path = "/all-node-hierarchy")
    public @ResponseBody  Iterable<NodesHierarchy> getAllNode() {
        return nodesHierarchyRepository.findAll();
    }

    @GetMapping(path = "node-hierarchy-delete/{id}")
    public @ResponseBody String deleteNodeHierarchyById(@RequestParam Long id) {
        nodesHierarchyRepository.deleteById(id);
        return "ok";
    }

    @GetMapping(path = "node-hierarchy-id/{id}")
    public @ResponseBody Optional<NodesHierarchy> searchNodesHierarchiesById(@RequestParam long id) {
        return nodesHierarchyRepository.findById(id);
    }

    @GetMapping(path = "/package-name")
    public @ResponseBody List<String> getPackageList(){
        return nodesHierarchyService.getPackageList();
    }

    @GetMapping(path = "class-name/{package-name}")
    public @ResponseBody List<String> getClassList(@PathParam("package-name") String pathName) {
        return nodesHierarchyService.getClassList(pathName);
    }
//
//    @GET
//    @Path("method-name/{class-name}")
//    @OnException("对应方法查找失败！")
//    public List<String> getMethodList(@PathParam("class-name") String className) {
//        return nodesHierarchyFacade.getMethodList(className);
//    }
}
