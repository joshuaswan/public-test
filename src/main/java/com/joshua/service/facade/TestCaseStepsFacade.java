//package com.joshua.service;
//
//import com.google.inject.persist.Transactional;
//import com.heren.his.domain.entity.TestCaseSteps;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//
//import javax.inject.Inject;
//import javax.persistence.EntityManager;
//
///**
// * Created by joshua on 2016/4/27.
// */
//public class TestCaseStepsFacade extends BaseFacade {
//    private static final Logger logger = LoggerFactory.getLogger(NodesHierarchyFacade.class);
//    private EntityManager entityManager;
//
//    @Inject
//    public TestCaseStepsFacade(EntityManager entityManager) {
//        this.entityManager = entityManager;
//    }
//
//    @Transactional
//    public void addTestCaseSteps(TestCaseSteps testCaseSteps){
//        persist(testCaseSteps);
//    }
//
//
//
//}
