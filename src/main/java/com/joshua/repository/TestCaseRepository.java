package com.joshua.repository;

import com.joshua.entity.NodesHierarchy;
import com.joshua.entity.TestCase;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by joshua on 2018/3/22.
 */
public interface TestCaseRepository extends CrudRepository<TestCase,Long> {
}
