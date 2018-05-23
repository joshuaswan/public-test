package com.joshua.entity;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlRootElement;
import java.sql.Blob;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by joshua on 2016/6/6.
 */
@Entity
public class TestResultInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private String id;

    private Blob resultPhotograph;

    private Date createTime;
    @OneToMany(mappedBy = "id")
    private Set<TestCase> testCase = new HashSet<>();

    public TestResultInfo() {
    }

    public TestResultInfo(Blob resultPhotograph, Date createTime, Set<TestCase> testCase) {
        this.resultPhotograph = resultPhotograph;
        this.createTime = createTime;
        this.testCase = testCase;
    }

    @Override
    public String toString() {
        return "TestResultInfo{" +
                "id='" + id + '\'' +
                ", resultPhotograph=" + resultPhotograph +
                ", createTime=" + createTime +
                ", testCase=" + testCase +
                '}';
    }

    public Blob getResultPhotograph() {
        return resultPhotograph;
    }

    public void setResultPhotograph(Blob resultPhotograph) {
        this.resultPhotograph = resultPhotograph;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Set<TestCase> getTestCase() {
        return testCase;
    }

    public void setTestCase(Set<TestCase> testCase) {
        this.testCase = testCase;
    }
}
