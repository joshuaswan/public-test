//package com.joshua.service;
//
//import com.google.inject.persist.Transactional;
//import com.heren.his.commons.exceptions.ValidationException;
//import com.heren.his.demo.PinYin2Abbreviation;
//import com.heren.his.domain.entity.NodesHierarchy;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//
//import javax.inject.Inject;
//import javax.persistence.EntityManager;
//import java.io.File;
//import java.lang.reflect.Method;
//import java.util.ArrayList;
//import java.util.Collections;
//import java.util.List;
//
///**
// * Created by joshua on 2016/4/27.
// */
//public class NodesHierarchyFacade extends BaseFacade {
//    private static final Logger logger = LoggerFactory.getLogger(NodesHierarchyFacade.class);
//    private EntityManager entityManager;
//
//    @Inject
//    public NodesHierarchyFacade(EntityManager entityManager) {
//        this.entityManager = entityManager;
//    }
//
//    @Transactional
//    public void insertNodesHierarchy(String name, String detail, long parentId, String inputCode,
//                                     int nodeTypeId, int nodeOrder) {
//        StringBuilder sql = new StringBuilder("insert into node_hierarchy (");
//        sql.append("name,detail,parent_id,input_code,node_type_id,node_order")
//                .append(" ) values (")
//                .append(name).append(detail).append(String.valueOf(parentId))
//                .append(inputCode).append(String.valueOf(nodeTypeId)).append(String.valueOf(nodeOrder))
//                .append(")");
//        createNativeQuery(sql.toString()).executeUpdate();
//    }
//
//    @Transactional
//    public void addNodeHierarchy(NodesHierarchy nodesHierarchy) {
//        if (nodesHierarchy.getName() == "") {
//            throw new ValidationException("测试分组名称不能为空！");
//        }
//        if (nodesHierarchy.getParentId() == "") {
//            JPQLBuilder jpqlBuilder = JPQLBuilder.getInstance();
//            jpqlBuilder.select("n.nodeOrder")
//                    .from("NodesHierarchy n")
//                    .where("n.nodeTypeId = 1");
//            List<Integer> orderList = find(Integer.class, jpqlBuilder.get$QL().toString());
//            Collections.sort(orderList);
//            Integer nodeOrder = orderList.get(orderList.size() - 1) + 1;
//            String nodeId = String.format("%02d", nodeOrder);
//            nodesHierarchy.setId(nodeId);
//            nodesHierarchy.setNodeOrder(nodeOrder);
//            nodesHierarchy.setNodeTypeId(1);
//            persist(nodesHierarchy);
//        } else {
//            JPQLBuilder jpqlBuilder = JPQLBuilder.getInstance();
//            jpqlBuilder.select("n.nodeOrder")
//                    .from("NodesHierarchy n")
//                    .where("n.parentId = " + nodesHierarchy.getParentId());
//            List<Integer> orderList = find(Integer.class, jpqlBuilder.get$QL().toString());
//            if (orderList.size() == 0) {
//                nodesHierarchy.setId(nodesHierarchy.getParentId() + "01");
//                nodesHierarchy.setNodeOrder(1);
//                System.out.println(nodesHierarchy.toString());
//            } else {
//                Collections.sort(orderList);
//                Integer nodeOrder = orderList.get(orderList.size() - 1) + 1;
//                nodesHierarchy.setNodeOrder(nodeOrder);
//                String nodeId = String.format("%02d", nodeOrder);
//                System.out.println(nodeId);
//                nodesHierarchy.setId(nodesHierarchy.getParentId() + nodeId);
//            }
//            nodesHierarchy.setNodeTypeId(2);
//            try {
//                persist(nodesHierarchy);
//            } catch (ValidationException e) {
//
//            }
//        }
//    }
//
//    //获取测试项目信息
//    public List<NodesHierarchy> queryAllTestProject() {
//        StringBuilder sql = new StringBuilder("select * ");
//        sql.append(" from NODES_HIERARCHY n ")
//                .append(" where n.node_type_id = 1")
//                .append(" order by n.node_order");
//        return createNativeQueryToMap(sql.toString());
//    }
//
//    //新建测试项目
//    @Transactional
//    public void newTestProject(NodesHierarchy nodesHierarchy) {
//        if (nodesHierarchy.getNodeTypeId() == 1) {
//            entityManager.persist(nodesHierarchy);
//            StringBuilder sql = new StringBuilder("update NODES_HIERARCHY set node_order=id where ");
//            sql.append("id=").append(String.valueOf(nodesHierarchy.getId()))
//                    .append("");
//        } else {
//
//        }
//    }
//
//    /**
//     * 更新测试项目的输入码
//     * 在执行sql的时候需要添加注解：@Transactional，不然系统报错Executing an update/delete query
//     * 这个应该可以更新所有的inputCode信息改一下就可以了
//     * 防止频发调用我将对应执行sql的语句注释掉，以后用的时候直接改掉就可以了
//     */
//    @Transactional
//    public void updateTestProjectInputCode() {
//        StringBuilder selectSql = new StringBuilder("select n.name from nodes_hierarchy n where ")
////                .append("n.node_type_id = 1 and ")
//                .append("n.input_code is null");
//        List testProjectName = createNativeQueryToMap(selectSql.toString());
//        for (int i = 0; i < testProjectName.size(); i++) {
//            String name = testProjectName.get(i).toString().substring(6).substring(0, testProjectName.get(i).toString().substring(6).length() - 1);
//            String inputCode = PinYin2Abbreviation.cn2py(name);
//            StringBuilder sql = new StringBuilder();
//            sql.append("update nodes_hierarchy set input_code = ").append("'")
//                    .append(inputCode.toUpperCase().replaceAll("[-_()]", "")).append("'").append(" where name = ").append("'")
//                    .append(name).append("'");
//            System.out.println(sql.toString());
//            createNativeQuery(sql.toString()).executeUpdate();
//            System.out.println(name + " " + inputCode);
//        }
//    }
//
//
//    public List<NodesHierarchy> getTestSuite(long parentId) {
//        StringBuilder selectSql = new StringBuilder("select n.name,n.details from nodes_hierarchy n where ");
//        selectSql.append("n.parent_id = ")
//                .append(String.valueOf(parentId))
//                .append("and n.node_type = 2");
//        return createNativeQueryToMap(selectSql.toString());
//    }
//
//    public List<NodesHierarchy> getTestProjectByInputCode(String inputCode) {
//        StringBuilder sql = new StringBuilder("select * from nodes_hierarchy n where ")
//                .append("n.node_type_id = 1 and ")
//                .append("n.input_code like '%")
//                .append(inputCode.toUpperCase())
//                .append("%'");
//        return createNativeQueryToMap(sql.toString());
//    }
//
//    /**
//     * 根据对应节点ID查找对应节点信息
//     *
//     * @param id
//     * @return
//     */
//    public NodesHierarchy findNodesHierarchyById(long id) {
//        return entityManager.find(NodesHierarchy.class, id);
//    }
//
//    @Transactional
//    public void updateNodesHierarchy(NodesHierarchy nodesHierarchy) {
//        if (nodesHierarchy.getName() == "") {
//            throw new ValidationException("测试分组名称不能为空！");
//        }
//        System.out.println(nodesHierarchy.toString());
//        entityManager.merge(nodesHierarchy);
//    }
//
//    @Transactional
//    public void deleteNodesHierarchyOne(String id) {
//        NodesHierarchy nodesHierarchy = entityManager.find(NodesHierarchy.class, id);
//        entityManager.remove(nodesHierarchy);
//
//    }
//
//    public List<NodesHierarchy> findNodesHierarchyChildren(String id) {
//        return createQuery(NodesHierarchy.class, "select n from NodesHierarchy n where n.parentId = ?", id).getResultList();
//    }
//
//    public List<NodesHierarchy> getAllNode() {
//        return createNativeQueryToMap("select * from Nodes_Hierarchy n order by n.id");
////        return createQuery(NodesHierarchy.class,"select n from Nodes_Hierarchy n order by n.id").getResultList();
//    }
//
//    @Transactional
//    public void deleteNodesHierarchyChildren(String id) {
//        List<NodesHierarchy> nodesHierarchies = findNodesHierarchyChildren(id);
//        if (nodesHierarchies != null && nodesHierarchies.size() > 0) {
//            for (NodesHierarchy nodesHierarchy : nodesHierarchies) {
//                deleteNodesHierarchyChildren(nodesHierarchy.getId());
//            }
//        }
//        deleteNodesHierarchyOne(id);
//    }
//
//    @Transactional
//    public void deleteNodesHierarchies(String id) {
//        deleteNodesHierarchyChildren(id);
//    }
//
//    public NodesHierarchy searchNodesHierarchiesById(String id) {
//        NodesHierarchy nodesHierarchy = entityManager.find(NodesHierarchy.class, id);
//        Collections.sort(nodesHierarchy.getTestCaseList());
//        return nodesHierarchy;
//    }
//
//    @Transactional
//    public void updateTestCase(NodesHierarchy nodesHierarchy) {
//        merge(nodesHierarchy);
//    }
//
//    public List<String> getPackageList() {
//        String path = "src.main.java.com.heren.his";
//        File dir = new File(path.replaceAll("\\.","/"));
//        File listFile[] = dir.listFiles();
//        List<String> stringList = new ArrayList<>();
//        if (listFile != null) {
//            for (int i = 0; i < listFile.length; i++) {
//                if (listFile[i].isDirectory()) {
//                    stringList.add(listFile[i].getName());
//                }
//            }
//        }
//        return stringList;
//    }
//
//    public List<String> getClassList(String path) {
//        String fullPath = "src.main.java.com.heren.his." + path;
//        File dir = new File(fullPath.replaceAll("\\.","/"));
//        File listFile[] = dir.listFiles();
//        List<String> stringList = new ArrayList<>();
//        if (listFile != null) {
//            for (int i = 0; i < listFile.length; i++) {
//                if (listFile[i].getName().endsWith(".java")) {
//                    stringList.add(listFile[i].getName().substring(0,listFile[i].getName().length()-5));
//                }
//            }
//        }
//        return stringList;
//    }
//
//    public List<String> getMethodList(String path) {
//        List<String> methodNameList = new ArrayList<>();
//        Class methodClass = null;
//        try {
//            methodClass = Class.forName(path);
//        } catch (ClassNotFoundException e) {
//            e.printStackTrace();
//        }
//        Method[] methodLists = methodClass.getDeclaredMethods();
//        for(Method method : methodLists){
//            methodNameList.add(method.getName());
//        }
//        return methodNameList;
//    }
//}
