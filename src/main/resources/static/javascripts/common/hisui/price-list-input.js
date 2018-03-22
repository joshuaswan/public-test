angular.module('hr.templateCache').run(['$templateCache',
    function ($templateCache) {
        $templateCache.put('price-list-for-bill-template.html', '<div class="price-list-pattern-input hc-float-above border-radius" click-outside="closeMe(\'click_outside\')">\n    <div ng-if="inputParam.type == inputParamTypeEnum.PRICE_LIST">\n        <div class="master">\n            <div class="master-title title-color text-center">项目名称</div>\n            <div class="master-item">\n                <table class="table table-striped">\n                    <tbody>\n                    <tr ng-repeat="priceItemNameDict in priceItemNameDicts"\n                        ng-class="{\'bg-selected-color\': activatePriceItemNameDict == priceItemNameDict}">\n                        <td title="{{priceItemNameDict.itemName}}" ng-click="selectPriceItemNameDict(priceItemNameDict)">\n                            {{priceItemNameDict.itemName}}\n                        </td>\n                    </tr>\n                    </tbody>\n                </table>\n            </div>\n            <div class="master-page title-color text-center">\n                <span ng-click="priceItemNameForwardPage()"\n                      ng-disabled="priceItemNamePagingOpt.currentPage == 1">上一页</span>\n                <span>{{priceItemNamePagingOpt.currentPage}}/{{priceItemNamePagingOpt.totalPage}}</span>\n                <span ng-click="priceItemNameNextPage()"\n                      ng-disabled="priceItemNamePagingOpt.currentPage == priceItemNamePagingOpt.totalPage">下一页</span>\n            </div>\n        </div>\n        <div class="center">\n            <div class="triangle-left"></div>\n        </div>\n        <div class="detail">\n            <table class="table" hr-set-table-width="[\'220px\',\'75px\',\'75px\',\'160px\']">\n                <thead>\n                <tr>\n                    <!--<th></th>-->\n                    <th>规格</th>\n                    <th>单位</th>\n                    <th>价格</th>\n                    <th>执行科室</th>\n                </tr>\n                </thead>\n            </table>\n            <div class="detail-item">\n                <table class="table table-striped" hr-set-table-width="[\'220px\',\'75px\',\'75px\',\'160px\']">\n                    <tbody>\n                    <tr ng-repeat="priceList in priceLists"\n                        ng-class="{\'bg-selected-color\': activatePriceList == priceList}"\n                        ng-dblclick="selectPriceList(priceList)" ng-click="prepareSelectPriceList(priceList, $index)">\n                        <!--<td ng-class="selectedStatus($index)"></td>-->\n                        <td class="text-left" ng-bind="priceListItemSpec(priceList)"></td>\n                        <td class="text-center">{{priceList.units}}</td>\n                        <td class="text-right">{{priceList.price | number: 2}}</td>\n                        <td class="text-left">{{priceList.performedByName}}</td>\n                    </tr>\n                    </tbody>\n                </table>\n            </div>\n            <div class="detail-foot title-color">\n                <label class="radio inline">\n                    <input type="radio" name="inputParamRadio" ng-model="inputParam.type" value="priceList" ng-disabled="!options.isSwitchInputParamType">项目\n                </label>\n                <label class="radio inline">\n                    <input type="radio" name="inputParamRadio" ng-model="inputParam.type" value="pattern" ng-disabled="!options.isSwitchInputParamType">模板\n                </label>\n            </div>\n        </div>\n    </div>\n    <div ng-if="inputParam.type == inputParamTypeEnum.PATTERN">\n        <div class="master">\n            <div class="master-title title-color text-center">模板名称</div>\n            <div class="master-item-pattern">\n                <table class="table table-striped">\n                    <tbody>\n                    <tr ng-repeat="patternMaster in patternMasters"\n                        ng-class="{\'bg-selected-color\': activePatternMaster == patternMaster}"\n                        ng-click="selectPatternMaster(patternMaster)"\n                        ng-dblclick="selectPatternMasterAndClose(patternMaster)">\n                        <td>{{patternMaster.patternName}}</td>\n                    </tr>\n                    </tbody>\n                </table>\n            </div>\n            <div class="master-page title-color text-center">\n                <!--<span>上一页</span>-->\n                <!--<span>1999/9999</span>-->\n                <!--<span>下一页</span>-->\n            </div>\n        </div>\n        <div class="center">\n            <div class="triangle-left"></div>\n        </div>\n        <div class="detail">\n            <table class="table" hr-set-table-width="[\'220px\',\'160px\',\'75px\',\'75px\']">\n                <thead>\n                <!--<th></th>-->\n                <th>名称</th>\n                <th>规格</th>\n                <th>单位</th>\n                <th>数量</th>\n                </thead>\n            </table>\n            <div class="detail-item">\n                <table class="table table-striped" hr-set-table-width="[\'220px\',\'160px\',\'75px\',\'75px\']">\n                    <tbody>\n                    <tr ng-repeat="patternDetail in patternDetails"\n                        ng-class="{\'bg-selected-color\': activePatternDetail == patternDetail}"\n                        ng-click="selectPatternDetail(patternDetail)">\n                        <!--<td></td>-->\n                        <td class="text-left">{{patternDetail.itemName}}</td>\n                        <td class="text-left">{{patternDetail.itemSpec}}</td>\n                        <td class="text-center">{{patternDetail.units}}</td>\n                        <td class="text-center">{{patternDetail.amount}}</td>\n                    </tr>\n                    </tbody>\n                </table>\n            </div>\n            <div class="detail-foot title-color">\n                <label class="radio inline">\n                    <input type="radio" ng-model="inputParam.type" value="priceList" ng-disabled="!options.isSwitchInputParamType">项目\n                </label>\n                <label class="radio inline">\n                    <input type="radio" ng-model="inputParam.type" value="pattern" ng-disabled="!options.isSwitchInputParamType">模板\n                </label>\n            </div>\n        </div>\n    </div>\n</div>\n\n<style type="text/css">\n    /*------------------------------收费录入项目和模板输入法 2014-04-25 范成林 开始------------------------------*/\n    .price-list-pattern-input {\n        position: absolute;\n        background-color: #ffffff;\n        border: solid 1px #929292;\n        z-index: 1050;\n    }\n\n    .price-list-pattern-input .title-color {\n        height: 30px;\n        line-height: 30px;\n        background-image: -webkit-linear-gradient(bottom,#eeeeee,#f9f9f9);\n    }\n\n    .price-list-pattern-input table {\n        table-layout:fixed;\n    }\n\n    .price-list-pattern-input table td {\n        white-space: nowrap;\n        overflow:hidden;\n    }\n\n    .price-list-pattern-input .master {\n        float: left;\n        width: 240px;\n    }\n\n    .price-list-pattern-input .master .master-item {\n        height: 155px;\n    }\n\n    .price-list-pattern-input .master .master-item-pattern {\n        height: 155px;\n        overflow-y: auto;\n    }\n\n    .price-list-pattern-input .master .master-title {\n        font-weight: bold;\n    }\n\n    .price-list-pattern-input .master .master-page {\n        border-top: solid 1px #929292;\n    }\n\n    .price-list-pattern-input .master .master-page span {\n        display: inline-block;\n    }\n\n    .price-list-pattern-input .master .master-page span:nth-child(1), .price-list-pattern-input .master .master-page span:nth-child(3) {\n        width: 60px;\n        color: #0066ff;\n        cursor: pointer;\n    }\n\n    .price-list-pattern-input .master .master-page span:nth-child(2) {\n        width: 100px;\n    }\n\n    .price-list-pattern-input .center {\n        float: left;\n    }\n\n    .price-list-pattern-input .center .triangle-left {\n        position: relative;\n        top: 41px;\n    }\n\n    .price-list-pattern-input .detail {\n        float: left;\n        width: 580px;\n    }\n\n    .price-list-pattern-input .detail-item {\n        height: 155px;\n        overflow-y: auto;\n    }\n\n    .price-list-pattern-input .detail-foot {\n        border-top: solid 1px #929292;\n    }\n\n    .price-list-pattern-input .detail-foot label {\n        padding-left: 30px;\n        padding-top: 0px;\n        padding-bottom: 3px;\n    }\n\n    .price-list-pattern-input .detail-foot label:nth-child(2) {\n        padding-left: 100px;\n    }\n    /*----------------------------------收费录入项目和模板输入法 2014-04-25 范成林 结束------------------*/\n</style>');
    }]);

