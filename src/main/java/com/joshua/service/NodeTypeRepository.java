package com.joshua.service;

import com.joshua.entity.NodeType;
import com.joshua.entity.NodesHierarchy;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by joshua on 2018/3/22.
 */
public interface NodeTypeRepository extends CrudRepository<NodeType,Long> {
}
