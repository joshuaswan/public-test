angular.module('hr.templateCache').run(['$templateCache',
    function($templateCache) {
        $templateCache.put('hr-multiple-select.html', '<div class="hr-multiple-select hc-float-above border-radius" click-outside="closeMe(\'click_outside\')">\n    <div class="operating">\n        <label class="checkbox inline" ng-click="clickAllSelectedFlag()">\n            <input type="checkbox" ng-model="allSelectedFlag">全选\n        </label>\n        <button class="btn btn-small" ng-click="closeMe(\'confirm\')">确定</button>\n    </div>\n    <div class="data">\n        <ul class="inline li-striped">\n            <li class="overflow-ellipsis" ng-repeat="item in selectDatas" ng-class="{\'selected\': item.selectedFlag, \'matching\' : item.matchingFlag}">\n                <label class="checkbox">\n                    <input type="checkbox" ng-model="item.selectedFlag">\n                    <hr-multiple-cell></hr-multiple-cell>\n                </label>\n            </li>\n        </ul>\n    </div>\n</div>\n        \n        <style type="text/css">\n            /*----------------------------------------多选输入法 2014-05-15 范成林 开始------------------------*/\n            .hr-multiple-select {\n                position: absolute;\n                width: 550px;\n                background-color: #ffffff;\n                border: solid 1px #AEBDCA;\n                z-index: 3000;\n                margin-top:2px;\n            }\n\n            .hr-multiple-select li.selected {\n                color: blue;\n            }\n\n            .hr-multiple-select li.matching {\n                color: red;\n            }\n\n            .hr-multiple-select .operating {\n                padding: 3px;\n                border-bottom: solid 1px #AEBDCA;\n            }\n\n            .hr-multiple-select .operating label {\n                margin-left: 5px;\n            }\n\n            .hr-multiple-select .operating button {\n                float:right;\n            }\n\n            .hr-multiple-select .data {\n                padding: 3px;\n                max-height: 450px;\n                overflow-y: auto;\n            }\n\n            .hr-multiple-select .data ul.inline li{\n                margin-right: 0px;\n                margin-top: 5px;\n                width: 170px;\n            }\n            /*---------------------多选输入法 2014-05-15 范成林 结束------------------------------------------------*/\n        </style>');
    }]);