angular.module('hr.directives').directive('priceListInput', ['$parse', '$compile', '$templateCache', '$document', '$timeout', '$debounce', 'hrPosition',
    function ($parse, $compile, $templateCache, $document, $timeout, $debounce, hrPosition) {
        var priceListInput = {
            restrict: 'E',
            scope: {
                options: "="
            },
            template: "<input type='text' ng-model='inputParam.value'>",
            replace: true,
            controller: ['$scope', '$http', function ($scope, $http) {
                var _template = null;//输入法模板代码
                var _closeFlag = true;//输入法是否关闭
                var _originalKeyMap = [];//处理mousetrap键盘事件临时数组
                var selectedPriceItemNameDictLineFlag = "no";//打开输入法时是否默认选中
                var defaultSelectedPriceListIndex = 0;//默认选中的价表项目索引
                var isSwitchInputParamType = false;

                $scope.inputParam = {value: "", type: "priceList"};//输入法类型[价表项目:priceList，模板:pattern]
                $scope.inputParamTypeEnum = {
                    PRICE_LIST: "priceList",
                    PATTERN: "pattern"
                };
                $scope.selectedPriceLists = [];//返回选中的价表项目

                $scope.priceItemNameDicts = [];//查询出的价表别名列表
                $scope.activatePriceItemNameDict = {};//当前选中的价表别名项目
                $scope.priceLists = [];//查询出的价表项目列表
                $scope.activatePriceList = {};//当前选中的价表项目

                $scope.patternMasters = [];//查询出的模板主记录
                $scope.patternDetails = [];//根据主记录查询出的模板明细记录
                $scope.activePatternMaster = {};//当前选中的模板主记录
                $scope.activePatternDetail = {};//当前选中的模板明细记录

                $scope.closeHandler = "";//记录输入法关闭操作者
                //枚举输入法关闭操作者
                $scope.closeHandlerEnum = {
                    CLICK_OUTSIDE: "click_outside"
                };
                //价表别名列表分页参数
                $scope.priceItemNamePagingOpt = {
                    pageSize: 5,
                    currentPage: 1,
                    totalItems: 0,
                    totalPage: 0
                };
                //清空数据
                var resetData = function () {
                    $scope.priceItemNameDicts = [];//查询出的价表别名列表
                    $scope.activatePriceItemNameDict = {};//当前选中的价表别名项目
                    $scope.priceLists = [];//查询出的价表项目列表
                    $scope.activatePriceList = {};//当前选中的价表项目
                    var selectedPriceItemNameDictLineFlag = "no";//打开输入法时是否默认选中
                    var defaultSelectedPriceListIndex = 0;//默认选中的价表项目索引

                    $scope.patternMasters = [];//查询出的模板主记录
                    $scope.patternDetails = [];//根据主记录查询出的模板明细记录
                    $scope.activePatternMaster = {};//当前选中的模板主记录

                    $scope.priceItemNamePagingOpt.pageSize = 5;
                    $scope.priceItemNamePagingOpt.currentPage = 1;
                    $scope.priceItemNamePagingOpt.totalItems = 0;
                    $scope.priceItemNamePagingOpt.totalPage = 0;

                    $scope.inputParam.value = "";
                };
                //关闭输入法
                $scope.closeMe = function (closeHandler) {
                    if (!_closeFlag) {
                        $scope.closeHandler = closeHandler;
                        $($scope.options.preventScrollDom).unbind('mousewheel');
                        _closeFlag = true;
                        $scope.options.isSwitchInputParamType = true;
                        $scope.options.inputParamType = $scope.inputParamTypeEnum.PRICE_LIST;
                        Mousetrap.reset();
                        Mousetrap.setKeyMap(_originalKeyMap);
                        resetData();
                        _template.remove();
                        if (angular.equals($scope.closeHandler, $scope.closeHandlerEnum.CLICK_OUTSIDE)) {
                            $scope.selectedPriceLists.length = 0;
                        }
                        $scope.options.selectedPriceList($scope.selectedPriceLists, $scope);
                    }
                };

                //阻止滚动条事件
                var scrollFunc=function(e){
                    e=e||window.event;
                    if (e && e.preventDefault){
                        e.preventDefault();
                        e.stopPropagation();
                    }else{
                        e.returnvalue=false;
                        return false;
                    }
                };

                //打开输入法
                $scope.openMe = function (targetElement) {
                    if (_closeFlag) {
                        $($scope.options.preventScrollDom).bind('mousewheel', function(e){
                            scrollFunc(e);
                        });
                        _closeFlag = false;
                        _template = angular.element(
                            angular.copy($templateCache.get('price-list-for-bill-template.html'))
                        );
                        _template.attr("inside-id", targetElement[0].id);
                        $compile(_template)($scope);

                        var resultTop = 0;
                        var resultLeft = 0;
                        var position = hrPosition.offset(targetElement);
                        var bodyOffsetHeight = $document.find('body')[0].offsetHeight;
                        if ((bodyOffsetHeight - (position.top + position.height)) < 179) {
                            resultTop = position.top - 220;
                        } else {
                            resultTop = position.top + 27;
                        }
                        resultLeft = position.left;

                        $(_template).css({top: resultTop + "px", left: resultLeft + "px"});
                        $document.find('body').append(_template);
                        _originalKeyMap = angular.copy(Mousetrap.getKeyMap());
                        $scope.bindPriceListKeys();
                        selectedPriceItemNameDictLineFlag = "no";
                        $scope.inputParam.type = $scope.options.inputParamType;
                        $scope.getPriceItemNameDictByInputCode();
                    }
                };

                //根据输入码查询价表项目名称字典
                var getPriceItemNameDictByInputCode = function (value, page, pageSize, callback) {
                    var requestUrl = Path.getUri("api/price-list-item/price-item-name-dict?page=" + page +
                        "&pageSize=" + pageSize + "&inputValue=" + value);
                    requestUrl += (HrStr.isNull($scope.options.queryUrl) ? "" : $scope.options.queryUrl);
                    $http.get(requestUrl).success(
                        function (data) {
                            callback(data);
                        }
                    ).error(
                        function (data, status) {
                            callback([]);
                        }
                    );
                };
                //根据条件查询价表
                var getPriceListByCondition = function (performedBys, callback) {
                    $http.get(Path.getUri("api/price-list-item/item-code/" + $scope.activatePriceItemNameDict.itemClass + "/" +
                    $scope.activatePriceItemNameDict.itemCode + "?performedBy=" + performedBys)).success(
                        function (data) {
                            callback(data);
                        }
                    ).error(
                        function (data, status) {
                            callback([]);
                        }
                    );
                };

                //根据输入码查询价表项目名称字典
                $scope.getPriceItemNameDictByInputCode = function () {
//                if (angular.equals($scope.inputParam.value, "")) {
//                    $scope.priceItemNameDicts = [];
//                    $scope.activatePriceItemNameDict = {};
//                    return;
//                }
                    getPriceItemNameDictByInputCode($scope.inputParam.value, $scope.priceItemNamePagingOpt.currentPage,
                        $scope.priceItemNamePagingOpt.pageSize, function (data) {
                            $scope.priceItemNameDicts = data.items;
                            $scope.priceItemNamePagingOpt.totalItems = data.totalItems;
                            if (selectedPriceItemNameDictLineFlag === "last") {//判断当前选中价表别名列表哪一行 first/last
                                $scope.activatePriceItemNameDict = $scope.priceItemNameDicts[$scope.priceItemNameDicts.length - 1];
                            } else if (selectedPriceItemNameDictLineFlag === "first") {
                                $scope.activatePriceItemNameDict = $scope.priceItemNameDicts[0];
                            }
                            defaultSelectedPriceListIndex = 0;
                            $scope.activatePricelist = {};
                        });
                };

                //根据输入码查询模板主记录
                var getPatternMasterByInputCode = function () {
                    $http.get(Path.getUri("api/bill-pattern?inputCode=" + $scope.inputParam.value)).success(
                        function (data) {
                            $scope.patternMasters = data;
                            $scope.activePatternMaster = {};
                            $scope.activePatternDetail = {};
                        }
                    ).error(
                        function (data, status) {
                            $scope.patternMasters = [];
                            $scope.patternDetails = [];
                        }
                    );
                };

                //选中一条价表项目名称
                $scope.selectPriceItemNameDict = function (priceItemNameDict) {
                    $scope.activatePriceItemNameDict = priceItemNameDict;
                };

                //选中一条模板主记录
                $scope.selectPatternMaster = function (patternMaster) {
                    $scope.activePatternMaster = patternMaster;
                };

                //选中一条模板主记录
                $scope.selectPatternMasterAndClose = function (patternMaster) {
                    $scope.activePatternMaster = patternMaster;
                    $scope.selectedPriceLists.length = 0;
                    if (!angular.equals($scope.activePatternMaster, {}) && $scope.activePatternMaster.billPatternDetails.length !== 0) {
                        $scope.selectedPriceLists = $scope.selectedPriceLists.concat($scope.activePatternMaster.billPatternDetails);
                    }
                    $scope.closeMe();
                };

                //选中一条价表项目
                $scope.selectPriceList = function (priceList) {
                    $scope.selectedPriceLists.length = 0;
                    $scope.selectedPriceLists.push(priceList);
                    $scope.closeMe();
                };

                //预选中一条价表项目
                $scope.prepareSelectPriceList = function (priceList, index) {
                    $scope.activatePriceList = priceList;
                    defaultSelectedPriceListIndex = index;
                };

                //选中一条模板明细
                $scope.selectPatternDetail = function (patternDetail) {
                    $scope.activePatternDetail = patternDetail;
                };

                //检测输入码的变化
                $scope.$watch("inputParam.value", function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        if (angular.equals($scope.inputParam.type, $scope.inputParamTypeEnum.PATTERN)) {
                            $debounce(getPatternMasterByInputCode, 100);
                        } else {
                            $debounce($scope.getPriceItemNameDictByInputCode, 100);
                            selectedPriceItemNameDictLineFlag = "first";
                            $scope.priceItemNamePagingOpt.currentPage = 1;
                        }
                    }
                }, true);

                //检测输入码类型的变化
                $scope.$watch("inputParam.type", function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        if (angular.equals($scope.inputParam.type, $scope.inputParamTypeEnum.PATTERN)) {
                            $debounce(getPatternMasterByInputCode, 100);
                        } else {
                            $debounce($scope.getPriceItemNameDictByInputCode, 100);
                            selectedPriceItemNameDictLineFlag = "first";
                            $scope.priceItemNamePagingOpt.currentPage = 1;
                        }
                    }
                }, true);

                //检测价表别名分页参数当前页的变化
                $scope.$watch('priceItemNamePagingOpt.currentPage', function (newValue, oldValue) {
                    $debounce($scope.getPriceItemNameDictByInputCode, 100);
                }, true);

                //检测价表别名分页参数项目总数的变化
                $scope.$watch('priceItemNamePagingOpt.totalItems', function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        $scope.priceItemNamePagingOpt.totalPage = Math.ceil($scope.priceItemNamePagingOpt.totalItems / $scope.priceItemNamePagingOpt.pageSize);
                    }
                }, true);

                //检测选中价表别名变化，查询相应价表信息
                $scope.$watch('activatePriceItemNameDict', function (newValue, oldValue) {
                    $scope.priceLists = [];
                    defaultSelectedPriceListIndex = 0;
                    $scope.activatePricelist = {};
                    if (newValue !== oldValue && (!angular.equals($scope.activatePriceItemNameDict, {})) && $scope.activatePriceItemNameDict !== undefined) {
                        getPriceListByCondition($scope.options.performedBys.join(","), function (data) {
                            $scope.priceLists = data;
                        });
                        $(".price-list-pattern-input .center .triangle-left").css("top",
                            ((($scope.priceItemNameDicts.indexOf(newValue) + 1) * 33)) + "px");
                    }
                }, true);

                //检测选中模板主记录变化，查询相应明细
                $scope.$watch('activePatternMaster', function (newValue, oldValue) {
                    $scope.patternDetails = [];
                    if (angular.isObject($scope.activePatternMaster)) {
                        $scope.patternDetails = $scope.activePatternMaster.billPatternDetails;
                    }
                }, true);

                //价表项目显示规格
                $scope.priceListItemSpec = function(priceList) {
                    if (HrStr.isNull(priceList.firmName)) {
                        return priceList.itemSpec;
                    } else {
                        return HrStr.nullToSpace(priceList.itemSpec) + "[" + priceList.firmName + "]";
                    }
                };

                //价表别名列表分页-显示上一页
                $scope.priceItemNameForwardPage = function () {
                    if ($scope.priceItemNamePagingOpt.totalPage === 0) {
                        $scope.priceItemNamePagingOpt.currentPage = 1;
                    } else if ($scope.priceItemNamePagingOpt.currentPage === 1) {
                        $scope.priceItemNamePagingOpt.currentPage = $scope.priceItemNamePagingOpt.totalPage;
                    } else {
                        $scope.priceItemNamePagingOpt.currentPage--;
                    }
                };

                //价表别名列表分页-显示下一页
                $scope.priceItemNameNextPage = function () {
                    if ($scope.priceItemNamePagingOpt.totalPage === 0) {
                        $scope.priceItemNamePagingOpt.currentPage = 1;
                    } else if ($scope.priceItemNamePagingOpt.currentPage === $scope.priceItemNamePagingOpt.totalPage) {
                        $scope.priceItemNamePagingOpt.currentPage = 1;
                    } else {
                        $scope.priceItemNamePagingOpt.currentPage++;
                    }
                };

                $scope.$watch("inputParam.type", function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        if (angular.equals(newValue, $scope.inputParamTypeEnum.PATTERN)) {
                            $scope.bindPatternKeys();
                        }
                        if (angular.equals(newValue, $scope.inputParamTypeEnum.PRICE_LIST)) {
                            $scope.bindPriceListKeys();
                        }
                    }
                }, true);

                //绑定价表输入模式键盘事件
                $scope.bindPriceListKeys = function () {
                    Mousetrap.reset();
                    //屏蔽键盘事件（全局）
                    Mousetrap.bindGlobal(["f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10"], function () {
                        return false;
                    });
                    //屏蔽键盘事件（非输入框）
                    Mousetrap.bind(["backspace"], function () {
                        return false;
                    });

                    Mousetrap.bindGlobal("up", function () {
                        var index;
                        //当前选中高亮在价表别名列表
                        if (angular.equals($scope.activatePriceList, {})) {
                            index = $scope.priceItemNameDicts.indexOf($scope.activatePriceItemNameDict);
                            if (index === 0) {
                                if ($scope.priceItemNamePagingOpt.totalPage === 0) {
                                    $scope.priceItemNamePagingOpt.currentPage = 1;
                                } else if ($scope.priceItemNamePagingOpt.currentPage === 1) {
                                    $scope.priceItemNamePagingOpt.currentPage = $scope.priceItemNamePagingOpt.totalPage;
                                } else {
                                    $scope.priceItemNamePagingOpt.currentPage--;
                                }
                            } else {
                                $scope.activatePriceItemNameDict = $scope.priceItemNameDicts[index - 1];
                            }
                            selectedPriceItemNameDictLineFlag = "last";
                        } else {
                            var scrollElement = $(".price-list-pattern-input .detail .detail-item");
                            $scope.activatePriceList = hrScrollBar.setScrollTop($scope.activatePriceList,
                                $scope.priceLists, scrollElement, hrScrollBar.eventType.UP);
                            defaultSelectedPriceListIndex = $scope.priceLists.indexOf($scope.activatePriceList);
                        }
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                        return false;
                    });
                    Mousetrap.bindGlobal("down", function () {
                        var index;
                        if (angular.equals($scope.activatePriceList, {})) {
                            index = $scope.priceItemNameDicts.indexOf($scope.activatePriceItemNameDict);
                            if (index === $scope.priceItemNameDicts.length - 1) {
                                if ($scope.priceItemNamePagingOpt.totalPage === 0) {
                                    $scope.priceItemNamePagingOpt.currentPage = 1;
                                } else if ($scope.priceItemNamePagingOpt.currentPage === $scope.priceItemNamePagingOpt.totalPage) {
                                    $scope.priceItemNamePagingOpt.currentPage = 1;
                                } else {
                                    $scope.priceItemNamePagingOpt.currentPage++;
                                }
                            } else {
                                $scope.activatePriceItemNameDict = $scope.priceItemNameDicts[index + 1];
                            }
                            selectedPriceItemNameDictLineFlag = "first";
                        } else {
                            var scrollElement = $(".price-list-pattern-input .detail .detail-item");
                            $scope.activatePriceList = hrScrollBar.setScrollTop($scope.activatePriceList,
                                $scope.priceLists, scrollElement, hrScrollBar.eventType.DOWN);
                            defaultSelectedPriceListIndex = $scope.priceLists.indexOf($scope.activatePriceList);
                        }
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                        return false;
                    });
                    Mousetrap.bindGlobal("left", function () {
                        if (!angular.equals($scope.activatePriceList, {})) {
                            defaultSelectedPriceListIndex = $scope.priceLists.indexOf($scope.activatePriceList);
                            $scope.activatePriceList = {};
                        }
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                        return false;
                    });
                    Mousetrap.bindGlobal("right", function () {
                        if ($scope.priceLists.length !== 0 && angular.equals($scope.activatePriceList, {})) {
                            $scope.activatePriceList = $scope.priceLists[defaultSelectedPriceListIndex];
                        }
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                        return false;
                    });
                    Mousetrap.bindGlobal("esc", function () {
                        $scope.selectedPriceLists.length = 0;
                        $scope.closeMe();
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                        return false;
                    });
                    Mousetrap.bindGlobal("enter", function () {
                        $scope.selectedPriceLists.length = 0;
                        if ($scope.priceLists.length !== 0) {
                            $scope.selectedPriceLists.push($scope.priceLists[defaultSelectedPriceListIndex]);
                        }
                        $scope.closeMe();
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                        return false;
                    });
                    Mousetrap.bindGlobal("=", function () {
                        $scope.priceItemNameNextPage();
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                        return false;
                    });
                    Mousetrap.bindGlobal("pagedown", function () {
                        $scope.priceItemNameNextPage();
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                        return false;
                    });
                    Mousetrap.bindGlobal("-", function () {
                        $scope.priceItemNameForwardPage();
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                        return false;
                    });
                    Mousetrap.bindGlobal("pageup", function () {
                        $scope.priceItemNameForwardPage();
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                        return false;
                    });
                    Mousetrap.bindGlobal("tab", function () {
                        if ($scope.options.isSwitchInputParamType) {
                            resetData();
                            $scope.inputParam.type = "pattern";
                            if (!$scope.$$phase) {
                                $scope.$apply();
                            }
                        }
                        return false;
                    });
                };

                //绑定模板输入模式键盘事件
                $scope.bindPatternKeys = function () {
                    Mousetrap.reset();
                    //屏蔽键盘事件（全局）
                    Mousetrap.bindGlobal(["f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10"], function () {
                        return false;
                    });
                    //屏蔽键盘事件（非输入框）
                    Mousetrap.bind(["backspace"], function () {
                        return false;
                    });

                    Mousetrap.bindGlobal("up", function () {
                        if (angular.equals($scope.activePatternDetail, {})) {
                            //当前选中高亮在模板主记录上
                            if ($scope.patternMasters.length === 0) {
                                return false;
                            }
                            var scrollElement = $(".price-list-pattern-input .master-item-pattern");
                            if (angular.equals($scope.activePatternMaster, {})) {
                                $scope.activePatternMaster = $scope.patternMasters[0];
                            } else {
                                $scope.activePatternMaster = hrScrollBar.setScrollTop($scope.activePatternMaster,
                                    $scope.patternMasters, scrollElement, hrScrollBar.eventType.UP);
                            }
                        } else {
                            //当前选中高亮在模板明细记录上
                            if ($scope.patternDetails.length === 0) {
                                return false;
                            }
                            var scrollElement = $(".price-list-pattern-input .detail .detail-item");
                            $scope.activePatternDetail = hrScrollBar.setScrollTop($scope.activePatternDetail,
                                $scope.patternDetails, scrollElement, hrScrollBar.eventType.UP);
                        }
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                        return false;
                    });
                    Mousetrap.bindGlobal("down", function () {
                        if (angular.equals($scope.activePatternDetail, {})) {
                            //当前选中高亮在模板主记录上
                            if ($scope.patternMasters.length === 0) {
                                return false;
                            }
                            var scrollElement = $(".price-list-pattern-input .master-item-pattern");
                            if (angular.equals($scope.activePatternMaster, {})) {
                                $scope.activePatternMaster = $scope.patternMasters[0];
                            } else {
                                $scope.activePatternMaster = hrScrollBar.setScrollTop($scope.activePatternMaster,
                                    $scope.patternMasters, scrollElement, hrScrollBar.eventType.DOWN);
                            }
                        } else {
                            //当前选中高亮在模板明细记录上
                            if ($scope.patternDetails.length === 0) {
                                return false;
                            }
                            var scrollElement = $(".price-list-pattern-input .detail .detail-item");
                            $scope.activePatternDetail = hrScrollBar.setScrollTop($scope.activePatternDetail,
                                $scope.patternDetails, scrollElement, hrScrollBar.eventType.DOWN);
                        }
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                        return false;
                    });
                    Mousetrap.bindGlobal("left", function () {
                        if (!angular.equals($scope.activePatternDetail, {})) {
                            $scope.activePatternDetail = {};
                        }
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                        return false;
                    });
                    Mousetrap.bindGlobal("right", function () {
                        if ($scope.patternDetails.length !== 0 && angular.equals($scope.activePatternDetail, {})) {
                            $scope.activePatternDetail = $scope.patternDetails[0];
                        }
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                        return false;
                    });
                    Mousetrap.bindGlobal("esc", function () {
                        $scope.selectedPriceLists.length = 0;
                        $scope.closeMe();
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                        return false;
                    });
                    Mousetrap.bindGlobal("enter", function () {
                        $scope.selectedPriceLists.length = 0;
                        if (!angular.equals($scope.activePatternMaster, {}) && $scope.activePatternMaster.billPatternDetails.length !== 0) {
                            $scope.selectedPriceLists = $scope.selectedPriceLists.concat($scope.activePatternMaster.billPatternDetails);
                        }
                        $scope.closeMe();
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                        return false;
                    });
                    Mousetrap.bindGlobal("tab", function () {
                        if ($scope.options.isSwitchInputParamType) {
                            resetData();
                            $scope.inputParam.type = "priceList";
                            if (!$scope.$$phase) {
                                $scope.$apply();
                            }
                        }
                        return false;
                    });
                };
            }],
            link: function (scope, element, attrs) {
                var openInputMethod = function () {
                    scope.openMe(element);
                };
                $(element).bind('click focus', function () {
                    $debounce(openInputMethod, 100);
                });
            }
        };
        return priceListInput;
    }]);