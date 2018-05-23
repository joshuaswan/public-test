package com.joshua.entity;


import javax.persistence.*;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by joshua on 2016/4/26.
 */

@Entity
@Table(name = "TEST_CASE_STEPS")
@XmlRootElement
public class TestCaseSteps {

    @Id
    @GeneratedValue
    private Integer id;

    private String actions;

    private String expectedResults;

    private Integer active;

    private Integer executionType;

    private String codePath;

    @OneToMany(mappedBy = "id")
    private Set<TestCase> testCaseId = new HashSet<>();

    public TestCaseSteps() {
    }

    public TestCaseSteps(String actions, String expectedResults, Integer active, Integer executionType, String codePath, Set<TestCase> testCaseId) {
        this.actions = actions;
        this.expectedResults = expectedResults;
        this.active = active;
        this.executionType = executionType;
        this.codePath = codePath;
        this.testCaseId = testCaseId;
    }

    @Override
    public String toString() {
        return "TestCaseSteps{" +
                "id=" + id +
                ", actions='" + actions + '\'' +
                ", expectedResults='" + expectedResults + '\'' +
                ", active=" + active +
                ", executionType=" + executionType +
                ", codePath='" + codePath + '\'' +
                ", testCaseId=" + testCaseId +
                '}';
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getActions() {
        return actions;
    }

    public void setActions(String actions) {
        this.actions = actions;
    }

    public String getExpectedResults() {
        return expectedResults;
    }

    public void setExpectedResults(String expectedResults) {
        this.expectedResults = expectedResults;
    }

    public Integer getActive() {
        return active;
    }

    public void setActive(Integer active) {
        this.active = active;
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

    public Set<TestCase> getTestCaseId() {
        return testCaseId;
    }

    public void setTestCaseId(Set<TestCase> testCaseId) {
        this.testCaseId = testCaseId;
    }
}