angular.module('hr.service').directive("hrMultipleSelect", ['$document', 'hrPosition', '$debounce', '$templateCache', '$compile', '$parse', function($document, hrPosition, $debounce, $templateCache, $compile, $parse) {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            hrMultipleSelect: '='
        },
        controller: ['$scope', '$element', '$parse', function($scope, $element, $parse) {
            var _closeFlag = true;
            var _template = "";
            $scope.closeHandler = "";//记录输入法关闭的操作者
            $scope.selectDatas = [];//需要选择的数据源
            $scope.templates = {};

            $scope.matchSelectData = function() {
                var reg = new RegExp($scope.ngModel.$modelValue.replace(/\W/g, ""), "i");
                $scope.selectDatas.forEach(function(item) {
                    if (!angular.equals($scope.ngModel.$modelValue.replace(/\W/g, ""), "") && reg.test(item.entity[$scope.hrMultipleSelect.matchingField])) {
                        item.matchingFlag = true;
                    } else {
                        item.matchingFlag = false;
                    }
                });
            };

            var deregAllSelectDatas = $scope.$watch("selectDatas", function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.allSelectedFlag = $scope.selectDatas.every(function(item) {
                        return item.selectedFlag;
                    });
                }
            }, true);
            $element.bind("$destroy", function () {
                if(deregAllSelectDatas) {deregAllSelectDatas();}
            });

            //打开输入法
            $scope.openMe = function(targetElement) {
                if (_closeFlag) {
                    $scope.selectDatas = [];
                    $scope.templates.cellTemplate = $scope.hrMultipleSelect.cellTemplate !== undefined ?
                        $scope.hrMultipleSelect.cellTemplate : '<span>{{item.displayValue}}</span>';
                    var tempData = $scope.$parent[$scope.hrMultipleSelect.data];
                    if (tempData !== undefined && angular.isArray(tempData)) {
                        tempData.forEach(function(item) {
                            $scope.selectDatas.push({selectedFlag: HrArray.exist(item, $scope.hrMultipleSelect.selectedItems),
                                matchingFlag: false, displayValue: item[$scope.hrMultipleSelect.displayField], entity: item});
                        });
                    }
                    _closeFlag = false;
                    _template = angular.element(
                        angular.copy($templateCache.get('hr-multiple-select.html'))
                    );
                    $compile(_template)($scope);

                    var resultTop = 0;
                    var resultLeft = 0;
                    var targetPosition = hrPosition.offset(targetElement);
                    var bodyPosition = hrPosition.offset($document.find('body'));
                    //if ((bodyPosition.height - (targetPosition.top + targetPosition.height)) < 500) {
                    //    resultTop = targetPosition.top - 500;
                    //} else {
                    resultTop = targetPosition.top + targetPosition.height;
                    //}

                    console.log($(_template).width());
                    if ((bodyPosition.width - targetPosition.left) < 550) {
                        resultLeft = bodyPosition.width - 550;
                    } else {
                        resultLeft = targetPosition.left;
                    }

                    $(_template).css({top: resultTop + "px", left: resultLeft + "px"});
                    $document.find('body').append(_template);
                }
            };

            //关闭输入法
            $scope.closeMe = function(closeHandler) {
                if (!_closeFlag) {
                    $scope.hrMultipleSelect.selectedItems.length = 0;
                    _closeFlag = true;
                    $scope.closeHandler = closeHandler;
                    var resultValue = "";
                    $scope.selectDatas.forEach(function(item) {
                        if (item.selectedFlag) {
                            $scope.hrMultipleSelect.selectedItems.push(item.entity);
                            if ($scope.hrMultipleSelect.showResult === undefined || $scope.hrMultipleSelect.showResult) {
                                if (!angular.equals(resultValue, "")) {
                                    resultValue += ",";
                                }
                                resultValue += item.entity[$scope.hrMultipleSelect.displayField];
                            }
                        }
                    });

                    if ($scope.hrMultipleSelect.showResult === undefined || $scope.hrMultipleSelect.showResult) {
                        //$scope.ngModel.$setViewValue(resultValue);
                        $scope.setter($scope.$parent, resultValue);
                    }
                    if ($scope.hrMultipleSelect.callBack) {
                        $scope.hrMultipleSelect.callBack();
                    }
                    _template.remove();
                }
            };

            $scope.$watch("hrMultipleSelect.selectedItems", function(newValue, oldValue) {
                if (angular.isArray(newValue) && angular.isArray(oldValue)) {
                    $scope.selectDatas.forEach(function(item) {
                        item.selectedFlag = HrArray.exist(item.entity, newValue);
                    });
                }
            }, true);

            //全选或者反选所有项目
            $scope.clickAllSelectedFlag = function() {
                var flag = false;
                if ($scope.allSelectedFlag) {
                    flag = true;
                }
                $scope.selectDatas.forEach(function(item) {
                    item.selectedFlag = flag;
                });
            };
        }],
        link: function(scope, element, attrs, controller) {
            var deregInputParam = scope.$watch("$parent." + attrs["ngModel"], function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $debounce(scope.matchSelectData, 100);
                }
            }, true);
            element.bind("$destroy", function () {
                if(deregInputParam) {deregInputParam();}
            });

            var openInputMethod = function() {
                scope.getter = $parse(attrs["ngModel"]);
                scope.setter = scope.getter.assign;
                scope.ngModel = controller;
                scope.openMe(element);
            };
            $(element).bind('click focus', function() {
                $debounce(openInputMethod, 100);
            });
        }
    };
}]);

angular.module('hr.service').directive("hrMultipleCell", ["$compile", function($compile) {
    return {
        restrict: 'E',
        scope: false,
        compile: function () {
            return {
                pre: function ($scope, iElement) {
                    iElement.append($compile($scope.templates.cellTemplate)($scope));
                }
            };
        }
    };
}]);