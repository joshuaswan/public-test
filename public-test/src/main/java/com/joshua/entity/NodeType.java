package com.joshua.entity;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * Created by joshua on 2016/5/6.
 */

@Entity
public class NodeType {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private String description;

    public NodeType(String description) {
        this.description = description;
    }

    public NodeType() {
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "NodeType{" +
                "id=" + id +
                ", description='" + description + '\'' +
                '}';
    }
}
