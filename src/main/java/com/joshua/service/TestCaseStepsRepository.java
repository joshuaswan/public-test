package com.joshua.service;

import com.joshua.entity.NodesHierarchy;
import com.joshua.entity.TestCaseSteps;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by joshua on 2018/3/22.
 */
public interface TestCaseStepsRepository extends CrudRepository<TestCaseSteps,Long> {
}
