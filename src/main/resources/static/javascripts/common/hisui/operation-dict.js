/**
 * 此module是自定义指令的html代码模版缓存
 */
angular.module('hr.templateCache').run(['$templateCache', function ($templateCache) {
    $templateCache.put('operation-dict-search.html', "<div class=\"operation-dict\"  click-outside=\"closeOperationDictSearch()\" inside-id=\"\" ng-show=\"operationDictSearchShow\">\n    <div class=\"operation-dict-search\">\n        <ul class=\"li-striped\">\n            <li ng-repeat=\"operationDict in operationDictVO.operationDictList\"\n                ng-click=\"activateOperationDict(operationDict)\"\n                ng-dblclick=\"selectOperationDict(operationDict)\"\n                ng-class=\"{\'bg-selected-color\': operationDict === activeOperationsDict}\" title=\"{{operationDict.id.operationName}}\">\n                {{operationDict.id.operationName}}\n            </li>\n        </ul>\n    </div>\n    <small class=\"more-items\">还剩{{operationDictVO.count - operationDictVO.operationDictList.length}}条</small>\n</div>");
}]);
/**
 * 通用手术字典服务
 */
angular.module('hr.directives').directive("operationDict", ["$parse", '$document', '$templateCache', '$compile', 'hr.config', 'hrIndexedDB', function ($parse, $document, $templateCache, $compile, hrIndexedDB) {
    var operationDict = {
        require: 'ngModel',
        restrict: "A",
        scope: {
            operationDict: "=",
            ngModel: "="
        },
        controller: ["$scope", "$http", "hrPosition", "hrIndexedDB", "$document", function ($scope, $http, hrPosition, hrIndexedDB, $document) {
            $scope.operationDictSearchShow = false;
            $scope.activeOperationsDict = {};
            //保存绑定的键盘事件
            $scope.keyMap = [];
            $scope.displayPosition = "down";
            //使用手术指令的Input输入框
            $scope.outElement = undefined;
            //input输入框上绑定的变量名
            $scope.outModel = undefined;
            $scope.repeatIndex = undefined;
            $scope.operationDictVO = {
                count: 0,
                operationDictList: []
            };
            //关闭手术搜索页面
            $scope.closeOperationDictSearch = function () {
                $scope.displayPosition = "down";
                $scope.activeOperationsDict = {};
                $scope.operationDictVO = {
                    count: 0,
                    operationDictList: []
                };
                $scope.operationDictSearchShow = false;
                $scope.unbindOperationDictSearchEvent();
                $scope.scrollElement.scrollTop(0);
            };
            //单击选中一条手术时调用的方法
            $scope.activateOperationDict = function (operationDict) {
                $scope.activeOperationsDict = operationDict;
                console.info("-------------$scope.activeOperationsDict-----------");
                console.info($scope.activeOperationsDict);
            };
            //从本地IndexDB查询
            $scope.searchOperationDictFromIndexDB = function (inputCode, element) {
                hrIndexedDB("OPERATION_DICT").getStoreDataByLike("inputCode", inputCode.toUpperCase(), null, function (data) {
                    $scope.activeOperationsDict = {};
                    $scope.operationDictVO.count = data.length;
                    $scope.operationDictVO.operationDictList = data.slice(0, 20);
                    if ($scope.operationDictVO.operationDictList.length > 0) {
                        $scope.operationDictSearchShow = true;
                        $scope.setPosition(element);
                    } else {
                        $scope.closeOperationDictSearch();
                    }
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            };

            //从后台数据库查询
            $scope.searchOperationDictFromServer = function (inputCode, element) {
                var url = Path.getUri("api/operation-dict/input-code/" + inputCode);
                $http.get(url).success(function (data) {
                    $scope.activeOperationsDict = {};
                    $scope.operationDictVO.count = data.count;
                    $scope.operationDictVO.operationDictList = data.operationDictList;
                    if ($scope.operationDictVO.operationDictList.length > 0) {
                        $scope.operationDictSearchShow = true;
                        $scope.setPosition(element);
                    } else {
                        $scope.closeOperationDictSearch();
                    }
                });
            };
            //根据拼音码查询手术字典
            $scope.searchOperationDictByInputCode = function (inputCode, element, model) {
                if ($scope.outElement === undefined) {
                    $scope.outElement = element;
                }
                if ($scope.outModel === undefined) {
                    $scope.outModel = model;
                }
                if (inputCode !== "") {
                    $scope.searchOperationDictFromServer(inputCode, element);
                } else {
                    $scope.closeOperationDictSearch();
                }
            };
            /**
             * 定位手术搜索页面
             * @param element
             */
            $scope.setPosition = function (element) {
                var dom = $(element);
                var domPosition = hrPosition.offset(dom);
                var height = $document.height();
                var differentDown = height - domPosition.top - domPosition.height;
                $scope.positionElement.css("left", domPosition.left + "px");
                $scope.positionElement.css("display", "none");
                var overflowY = $("body").css("overflow-y");
                var scrollHeight = $("body")[0].scrollHeight;
                if (scrollHeight === $(window).height()) {
                    $("body").css("overflow-y", "hidden");
                }
                if (!$scope.operationDict.dropdownAutoWidth) {
                    $scope.positionElement.css("width", domPosition.width - 2 + "px");
                }
                setTimeout(function () {
                    if (differentDown < $scope.positionElement.height() || $scope.displayPosition == "up") {
                        $scope.displayPosition = "up";
                        $scope.positionElement.css("top", domPosition.top - $scope.positionElement.height() - 2 + "px");
                    } else if (domPosition.top < $scope.positionElement.height() || $scope.displayPosition === "down") {
                        $scope.displayPosition = "down";
                        $scope.positionElement.css("top", domPosition.top + domPosition.height + "px");
                    }
                    $("body").css("overflow-y", overflowY);
                    $scope.positionElement.css("display", "block");
                    $scope.positionElement.find("li").css("width", domPosition.width - 18 + "px");
                }, 100);
            };
            /**
             * 选择手术时调用的方法
             */
            $scope.selectOperationDict = function () {
                var option = {
                    selectedItems: [],
                    afterSelection: function (data, other) {

                    },
                    dropdownAutoWidth: true
                };
                option = angular.extend(option, $scope.operationDict);
                option.selectedItems.length = 0;
                option.selectedItems.push(angular.copy($scope.activeOperationsDict));
                var _getter = $parse($scope.outModel);
                var _setter = _getter.assign;
                _setter($scope, $scope.activeOperationsDict.id.operationName);
                option.afterSelection(angular.copy($scope.activeOperationsDict), $scope.repeatIndex);
                $scope.closeOperationDictSearch();
            };
            /**
             *设置滚动条位置
             * @param activeObject 当前选中的对象
             * @param currentList 当前列表
             * @param event 事件，up或down
             * @param scrollElement 目标div
             * @returns {*}
             */
            var setScrollTop = function (activeObject, currentList, event) {
                var currentIndex = currentList.indexOf(activeObject);
                var top0 = $scope.scrollElement.offset().top;
                var currentDom = $scope.scrollElement.find(".bg-selected-color");
                var totalHeight = $scope.scrollElement.height();
                var currentTop = currentDom.offset().top;
                var currentHeight = currentDom.height();
                var nextDom, nextHeight, nextIndex, nextTop;
                if (event === "down") {
                    nextDom = currentDom.next();
                    nextHeight = nextDom.height();
                    nextIndex = currentIndex === currentList.length - 1 ? 0 : currentIndex + 1;
                    nextTop = currentTop + currentHeight;
                } else if (event === "up") {
                    nextDom = currentDom.prev();
                    nextHeight = nextDom.height();
                    nextIndex = currentIndex === 0 ? currentList.length - 1 : currentIndex - 1;
                    nextTop = currentTop - nextHeight;
                }
                if (event === "down" && currentIndex === currentList.length - 1) {
                    $scope.scrollElement.scrollTop(0);
                } else if (event === "up" && currentIndex === 0) {
                    $scope.scrollElement.scrollTop($scope.scrollElement[0].scrollHeight - $scope.scrollElement[0].offsetHeight + 5);
                } else {
                    var difference = nextTop - top0;
                    if (difference < 0) {
                        $scope.scrollElement.scrollTop($scope.scrollElement.scrollTop() + difference);
                    } else if (difference > totalHeight - nextHeight) {
                        $scope.scrollElement.scrollTop($scope.scrollElement.scrollTop() + difference - totalHeight + nextHeight);
                    }
                }
                return currentList[nextIndex];

            };
            $scope.operationDown = function () {
                event.preventDefault();
                if (!angular.equals($scope.activeOperationsDict, {})) {
                    $scope.activeOperationsDict = setScrollTop($scope.activeOperationsDict, $scope.operationDictVO.operationDictList, "down");
                } else if ($scope.operationDictVO.operationDictList.length !== 0) {
                    $scope.activeOperationsDict = $scope.operationDictVO.operationDictList[0];
                }
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            };
            $scope.operationUp = function () {
                event.preventDefault();
                if (!angular.equals($scope.activeOperationsDict, {})) {
                    $scope.activeOperationsDict = setScrollTop($scope.activeOperationsDict, $scope.operationDictVO.operationDictList, "up");
                } else if ($scope.operationDictVO.operationDictList.length !== 0) {
                    $scope.activeOperationsDict = $scope.operationDictVO.operationDictList[$scope.operationDictVO.operationDictList.length - 1];
                    $scope.scrollElement.scrollTop($scope.scrollElement[0].scrollHeight - $scope.scrollElement[0].offsetHeight + 5);
                }
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            };
            $scope.operationEnter = function () {
                if ($scope.operationDictSearchShow && !angular.equals($scope.activeOperationsDict, {})) {
                    $scope.selectOperationDict();
                } else {
                    return;
                }
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            };
            $scope.bindOperationDictSearchEvent = function () {
                $scope.keyMap = angular.copy(Mousetrap.getKeyMap());
                Mousetrap.reset();
            };
            $scope.unbindOperationDictSearchEvent = function () {
                if ($scope.keyMap.length !== 0) {
                    Mousetrap.reset();
                    Mousetrap.setKeyMap($scope.keyMap);
                }
            };
            //改变窗口大小后重新定位搜索页面
            $(window).resize(function () {
                if ($scope.operationDictSearchShow) {
                    $scope.setPosition($scope.outElement);
                }
            });
        }],
        link: function (scope, element, attrs) {
            //将模板添加到页面的dom中
            var template = angular.element($templateCache.get('operation-dict-search.html'));
            $document.find('body').append(template);
            var insideId = element[0].id;
            if (element.attr("index")) {
                scope.repeatIndex = scope.$parent.$index;
                insideId = element[0].id.substring(0, element[0].id.indexOf(element.attr("index"))) + scope.$parent.$index;
                element.attr("id", insideId);
            }
            template.attr("inside-id", insideId);
            //给添加的dom绑定scope
            $compile(template)(scope);
            scope.positionElement = template;
            scope.scrollElement = template.find(".operation-dict-search");
            //绑定input输入框的键盘事件，用于上下键选择手术
            element.bind('keydown', function (e) {
                if (e.keyCode === 40) {
                    scope.operationDown();
                } else if (e.keyCode === 38) {
                    scope.operationUp();
                } else if (e.keyCode === 13) {
                    scope.operationEnter();
                }
            });
            $parse(attrs.ngModel).assign(scope, "");
            element.bind("focus", function () {
                if ($parse(attrs.ngModel)(scope) !== undefined && $parse(attrs.ngModel)(scope) !== "") {
                    scope.searchOperationDictByInputCode($parse(attrs.ngModel)(scope), element, attrs.ngModel);
                }
            });
            //监视当前scope中变量名为attrs.ngModel值的改变
            //子变 更新父
            scope.$watch(attrs.ngModel, function (newValue) {
                if (newValue) {
                    scope.ngModel = newValue;
                    scope.searchOperationDictByInputCode(newValue, element, attrs.ngModel);
                }
            }, true);
            //父变 更新子
            scope.$watch('ngModel', function (newValue) {
                $parse(attrs.ngModel).assign(scope, newValue);
            }, true);
            scope.$watch('operationDictSearchShow', function (newValue) {
                if(!newValue){
                    scope.unbindOperationDictSearchEvent();
                }
            }, true);
        }
    };
    return  operationDict;
}]);
