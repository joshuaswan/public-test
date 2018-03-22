/**
 * 此module是自定义指令的html代码模版缓存
 */
angular.module('hr.templateCache').run(['$templateCache', function ($templateCache) {
    $templateCache.put('diagnosis-dict-search.html', "<div class=\"diagnosis-dict\"  click-outside=\"closeDiagnosisDictSearch()\" inside-id=\"\" ng-show=\"diagnosisDictSearchShow\">\n    <div class=\"diagnosis-dict-search diagnosis-style-area\">\n        <ul class=\"li-striped\">\n            <li ng-repeat=\"diagnosisDict in diagnosisDictVO.diagnosisDictList\"\n                ng-click=\"activateDiagnosisDict(diagnosisDict)\"\n                ng-dblclick=\"selectDiagnosisDict(diagnosisDict)\"\n                ng-class=\"{\'bg-selected-color\': diagnosisDict == activeDiagnosisDict}\" title=\"{{diagnosisDict.id.diagnosisName}}\">\n                {{diagnosisDict.id.diagnosisName}}\n            </li>\n        </ul>\n    </div>\n    <small class=\"more-items clinical-footer-info\">\n        还剩{{diagnosisDictVO.count - diagnosisDictVO.diagnosisDictList.length}}条\n        <label class=\"checkbox\" for=\"diagnosisFuzzySearch\"><input type=\"checkbox\"  id=\"diagnosisFuzzySearch\" ng-model=\"diagnosisFuzzyMatch\" ng-change=\"changeDiagnosisSearchType()\"/>模糊匹配</label>\n    </small>\n    \n</div>");
}]);
/**
 * 通用诊断字典服务
 */
