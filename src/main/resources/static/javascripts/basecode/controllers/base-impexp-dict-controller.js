/**
 * Created by liutao on 2016/1/14.
 */
var baseImpExpDictApp = angular.module('baseImpExpDictApp', ['ui', 'hr', 'ngGrid', 'ngGridExtension']);
baseImpExpDictApp.filter('typeFilter', function () {
    return function (item) {
        if (item == 1) {
            return "入库"
        } else if (item == -1) {
            return "出库"
        }
    }
});

baseImpExpDictApp.filter('typeFilter1', function () {
    return function (item) {
        if (item == 1) {
            return "内部科室"
        } else if (item == 2) {
            return "内部库房"
        } else if (item == 3) {
            return "外部供应商"
        } else if (item == 4) {
            return "全部"
        }
    }
});
baseImpExpDictApp.controller("baseImpExpDictController", ["$scope", "$http", "hrDialog", "$window", "$timeout", function ($scope, $http, hrDialog, $window, $timeout) {

    var baseUri = Path.getUri("api/");
    $scope.myData = [];
    $scope.myData1 = [];
    $scope.selectedItem = [];
    $scope.ctrvalue0 = '1';

    $scope.init = function () {
        var url = baseUri + ("base-impexp-dict/getall");
        $http.get(url).success(function (data, status) {
            if (data.length > 0) {
                angular.forEach(data, function (item) {
                    if (item.stopIndicator == 1) {
                        item.stopIndicator = true;
                    } else if (item.stopIndicator == 0) {
                        item.stopIndicator = false;
                    }
                })
            }
            $scope.myData1 = data;
        }).error(function (data, status) {
            $scope.promptMessage = "查询出错";
            $scope.openWarnDialog();
        })
    };

    $scope.gridOptions = {
        enableCellEditOnFocus: true,//1、为了让“行编辑”生效，首先允许 “单元格编辑”(为了使ngGrid使用 "cellEditTemplate.html"模版)
        enableRowEditOnSelected: true,//2、行编辑模式：允许 “行编辑”
        enableCellEdit: true,
        enableRowSelection: true,
        rowTemplate: "<div ng-style=\"{ \'cursor\': row.cursor }\" ng-repeat=\"col in renderedColumns\" ng-click=\"getRowIndex(row.entity,row.index)\" ng-class=\"col.colIndex()\" class=\"ngCell {{col.cellClass}}\"><div class=\"ngVerticalBar\" ng-style=\"{height: rowHeight}\" ng-class=\"{ ngVerticalBarVisible: !$last }\">&nbsp;</div><div ng-cell></div></div>",
        enableColumnResize: true,
        data: 'myData',
        enablePinning: false,
        enableCellEditOnFocus: true,
        multiSelect: false,
        i18n: 'zh-cn',//国际化
        columnDefs: 'myDefs',
        selectedItems: $scope.selectedItem
    };

    var codeNameTemplate = "<div><input ng-input style=\"width:100%;\" type=\'text\' ng-model=\'row.entity.codeName\' id=\"codeName\"\n  ng-blur=\"setInputCodeDefaultValue(row.entity.codeName, row.rowIndex)\"  enter-loop=\"{{row.rowIndex}}\" enterindex=\"3\">\n</div>";
    var stIndicatorTemplate = '<div class="text-center"  style="margin-top: 3px;" >\n    <input  ng-model=\"row.entity.stopIndicator\" style="margin-top: 4px" type="checkbox" \n   >  \n</div>';
    var baseimpexptypeTemplate = '<select ui-select2 ng-grid-select2 ng-class="\'colt\' + col.index"  placeholder="请选择" ng-model=\'row.entity.ctrvalue0\'> <option value=\"1\">入库</option>\n <option value=\"-1\">出库</option>\n</select>';
    var baseexpinsTemplate = '<select ui-select2 ng-grid-select2 ng-class="\'colt\' + col.index"  placeholder="请选择" ng-model=\'row.entity.ctrvalue1\'> <option value="1">内部科室</option>\n    <option value="2">内部库房</option>\n    <option value="3">外部供应商</option>\n    <option value="4">全部</option>\n</select>';
    $scope.myDefs = [
        {
            field: 'ctrvalue0',
            displayName: '类型',
            cellFilter: 'typeFilter',
            width: '100px',
            enableCellEdit: true,
            editableCellTemplate: baseimpexptypeTemplate
        },
        {
            field: 'codeName',
            displayName: '类型名称',
            width: '260px',
            enableCellEdit: true,
            editableCellTemplate: codeNameTemplate
        },
        {field: 'inputCode', displayName: '输入码', enableCellEdit: false, width: '100px'},
        {
            field: 'ctrvalue1',
            displayName: '对应外部机构',
            cellFilter: 'typeFilter1',
            width: '160px',
            enableCellEdit: true,
            editableCellTemplate: baseexpinsTemplate
        },
        {
            field: 'stopIndicator',
            displayName: '停用',
            enableCellEdit: false,
            width: '80px',
            cellTemplate: stIndicatorTemplate
        },
        {field: 'col', displayName: '', enableCellEdit: false}
    ];

    //汉字转拼音
    $scope.setInputCodeDefaultValue = function (codeName, index) {
        $scope.myData[index].inputCode = CC2PY(codeName);
    };

    //控制删除和修改按钮颜色
    $scope.isCurrentFirmSelected = function () {
        return $scope.selectedItem.length == 0;
    };

    $scope.checkOnlyOne = false;

    $scope.baseCodeDict = {
        codeTypeId: "",
        codeId: "",
        codeName: "",
        codeTypeName: "",
        codeValue: "",
        inputCode: "",
        upCodeId: "",
        grade: "",
        leafFlag: "",
        stopIndicator: "",
        sysFlag: "",
        serialNo: "",
        note: "",
        ctrvalue0: "",
        ctrvalue1: "",
        ctrvalue2: "",
        ctrvalue3: "",
        ctrvalue4: "",
        ctrvalue5: "",
        ctrvalue6: "",
        ctrvalue7: "",
        ctrvalue8: "",
        ctrvalue9: "",
        $$add: true
    };

    //查询
    $scope.queryImpExpdict = function () {
        var url = baseUri + ("base-impexp-dict/query?ctrvalue=" + $scope.ctrvalue0);
        $http.get(url).success(function (data, status) {
            if (data.length > 0) {
                angular.forEach(data, function (item) {
                    if (item.stopIndicator == 1) {
                        item.stopIndicator = true;
                    } else if (item.stopIndicator == 0) {
                        item.stopIndicator = false;
                    }
                })
            }
            $scope.myData = data;
            $scope.selectedItem.length = 0;
            $scope.init();
        }).error(function (data) {
            $scope.promptMessage = "查询出错";
            $scope.openWarnDialog();
        })
    };

    //删除一条信息
    $scope.delRow = function () {
        console.log($scope.selectedItem);
        if ($scope.selectedItem.length == 0) {
            hrDialog.dialog(hrDialog.typeEnum.WARN, {message: "请选择一条数据！"});
            return;
        }
        var codeId = null;
        var codeTypeId = null;
        codeId = $scope.selectedItem[0].codeId;
        codeTypeId = $scope.selectedItem[0].codeTypeId;
        var opts = {
            title: '操作窗口',
            message: '是否删除',
            buttons: [
                {result: 'callbackResultDelete', label: '是', cssClass: 'btn-primary'},
                {result: "callbackResultCancel", label: '否'}
            ]
        };
        //可以提供opts参数，覆盖其中的全部选项
        hrDialog.dialog(hrDialog.typeEnum.CONFIRM, opts).close(function (result) {
            if (result === 'callbackResultDelete') {
                if ($scope.myData[0].$$add === true) {
                    $scope.myData.splice(0, 1);
                }
                var url = Path.getUri(baseUri + "base-code-dict/del-baseCode-new?codeId=" + codeId + "&codeTypeId=" + codeTypeId);
                $http.delete(url).success(function (data) {
                    hrDialog.dialog(hrDialog.typeEnum.SUCCESS, {message: "已删除！"});
                    $scope.queryImpExpdict();
                }).error(function (data) {
                    hrDialog.dialog(hrDialog.typeEnum.WARN, {message: "删除失败！"});
                });
            }
        });
        $scope.checkOnlyOne = false;
    };

    //初始化 新增行
    $scope.cleanAddRow = function () {
        $scope.baseCodeDict.ctrvalue0 = "";
        $scope.baseCodeDict.ctrvalue1 = "";
        $scope.baseCodeDict.codeName = "";
        $scope.baseCodeDict.inputCode = "";
        $scope.baseCodeDict.stopIndicator = 0;
    };

    //增加行
    $scope.addRow = function () {
        if (!$scope.checkOnlyOne) {
            var codeId = 1;
            codeId = codeId + Number($scope.myData1[$scope.myData1.length - 1].codeId);
            $scope.baseCodeDict.codeId = codeId;
            $scope.baseCodeDict.codeTypeId = $scope.myData1[$scope.myData1.length - 1].codeTypeId;
            $scope.baseCodeDict.codeTypeName = $scope.myData1[$scope.myData1.length - 1].codeTypeName;
            $scope.baseCodeDict.grade = $scope.myData1[$scope.myData1.length - 1].grade;
            $scope.baseCodeDict.leafFlag = $scope.myData1[$scope.myData1.length - 1].leafFlag;
            $scope.baseCodeDict.sysFlag = $scope.myData1[$scope.myData1.length - 1].sysFlag;
            $scope.baseCodeDict.serialNo = $scope.myData1[$scope.myData1.length - 1].serialNo;
            $scope.baseCodeDict.codeName = "";
            if ($scope.ctrvalue0 == 1 || $scope.ctrvalue0 == " ") {
                $scope.baseCodeDict.ctrvalue0 = "1";
            } else {
                $scope.baseCodeDict.ctrvalue0 = "-1";
            }
            $scope.baseCodeDict.ctrvalue1 = "1";
            $scope.myData.unshift($scope.baseCodeDict);
            setTimeout(function () {
                $scope.gridOptions.selectRow(0, true);
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
                $("#codeName").focus();
            }, 100)

        } else {
            hrDialog.dialog(hrDialog.typeEnum.WARN, {message: "请先进行保存操作！"});
            $("#codeName").focus();
        }
        $scope.checkOnlyOne = true;
    };


    //保存数据
    $scope.saveBaseCode = function () {
        var checkData = true;
        angular.forEach($scope.myData, function (item, index) {
            if ($scope.myData[index].ctrvalue0 != "" && $scope.myData[index].codeName != "" && $scope.myData[index].ctrvalue1 != "") {
            } else {
                checkData = false;
            }
        });
        if (checkData) {
            var url = Path.getUri(baseUri + "base-impexp-dict/save-type-name");
            var tempData = angular.copy($scope.myData);
            angular.forEach(tempData, function (item) {
                if (item.stopIndicator == true) {
                    item.stopIndicator = 1;
                } else {
                    item.stopIndicator = 0;
                }
            });
            $http.post(url, tempData).success(function (data) {
                hrDialog.dialog(hrDialog.typeEnum.SUCCESS, {message: "已保存！"});
                $scope.queryImpExpdict();
                $scope.cleanAddRow();
            }).error(function (data) {
                hrDialog.dialog(hrDialog.typeEnum.WARN, {message: "保存失败！"});
            });
        } else {
            hrDialog.dialog(hrDialog.typeEnum.WARN, {message: "表单内容不可为空！"});
        }
        $scope.checkOnlyOne = false;
    };

    $scope.openWarnDialog = function () {
        hrDialog.dialog(hrDialog.typeEnum.WARN, {message: $scope.promptMessage})
            .close(function (result) {
            });
    };


    (function () {
        Mousetrap.bindGlobal(["f2", "f3", "f6", "f7", "f8", "f9", "f10"], function () {
            return false
        });

        //查询
        Mousetrap.bindGlobal("alt+q", function () {
            $scope.queryImpExpdict();
            if (!$scope.$$phase) {
                $scope.$apply();
            }
            return false;
        });

        //保存
        Mousetrap.bindGlobal("alt+s", function () {
            $scope.saveBaseCode();
            if (!$scope.$$phase) {
                $scope.$apply();
            }
            return false;
        });

        //关闭
        Mousetrap.bindGlobal("alt+c", function () {
            closeThisByMain();
            if (!$scope.$$phase) {
                $scope.$apply();
            }
            return false;
        });


    })();

    $scope.queryImpExpdict();

}]);
