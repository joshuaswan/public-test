package com.joshua.service;

import com.joshua.entity.NodesHierarchy;
import com.joshua.entity.TestResultInfo;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by joshua on 2018/3/22.
 */
public interface TestResultInfoRepository extends CrudRepository<TestResultInfo,Long> {
}