angular.module('hr.directives').directive("diagnosisDict", ["$parse", '$document', '$templateCache', '$compile', 'hr.config', 'hrIndexedDB', function ($parse, $document, $templateCache, $compile, hrConfig, hrIndexedDB) {
    var diagnosisDict = {
        require: 'ngModel',
        restrict: "A",
        scope: {
            diagnosisDict: "=",
            ngModel: "="
        },
        controller: ["$scope", "$http", "hrPosition", "hrIndexedDB", "$document", function ($scope, $http, hrPosition, hrIndexedDB, $document) {
            $scope.diagnosisDictSearchShow = false;
            $scope.activeDiagnosisDict = {};
            //保存绑定的键盘事件
            $scope.keyMap = [];
            $scope.displayPosition = "down";
            //使用诊断指令的Input输入框
            $scope.outElement = undefined;
            //input输入框上绑定的变量名
            $scope.outModel = undefined;
            $scope.repeatIndex = undefined;
            $scope.diagnosisDictVO = {
                count: 0,
                diagnosisDictList: []
            };
            //匹配类型  'J'精确  'M'模糊
            $scope.searchType = "J";
            //模糊匹配
            $scope.diagnosisFuzzyMatch = false;

            $scope.changeDiagnosisSearchType = function () {
                if ($scope.diagnosisFuzzyMatch) {
                    $scope.searchType = "M";
                } else {
                    $scope.searchType = "J";
                }
            };

            //关闭诊断搜索页面
            $scope.closeDiagnosisDictSearch = function () {
                $scope.displayPosition = "down";
                $scope.activeDiagnosisDict = {};
                $scope.diagnosisDictVO = {
                    count: 0,
                    diagnosisDictList: []
                };
                $scope.diagnosisDictSearchShow = false;
                $scope.unbindDiagnosisDictSearchEvent();
                $scope.scrollElement.scrollTop(0);
            };
            //单击选中一条诊断时调用的方法
            $scope.activateDiagnosisDict = function (diagnosisDict) {
                $scope.activeDiagnosisDict = diagnosisDict;
            };
            //从本地IndexDB查询
            $scope.searchDiagnosisDictFromIndexDB = function (inputCode, element) {
                hrIndexedDB("DIAGNOSIS_DICT").getStoreDataByLike("inputCode", inputCode.toUpperCase(), null, function (data) {
                    $scope.activeDiagnosisDict = {};
                    $scope.diagnosisDictVO.count = data.length;
                    $scope.diagnosisDictVO.diagnosisDictList = data.slice(0, 20);
                    if ($scope.diagnosisDictVO.diagnosisDictList.length > 0) {
                        $scope.diagnosisDictSearchShow = true;
                        $scope.setPosition(element);
                    } else {
                        $scope.closeDiagnosisDictSearch();
                    }
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            };

            //从后台数据库查询
            $scope.searchDiagnosisDictFromServer = function (inputCode, element) {
                var url = Path.getUri("api/diagnosis-dict/input-code/" + inputCode + "/" + $scope.searchType);
                $http.get(url).success(function (data) {
                    $scope.activeDiagnosisDict = {};
                    $scope.diagnosisDictVO.count = data.count;
                    $scope.diagnosisDictVO.diagnosisDictList = data.diagnosisDictList;
                    if ($scope.diagnosisDictVO.diagnosisDictList.length > 0) {
                        $scope.diagnosisDictSearchShow = true;
                        $scope.setPosition(element);
                    } else {
                        $scope.closeDiagnosisDictSearch();
                    }
                });
            };
            //根据拼音码查询诊断字典
            $scope.searchDiagnosisDictByInputCode = function (inputCode, element, model) {
                if ($scope.outElement === undefined) {
                    $scope.outElement = element;
                }
                if ($scope.outModel === undefined) {
                    $scope.outModel = model;
                }
                if (inputCode !== "") {
//                    $scope.searchDiagnosisDictFromIndexDB(inputCode, element);
                    $scope.searchDiagnosisDictFromServer(inputCode, element);
                } else {
                    $scope.closeDiagnosisDictSearch();
                }
            };
            /**
             * 定位诊断搜索页面
             * @param element
             */
            $scope.setPosition = function (element) {
                var dom = $(element);
                var domPosition = hrPosition.offset(dom);
                var height = $document.height();
//                if(domPosition.top==0){
//                    $scope.positionElement.css("display", "none");
//                    return false;
//                }
                var differentDown = height - domPosition.top - domPosition.height;
                $scope.positionElement.css("left", domPosition.left + "px");
                $scope.positionElement.css("display", "none");
                var overflowY = $("body").css("overflow-y");
                var scrollHeight = $("body")[0].scrollHeight;
                if (scrollHeight === $(window).height()) {
                    $("body").css("overflow-y", "hidden");
                }
                if (!$scope.diagnosisDict.dropdownAutoWidth) {
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
             * 选择诊断时调用的方法
             */
            $scope.selectDiagnosisDict = function () {
                var option = {
                    selectedItems: [],
                    afterSelection: function (data, other) {

                    },
                    dropdownAutoWidth: true
                };
                option = angular.extend(option, $scope.diagnosisDict);
                option.selectedItems.length = 0;
                option.selectedItems.push(angular.copy($scope.activeDiagnosisDict));
                var _getter = $parse($scope.outModel);
                var _setter = _getter.assign;
                _setter($scope, $scope.activeDiagnosisDict.id.diagnosisName);
                option.afterSelection(angular.copy($scope.activeDiagnosisDict), $scope.repeatIndex);
                $scope.closeDiagnosisDictSearch();
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
            $scope.diagnosisDown = function () {
                event.preventDefault();
                if (!angular.equals($scope.activeDiagnosisDict, {})) {
                    $scope.activeDiagnosisDict = setScrollTop($scope.activeDiagnosisDict, $scope.diagnosisDictVO.diagnosisDictList, "down");
                } else if ($scope.diagnosisDictVO.diagnosisDictList.length !== 0) {
                    $scope.activeDiagnosisDict = $scope.diagnosisDictVO.diagnosisDictList[0];
                }
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            };
            $scope.diagnosisUp = function () {
                event.preventDefault();
                if (!angular.equals($scope.activeDiagnosisDict, {})) {
                    $scope.activeDiagnosisDict = setScrollTop($scope.activeDiagnosisDict, $scope.diagnosisDictVO.diagnosisDictList, "up");
                } else if ($scope.diagnosisDictVO.diagnosisDictList.length !== 0) {
                    $scope.activeDiagnosisDict = $scope.diagnosisDictVO.diagnosisDictList[$scope.diagnosisDictVO.diagnosisDictList.length - 1];
                    $scope.scrollElement.scrollTop($scope.scrollElement[0].scrollHeight - $scope.scrollElement[0].offsetHeight + 5);
                }
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            };
            $scope.diagnosisEnter = function () {
//                event.preventDefault();
                if ($scope.diagnosisDictSearchShow && !angular.equals($scope.activeDiagnosisDict, {})) {
                    $scope.selectDiagnosisDict();
                } else {
                    return;
                }
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            };
            $scope.bindDiagnosisDictSearchEvent = function () {
                $scope.keyMap = angular.copy(Mousetrap.getKeyMap());
                Mousetrap.reset();
//                Mousetrap.bindGlobal("down", $scope.diagnosisDown);
//                Mousetrap.bindGlobal("up", $scope.diagnosisUp);
//                Mousetrap.bindGlobal("enter", $scope.diagnosisEnter);
            };
            $scope.unbindDiagnosisDictSearchEvent = function () {
                if ($scope.keyMap.length !== 0) {
                    Mousetrap.reset();
                    Mousetrap.setKeyMap($scope.keyMap);
                }
            };
            //改变窗口大小后重新定位搜索页面
            $(window).resize(function () {
                if ($scope.diagnosisDictSearchShow) {
                    $scope.setPosition($scope.outElement);
                }
            });
        }],
        link: function (scope, element, attrs) {
            //将模板添加到页面的dom中
            var template = angular.element($templateCache.get('diagnosis-dict-search.html'));
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
            scope.scrollElement = template.find(".diagnosis-dict-search");
            //绑定input输入框的键盘事件，用于上下键选择诊断
            element.bind('keydown', function (e) {
                if (e.keyCode === 40) {
                    scope.diagnosisDown();
                } else if (e.keyCode === 38) {
                    scope.diagnosisUp();
                } else if (e.keyCode === 13) {
                    scope.diagnosisEnter();
                }
            });
            $parse(attrs.ngModel).assign(scope, "");
            element.bind("focus", function () {
                if ($parse(attrs.ngModel)(scope) !== undefined && $parse(attrs.ngModel)(scope) !== "") {
                    scope.searchDiagnosisDictByInputCode($parse(attrs.ngModel)(scope), element, attrs.ngModel);
                }
            });
            //监视当前scope中变量名为attrs.ngModel值的改变
            //子变 更新父
            scope.$watch(attrs.ngModel, function (newValue, oldValue) {
                if (newValue) {
                    scope.ngModel = newValue;
                    if($document[0].activeElement == element[0]){
                        scope.searchDiagnosisDictByInputCode(newValue, element, attrs.ngModel);
                    }
                }
            }, true);
            //父变 更新子
            scope.$watch('ngModel', function (newValue, oldValue) {
                $parse(attrs.ngModel).assign(scope, newValue);
            }, true);
            scope.$watch('diagnosisDictSearchShow', function (newValue, oldValue) {
               if(!newValue){
                   scope.unbindDiagnosisDictSearchEvent();
               }
            }, true);
        }
    };
    return  diagnosisDict;
}]);
