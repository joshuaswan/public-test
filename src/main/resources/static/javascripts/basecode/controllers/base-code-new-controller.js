/**
 * Created by douzhiwei on 2015/9/7.
 */
var baseCodeDictNewApp = angular.module('baseCodeDictNewApp', ['ui', 'hr', 'ngGrid', 'ngGridExtension']);
baseCodeDictNewApp.controller("BaseCodeController", ["$scope", "$http", "hrDialog", "$window", "$timeout", function ($scope, $http, hrDialog, $window, $timeout) {
    var baseUri = Path.getUri("api/");
    $scope.myData = [];
    $scope.name = "";
    $scope.name = getQueryString($window.location.search, "name");
    $scope.codeTypeName = getQueryString($window.location.search, "codeTypeName");
    //查询所有数据
    $scope.init = function () {
        $http.get(baseUri + "base-code-dict/code-type-name/" + $scope.codeTypeName).success(function (data, status) {
            $scope.myData = data;
        }).error(function (data, status) {

        });
    };
    $scope.init();
    $scope.gridOptions = {
        enableCellEditOnFocus: true,//1、为了让“行编辑”生效，首先允许 “单元格编辑”(为了使ngGrid使用 "cellEditTemplate.html"模版)
        enableRowEditOnSelected: true,//2、行编辑模式：允许 “行编辑”
        enableCellEdit: true,
        enableRowSelection: true,
        rowTemplate: "<div ng-style=\"{ \'cursor\': row.cursor }\" ng-repeat=\"col in renderedColumns\" ng-click=\"selectRow(row.entity,row.index)\" ng-class=\"col.colIndex()\" class=\"ngCell {{col.cellClass}}\"><div class=\"ngVerticalBar\" ng-style=\"{height: rowHeight}\" ng-class=\"{ ngVerticalBarVisible: !$last }\">&nbsp;</div><div ng-cell></div></div>",
        enableColumnResize: true,
        data: 'myData',
        enablePinning: false,
        enableCellEditOnFocus: true,
        multiSelect: false,
        i18n: 'zh-cn',//国际化
        columnDefs: 'myDefs'
    };
    var codeNameTemplate = "<div><input ng-input style=\"width:100%;\" type=\'text\' ng-model=\'row.entity.codeName\' \n  ng-blur=\"setInputCodeDefaultValue(row.entity.codeName, row.rowIndex)\"  enter-loop=\"{{row.rowIndex}}\" enterindex=\"3\">\n</div>";
    //var stIndicatorTemplate = '<div class="text-center"  style="margin-top: 3px;" >\n    <input  ng-model=\"row.entity.stopIndicator\" style="margin-top: 4px" type="checkbox" \n   >  \n</div>';
    var codeIdRez = "<div><input  ng-input style=\"width:100%;\" type=\'text\' ng-model=\'row.entity.codeId\' id=\"codeId\"\n  ng-blur=\"check(row.entity.codeId,row.rowIndex)\"  enter-loop=\"{{row.rowIndex}}\" enterindex=\"3\">\n</div>";
    $scope.myDefs = [

        {field: 'codeId', displayName: $scope.name + 'ID', width: '260px', editableCellTemplate: codeIdRez},
        {field: 'codeName', displayName: $scope.name + '名称', width: '260px', editableCellTemplate: codeNameTemplate},
        {field: 'inputCode', displayName: '输入码', enableCellEdit: false, width: '100px'},
        {field: 'col', displayName: '', enableCellEdit: false}
    ];
    //汉字转拼音
    $scope.setInputCodeDefaultValue = function (codeName, index) {
        $scope.myData[index].inputCode = CC2PY(codeName);
    };
    //正则表达验证
    $scope.checkOnlyOne = false;
    $scope.check = function (codeId, index) {
        var check = false;
        var reg = /^([0-9]*|^[A-Za-z]+$)$/;
        //  var reg = /^(\d{2}|\d{4}|\d{6})$/;
        if (codeId != "") {
            if (!reg.test(codeId)) {
                hrDialog.dialog(hrDialog.typeEnum.WARN, {message: "只能是数字或英文字母！"});
                $scope.baseCodeDict.codeId = "";
                check = false;
            }
        } else {
            $scope.checkOnlyOne = true;
        }


        angular.forEach($scope.myData, function (_item, count) {
            if (index != count && $scope.myData[count].codeId == $scope.myData[index].codeId) {
                check = true;
            }
        });
        if (check) {
            hrDialog.dialog(hrDialog.typeEnum.WARN, {message: $scope.name + "id不允许重复！id=" + codeId});
            check = false;
            $scope.baseCodeDict.codeId = "";
        }

    };

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
    //增加行
    $scope.addRow = function () {

        if (!$scope.checkOnlyOne) {
            $scope.baseCodeDict.codeTypeId = $scope.myData[$scope.myData.length - 1].codeTypeId;
            $scope.baseCodeDict.codeTypeName = $scope.myData[$scope.myData.length - 1].codeTypeName;
            $scope.baseCodeDict.grade = $scope.myData[$scope.myData.length - 1].grade;
            $scope.baseCodeDict.leafFlag = $scope.myData[$scope.myData.length - 1].leafFlag;
            $scope.baseCodeDict.sysFlag = $scope.myData[$scope.myData.length - 1].sysFlag;
            $scope.baseCodeDict.serialNo = $scope.myData[$scope.myData.length - 1].serialNo;
            $scope.myData.unshift($scope.baseCodeDict);
            setTimeout(function () {
                $scope.gridOptions.selectRow(0, true);
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
                $("#codeId").focus();
            }, 100)

        } else {
            hrDialog.dialog(hrDialog.typeEnum.WARN, {message: "请先进行保存操作！"});
        }
    };

    //初始化 新增行
    $scope.cleanAddRow = function () {
        $scope.baseCodeDict.codeId = "";
        $scope.baseCodeDict.codeName = "";
        $scope.baseCodeDict.inputCode = "";
        //$scope.baseCodeDict.stopIndicator = 0;
    };

    //删除一条信息
    var codeId = null;
    var codeTypeId = null;
    $scope.selectRow = function (entity, index) {
        codeId = entity.codeId;
        codeTypeId = entity.codeTypeId;
    };
    $scope.openConfirmDialog = function () {
        if (codeId === null) {
            hrDialog.dialog(hrDialog.typeEnum.WARN, {message: "请选择一条数据！"});
            return;
        }
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
                    $scope.init();
                }).error(function (data) {
                    hrDialog.dialog(hrDialog.typeEnum.WARN, {message: "删除失败！"});
                });
            }
        });
        $scope.checkOnlyOne = false;
    };
    //保存数据
    $scope.saveBaseCode = function () {
        var checkData = true;
        angular.forEach($scope.myData, function (item, index) {
            if ($scope.myData[index].codeId != "" && $scope.myData[index].codeName != "") {
            } else {
                checkData = false;
            }
        });
        if (checkData) {
            var url = Path.getUri(baseUri + "base-code-dict/code-type-name-new");
            var tempData = angular.copy($scope.myData);
            angular.forEach(tempData, function (item) {
                //插入up_code_id
                var upCodeId = item.codeId.substring(0, item.codeId.length - 2);
                item.upCodeId = upCodeId;
            });
            $http.post(url, tempData).success(function (data) {
                hrDialog.dialog(hrDialog.typeEnum.SUCCESS, {message: "已保存！"});
                $scope.init();
                $scope.cleanAddRow();
            }).error(function (data) {
                hrDialog.dialog(hrDialog.typeEnum.WARN, {message: "保存失败！"});
            })
        } else {
            hrDialog.dialog(hrDialog.typeEnum.WARN, {message: "表单内容不可为空！"});
        }
        $scope.checkOnlyOne = false;

    };

    //查询
    $scope.searchName = "";
    $scope.getBaseCodes = function () {
        if ($scope.searchName.length == 0) {
            $scope.init();
        }
        var url = Path.getUri(baseUri + "base-code-dict/code-type-codeName/" + $scope.codeTypeName + "/" + $scope.searchName);
        $http.get(url).success(function (data) {
            $scope.myData = data;
        }).error(function (data) {
            $scope.openExceptionDialog();
        });
    };
    //给关闭传参数
    $scope.closeTable = function () {
        var str = "?codeTypeName=" + $scope.codeTypeName + "&name=" + $scope.name;
        closeThisByMain(str);
    };
    //快捷键设置
    (function () {
        Mousetrap.bindGlobal(["f2", "f3", "f6", "f7", "f8", "f9", "f10"], function () {
            return false;
        });

        //查询
        Mousetrap.bindGlobal("alt+q", function () {
            $scope.init();
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
        //保存
        Mousetrap.bindGlobal("alt+s", function () {
            $scope.saveBaseCode();
            if (!$scope.$$phase) {
                $scope.$apply();
            }
            return false;
        });
    })();

}]);