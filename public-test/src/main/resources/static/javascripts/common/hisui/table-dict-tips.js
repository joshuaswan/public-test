angular.module('hr.templateCache').run(['$templateCache', function ($templateCache) {
    $templateCache.put('register-tips-template.html', '<div class="table-dict-tips-input" id= "inside-id" click-outside="closeMe(\'outside\')" style="font-size: 14px">\n    <div class=" table-dict-item-name">\n        <div class="tip-item-name-table">\n            <table class="table table-striped table-hover" >\n                <tr ng-repeat="tableDict in displayedRecords track by tableDict.codeId"  ng-click="clickToSelect(tableDict)" \n                    ng-class="{\'bg-selected-color\': activateTableItem == tableDict}">\n                    <td ng-if="!inputParametes.isHide" class="first-td">{{::tableDict.inputCode}}</td>\n                    <td >{{::tableDict.codeName}}</td>\n                </tr>\n            </table>\n        </div>\n        <div class="page-field">\n            <a ng-click="prevPage()" ng-disabled="pageInfo.currentPageNo == 1" class="left-arrow" >\n                <i> < </i> \n            </a>\n            \n            <!--<span>{{pageInfo.currentPageNo}}/{{pageInfo.totalPageNo}}</span>-->\n            \n            <span ng-bind="pageInfo.currentPageNo"></span>\n            /\n            <span ng-bind="pageInfo.totalPageNo"></span>\n            \n            \n            <a  ng-click="nextPage()" ng-disabled="pageInfo.currentPageNo == pageInfo.totalPageNo" class="right-arrow"> \n                <i > > </i> \n            </a>\n        </div>\n    </div>\n</div>\n');
}]);
//输入法
angular.module('hr.directives').directive('tableDictTips', ['$parse', '$compile', '$templateCache', '$document', '$timeout', '$debounce', 'hrPosition', function ($parse, $compile, $templateCache, $document, $timeout, $debounce, hrPosition) {
    var tableDictTips = {
        require: 'ngModel',
        restrict: 'A',

        scope: {
            tableDictTips: "=",
            ngModel: "="
        },

        controller: ['$scope', '$http', 'hrPosition', '$element', function ($scope, $http, hrDialog, $element) {

            var _template = null;
            var _closeFlag = true;
            var _originalKeyMap = [];
            var DISPLAY_NUM_EVERY_PAGE = 6;     //每页最多显示几个记录

            $scope.displayedRecords = [];  //每页显示的记录数组
            $scope.activateTableItem = null;//当前选中的项目

            //页数
            $scope.pageInfo = {
                totalPageNo: 0,
                currentPageNo: 0
            };

            //指令接受参数
            $scope.inputParametes = {
                tableName: null,
                filter: 0,
                inputNumber: null,
                isHide: false
            };

            var cleanAllData = function () {
                $scope.displayedRecords.length = 0;
                $scope.pageInfo = {
                    totalPageNo: 0,
                    currentPageNo: 0
                };
                cacheArray = [];
                $scope.tableDicts = [];
                $scope.tableDicts.length = 0;
                $scope.displayedRecords = [];
            };
            function getPageCount(arr, num) {
                var count = (arr.length - (arr.length % num)) / num;
                if (arr.length % num !== 0) {
                    count += 1;
                }
                return count;
            }
            var getReturnedObject = function(codeName){
                var returnedObject = {
                    codeId : "",
                    codeName : ""
                };
                for(var d in $scope.tableDicts){
                    if($scope.tableDicts[d].codeName === codeName){
                        returnedObject = {
                            codeId : $scope.tableDicts[d].codeId,
                            codeName : $scope.tableDicts[d].codeName
                        };
                        break;
                    }
                }
                return returnedObject;
            };

            $scope.closeMe = function (status) {
                Mousetrap.reset();
                Mousetrap.setKeyMap(_originalKeyMap);

                if (status === "outside") {
                    $scope.activateTableItem = null;
                }
                if (!_closeFlag) {
                    var returnedObject = null;
                    if(HrStr.isNull($scope.activateTableItem) ){
                        if($scope.ngModel){
                            returnedObject = getReturnedObject($scope.ngModel);
                        }else{
                            returnedObject = {
                                codeId : "",
                                codeName : ""
                            };
                        }
                    }else{
                        returnedObject = getReturnedObject($scope.activateTableItem.codeName);
                    }
                    $scope.tableDictTips.selectedItem(returnedObject, status);
                    cleanAllData();
                    _template.remove();
                    _template = null;
                    _closeFlag = true;
                    $scope.activateTableItem = null;
                }
            };

            $scope.openMe = function (targetElement) {
                if (targetElement) {
                    if (_closeFlag) {
                        _closeFlag = false;
                        _template = angular.element(
                            angular.copy($templateCache.get('register-tips-template.html'))
                        );
//                    $scope._template.attr("inside-id", targetElement[0].id);
                        $compile(_template)($scope);
                        if ($scope.inputParametes.isHide) {
                            _template.width($element.width() + 5);
                            _template.find(".table-dict-item-name").width($element.width() + 5);
                            _template.find(".page-field").width($element.width() + 5);
                        } else {
                            _template.width(210);
                            _template.find(".table-dict-item-name").width(210);
                            _template.find(".page-field").width(210);
                        }
                        var resultTop = 0;
                        var resultLeft = 0;
                        var position = hrPosition.offset(targetElement);
                        var windowHeight = $(window).height();

                        if ((windowHeight - (position.top + position.height)) < 180) {
                            resultTop = position.top - 180;
                        } else {
                            resultTop = position.top + 30;
                        }
                        resultLeft = position.left;
                        $(_template).css({top: resultTop + "px", left: resultLeft + "px"});
                        $document.find('body').append(_template);
                        _originalKeyMap = angular.copy(Mousetrap.getKeyMap());

                        Mousetrap.reset();
                        bindKeys();
                        num = 1;
                        getItemNameDictByInputNumber();
                    } else {
                        getItemNameDictByInputNumber();
                    }
                }else{
                    getItemNameDictByInputNumber();
                }
            };

            //数据源
            var cacheArray = [];
            var getItemNameDictByInputNumber = function () {
                if ($scope.inputParametes.tableName) {
                    var requestUri = Path.getUri("api/identification-class/table-tips");
                    requestUri += QueryUriParamBuilder
                        .queryParam($scope.inputParametes.tableName, "tableName")
                        .queryParam($scope.inputParametes.filter, "filter")
                        .build();
                    $http.get(requestUri).success(function (data) {
                        cacheArray = [];
                        $scope.tableDicts = angular.copy(data);
                        if (data.length > 0) {
                            if (HrStr.isNull($scope.inputParametes.inputNumber)) {
                                cacheArray = angular.copy(data);
                                if (data.length <= DISPLAY_NUM_EVERY_PAGE) {
                                    $scope.displayedRecords = data;
                                } else {
                                    $scope.displayedRecords = data.splice(0, DISPLAY_NUM_EVERY_PAGE);
                                }
                            } else {
                                var reg = new RegExp("^" + $scope.inputParametes.inputNumber, "i");
                                angular.forEach(data, function (value) {
                                    if (reg.test(value.inputCode) || reg.test(value.codeName)) {
                                        cacheArray.push(value);
                                    }
                                });
                                $scope.displayedRecords = cacheArray.splice(0, DISPLAY_NUM_EVERY_PAGE);
                                $scope.activateTableItem = $scope.displayedRecords[0];
                            }
                            $scope.pageInfo.totalPageNo = getPageCount(cacheArray, DISPLAY_NUM_EVERY_PAGE);
                            if ( $scope.pageInfo.totalPageNo === 0 ) {
                                $scope.pageInfo.currentPageNo = 0;
                            } else {
                                $scope.pageInfo.currentPageNo = 1;
                            }
                        }
                    });
                }
            };

            //点击页数，显示该页的记录
            var clickCurrentPageNum = function (value) {
                $scope.pageInfo.currentPageNo = value;
                $scope.displayedRecords = displayedNumber(cacheArray, (value - 1), value, DISPLAY_NUM_EVERY_PAGE);
                $scope.activateTableItem = $scope.displayedRecords[0];
            };

            //下一页记录
            var num = 1;
            $scope.nextPage = function () {
                if (num < $scope.pageInfo.totalPageNo) {
                    num++;
                    clickCurrentPageNum(num);
                }
            };

            //上一页记录
            $scope.prevPage = function () {
                if (num > 1) {
                    num--;
                    clickCurrentPageNum(num);
                }
            };

            //选中
            $scope.clickToSelect = function (item) {
                $scope.activateTableItem = item;
                $scope.closeMe();
                return false;
            };

            var bindKeys = function () {
                Mousetrap.reset();
                Mousetrap.bindGlobal("esc", function () {
                    _template.remove();
                    _closeFlag = true;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                    return false;
                });

                Mousetrap.bindGlobal("enter", function () {
                    $scope.closeMe();
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                    return false;
                });

                Mousetrap.bindGlobal("up", function () {
                    var index;
                    index = $scope.displayedRecords.indexOf($scope.activateTableItem);
                    if (index > 0) {
                        $scope.activateTableItem = $scope.displayedRecords[index - 1];
                    }
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                    return false;
                });

                Mousetrap.bindGlobal("down", function () {
                    var index;
                    index = $scope.displayedRecords.indexOf($scope.activateTableItem);
                    if (index < $scope.displayedRecords.length - 1) {
                        $scope.activateTableItem = $scope.displayedRecords[index + 1];
                    }
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                    return false;
                });

                Mousetrap.bindGlobal("pagedown", function () {
                    $scope.nextPage();
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                    return false;
                });

                Mousetrap.bindGlobal("pageup", function () {
                    $scope.prevPage();
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                    return false;
                });

                Mousetrap.bindGlobal("up", function () {
                    var index;
                    //当前选中高亮在价表别名列表
                    index = $scope.displayedRecords.indexOf($scope.activateTableItem);
                    if (index > 0) {
                        $scope.activateTableItem = $scope.displayedRecords[index - 1];
                    }
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                    return false;
                });

                Mousetrap.bindGlobal("down", function () {
                    var index;
                    index = $scope.displayedRecords.indexOf($scope.activateTableItem);
                    if (index < $scope.displayedRecords.length - 1) {
                        $scope.activateTableItem = $scope.displayedRecords[index + 1];
                    }
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                    return false;
                });

                Mousetrap.bindGlobal("pagedown", function () {
                    $scope.nextPage();
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                    return false;
                });

                Mousetrap.bindGlobal("pageup", function () {
                    $scope.prevPage();
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                    return false;
                });
            };
        }],

        link: function (scope, element, attrs) {
            element.bind('focus', function (event) {
                $debounce(function () {
                    scope.inputParametes = {
                        tableName: attrs.tablename,
                        filter: attrs.filter,
                        inputNumber: null,
                        isHide: false
                    };
                    if (attrs.ishide === "true") {
                        scope.inputParametes.isHide = true;
                    } else {
                        scope.inputParametes.isHide = false;
                    }

                    $(event.target).select();
                    scope.openMe($(event.target));
                }, 100);
            });

            //子变 更新父
            scope.$watch(attrs.ngModel, function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    scope.ngModel = newValue;
                    scope.inputParametes.tableName = attrs.tablename;
                    scope.inputParametes.filter = attrs.filter;
                    scope.inputParametes.inputNumber = newValue;
                    scope.openMe();
                }
            }, true);

            //父变 更新子
            scope.$watch('ngModel', function (newValue, oldValue) {
                $parse(attrs.ngModel).assign(scope, newValue);
            }, true);
        }
    };
    return tableDictTips;
}]);