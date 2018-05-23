package com.joshua.service;

import com.joshua.repository.NodesHierarchyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by joshua on 2018-05-15.
 */
@Service
public class NodesHierarchyService {

    NodesHierarchyRepository nodesHierarchyRepository;

    @Autowired
    public NodesHierarchyService(NodesHierarchyRepository nodesHierarchyRepository) {
        this.nodesHierarchyRepository = nodesHierarchyRepository;
    }

    public List<String> getPackageList() {
        String path = "src.main.java.com.joshua.test";
        File dir = new File(path.replaceAll("\\.", "/"));
        File listFile[] = dir.listFiles();
        List<String> stringList = new ArrayList<>();
        if (listFile != null) {
            for (int i = 0; i < listFile.length; i++) {
                if (listFile[i].isDirectory()) {
                    stringList.add(listFile[i].getName());
                }
            }
        }
        return stringList;
    }

    public List<String> getClassList(String pathName) {
        String fullPath = "src.main.java.com.joshua.test" + pathName;
        File dir = new File(fullPath.replaceAll("\\.", "/"));
        File listFile[] = dir.listFiles();
        List<String> stringList = new ArrayList<>();
        if (listFile != null) {
            for (int i = 0; i < listFile.length; i++) {
                if (listFile[i].getName().endsWith(".java")) {
                    stringList.add(listFile[i].getName().substring(0, listFile[i].getName().length() - 5));
                }
            }
        }
        return stringList;
    }
}
