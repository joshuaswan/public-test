angular.module("testCaseApp", ["hr", "ui", "ui.bootstrap", "ngGrid", "treeControl"]);

angular.module("testCaseApp").value("ui.config", {
    //-------------------------------配置对应select2设置对应过滤机制
    select2: {
        allowClear: true,
        matcher: function (term, text, opt) {
            var code = opt.attr('code') || '';
            var reg = new RegExp(angular.uppercase(term));
            return reg.test(code) || reg.test(text);
        }
    }
});
angular.module("testCaseApp").factory("nodeNameFactory", function ($http) {
    var nodeNameObj = {};
    $http.get(Path.getUri("api/nodes-hierarchy/all-node-hierarchy")).success(
        function (data) {
            angular.forEach(data, function (item) {
                nodeNameObj[item.id] = item.name;
            });
        }
    );
    return {
        getName: function (id) {
            return nodeNameObj[id] ? nodeNameObj[id] : id;
        }
    };
});

angular.module("testCaseApp").filter("nodeName", function (nodeNameFactory) {
    return function (id) {
        return nodeNameFactory.getName(id);
    }
});

// angular.module("testCaseApp").filter("testCaseStepFilter", function () {
//     return function (testCaseId) {
//         return testCaseId.substring(testCaseId.length - 2);
//     }
// });

