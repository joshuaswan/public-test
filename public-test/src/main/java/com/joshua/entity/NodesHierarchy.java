package com.joshua.entity;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Created by joshua on 2016/4/26.
 */

@Entity
@SequenceGenerator(name = "nodesHierarchy",sequenceName = "nodesHierarchy_sequence",initialValue = 1,allocationSize = 1)
public class NodesHierarchy{

    @Id
    @Column(name="id")
    @GeneratedValue(generator="nodesHierarchy")
    private Integer id;

    private String name;

    private String details;

    private String parentId;

    private String inputCode;

    private Integer nodeTypeId;

    private Integer nodeOrder;

    @OneToMany(mappedBy = "id")
    private Set<TestCase> testCases = new HashSet<>();

    public NodesHierarchy() {
    }

    public NodesHierarchy(String name, String details, String parentId, String inputCode, Integer nodeTypeId, Integer nodeOrder, Set<TestCase> testCases) {
        this.name = name;
        this.details = details;
        this.parentId = parentId;
        this.inputCode = inputCode;
        this.nodeTypeId = nodeTypeId;
        this.nodeOrder = nodeOrder;
        this.testCases = testCases;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public String getInputCode() {
        return inputCode;
    }

    public void setInputCode(String inputCode) {
        this.inputCode = inputCode;
    }

    public Integer getNodeTypeId() {
        return nodeTypeId;
    }

    public void setNodeTypeId(Integer nodeTypeId) {
        this.nodeTypeId = nodeTypeId;
    }

    public Integer getNodeOrder() {
        return nodeOrder;
    }

    public void setNodeOrder(Integer nodeOrder) {
        this.nodeOrder = nodeOrder;
    }

    public Set<TestCase> getTestCases() {
        return testCases;
    }

    public void setTestCases(Set<TestCase> testCases) {
        this.testCases = testCases;
    }

    @Override
    public String toString() {
        return "NodesHierarchyRepository{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", details='" + details + '\'' +
                ", parentId='" + parentId + '\'' +
                ", inputCode='" + inputCode + '\'' +
                ", nodeTypeId=" + nodeTypeId +
                ", nodeOrder=" + nodeOrder +
                ", testCases=" + testCases +
                '}';
    }
}
