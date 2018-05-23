angular.module("hr.directives").directive('typeWriting', function ($debounce) {
        return {
            restrict: 'EA',
            require: '^ngModel',
            link: function (scope, ele, attrs, ctrl) {
                var options = JSON.parse(attrs.typeWriting);
                var dom = $(ele);
                var id = options.id;
                ctrl.$viewChangeListeners.push(function () {
                    $debounce(function () {
                        if (id) {
                            var reg = new RegExp("[6][9]\d*");
                            //药品入出库需要输入法的同时支持69开头的数字监管码查询，具体内容在药品业务逻辑里处理
                            if ((angular.element($("#drug-import-detail-index")).scope() && !angular.element($("#drug-import-detail-index")).scope().assistInput) ||
                                (angular.element($("#drug-export-detail-index")).scope() && !angular.element($("#drug-export-detail-index")).scope().assistInput) ||
                                reg.test(ctrl.$modelValue)) {
                            } else if (ctrl.$modelValue) {
                                angular.element($("#" + id)).scope().searchByInputCode(ctrl.$modelValue, options, dom, id);
                                angular.element($("#" + id)).scope().options = options;
                            }
                        } else {
                            angular.element($("#drugSelect")).scope().searchByInputCode(ctrl.$modelValue, options, dom);
                            angular.element($("#drugSelect")).scope().options = options;
                        }
                    }, 300)
                });
                ele.bind('keydown', function (event) {

                        if (event.keyCode == 40) {
                            event.preventDefault();
                            event.stopPropagation();
                            dom.blur();
                            $("#leftSearch").focus();
                            if (id) {
                                var ctrlScope = angular.element($("#" + id)).scope();
                            } else {
                                var ctrlScope = angular.element($("#drugSelect")).scope();
                            }

                            if (ctrlScope.leftRowList.length > 0) {
                                if (angular.equals(ctrlScope.activateLeftRow, {})) {
                                    ctrlScope.$apply(function () {
                                            ctrlScope.activateLeftRowFunc(ctrlScope.leftRowList[0]);
                                            $("#leftSearch").scrollTop(0)
                                        }
                                    );

                                } else {
//                                            if (!angular.equals(ctrlScope.activateLeftRow, {})) {
//                                                ctrlScope.activateLeftRow = hrScrollBar.setScrollTop(ctrlScope.activateLeftRow, ctrlScope.drugNameDictList, $("#leftSearch"), hrScrollBar.eventType.DOWN);
//                                            }
                                }

                            }
                        } else if (event.keyCode == 38) {
                            event.preventDefault();
                            event.stopPropagation();
                            dom.blur();
                            $("#leftSearch").focus();
                            if (id) {
                                var ctrlScope = angular.element($("#" + id)).scope();
                            } else {
                                var ctrlScope = angular.element($("#drugSelect")).scope();
                            }
                            if (ctrlScope.leftRowList.length > 0) {
                                if (angular.equals(ctrlScope.activateLeftRow, {})) {
                                    ctrlScope.$apply(function () {
                                            ctrlScope.activateLeftRowFunc(ctrlScope.leftRowList[ctrlScope.leftRowList.length - 1]);
                                            $("#leftSearch").scrollTop(document.getElementById("leftSearch").scrollHeight - document.getElementById("leftSearch").offsetHeight + 5);
                                        }
                                    );

                                }

                            }
                        }

                    }
                );
            }
        }
    }
);
angular.module("hr.directives").controller('typeWritingCtrl', ['$scope', '$http', function ($scope, $http) {

    var baseUri = Path.getUri("api/");
    var windowWidth = window.outerWidth;
    //根据拼音码搜索得到的药品信息
    $scope.leftRowList = [];

    $scope.rightRowList = [];
    //是否显示搜索的列表
    $scope.leftShow = false;
    $scope.rightShow = false;

    $scope.activateLeftRow = {};
    $scope.activateRightRow = {};

    var ctrlScope = {};
    var searchType = "";

    $scope.ctrlId = "";

    $scope.changeDrugSearchType = function () {
        var fuzzyMatch = $scope.fuzzyMatch;
        if (fuzzyMatch === undefined) {
            var scope = angular.element($("#drugSelect")).scope();
            if (scope) {
                fuzzyMatch = scope.fuzzyMatch;
            }
        }
        if (fuzzyMatch) {
            searchType = "&searchType=M";
        } else {
            searchType = "&searchType=J";
        }
    };


    //根据拼音码查询左边table
    $scope.searchByInputCode = function (inputCode, options, dom, id) {
        $scope.ctrlId = id;
        if (id) {
            ctrlScope = angular.element($("#" + id)).scope();
        } else {
            ctrlScope = angular.element($("#drugSelect")).scope();
        }
        $scope.options = options;
        var uri = baseUri + options.queryUrl + inputCode + searchType;
        $http.get(uri).success(function (data, status) {
            $scope.leftRowList = data;
            if ($scope.leftRowList.length > 0) {
                ctrlScope.leftShow = true;
            } else {
                var leftReceiveName = $scope.options.leftReceiveName;
                ctrlScope.leftShow = false;
                $scope.$emit(leftReceiveName, {});
            }
        }).error(function (data, status) {

        });
        console.info(dom.offset().left);
        $scope.setPosition(dom);
    };


    $scope.searchRightRow = function (parameter) {
        var uri = baseUri + $scope.options.rightQueryUrl;
        $http.get(uri + parameter).success(function (data, status) {
            $scope.rightRowList = data;
            if ($scope.rightRowList.length > 0) {
                ctrlScope.rightShow = true;
            } else {
                ctrlScope.rightShow = false;
            }
        }).error(function (data, status) {
            $scope.rightRowList = [];
            ctrlScope.rightShow = false;
        });
    };


    $scope.activateLeftRowFunc = function (leftRow) {
        $scope.activateLeftRow = leftRow;
        $scope.activateRightRow = {};
    };

    $scope.$watch('activateLeftRow', function (newValue, oldValue) {
        if (!angular.equals($scope.activateLeftRow, {}) && $scope.options.isDisplayRight) {
            var rightParameter = $scope.options.rightParameter;

            $scope.searchRightRow(eval("$scope.activateLeftRow." + rightParameter));
            var activeIndex = $scope.leftRowList.indexOf($scope.activateLeftRow);
            setTrianglePosition(activeIndex);
            ctrlScope.rightShow = true;

        } else if (!angular.equals(oldValue, {})) {
//            Mousetrap.reset();
            ctrlScope.rightShow = false;
        }
    }, true);

    function setTrianglePosition(index) {
        if($scope.ctrlId){
            var drugNameDomList = $("#"+$scope.ctrlId).find("tr");
            var divDom = $("#"+$scope.ctrlId).children($(".hc-ime-left"));
        }else{
            var drugNameDomList = $("#basicDrugInfo").find("tr");
            var divDom = $(".hc-ime-left");
        }
        var activeDom = $(drugNameDomList[index]);

        $(".triangle-field").css("top", activeDom.offset().top - divDom.offset().top);
    }

    $scope.close = function () {
        ctrlScope.leftShow = false;
        ctrlScope.rightShow = false;
//        Mousetrap.reset();
        $scope.clearSearchInfo();
    };

    $scope.clearSearchInfo = function () {
        $scope.leftRowList = {};
        $scope.rightRowList = [];
        $scope.activateLeftRow = {};
        $scope.activateRightRow = {};
    };

    $scope.setPosition = function (dom) {
        var domWidth = dom.width();
        var htmlWidth = 0;//输入法html的宽度
        if (!angular.isUndefined($scope.options.leftWidth)) {
            htmlWidth = $scope.options.leftWidth;
        } else {
            htmlWidth = domWidth + 6;
        }

        var domLeft = dom.offset().left;
        if (domLeft + domWidth > windowWidth - 100) {
            var htmlLeft = domLeft - (htmlWidth - domWidth);
            $(".hc-ime").css("left", htmlLeft + "px");
        } else {
            $(".hc-ime").css("left", domLeft + "px");
        }

        $(".hc-ime").css("top", dom.offset().top + dom.height() + 6 + "px");

        $(".hc-ime-left").css("width", htmlWidth + "px");
    };

    $scope.activateRightRowFunc = function (rightRow) {
        $scope.activateRightRow = rightRow;
    };


    //选准相应的药品信息
    $scope.selectedValue = function () {
        if ($scope.options) {
            var leftReceiveName = $scope.options.leftReceiveName;
            var rightReceiveName = $scope.options.rightReceiveName;
            if ($scope.options.isDisplayRight && !angular.equals($scope.activateRightRow, {})) {
//            Mousetrap.reset();

                $scope.$emit(rightReceiveName, $scope.activateRightRow);
                $scope.$emit(leftReceiveName, $scope.activateLeftRow);
                $scope.close();
            } else if (!$scope.options.isDisplayRight && !angular.equals($scope.activateLeftRow, {})) {
//            Mousetrap.reset();
                $scope.$emit(leftReceiveName, $scope.activateLeftRow);
                $scope.close();
            }
        }

    };

    $scope.$watch('activateLeftRow', function (newValue, oldValue) {
        if (newValue) {
            $scope.bindDrugInfoSearchEvent();
        }
    }, true);


    $scope.bindDrugInfoSearchEvent = function () {
        Mousetrap.bind("down", function () {
            event.preventDefault();
            if (!angular.equals($scope.activateLeftRow, {}) && angular.equals($scope.activateRightRow, {})) {
                var dom = $(".search-content")

                if($scope.ctrlId){
                    dom = $("#"+$scope.ctrlId).find($(".search-content"));
                }

                $scope.activateLeftRow = hrScrollBar.setScrollTop($scope.activateLeftRow, $scope.leftRowList, dom, hrScrollBar.eventType.DOWN);
            } else if (!angular.equals($scope.activateLeftRow, {}) && !angular.equals($scope.activateRightRow, {})) {
                $scope.activateRightRow = hrScrollBar.setScrollTop($scope.activateRightRow, $scope.rightRowList, $("#rightSearch"), hrScrollBar.eventType.DOWN);
            }
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });
        Mousetrap.bind("up", function () {
            event.preventDefault();
            if (!angular.equals($scope.activateLeftRow, {}) && angular.equals($scope.activateRightRow, {})) {
                var dom = $(".search-content")
                if($scope.ctrlId){
                    dom = $("#"+$scope.ctrlId).find($(".search-content"));
                }
                $scope.activateLeftRow = hrScrollBar.setScrollTop($scope.activateLeftRow, $scope.leftRowList, dom, hrScrollBar.eventType.UP);
            } else if (!angular.equals($scope.activateLeftRow, {}) && !angular.equals($scope.activateRightRow, {})) {
                $scope.activateRightRow = hrScrollBar.setScrollTop($scope.activateRightRow, $scope.rightRowList, $("#rightSearch"), hrScrollBar.eventType.UP);
            }
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });
        Mousetrap.bind("right", function () {
            event.preventDefault();
            if (!angular.equals($scope.activateLeftRow, {}) && angular.equals($scope.activateRightRow, {}) && $scope.rightRowList.length > 0) {
                $scope.activateRightRow = $scope.rightRowList[0];
            }
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });
        Mousetrap.bind("left", function () {
            event.preventDefault();
            if (!angular.equals($scope.activateLeftRow, {}) && !angular.equals($scope.activateRightRow, {})) {
                $scope.activateRightRow = {};
            }
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });
        Mousetrap.bind("enter", function () {
            event.preventDefault();

            $scope.selectedValue();

            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });
    };


}])