package com.joshua.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Created by joshua on 2016/4/26.
 */

@Entity
public class TestCase{

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private String id;

    private String nodeId;

    private String testCaseTitle;

    private String summary;

    private String preconditions;

    private String result;

    private Date createTime;

    private Date modificationTime;

    private Integer executionType;

    private String codePath;

    private Integer runStatus;

    private Integer savePhoto;

//    @ManyToOne
//    @JoinColumn(name = "TEST_CASE_ID" ,referencedColumnName = "ID",insertable = false,updatable = false)
//    private NodesHierarchyRepository nodesHierarchy;

    //    public NodesHierarchyRepository getNodesHierarchy() {
//        return nodesHierarchy;
//    }
//
//    public void setNodesHierarchy(NodesHierarchyRepository nodesHierarchy) {
//        this.nodesHierarchy = nodesHierarchy;
//    }
    @JsonIgnore
    @ManyToOne
    private TestCaseSteps testCaseSteps;

    @JsonIgnore
    @ManyToOne
    private TestResultInfo testResultInfo;

    public TestCase(String nodeId, String testCaseTitle, String summary, String preconditions, String result, Date createTime, Date modificationTime, Integer executionType, String codePath, Integer runStatus, Integer savePhoto, TestCaseSteps testCaseSteps, TestResultInfo testResultInfo) {
        this.nodeId = nodeId;
        this.testCaseTitle = testCaseTitle;
        this.summary = summary;
        this.preconditions = preconditions;
        this.result = result;
        this.createTime = createTime;
        this.modificationTime = modificationTime;
        this.executionType = executionType;
        this.codePath = codePath;
        this.runStatus = runStatus;
        this.savePhoto = savePhoto;
        this.testCaseSteps = testCaseSteps;
        this.testResultInfo = testResultInfo;
    }

    @Override
    public String toString() {
        return "TestCase{" +
                "id='" + id + '\'' +
                ", nodeId='" + nodeId + '\'' +
                ", testCaseTitle='" + testCaseTitle + '\'' +
                ", summary='" + summary + '\'' +
                ", preconditions='" + preconditions + '\'' +
                ", result='" + result + '\'' +
                ", createTime=" + createTime +
                ", modificationTime=" + modificationTime +
                ", executionType=" + executionType +
                ", codePath='" + codePath + '\'' +
                ", runStatus=" + runStatus +
                ", savePhoto=" + savePhoto +
                ", testCaseSteps=" + testCaseSteps +
                ", testResultInfo=" + testResultInfo +
                '}';
    }

    public TestCase() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNodeId() {
        return nodeId;
    }

    public void setNodeId(String nodeId) {
        this.nodeId = nodeId;
    }

    public String getTestCaseTitle() {
        return testCaseTitle;
    }

    public void setTestCaseTitle(String testCaseTitle) {
        this.testCaseTitle = testCaseTitle;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getPreconditions() {
        return preconditions;
    }

    public void setPreconditions(String preconditions) {
        this.preconditions = preconditions;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Date getModificationTime() {
        return modificationTime;
    }

    public void setModificationTime(Date modificationTime) {
        this.modificationTime = modificationTime;
    }

    public Integer getExecutionType() {
        return executionType;
    }

    public void setExecutionType(Integer executionType) {
        this.executionType = executionType;
    }

    public String getCodePath() {
        return codePath;
    }

    public void setCodePath(String codePath) {
        this.codePath = codePath;
    }

    public Integer getRunStatus() {
        return runStatus;
    }

    public void setRunStatus(Integer runStatus) {
        this.runStatus = runStatus;
    }

    public Integer getSavePhoto() {
        return savePhoto;
    }

    public void setSavePhoto(Integer savePhoto) {
        this.savePhoto = savePhoto;
    }

    public TestCaseSteps getTestCaseSteps() {
        return testCaseSteps;
    }

    public void setTestCaseSteps(TestCaseSteps testCaseSteps) {
        this.testCaseSteps = testCaseSteps;
    }

    public TestResultInfo getTestResultInfo() {
        return testResultInfo;
    }

    public void setTestResultInfo(TestResultInfo testResultInfo) {
        this.testResultInfo = testResultInfo;
    }
}