angular.module("testCaseApp").controller('testCaseController', ["$scope", "$http", "$timeout", "hrDialog", "nodeNameFactory", "hrProgress", function ($scope, $http, $timeout, hrDialog, nodeNameFactory, hrProgress) {
    var baseUrl = Path.getUri("api/nodes-hierarchy");
    $scope.photographUriHtml = Path.getUri("test/photograph.html?");
    var testCaseList;
    $scope.modalOption = {
        head: '新增测试节点'
    };
    $scope.node = {
        id: '',
        name: '',
        details: '',
        parentId: '',
        inputCode: '',
        nodeTypeId: '',
        nodeOrder: ''
    };

    $scope.testCase = {
        testCaseId: '',
        nodeId: '',
        testCaseTitle: '',
        summary: '',
        preconditions: '',
        testCaseStepsList: [
            {
                testCaseId: '',
                stepNumber: '1',
                actions: '',
                expectedResults: '',
                active: '',
                executionType: '',
                codePath: ''
            }],
        result: '',
        codePath: ''
    };

    $scope.searchTestCase = function () {
        if (selectNode) {
            HrUtils.httpRequest($http, "api/nodes-hierarchy/node-hierarchy-id/" + selectNode.object.id,
                function (data, status) {
                    $scope.testCaseList = data.testCaseList;
                    testCaseList = $scope.testCaseList;
                    console.log($scope.testCaseList);
                },
                function (data, status) {
                    HrUtils.httpError(data, status, hrDialog);
                }, hrDialog, "get");
        }
        runStatus = -1;
    };

    $scope.clearTestResult = function () {
        HrUtils.httpRequest($http, "api/test-case/test-result",
            function (data, status) {
                $scope.searchTestCase();
            }, function (data, status) {
                hrDialog.dialog(hrDialog.typeEnum.EXCEPTION,{message:"清空测试结果失败！"})
            }, hrDialog, "put", $scope.testCaseList);
        $scope.searchTestCase();
    };

    $scope.runTestCaseList = function () {
        hrProgress.open();
        HrUtils.httpRequest($http, "api/test-case/test-code-list",
            function (data) {
                hrProgress.close();
                if (data == "0"){
                    hrDialog.dialog(hrDialog.typeEnum.SUCCESS, {message: "自动化脚本执行成功！"});
                }else {
                    hrDialog.dialog(hrDialog.typeEnum.SUCCESS, {message: "脚本失败次数为"+data+"次！"});
                }
                $scope.searchTestCase();
            }, function () {
                hrProgress.close();
                hrDialog.dialog(hrDialog.typeEnum.EXCEPTION,{message:"自动化执行脚本异常！"});
            }, hrDialog, "post", $scope.testCaseList);
    };

    $scope.getAllNodes = function (callback) {
        $scope.allNodes = null;
        var url = baseUrl + "/all-node-hierarchy";
        $http.get(url).success(
            function (data) {
                $scope.allNodes = data;
                callback();
            }
        );
    };

    $scope.nodeIdName = {};

    angular.forEach($scope.allNodes, function (item) {
        $scope.nodeIdName[item.id] = item.name;
    });

    //--------------------------------------测试用例分组显示树形结构start------------------------------------
    //设置选中节点
    $scope.selectedNode = {};
    $scope.comparator = false;
    $scope.expression = '';
    $scope.opts = {
        injectClasses: {
            "labelSelected": "bg-selected-color"
        }
    };

    var selectNode = null;

    var setTreedata = function () {
        $scope.getAllNodes(function () {
            $scope.treedata = getTreeSourceFactory($scope.allNodes, "parentId", "id");
        });
    };

    $scope.testCase = {
        executionType: '1'
    };

    $scope.isNotActive = function () {
        return $scope.testCase.executionType == 1 ? true : false;
    };

    setTreedata();

    $scope.selectedItem = function (node) {
        selectNode = node;
        $scope.searchTestCase();
        $scope.selecteGroupOrdersMaster = selectNode.object;
    };

    //形成angular Tree 数据源 函数; oldSourceList为数组 superId:父节点ID、selfId：自己ID 字段
    var getTreeSourceFactory = function (oldSourceList, superId, selfId) {
        var treeSourceList = [];
        var sourceList = [];
        if (oldSourceList != null && oldSourceList.length > 0) {
            sourceList = oldSourceList.filter(function (item, index, arry) {
                return (item[superId] === '-1' || item[superId] == null);
            });

            for (var i = 0; i < sourceList.length; i++) {
                var node = new TreeNode();
                node.superObject = null;
                node.object = sourceList[i];
                node.children = rollFindNodeFun(oldSourceList, node, superId, selfId);
                treeSourceList.push(node);
            }
        }
        return treeSourceList;
    };

    //树节点
    var TreeNode = function () {
        this.object = {};//本身对象
        this.superObject = {};//父对象
        this.children = [];
    };

    //递归函数
    var rollFindNodeFun = function (sourceList, node, superId, selfId) {
        var nodeList = [];
        if (sourceList.length != 0) {
            var newSourceList = sourceList.filter(function (item, index, arry) {
                return (item[superId] === node.object[selfId]);
            });
            for (var i = 0; i < newSourceList.length; i++) {
                var node1 = new TreeNode();
                node1.superObject = node.object;
                node1.object = newSourceList[i];
                node1.children = rollFindNodeFun(sourceList, node1, superId, selfId);
                nodeList.push(node1);
            }
        }
        return nodeList;
    };
    //--------------------------------------测试用例分组显示树形结构end------------------------------------

    //---------------------------------------测试分组modal代码start-----------------------------------------
    $scope.nodeModal = false;
    $scope.nodeModalOpts = {
        dialogClass: "modal node-modal",
        backdropFade: true,
        dialogFade: true,
        keyboard: false,
        backdrop: true,
        backdropClick: false
    };

    $scope.closeNodeModalCallback = function () {
        $scope.nodeModal = false;
    };

    $scope.closeNodeModal = function () {
        $scope.nodeModal = false;
    };

    $scope.updatePy = function () {
        if ($scope.nodesHierarchy.name !== undefined) {
            $scope.nodesHierarchy.inputCode = CC2PY($scope.nodesHierarchy.name);
        }
    };

    $scope.saveNodesHierarchy = function () {
        if ($scope.modalTitle === "新增测试分组") {
            HrUtils.httpRequest($http, "api/nodes-hierarchy", function (data, status) {
                hrDialog.dialog(hrDialog.typeEnum.SUCCESS, {message: "新增测试分组成功！"});
            }, function (data, status) {
                HrUtils.httpError(data, status, hrDialog);
            }, hrDialog, "post", $scope.nodesHierarchy);
        } else if ($scope.modalTitle === "编辑测试分组") {
            HrUtils.httpRequest($http, "api/nodes-hierarchy/id=" + $scope.nodesHierarchy.id, function (data, status) {
                hrDialog.dialog(hrDialog.typeEnum.SUCCESS, {message: "编辑测试分组成功！"});
            }, function (data, status) {
                HrUtils.httpError(data, status, hrDialog)
            }, hrDialog, "post", $scope.nodesHierarchy);
        }
        $scope.nodeModal = false;
        $scope.getAllNodes();
        setTreedata();
    };

    $scope.openNodeHierarchyModel = function (isAddModal) {
        if (isAddModal) {
            console.log("新增测试分组");
            $scope.modalTitle = "新增测试分组";
            if (selectNode !== null) {
                $scope.nodesHierarchy = {
                    id: '',
                    name: '',
                    details: '',
                    parentId: selectNode.object.id,
                    inputCode: '',
                    nodeTypeId: '',
                    nodeOrder: ''
                };
            } else {
                $scope.nodesHierarchy = {
                    id: '',
                    name: '',
                    details: '',
                    parentId: '',
                    inputCode: '',
                    nodeTypeId: '',
                    nodeOrder: ''
                };
            }
        } else {
            $scope.modalTitle = "编辑测试分组";
            $scope.nodesHierarchy = selectNode.object;
        }
        $scope.nodeModal = true;
    };

    $scope.isSelected = function () {
        if (selectNode == null) {
            return true;
        } else {
            return false;
        }
    };

    $scope.removeNodeHierarchy = function () {
        $scope.searchTestCase();
        if (selectNode) {
            var infoMessage = "是否要删除‘" + $scope.selectedNode.object.name + "’测试分组?";
            var confirm = true;
            if (selectNode.children.length > 0) {
                var info = checkNodeHierarchyIsLeafFlag(selectNode);
                var infoList = (info == '' ? [] : info.split(';'));
                if (info == '') {
                    infoMessage = "‘" + $scope.selectedNode.object.name + "’有测试分组，无法删除！";
                    confirm = false;
                } else {
                    infoMessage = "‘" + $scope.selectedNode.object.name + "’项目下的子测试分组：“" + (infoList.length > 2 ? (infoList[0] + "”等" + (infoList.length - 1) + "个项目，") : (infoList[0] + "”")) + "含有测试用例内容，你确定要删除测试分组和测试用例内容吗"
                    confirm = false;
                }
            } else {
                if ($scope.testCaseList.length > 0) {
                    infoMessage = "‘" + $scope.selectedNode.object.name + "’测试分组中含有测试用例，无法删除！";
                    confirm = false;
                }
            }

            if (confirm) {
                hrDialog.dialog(hrDialog.typeEnum.CONFIRM, {message: infoMessage})
                    .close(function (result) {
                        if (result === "ok") {
                            deleteNodeHierarchyFun();
                        }
                    });
            } else {
                hrDialog.dialog(hrDialog.typeEnum.WARN, {message: infoMessage});
            }
        }
        else {
            return;
        }
    };

    var deleteNodeHierarchyFun = function () {
        $http.get(baseUrl + "/node-hierarchy-delete/" + $scope.selectedNode.object.id)
            .success(function (data) {
                hrDialog.dialog(hrDialog.typeEnum.SUCCESS, {message: "已删除！"})
                    .close(function (result) {
                        initFun();
                        setTreedata();
                    });
            })
            .error(function () {
                hrDialog.dialog(hrDialog.typeEnum.EXCEPTION, {message: "删除失败！"})
                    .close(function (result) {

                    });
            });
    };

    $scope.runStatus = function ($index) {
        if ($scope.testCaseList[$index].runStatus === 1) {
            return "run-success";
        } else if ($scope.testCaseList[$index].runStatus === 0) {
            return "run-fail";
        } else {
            return "no-run";
        }
    };

    var runStatus = -1;
    $scope.filterRunStatus = function (status) {
        runStatus = status;
    };

    $scope.runSuccessOpt = {
        trigger: "hover",
        placement: "top",
        html: "true",
        // title: "hover",
        content: "执行成功"
    };


    $scope.runFailOpt = {
        trigger: "hover",
        placement: "top",
        html: "true",
        // title: "hover",
        content: "执行失败"
    };


    $scope.notRunOpt = {
        trigger: "hover",
        placement: "top",
        html: "true",
        // title: "hover",
        content: "未执行"
    };

    var initFun = function () {
        selectNode = null;
        $scope.selectedNode = {};
    };

    $scope.refreshNodeHierarchy = function () {
        setTreedata();
    };

    $scope.closeNodeModal = function () {
        $scope.nodeModal = false;
    };
//-----------------------------------------维护对应测试节点end----------------------------------------------------

//--------------------------------------测试用例modal代码start-------------------------------------------
    $scope.testCaseModal = true;
    $scope.testCaseModal = true;
    $scope.testCaseModalOpts = {
        dialogClass: "modal",
        backdropFade: true,
        dialogFade: true,
        keyboard: false,
        backdrop: true,
        backdropClick: false
    };

    $scope.emptyCodePath = function () {
        if ($scope.testCase.executionType === "1") {
            $scope.testCase.codePath = '';
        }
    };

    $scope.editTestCaseModal = function ($index) {
        $scope.testCaseModal = true;
        $scope.isAddTestCase = false;
        $scope.testCase = $scope.testCaseList[$index];
        var codePathArray = $scope.testCase.codePath.split(".");
        $scope.selectPackage = codePathArray[codePathArray.length - 3];
        $scope.selectClass = codePathArray[codePathArray.length - 2];
        $scope.selectMethod = codePathArray[codePathArray.length - 1];
        console.log($scope.testCase);
    };

    $scope.isRunEnable = function ($index) {
        return $scope.testCaseList[$index].executionType == 1 ? true : false;
    };

    $scope.addTestCaseModal = function () {
        // if (!$scope.testCaseList || $scope.testCaseList[0].nodeId !== selectNode.object.id) {
        $scope.searchTestCase()
        // }
        $scope.testCase = {};
        $scope.isAddTestCase = true;
        $scope.testCaseModal = true;
        $scope.testCase.executionType = 2;
        $scope.testCase.nodeId = selectNode.object.id;
    };

    $scope.closeTestCaseModal = function () {
        $scope.testCaseModal = false;
    };

    $scope.closeTestCaseModalCallback = function () {
        $scope.testCaseModal = false;
    };

    $scope.copyTestCase = function () {
        // $scope.testCase.testCaseId = {};
        $scope.isAddTestCase = true;
        $scope.testCaseModal = true;
        $scope.testCase.executionType = 2;
        $scope.testCase.nodeId = selectNode.object.id;
        $scope.testCase.result = '';
        $scope.testCase.runStatus = null;
        $scope.testCaseList.push($scope.testCase);
        $scope.saveTestCase();
        $scope.searchTestCase();
    };

    $scope.saveTestCase = function () {
        if ($scope.isAddTestCase) {
            var testCaseId = "";
            if ($scope.testCaseList.length !== 0) {
                testCaseId = $scope.testCaseList[$scope.testCaseList.length - 1].testCaseId;
            } else {
                testCaseId = selectNode.object.id + "00";
            }
            $scope.testCase.testCaseId = testCaseId.substring(0, testCaseId.length - 3) + (parseInt(testCaseId.substring(testCaseId.length - 3)) + 1);
            if ($scope.testCaseList) {
                $scope.testCaseList.push($scope.testCase);
            } else {
                $scope.testCaseList = [];
                $scope.testCaseList.push($scope.testCase);
            }
            console.log($scope.testCase);
            if ($scope.testCase.executionType == "1") {
                $scope.testCase.codePath = "";
            } else {
                $scope.testCase.codePath = "com.heren.his." + $scope.selectPackage + "." + $scope.selectClass + "." + $scope.selectMethod;
            }
            angular.forEach($scope.testCase.testCaseStepsList, function (item) {
                item.testCaseStepsPk.testCaseId = $scope.testCase.testCaseId;
            });
            HrUtils.httpRequest($http, "api/test-case", function (data, status) {
                hrDialog.dialog(hrDialog.typeEnum.SUCCESS, {message: "新增测试用例成功！"});
            }, function (data, status) {
                HrUtils.httpError(data, status, hrDialog);
            }, hrDialog, "post", $scope.testCase);
        } else {
            if ($scope.testCase.executionType == "1") {
                $scope.testCase.codePath = "";
            } else {
                $scope.testCase.codePath = "com.heren.his." + $scope.selectPackage + "." + $scope.selectClass + "." + $scope.selectMethod;
            }
            HrUtils.httpRequest($http, "api/test-case",
                function (data, status) {
                    hrDialog.dialog(hrDialog.typeEnum.SUCCESS, {message: "修改测试用例成功！"});
                }, function (data, status) {
                    HrUtils.httpError(data, status, hrDialog);
                }, hrDialog, "put", $scope.testCase);
        }
        $scope.closeTestCaseModal();
    };

    $scope.removeTestCase = function ($index) {
        hrDialog.dialog(hrDialog.typeEnum.CONFIRM, {message: "是否删除对应测试用例信息？"})
            .close(function (result) {
                if (result === "ok") {
                    console.log($scope.testCaseList[$index]);
                    deleteTestCase($scope.testCaseList[$index]);
                }
            });
    };

    var deleteTestCase = function (data) {
        console.log(data);
        HrUtils.httpRequest($http, "api/test-case/" + data.testCaseId,
            function (data, status) {
                hrDialog.dialog(hrDialog.typeEnum.SUCCESS, {message: "删除测试用例成功!"});
                $scope.searchTestCase();
            }, function (data, status) {
                HrUtils.httpError(data, status, hrDialog)
            }, hrDialog, "delete");
    };

    $scope.runTestCase = function ($index) {
        runTestCase($scope.testCaseList[$index]);
    };

    var runTestCase = function (item) {
        hrProgress.open();
        HrUtils.httpRequest($http, "api/test-case/code-path",
            function (data, status) {
                hrDialog.dialog(hrDialog.typeEnum.SUCCESS, {message: "测试用例执行成功！"});
                $scope.searchTestCase();
                hrProgress.close();
            }, function (data, status) {
                HrUtils.httpError(data, status, hrDialog);
                hrProgress.close();
                $scope.searchTestCase();
            }, hrDialog, "post", item);
    };

    var searchPackage = function () {
        HrUtils.httpRequest($http, "api/nodes-hierarchy/package-name/",
            function (data, status) {
                $scope.packageNameList = data;
                console.log($scope.packageNameList)
            }, function (data, status) {

            })
    };
    $scope.selectPackage = "no";
    $scope.selectClass = "no";
    $scope.selectMethod = "no";
    $scope.selectTwoOpts = {
        matcher: function (term, text, opt) {
            var reg = new RegExp(term);
            return reg.test(text);
        }
    };

    searchPackage();

    $scope.$watch("selectPackage", function (newVal, oldVal) {
        console.log(newVal);
        if (newVal != "packageName") {
            HrUtils.httpRequest($http, "api/nodes-hierarchy/class-name/" + $scope.selectPackage,
                function (data, status) {
                    $scope.classNameList = data;
                }, function (data, status) {

                })
        } else {
            $scope.classNameList = [];
        }
    }, true);

    $scope.$watch("selectClass", function (newVal, oldVal) {
        console.log(newVal);
        if (newVal != "className" && newVal != "no") {
            HrUtils.httpRequest($http, "api/nodes-hierarchy/method-name/com.heren.his." + $scope.selectPackage + "." + $scope.selectClass,
                function (data, status) {
                    $scope.methodNameList = data;
                }, function (data, status) {

                })
        } else {
            $scope.methodNameList = [];
        }
    }, true);

    var searchMethod = function (path) {
        HrUtils.httpRequest($http, "api/nodes-hierarchy/method-name/" + path,
            function (data, status) {

            }, function (data, status) {

            })
    };

    $scope.showTestCase = function ($index) {
        if (runStatus === -1) {
            return true;
        } else if ($scope.testCaseList[$index].runStatus != runStatus) {
            return false;
        } else {
            return true;
        }
    };

//---------------------------------------测试用例modal代码end-------------------------------------------

    // 核查删除时，叶子节点是否含有测试用例
    var checkNodeHierarchyIsLeafFlag = function (node) {
        var checkInfo = '';
        for (var i = 0; i < node.children.length; i++) {
            if (node.children[i].children.length > 0) {
                var result = checkNodeHierarchyIsLeafFlag(node.children[i]);
                if (result != '') {
                    checkInfo += result;
                }
            } else {
                if (node.children[i].object.leafFlag == 1) {
                    checkInfo += node.children[i].object.title + ";";
                }
            }
        }
        return checkInfo;
    };

//--------------------------------------测试步骤nd-grid定义--------------------------------------------

    $scope.selectTestCaseStep = [];

//绑定当前行号信息
    var actionInputTemplate = "<input ng-model='row.entity.actions' style='width: 100%'>";
    var expectedResultsInputTemplate = "<input ng-model='row.entity.expectedResults' style='width: 100%'>";
    var codePathInputTemplate = "<input ng-model='row.entity.codePath' style='width: 100%'>";

    $scope.testCaseStepGridOptions = {
        data: 'testCase.testCaseStepsList',
        selectedItems: $scope.selectTestCaseStep,
        multiSelect: false,
        i18n: 'zh-cn',
        enableRowSelection: true,
        enableColumnResize: true,
        columnDefs: [
            {field: 'testCaseStepsPk.stepNumber', displayName: '序号', width: '5%', enableCellEdit: false},
            {field: 'actions', displayName: '测试步骤', enableCellEdit: true, editableCellTemplate: actionInputTemplate},
            {
                field: 'expectedResults',
                displayName: '预期结果',
                enableCellEdit: true,
                editableCellTemplate: expectedResultsInputTemplate
            },
            {field: 'codePath', displayName: '脚本地址', enableCellEdit: true, editableCellTemplate: codePathInputTemplate}
        ]
    };

    $scope.addTestCaseStep = function () {
        console.log("new test case step");
        if ($scope.testCase.testCaseStepsList) {
            var testCaseStepPk = {
                stepNumber: $scope.testCase.testCaseStepsList.length + 1
            };
        } else {
            var testCaseStepPk = {
                stepNumber: '1'
            };
            $scope.testCase.testCaseStepsList = [];
        }
        testCaseStepPk.testCaseId = $scope.testCase.testCaseId;
        var testCaseStep = {
            testCaseStepsPk: testCaseStepPk
        };
        testCaseStep.active = 1;
        testCaseStep.executionType = 1;
        $scope.testCase.testCaseStepsList.push(testCaseStep);
        console.log($scope.testCase.testCaseStepsList);
    };

    $scope.removeTestCaseStep = function () {
        $scope.testCase.testCaseStepsList.pop();
        // HrArray.remove($scope.selectTestCaseStep[0], $scope.testCase.testCaseStepsList);
    };

    Mousetrap.bindGlobal('alt+n', function () {
        $scope.addTestCaseModal();
        if ($scope.$$phase) {
            $scope.$apply();
        }
        return false;
    });

    Mousetrap.bindGlobal('alt+r', function () {
        $scope.runTestCaseList();
        if ($scope.$$phase) {
            $scope.$apply();
        }
        return false;
    });

    Mousetrap.bindGlobal('alt+c', function () {
        $scope.clearTestResult();
        if ($scope.$$phase) {
            $scope.$apply();
        }
        return false;
    });
}])
;

angular.module("testCaseApp").factory('nodeTree', function ($scope, $http) {
});
