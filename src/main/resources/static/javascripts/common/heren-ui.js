angular.module('hr.config', []).value('hr.config', {});
angular.module('hr.filters', ['hr.config']);
angular.module('hr.service', ['hr.config']);
angular.module('hr.directives', ['hr.config']);
angular.module('hr.templateCache', ['hr.config']);
angular.module('hr', ['hr.filters', 'hr.service', 'hr.directives', 'hr.templateCache', 'hr.config']);

/**
 * 此Controller用于hrDialog
 */
angular.module('hr').controller('HrMessageBoxController', ['$scope', 'dialog', 'model', '$sce', function ($scope, dialog, model, $sce) {
    $scope.title = model.title;
    $scope.message = model.message;
    $scope.buttons = model.buttons;
    $scope.cssClass = model.cssClass;
    $scope.detail = model.detail;
    $scope.detailShowFlag = false;
    $scope.close = function (res) {
        dialog.close(res);
    };
    $scope.deliberatelyTrustDangerousSnippet = function (html) {
        return $sce.trustAsHtml(html);
    };
    $scope.buttons.forEach(function (button) {
        if (button.cssClass !== undefined && button.cssClass !== null) {
            if (button.cssClass.match("btn-primary")) {
                $scope.activeButton = button;
                button.cssClass = button.cssClass.replace(/btn-primary/g, "");
            }
        }
    });
    $scope.detailIsShow = function () {
        $scope.detailShowFlag = !$scope.detailShowFlag;
    };

    $scope.detailTxtIsShow = function () {
        if (HrStr.isNull($scope.detail)) {
            return false;
        } else {
            return true;
        }
    };

    (function () {
        Mousetrap.reset();
        Mousetrap.bindGlobal(["f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10"], function () {
            return false;
        });
        //屏蔽键盘事件（非输入框）
        Mousetrap.bind(["backspace"], function () {
            return false;
        });
        Mousetrap.bindGlobal("esc", function () {
            $scope.$apply(function () {
                dialog.close("close");
            });
            return false;
        });
        Mousetrap.bindGlobal(["tab", "right"], function () {
            $scope.$apply(function () {
                var index = $scope.buttons.indexOf($scope.activeButton);
                if (index === -1) {
                    $scope.activeButton = $scope.buttons[0];
                }
                if (index === $scope.buttons.length - 1) {
                    $scope.activeButton = $scope.buttons[0];
                } else {
                    $scope.activeButton = $scope.buttons[index + 1];
                }
            });
            return false;
        });
        Mousetrap.bindGlobal("left", function () {
            $scope.$apply(function () {
                var index = $scope.buttons.indexOf($scope.activeButton);
                if (index === -1) {
                    $scope.activeButton = $scope.buttons[0];
                }
                if (index === 0) {
                    $scope.activeButton = $scope.buttons[$scope.buttons.length - 1];
                } else {
                    $scope.activeButton = $scope.buttons[index - 1];
                }
            });
            return false;
        });
        Mousetrap.bindGlobal("enter", function () {
            $scope.$apply(function () {
                dialog.close($scope.activeButton.result);
            });
            return false;
        });
    })();
}]);

/**
 * 此module是自定义指令的html代码模版缓存
 */
angular.module('hr.templateCache').run(['$templateCache', function ($templateCache) {
    $templateCache.put('hr-dialog-confirm.html', '<div class="alert-level">\n    <div class="alert-message">\n        <h5>{{title}}\n            <button class="close" ng-click="close(\'close\')">&times;</button>\n        </h5>\n        <p>\n\n        <div class="alert-circle alert-circle-isSave alert-font"><span>?</span></div>\n                  <span class="messageFont-text">\n                      <div class="message-content" ng-bind-html="deliberatelyTrustDangerousSnippet(message)"></div>\n                  </span>\n        </p>\n        <div class="message-bottom">\n            <button ng-repeat="button in buttons" ng-click="close(button.result)" \n                    ng-class="{\'btn-primary\' : activeButton == button}"\n                    class="btn {{button.cssClass}}">\n                {{button.label}}\n            </button>\n        </div>\n    </div>\n</div>');
    $templateCache.put('hr-dialog-warn.html', '<div class="alert-level">\n    <div class="warn-operate">\n        <div class="alert-message">\n            <h5>{{title}}<button class="close" ng-click="close(\'close\')">&times;</button></h5>\n            <p>\n            <div class="alert-triangle-up alert-font"><span>!</span></div>\n                  <span class="messageFont-text">\n                      <div class="message-content" ng-bind-html="deliberatelyTrustDangerousSnippet(message)"></div>\n                  </span>\n            </p>\n            <a class="details" ng-click="detailIsShow()" ng-if="detailTxtIsShow()"> >>详情</a>\n            <div class="message-bottom">\n                <button ng-repeat="button in buttons" ng-click="close(button.result)"\n                        ng-class="{\'btn-primary\' : activeButton == button}"\n                        class="btn {{button.cssClass}}">\n                    {{button.label}}\n                </button>\n            </div>\n        </div>\n        <div ng-if="detailShowFlag" class="details-messages">\n            <p ng-bind-html="deliberatelyTrustDangerousSnippet(detail)"></p>\n        </div>\n    </div>\n</div>');
    $templateCache.put('hr-dialog-success.html', '<div class="alert-level">\n    <div class="alert-message">\n        <h5>{{ title }}<button class="close" ng-click="close(\'close\')">&times;</button></h5>\n        <p>\n        <div class="alert-circle alert-circle-success"><i class="icon-checkmark"></i></div>\n                  <span class="messageFont-text">\n                      <div class="message-content" ng-bind-html="deliberatelyTrustDangerousSnippet(message)"></div>\n                  </span>\n        </p>\n        <div class="message-bottom">\n            <button ng-repeat="button in buttons" ng-click="close(button.result)"\n                    ng-class="{\'btn-primary\' : activeButton == button}"\n                    class="btn {{button.cssClass}}">\n                {{button.label}}\n            </button>\n        </div>\n    </div>\n</div>');
    $templateCache.put('hr-dialog-exception.html', '<div class="alert-level">\n    <div class="exception-operate">\n        <div class="alert-message">\n            <h5>{{ title }}<button class="close" ng-click="close(\'close\')">&times;</button></h5>\n            <p>\n            <div class="alert-circle alert-circle-exception"><i class="icon-cancel-2"></i></div>\n                      <span class="messageFont-text">\n                          <div class="message-content" ng-bind-html="deliberatelyTrustDangerousSnippet(message)"></div>\n                      </span>\n            </p>\n            <a class="details" ng-click="detailIsShow()" ng-if="detailTxtIsShow()"> >>详情</a>\n            <div class="message-bottom">\n                <button ng-repeat="button in buttons" ng-click="close(button.result)"\n                        ng-class="{\'btn-primary\' : activeButton == button}"\n                        class="btn {{button.cssClass}}">\n                    {{button.label}}\n                </button>\n            </div>\n        </div>\n        <div ng-if="detailShowFlag" class="details-messages">\n            <p ng-bind-html="deliberatelyTrustDangerousSnippet(detail)"></p>\n        </div>\n    </div>\n</div>');
    $templateCache.put('hr-progress.html', '<div class="alert-level">\n    <i style="position: absolute;top: 40%;left: 50%;right: 50%;" class=\'hr-progress spin icon-loading\'>\n</div>');
    $templateCache.put('hrdict.html', "<div ng-switch on=\"modelConfig\">\n  <div ng-switch-when=\"1\">\n      <select ng-model=\"$parent.ngModel\"  ui-select2  ng-change=\"callback({changeObj:ngModel})\"  ng-readonly=\"hrReadonly\">\n          <option></option>\n          <option ng-repeat=\"dict in dicts\" value=\"{{dict}}\" code=\"{{dict.inputCode.toLowerCase()}}\"> {{dict.codeName}}</option>\n      </select>\n  </div>\n   <div ng-switch-when=\"2\">\n       \n    <select ng-model=\"$parent.ngModel\"  ui-select2 ng-change=\"callback({changeObj:ngModel}) \"ng-readonly=\"hrReadonly\" >\n        <option></option>\n        <option ng-repeat=\"dict in dicts\" value=\"{{dict.codeName}}\" code=\"{{dict.inputCode.toLowerCase()}}\"> {{dict.codeName}}</option>\n    </select>\n   </div>\n    <div ng-switch-default>\n          <select ng-model=\"$parent.ngModel\"  ui-select2 ng-change=\"callback({changeObj:ngModel})\" ng-readonly=\"hrReadonly\">\n              <option></option>\n              <option ng-repeat=\"dict in dicts\" value=\"{{dict.codeId}}\" code=\"{{dict.inputCode.toLowerCase()}}\"> {{dict.codeName}}</option>\n          </select> \n    </div>\n</div>\n ");
}]);

/**
 * 此服务提供position与offset两个方法，可以取得页面元素的位置
 */
angular.module('hr.service').factory('hrPosition', ['$document', '$window', function ($document, $window) {
    function getStyle(el, cssprop) {
        if (el.currentStyle) { //IE
            return el.currentStyle[cssprop];
        } else if ($window.getComputedStyle) {
            return $window.getComputedStyle(el)[cssprop];
        }
        // finally try and get inline style
        return el.style[cssprop];
    }

    /**
     * Checks if a given element is statically positioned
     * @param element - raw DOM element
     */
    function isStaticPositioned(element) {
        return (getStyle(element, "position") || 'static' ) === 'static';
    }

    /**
     * returns the closest, non-statically positioned parentOffset of a given element
     * @param element
     */
    var parentOffsetEl = function (element) {
        var docDomEl = $document[0];
        var offsetParent = element.offsetParent || docDomEl;
        while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent)) {
            offsetParent = offsetParent.offsetParent;
        }
        return offsetParent || docDomEl;
    };

    return {
        /**
         * Provides read-only equivalent of jQuery's position function:
         * http://api.jquery.com/position/
         */
        position: function (element) {
            var elBCR = this.offset(element);
            var offsetParentBCR = {top: 0, left: 0};
            var offsetParentEl = parentOffsetEl(element[0]);
            if (offsetParentEl !== $document[0]) {
                offsetParentBCR = this.offset(angular.element(offsetParentEl));
                offsetParentBCR.top += offsetParentEl.clientTop;
                offsetParentBCR.left += offsetParentEl.clientLeft;
            }

            return {
                width: element.prop('offsetWidth'),
                height: element.prop('offsetHeight'),
                top: elBCR.top - offsetParentBCR.top,
                left: elBCR.left - offsetParentBCR.left
            };
        },

        /**
         * Provides read-only equivalent of jQuery's offset function:
         * http://api.jquery.com/offset/
         */
        offset: function (element) {
            var boundingClientRect = element[0].getBoundingClientRect();
            return {
                width: element.prop('offsetWidth'),
                height: element.prop('offsetHeight'),
                top: boundingClientRect.top + ($window.pageYOffset || $document[0].body.scrollTop),
                left: boundingClientRect.left + ($window.pageXOffset || $document[0].body.scrollLeft)
            };
        }
    };
}]);

/**
 * 此服务提供模态对话框
 */
angular.module('hr.service').factory('hrDialog', ['$templateCache', '$document', '$compile', '$rootScope',
    '$controller', '$q', '$timeout',
    function ($templateCache, $document, $compile, $rootScope, $controller, $q, $timeout) {
        var _defaultSuccessOpts = {
            title: "提示", message: "操作成功", buttons: [
                {result: "close", label: '关闭', cssClass: 'btn-primary'}
            ]
        };
        var _defaultExceptionOpts = {
            title: "异常", message: "操作异常", buttons: [
                {result: "close", label: '关闭', cssClass: 'btn-primary'}
            ]
        };
        var _defaultConfirmOpts = {
            title: "确认", message: "确认操作", buttons: [
                {result: "ok", label: '确定', cssClass: 'btn-primary'},
                {result: "cancel", label: '取消'}
            ]
        };
        var _defaultWarnOpts = {
            title: "警告", message: "操作警告", buttons: [
                {result: "close", label: '关闭', cssClass: 'btn-primary'}
            ]
        };

        var dialogTypeEnum = {
            CONFIRM: "confirm",
            SUCCESS: "success",
            WARN: "warn",
            EXCEPTION: "exception"
        };

        function HrDialog(dialogType, opts) {
            this._dialogType = dialogType;
            this._opts = null;
            this._element = null;
            this._activeElement = null;
            if (angular.equals(dialogTypeEnum.WARN, this._dialogType)) {
                this._opts = this._getOpts(opts, angular.copy(_defaultWarnOpts), dialogType);
                this._element = angular.element($templateCache.get('hr-dialog-warn.html'));
            } else if (angular.equals(dialogTypeEnum.EXCEPTION, this._dialogType)) {
                this._opts = this._getOpts(opts, angular.copy(_defaultExceptionOpts), dialogType);
                this._element = angular.element($templateCache.get('hr-dialog-exception.html'));
            } else if (angular.equals(dialogTypeEnum.CONFIRM, this._dialogType)) {
                this._opts = this._getOpts(opts, angular.copy(_defaultConfirmOpts), dialogType);
                this._element = angular.element($templateCache.get('hr-dialog-confirm.html'));
            } else {
                this._opts = this._getOpts(opts, angular.copy(_defaultSuccessOpts), dialogType);
                this._element = angular.element($templateCache.get('hr-dialog-success.html'));
            }
        }

        HrDialog.prototype.open = function () {
            if (!angular.isUndefined(event)) {
                event.stopPropagation();
                event.preventDefault();
            }
            $timeout(function () {
                this._activeElement = $(document.activeElement);
                this._activeElement.blur();
            }, 200);

            this._keyMap = angular.copy(Mousetrap.getKeyMap());

            var locals = {dialog: this, model: this._opts};
            var $scope = locals.$scope = locals.$scope ? locals.$scope : $rootScope.$new();
            $controller('HrMessageBoxController', locals);
            $compile(this._element)($scope);
//            $document.find('body').append(this._element);
            $(window.top.document).find('body').append(this._element);
            this.deferred = $q.defer();
            var promise = this.deferred.promise;
            promise.close = function (fn) {
                promise.then(function (result) {
                    fn(result);
                });
                return promise;
            };
            return promise;
        };
        HrDialog.prototype.close = function (result) {
            Mousetrap.reset();
            Mousetrap.setKeyMap(this._keyMap);
            this._element.remove();
            if (!this._opts.preventFocus) {
                $timeout(function () {
                    this._activeElement.focus();
                }, 200);
            }
            this.deferred.resolve(result);
        };
        HrDialog.prototype._getOpts = function (opts, defaultOpts, dialogType) {
            var _tempOpts = angular.extend(defaultOpts, opts);
            if (angular.equals(dialogTypeEnum.CONFIRM, dialogType)) {
                _tempOpts.cssClass = "alert-circle alert-circle-isSave";
            } else {
                _tempOpts.cssClass = "alert-triangle-up";
            }
            return _tempOpts;
        };

        return {
            typeEnum: dialogTypeEnum,
            dialog: function (dialogType, opts) {
                return new HrDialog(dialogType, opts).open();
            }
        };
    }]);

/**
 * 提供延迟执行服务
 */
angular.module('hr.service').factory('$debounce', ['$rootScope', '$browser', '$q', '$exceptionHandler',
    function ($rootScope, $browser, $q, $exceptionHandler) {
        var deferreds = {},
            methods = {},
            uuid = 0;

        function debounce(fn, delay, invokeApply) {
            var deferred = $q.defer(),
                promise = deferred.promise,
                skipApply = (angular.isDefined(invokeApply) && !invokeApply),
                timeoutId, cleanup,
                methodId, bouncing = false;

            // check we dont have this method already registered
            angular.forEach(methods, function (value, key) {
                if (angular.equals(methods[key].fn, fn)) {
                    bouncing = true;
                    methodId = key;
                }
            });

            // not bouncing, then register new instance
            if (!bouncing) {
                methodId = uuid++;
                methods[methodId] = {fn: fn};
            } else {
                // clear the old timeout
                deferreds[methods[methodId].timeoutId].reject('bounced');
                $browser.defer.cancel(methods[methodId].timeoutId);
            }

            var debounced = function () {
                // actually executing? clean method bank
                delete methods[methodId];

                try {
                    deferred.resolve(fn());
                } catch (e) {
                    deferred.reject(e);
                    $exceptionHandler(e);
                }

                if (!skipApply) $rootScope.$apply();
            };

            timeoutId = $browser.defer(debounced, delay);

            // track id with method
            methods[methodId].timeoutId = timeoutId;

            cleanup = function (reason) {
                delete deferreds[promise.$$timeoutId];
            };

            promise.$$timeoutId = timeoutId;
            deferreds[timeoutId] = deferred;
            promise.then(cleanup, cleanup);

            return promise;
        }


        // similar to angular's $timeout cancel
        debounce.cancel = function (promise) {
            if (promise && promise.$$timeoutId in deferreds) {
                deferreds[promise.$$timeoutId].reject('canceled');
                return $browser.defer.cancel(promise.$$timeoutId);
            }
            return false;
        };

        return debounce;
    }]);

/**
 * 医疗类别枚举
 */
angular.module('hr.service').factory("HrClinicCate", [function () {
    return {
        OUTP: 1,
        INP: 2,
        REGISTER: 3
    };
}]);

angular.module("hr.service").filter("clinicCate", function () {
    return function (input) {
        if (angular.equals(input, 1)) {
            return "门诊";
        } else if (angular.equals(input, 2)) {
            return "住院";
        } else if (angular.equals(input, 3)) {
            return "挂号";
        } else {
            return input;
        }
    };
});

/**
 * 证件类型枚举
 */
angular.module('hr.service').factory("HrCardType", [function () {
    return {
        ID_CARD: "身份证",
        MILITARY_MEDICAL: "军队医改",
        BEIJING_INSURANCE: "北京医保",
        PASSPORT: "护照",
        ONE_CARD_SOLUTION: "本院一卡通",
        INSURANCE_MEDICAL: "医疗保险",
        FARMER_COOP_MEDICAL: "新农合"
    };
}]);

/**
 * popover指令
 */
angular.module('hr.directives').directive('hrPopover', ['hr.config', '$compile', '$templateCache',
    function (hrConfig, $compile, $templateCache) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var getOptions = function () {
                    return angular.extend({}, hrConfig.hrPopover, scope.$eval(attrs.hrPopover));
                };
                var opts = getOptions();
                var templateHtml = $templateCache.get(scope.$eval(attrs.hrPopover)["templateUrl"]);
                if (templateHtml !== undefined) {
                    var elementTemp = angular.element(templateHtml);
                    $compile(elementTemp)(scope);
                    opts.content = function () {
                        return elementTemp;
                    };
                }
                element.popover(opts);
                scope.$watch(attrs.hrPopover + ".showFlag", function (newValue) {
                    if (angular.equals(newValue, true)) {
                        element.popover('show');
                    } else {
                        element.popover('hide');
                    }
                }, true);
            }
        };
    }]);

/**
 * autocomplete指令
 */
angular.module('hr.directives').directive('hrAutocomplete', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, controller) {
            var options = scope[attrs['hrAutocomplete']];
            var optionsItems = options['optionsItem'].split(' ');
            var completeOpts = {
                focus: function (event, ui) {
                    element.val(ui.item[optionsItems[2]]);
                    return false;
                },
                select: function (event, ui) {
                    controller.$setViewValue(ui.item[optionsItems[0]]);
                    scope[options["selectedItem"]] = angular.copy(ui.item);
                    if (options["selectCallback"]) {
                        options["selectCallback"]();
                    }
                    scope.$apply();
                    return false;
                }
            };

            if (typeof options['source'] === "function") {
                completeOpts.source = options['source'];
            } else {
                completeOpts.source = function (request, response) {
                    var sourceData = scope[options['source']];
                    response(sourceData);
                };
            }
            element.autocomplete(completeOpts).data("ui-autocomplete")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<a>" + item[optionsItems[2]] + "</a>")
                    .appendTo(ul);
            };
        }
    };
});

/**
 * timepicker指令
 */
angular.module('hr.directives').directive('hrTime', ['hr.config', function (hrConfig) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, controller) {
            var getOptions = function () {
                return angular.extend({}, hrConfig.time, scope.$eval(attrs.hrTime));
            };
            var opts = getOptions();
            opts.onSelect = function (value, picker) {
                scope.$apply(function () {
                    controller.$setViewValue(value);
                });
            };
            element.timepicker(opts);
        }
    };
}]);

/**
 *dom编译期设置元素高度，可以接受数字或者表达式
 */
angular.module('hr.directives').directive('hrSelfHeight', ['$timeout', function ($timeout) {
    function _resizeElement(element, hrSelfHeight) {
        element.height((typeof hrSelfHeight === "number") ? hrSelfHeight : eval(hrSelfHeight));
    };

    return {
        priority: 1000,
        link: function (scope, element, attrs) {
            var hrSelfHeight = attrs["hrSelfHeight"];
            var on = attrs["on"];
            if (on) {
                $(window).resize(function () {
                    _resizeElement(element, scope.$eval(hrSelfHeight));
                });
                scope.$watch(on, function () {
                    $timeout(function () {
                        _resizeElement(element, scope.$eval(hrSelfHeight));
                    }, 100);
                }, true);
            } else {
                $(window).resize(function () {
                    _resizeElement(element, hrSelfHeight);
                });
                _resizeElement(element, hrSelfHeight);
            }
        }
    };
}]);

/**
 *dom编译期设置元素宽度，可以接受数字或者表达式
 */
angular.module('hr.directives').directive('hrSelfWidth', ['hr.config', function (hrConfig) {
    function _resizeElement(tElement, hrSelfWidth) {
        if (typeof hrSelfWidth === "number") {
            tElement.width(hrSelfWidth);
        } else {
            tElement.width(eval(hrSelfWidth));
        }
    }

    return {
        priority: 1000,
        compile: function (tElement, tAttrs, transclude) {
            var hrSelfWidth = tAttrs["hrSelfWidth"];
            $(window).resize(function () {
                _resizeElement(tElement, hrSelfWidth);
            });
            _resizeElement(tElement, hrSelfWidth);
            return function (scope, element, attrs) {
            };
        }
    };
}]);

/**
 * datetimepicker指令
 */
angular.module('hr.directives').directive('hrDateTime', ['hr.config', function (hrConfig, $parse) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, controller) {
            controller.$formatters.push(function (value) {
                if (angular.isDate(value)) {
                    return HrDate.formatDateTime(value, HrDate.YY_MM_DD, HrDate.HH_MM_SS);
                } else if (angular.isString(value)) {
                    return value;
                } else if (angular.isNumber(value)) {
                    return HrDate.formatDateTime(new Date(value), HrDate.YY_MM_DD, HrDate.HH_MM_SS);
                }

            });

            var getOptions = function () {
                return angular.extend({}, hrConfig.dateTime, scope.$eval(attrs.hrDateTime));
            };
            var opts = getOptions();
            opts.onSelect = function (value, picker) {
                scope.$apply(function () {
                    controller.$setViewValue(value);

                });
            };
            opts.onClose = function (value, picker) {
                scope.$apply(function () {
                    controller.$setViewValue(value);
//                    scope.$parent.editFlag = false;
                });
            };
            if (angular.equals(opts.pickerType, "timePicker")) {
                element.timepicker(opts);
            } else if (angular.equals(opts.pickerType, "dateTimePicker")) {
                element.datetimepicker(opts);
            } else {
                element.datepicker(opts);
            }
        }
    };
}]);

/**
 * datetimepicker指令,传入date类型的数据时，可通过参数dateFormatStyle控制格式化样式 不写该参数默认yyyy-MM-dd 传入值long表示 yyyy-MM-dd hh:mm:ss 其它值等于默认
 */
angular.module('hr.directives').directive('hrDateTime2', ['hr.config', function (hrConfig, $parse) {
    return {
        require: 'ngModel',
        scope: {
            dateFormatStyle: '='
        },
        link: function (scope, element, attrs, controller) {
            controller.$formatters.push(function (value) {
                if (angular.isDate(value)) {
                    if (isNull(scope.dateFormatStyle) || scope.dateFormatStyle != "long") {
                        return HrDate.formatDate(value, HrDate.YY_MM_DD);
                    } else {
                        return HrDate.formatDateTime(value, HrDate.YY_MM_DD, HrDate.HH_MM_SS);
                    }

                } else if (angular.isString(value)) {
                    return value;
                } else if (angular.isNumber(value)) {
                    return HrDate.formatDateTime(new Date(value), HrDate.YY_MM_DD, HrDate.HH_MM_SS);
                }

            });

            var getOptions = function () {
                return angular.extend({}, hrConfig.dateTime, scope.$eval(attrs.hrDateTime));
            };
            var opts = getOptions();
            opts.onSelect = function (value, picker) {
                scope.$apply(function () {
                    controller.$setViewValue(value);

                });
            };
            opts.onClose = function (value, picker) {
                scope.$apply(function () {
                    controller.$setViewValue(value);
//                    scope.$parent.editFlag = false;
                });
            };
            if (angular.equals(opts.pickerType, "timePicker")) {
                element.timepicker(opts);
            } else if (angular.equals(opts.pickerType, "dateTimePicker")) {
                element.datetimepicker(opts);
            } else {
                element.datepicker(opts);
            }
        }
    };
}]);
/**
 * 配合hrDateTime指定使用，添加今天、昨天、明天快捷方式，使用可参考  护士站---空床上报 页面
 * 示例： <span hr-date-time-for-select  date-options="dateOptions"  selected-date="selectedDate" input-class="'input-medium'" choose-button="cancelMode!=='CANCEL_OUT_HOSPITAL'"></span>
 */

angular.module('hr.directives').directive('hrDateTimeForSelect', ['hr.config', '$filter', 'hrDialog', function (hrConfig, $filter, hrDialog, $parse) {

    return {
        template: '<span> <input type="text" date-format-style="dateFormatStyle"    ng-class="inputClass" ng-disabled="chooseButton||dateSelectDisable" hr-date-time2="dateOptions" ng-model="selectedDate" selected-date="selectedDate"><select  class="DateTimeForSelect" ui-select2 ng-disabled="chooseButton"  ng-init="chooseDatepack=(initValue==null?0:initValue)" ng-model="chooseDatepack"><option value="-1">昨天</option><option value="0">今天</option><option value="1" ng-show="tomorrowshow">明天</option><option value="2">其它</option> </select></span>',

        scope: {
            dateOptions: '=',//时间格式，最大值，最小值等设定
            selectedDate: '=',//input绑定的元素
            chooseButton: '=',//控制快捷方式按钮禁用
            inputClass: '=',//控制input的样式，使用时若传递字符串，请用‘’包裹
            initValue: '=',//初始化的值 今天：0 昨天 -1 明天 1 其它 2
            dateFormatStyle: '='//将date类型的值传入给input时，默认转成yyyy-MM-dd，通过该参数可以控制，设为long值时，转化格式yyyy-MM-dd hh:mm:ss
        },

        link: function (scope, element, attrs, controller) {
            //控制今天。明天等选项是否显示
            scope.tomorrowshow = true;
            scope.todayshow = true;
            scope.yesterdayshow = true;

            var today = new Date($filter('date')(new Date(), 'yyyy-MM-dd') + " 00:00:00");
            var tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
            var yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
            if (isNull(scope.dateOptions)) {
                scope.dateOptions = [];
            }
            //当设置最大值不为空时，若生成的时间大于最大值，不显示该选项
            if (!isNull(scope.dateOptions.maxDate) && scope.dateOptions.maxDate < today) {
                scope.todayshow = false;
            }
            //当设置最小值不为空时，若生成的时间小于最小值，给出提示
            if (!isNull(scope.dateOptions.maxDate) && scope.dateOptions.minDate > today) {
                scope.todayshow = false;
            }
            //当设置最大值不为空时，若生成的时间大于最大值，不显示该选项
            if (!isNull(scope.dateOptions.maxDate) && scope.dateOptions.maxDate < tomorrow) {
                scope.tomorrowshow = false;
            }
            //当设置最小值不为空时，若生成的时间小于最小值，给出提示
            if (!isNull(scope.dateOptions.maxDate) && scope.dateOptions.minDate > tomorrow) {
                scope.tomorrowshow = false;
            }

            //当设置最大值不为空时，若生成的时间大于最大值，不显示该选项
            if (!isNull(scope.dateOptions.maxDate) && scope.dateOptions.maxDate < yesterday) {
                scope.yesterdayshow = false;
            }
            //当设置最小值不为空时，若生成的时间小于最小值，给出提示
            if (!isNull(scope.dateOptions.maxDate) && scope.dateOptions.minDate > yesterday) {
                scope.yesterdayshow = false;
            }
            scope.$watch('chooseDatepack', function (newValue, oldValue) {
                scope.dateSelectDisable = true;
                var toDate = null;
                if (newValue == 0) {
                    //今天
                    toDate = today;
                } else if (newValue == 1) {
                    //明天
                    toDate = tomorrow;
                } else if (newValue == 2) {
                    //其他
                    scope.dateSelectDisable = false;
                    return;
                } else if (newValue == -1) {
                    //昨天
                    toDate = yesterday;
                }
                var dateformat = "";
                if (!isNull(scope.dateOptions.dateFormat)) {
                    //为了处理  yy==yyyy  mm==MM的情况
                    dateformat = scope.dateOptions.dateFormat.replace("yyyy", "yy").replace("yy", "yyyy").replace("mm", "MM") + " ";
                }
                if (!isNull(scope.dateOptions.timeFormat)) {
                    dateformat += scope.dateOptions.timeFormat;
                }
                //若未传入格式，默认yyyy-MM-dd
                if (dateformat == "") {
                    dateformat = "yyyy-MM-dd";
                }

                scope.selectedDate = $filter('date')(toDate, dateformat);

            });

        }
    };
}]);

/**
 * 针对  xxxx至xxxx 两个时间选择框添加今天明天等快捷方式
 * 示例：<div class="controls" hr-date-time-for-select-to-query  begin-date="beginDate" end-date="endDate" input-class="'input-time'"  date-options="dateTimeOptions"  choose-button="filterOpt.processingStatus==0"></div>
 */
angular.module('hr.directives').directive('hrDateTimeForSelectToQuery', ['hr.config', '$filter', 'hrDialog', function (hrConfig, $filter, hrDialog, $parse) {

    return {
        template: '<span><input type="text" ng-disabled="chooseButton||dateSelectDisable" ng-class="inputClass"  hr-date-time="dateOptions" ng-model="beginDate"> 至<input type="text" ng-disabled="chooseButton||dateSelectDisable" ng-class="inputClass"  hr-date-time="dateOptions" ng-model="endDate"> <select style="width: 70px;" ui-select2 ng-disabled="chooseButton"  ng-init="chooseDatepack=\'0\'" ng-model="chooseDatepack"><option value="-1">昨天</option><option value="0">今天</option><option value="1" ng-show="tomorrowshow">明天</option><option value="2">其它</option> </select></span>',
        scope: {
            beginDate: '=',//开始时间
            endDate: '=',//结束时间
            dateOptions: '=',//datepicks各属性
            inputClass: '=',//input样式
            chooseButton: '='//快捷按钮禁用条件，不需要可以不传进来
        },

        link: function (scope, element, attrs, controller) {
            scope.tomorrowshow = true;
            scope.todayshow = true;
            scope.yesterdayshow = true;

            var today = new Date($filter('date')(new Date(), 'yyyy-MM-dd') + " 00:00:00");
            var todayEnd = new Date($filter('date')(new Date(), 'yyyy-MM-dd') + " 23:59:59");
            var tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
            var tomorrowEnd = new Date($filter('date')(tomorrow, 'yyyy-MM-dd') + " 23:59:59");
            var yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
            var yesterdayEnd = new Date($filter('date')(yesterday, 'yyyy-MM-dd') + " 23:59:59");
            if (isNull(scope.dateOptions)) {
                scope.dateOptions = [];
            }
            //当设置最大值不为空时，若生成的时间大于最大值，不显示该选项
            if (!isNull(scope.dateOptions.maxDate) && scope.dateOptions.maxDate < today) {
                scope.todayshow = false;
            }
            //当设置最小值不为空时，若生成的时间小于最小值，给出提示
            if (!isNull(scope.dateOptions.maxDate) && scope.dateOptions.minDate > today) {
                scope.todayshow = false;
            }

            //当设置最大值不为空时，若生成的时间大于最大值，不显示该选项
            if (!isNull(scope.dateOptions.maxDate) && scope.dateOptions.maxDate < todayEnd) {
                scope.todayshow = false;
            }
            //当设置最小值不为空时，若生成的时间小于最小值，给出提示
            if (!isNull(scope.dateOptions.maxDate) && scope.dateOptions.minDate > todayEnd) {
                scope.todayshow = false;
            }

            //当设置最大值不为空时，若生成的时间大于最大值，不显示该选项
            if (!isNull(scope.dateOptions.maxDate) && scope.dateOptions.maxDate < tomorrow) {
                scope.tomorrowshow = false;
            }
            //当设置最小值不为空时，若生成的时间小于最小值，给出提示
            if (!isNull(scope.dateOptions.maxDate) && scope.dateOptions.minDate > tomorrow) {
                scope.tomorrowshow = false;
            }

            //当设置最大值不为空时，若生成的时间大于最大值，不显示该选项
            if (!isNull(scope.dateOptions.maxDate) && scope.dateOptions.maxDate < tomorrowEnd) {
                scope.tomorrowshow = false;
            }
            //当设置最小值不为空时，若生成的时间小于最小值，给出提示
            if (!isNull(scope.dateOptions.maxDate) && scope.dateOptions.minDate > tomorrowEnd) {
                scope.tomorrowshow = false;
            }

            //当设置最大值不为空时，若生成的时间大于最大值，不显示该选项
            if (!isNull(scope.dateOptions.maxDate) && scope.dateOptions.maxDate < yesterday) {
                scope.yesterdayshow = false;
            }
            //当设置最小值不为空时，若生成的时间小于最小值，给出提示
            if (!isNull(scope.dateOptions.maxDate) && scope.dateOptions.minDate > yesterday) {
                scope.yesterdayshow = false;
            }
            //当设置最大值不为空时，若生成的时间大于最大值，不显示该选项
            if (!isNull(scope.dateOptions.maxDate) && scope.dateOptions.maxDate < yesterdayEnd) {
                scope.yesterdayshow = false;
            }
            //当设置最小值不为空时，若生成的时间小于最小值，给出提示
            if (!isNull(scope.dateOptions.maxDate) && scope.dateOptions.minDate > yesterdayEnd) {
                scope.yesterdayshow = false;
            }

            scope.$watch('chooseDatepack', function (newValue, oldValue) {
                scope.dateSelectDisable = true;
                var toDate = null;
                var toDateEnd = null;
                if (newValue == 0) {
                    //今天
                    toDate = today;
                    toDateEnd = todayEnd;
                } else if (newValue == 1) {
                    //明天
                    toDate = tomorrow;
                    toDateEnd = tomorrowEnd;
                } else if (newValue == 2) {
                    //其他
                    scope.dateSelectDisable = false;

                    return;
                } else if (newValue == -1) {
                    //昨天
                    toDate = yesterday;
                    toDateEnd = yesterdayEnd;
                }
                var dateformat = "";
                if (!isNull(scope.dateOptions.dateFormat)) {
                    //为了处理  yy==yyyy  mm==MM的情况
                    dateformat = scope.dateOptions.dateFormat.replace("yyyy", "yy").replace("yy", "yyyy").replace("mm", "MM") + " ";
                }
                if (!isNull(scope.dateOptions.timeFormat)) {
                    dateformat += scope.dateOptions.timeFormat;
                }
                //若未传入格式，默认yyyy-MM-dd
                if (dateformat == "") {
                    dateformat = "yyyy-MM-dd";
                }

                scope.beginDate = $filter('date')(toDate, dateformat);
                scope.endDate = $filter('date')(toDateEnd, dateformat);
            });

        }
    };
}]);

/**
 * hr-date-input输入框验证
 */
angular.module('hr.directives')
    .value('uiMaskConfig', {
        'maskDefinitions': {
            '9': /\d/,
            'A': /[a-zA-Z]/,
            '*': /[a-zA-Z0-9]/,
            'B': /([0-9]{1})/,
            'C': /([0-1])/,
            'D': /([0-3])/,
            'E': /([0-2])/,
            'F': /([0-5])/
        }
    })
    .directive('hrDateInput', ['uiMaskConfig', function (maskConfig) {
        return {
            priority: 100,
            require: 'ngModel',
            restrict: 'A',
            compile: function uiMaskCompilingFunction() {
                var options = maskConfig;

                return function uiMaskLinkingFunction(scope, iElement, iAttrs, controller) {
                    var maskProcessed = false, eventsBound = false,
                        maskCaretMap, maskPatterns, maskPlaceholder, maskComponents,
                    // Minimum required length of the value to be considered valid
                        minRequiredLength,
                        value, valueMasked, isValid,
                    // Vars for initializing/uninitializing
                        originalPlaceholder = "",
                        originalMaxlength = iAttrs.maxlength,
                    // Vars used exclusively in eventHandler()
                        oldValue, oldValueUnmasked, oldCaretPosition, oldSelectionLength, inputStatus, initCount = 0;

                    function initialize(maskAttr) {
                        inputStatus = maskAttr === "date" ? "日期时间" : "日期";
                        maskAttr = maskAttr === "date" ? "BBBB-CB-DB EB:FB:FB" : "BBBB-CB-DB";
                        if (!angular.isDefined(maskAttr)) {
                            return uninitialize();
                        }
                        processRawMask(maskAttr);
                        if (!maskProcessed) {
                            return uninitialize();
                        }
                        initializeElement();
                        bindEventListeners();
                        return true;
                    }

                    function initPlaceholder(placeholderAttr) {
                        if (!angular.isDefined(placeholderAttr)) {
                            return;
                        }

//                        maskPlaceholder = placeholderAttr;

                        // If the mask is processed, then we need to update the value
                        if (maskProcessed) {
                            eventHandler();
                        }
                    }

                    function formatter(fromModelValue) {
                        if (!maskProcessed) {
                            return fromModelValue;
                        }
                        value = unmaskValue(fromModelValue || '');
                        isValid = validateValue(value);
                        controller.$setValidity('mask', isValid);
                        return isValid && value.length ? maskValue(value) : undefined;
                    }

                    function parser(fromViewValue) {
                        if (!maskProcessed) {
                            return fromViewValue;
                        }
                        value = unmaskValue(fromViewValue || '');
                        isValid = validateValue(value);
                        // We have to set viewValue manually as the reformatting of the input
                        // value performed by eventHandler() doesn't happen until after
                        // this parser is called, which causes what the user sees in the input
                        // to be out-of-sync with what the controller's $viewValue is set to.
                        controller.$viewValue = value.length ? maskValue(value) : '';
                        controller.$setValidity('mask', isValid);
                        if (value === '' && controller.$error.required !== undefined) {
                            controller.$setValidity('required', false);
                        }
                        if (parseInt(controller.$viewValue) === 0) {
                            controller.$viewValue = undefined;
                        }
                        return isValid ? controller.$viewValue : undefined;
                    }

                    var linkOptions = {};

                    if (iAttrs.uiOptions) {
                        linkOptions = scope.$eval('[' + iAttrs.uiOptions + ']');
                        if (angular.isObject(linkOptions[0])) {
                            // we can't use angular.copy nor angular.extend, they lack the power to do a deep merge
                            linkOptions = (function (original, current) {
                                for (var i in original) {
                                    if (Object.prototype.hasOwnProperty.call(original, i)) {
                                        if (!current[i]) {
                                            current[i] = angular.copy(original[i]);
                                        } else {
                                            angular.extend(current[i], original[i]);
                                        }
                                    }
                                }
                                return current;
                            })(options, linkOptions[0]);
                        }
                    } else {
                        linkOptions = options;
                    }
                    iAttrs.$observe('hrDateInput', initialize);
                    iAttrs.$observe('placeholder', initPlaceholder);
                    controller.$formatters.push(formatter);
                    controller.$parsers.push(parser);

                    function uninitialize() {
                        maskProcessed = false;
                        unbindEventListeners();

                        if (angular.isDefined(originalPlaceholder)) {
                            iElement.attr('placeholder', originalPlaceholder);
                        } else {
                            iElement.removeAttr('placeholder');
                        }

                        if (angular.isDefined(originalMaxlength)) {
                            iElement.attr('maxlength', originalMaxlength);
                        } else {
                            iElement.removeAttr('maxlength');
                        }

                        iElement.val(controller.$modelValue);
                        controller.$viewValue = controller.$modelValue;
                        return false;
                    }

                    function initializeElement() {
                        value = oldValueUnmasked = unmaskValue(controller.$modelValue || '');
                        valueMasked = oldValue = maskValue(value);
                        isValid = validateValue(value);
                        var viewValue = isValid && value.length ? valueMasked : '';
                        if (iAttrs.maxlength) { // Double maxlength to allow pasting new val at end of mask
                            iElement.attr('maxlength', maskCaretMap[maskCaretMap.length - 1] * 2);
                        }
                        iElement.attr('placeholder', maskPlaceholder);
                        iElement.val(viewValue);
                        controller.$viewValue = viewValue;
                        // Not using $setViewValue so we don't clobber the model value and dirty the form
                        // without any kind of user interaction.
                    }

                    function bindEventListeners() {
                        if (eventsBound) {
                            return;
                        }
                        iElement.bind('blur', blurHandler);
                        iElement.bind('mousedown mouseup', mouseDownUpHandler);
                        iElement.bind('input keyup click focus', eventHandler);
                        eventsBound = true;
                    }

                    function unbindEventListeners() {
                        if (!eventsBound) {
                            return;
                        }
                        iElement.unbind('blur', blurHandler);
                        iElement.unbind('mousedown', mouseDownUpHandler);
                        iElement.unbind('mouseup', mouseDownUpHandler);
                        iElement.unbind('input', eventHandler);
                        iElement.unbind('keyup', eventHandler);
                        iElement.unbind('click', eventHandler);
                        iElement.unbind('focus', eventHandler);
                        eventsBound = false;
                    }

                    function validateValue(value) {
                        // Zero-length value validity is ngRequired's determination
                        return value.length ? value.length >= minRequiredLength : true;
                    }

                    function unmaskValue(value) {
                        var valueUnmasked = '',
                            maskPatternsCopy = maskPatterns.slice();
                        // Preprocess by stripping mask components from value
                        value = value.toString();
                        angular.forEach(maskComponents, function (component) {
                            value = value.replace(component, '');
                        });
                        var tempValue = angular.copy(value);
                        var caretPos = getCaretPosition(iElement[0]) || 0;
                        if (caretPos <= 5) {
                            caretPos = caretPos;
                        } else if (caretPos <= 8) {
                            caretPos = caretPos - 1;
                        } else if (caretPos <= 11) {
                            caretPos = caretPos - 2;
                        } else if (caretPos <= 14) {
                            caretPos = caretPos - 3;
                        } else if (caretPos <= 17) {
                            caretPos = caretPos - 4;
                        } else if (caretPos <= 19) {
                            caretPos = caretPos - 5;
                        }
                        if (value.length > 14 || (value.length > 8 && value.length < 14)) {
                            value = value.slice(0, caretPos) + value.slice(caretPos + 1);
                        }
                        angular.forEach(value.split(''), function (chr) {
                            if (maskPatternsCopy.length && maskPatternsCopy[0].test(chr)) {
                                valueUnmasked += chr;
                                maskPatternsCopy.shift();
                            }
                        });
                        if ((tempValue.length > 14 && valueUnmasked.length < 14) || (tempValue.length > 8 && valueUnmasked.length < 8 && tempValue.length < 14)) {
                            valueUnmasked = tempValue.slice(0, caretPos - 1) + tempValue.slice(caretPos);
                        }
                        if (!((parseInt(valueUnmasked.slice(0, 4)) % 4 === 0 && parseInt(valueUnmasked.slice(0, 4)) % 100 !== 0) || parseInt(valueUnmasked.slice(0, 4)) % 400 === 0) && parseInt(valueUnmasked.slice(4, 6)) === 2) {
                            if (parseInt(valueUnmasked.charAt(6)) === 2 && parseInt(valueUnmasked.charAt(7)) === 9) {
                                valueUnmasked = oldValueUnmasked;
                            }
                        }
                        if (inputStatus === "日期") {
                            var eightZero = "00000000";
                            valueUnmasked = valueUnmasked + eightZero.slice(valueUnmasked.length);
                        } else if (inputStatus === "日期时间") {
                            var fourteenZero = "00000000000000";
                            valueUnmasked = valueUnmasked + fourteenZero.slice(valueUnmasked.length);
                        }
                        return valueUnmasked;
                    }

                    function maskValue(unmaskedValue) {
                        var valueMasked = '',
                            maskCaretMapCopy = maskCaretMap.slice();
                        angular.forEach(maskPlaceholder.split(''), function (chr, i) {
                            if (unmaskedValue.length && i === maskCaretMapCopy[0]) {
                                valueMasked += unmaskedValue.charAt(0) || '_';
                                unmaskedValue = unmaskedValue.substr(1);
                                maskCaretMapCopy.shift();
                            }
                            else {
                                valueMasked += chr;
                            }
                        });
                        return valueMasked;
                    }

                    function getPlaceholderChar(i) {
//            var placeholder = iAttrs.placeholder;
                        var placeholder = "";

                        if (typeof placeholder !== "undefined" && placeholder[i]) {
                            return placeholder[i];
                        } else {
                            return "_";
                        }
                    }

                    // Generate array of mask components that will be stripped from a masked value
                    // before processing to prevent mask components from being added to the unmasked value.
                    // E.g., a mask pattern of '+7 9999' won't have the 7 bleed into the unmasked value.
                    // If a maskable char is followed by a mask char and has a mask
                    // char behind it, we'll split it into it's own component so if
                    // a user is aggressively deleting in the input and a char ahead
                    // of the maskable char gets deleted, we'll still be able to strip
                    // it in the unmaskValue() preprocessing.
                    function getMaskComponents() {
                        return maskPlaceholder.replace(/[_]+/g, '_').replace(/([^_]+)([a-zA-Z0-9])([^_])/g, '$1$2_$3').split('_');
                    }

                    function processRawMask(mask) {
                        var characterCount = 0;

                        maskCaretMap = [];
                        maskPatterns = [];
                        maskPlaceholder = '';

                        if (typeof mask === 'string') {
                            minRequiredLength = 0;

                            var isOptional = false,
                                splitMask = mask.split("");

                            angular.forEach(splitMask, function (chr, i) {
                                if (linkOptions.maskDefinitions[chr]) {
                                    maskCaretMap.push(characterCount);

                                    maskPlaceholder += getPlaceholderChar(i);
                                    maskPatterns.push(linkOptions.maskDefinitions[chr]);

                                    characterCount++;
                                    if (!isOptional) {
                                        minRequiredLength++;
                                    }
                                }
                                else if (chr === "?") {
                                    isOptional = true;
                                }
                                else {
                                    maskPlaceholder += chr;
                                    characterCount++;
                                }
                            });
                        }
                        // Caret position immediately following last position is valid.
                        maskCaretMap.push(maskCaretMap.slice().pop() + 1);
                        maskComponents = getMaskComponents();
                        maskProcessed = maskCaretMap.length > 1 ? true : false;
                    }

                    function blurHandler() {
                        oldCaretPosition = 0;
                        oldSelectionLength = 0;
                        /*if (!isValid || value.length === 0) {
                         valueMasked = '';
                         iElement.val('');
                         scope.$apply(function (){
                         controller.$setViewValue('');
                         });
                         }*/
                    }

                    function mouseDownUpHandler(e) {
                        if (e.type === 'mousedown') {
                            iElement.bind('mouseout', mouseoutHandler);
                        } else {
                            iElement.unbind('mouseout', mouseoutHandler);
                        }
                    }

                    iElement.bind('mousedown mouseup', mouseDownUpHandler);

                    function mouseoutHandler() {
                        oldSelectionLength = getSelectionLength(this);
                        iElement.unbind('mouseout', mouseoutHandler);
                    }

                    function eventHandler(e) {
                        e = e || {};
                        // Allows more efficient minification
                        var eventWhich = e.which,
                            eventType = e.type;

                        // Prevent shift and ctrl from mucking with old values
                        if (eventWhich === 16 || eventWhich === 91) {
                            return;
                        }

                        var val = iElement.val(),
                            valOld = oldValue,
                            valMasked,
                            valUnmasked = unmaskValue(val),
                            valUnmaskedOld = oldValueUnmasked,
                            valAltered = false,

                            caretPos = getCaretPosition(this) || 0,
                            caretPosOld = oldCaretPosition || 0,
                            caretPosDelta = caretPos - caretPosOld,
                            caretPosMin = maskCaretMap[0],
                            caretPosMax = maskCaretMap[valUnmasked.length] || maskCaretMap.slice().shift(),

                            selectionLenOld = oldSelectionLength || 0,
                            isSelected = getSelectionLength(this) > 0,
                            wasSelected = selectionLenOld > 0,

                        // Case: Typing a character to overwrite a selection
                            isAddition = (val.length > valOld.length) || (selectionLenOld && val.length > valOld.length - selectionLenOld),
                        // Case: Delete and backspace behave identically on a selection
                            isDeletion = (val.length < valOld.length) || (selectionLenOld && val.length === valOld.length - selectionLenOld),
                            isSelection = (eventWhich >= 37 && eventWhich <= 40) && e.shiftKey, // Arrow key codes

                            isKeyLeftArrow = eventWhich === 37,
                        // Necessary due to "input" event not providing a key code
                            isKeyBackspace = eventWhich === 8 || (eventType !== 'keyup' && isDeletion && (caretPosDelta === -1)),
                            isKeyDelete = eventWhich === 46 || (eventType !== 'keyup' && isDeletion && (caretPosDelta === 0 ) && !wasSelected),

                        // Handles cases where caret is moved and placed in front of invalid maskCaretMap position. Logic below
                        // ensures that, on click or leftward caret placement, caret is moved leftward until directly right of
                        // non-mask character. Also applied to click since users are (arguably) more likely to backspace
                        // a character when clicking within a filled input.
                            caretBumpBack = (isKeyLeftArrow || isKeyBackspace || eventType === 'click') && caretPos > caretPosMin;

                        oldSelectionLength = getSelectionLength(this);

                        // These events don't require any action
                        if (isSelection || (isSelected && (eventType === 'click' || eventType === 'keyup'))) {
                            return;
                        }


                        // Value Handling
                        // ==============

                        // User attempted to delete but raw value was unaffected--correct this grievous offense
                        if ((eventType === 'input') && isDeletion && !wasSelected && valUnmasked === valUnmaskedOld) {
                            while (isKeyBackspace && caretPos > caretPosMin && !isValidCaretPosition(caretPos)) {
                                caretPos--;
                            }
                            while (isKeyDelete && caretPos < caretPosMax && maskCaretMap.indexOf(caretPos) === -1) {
                                caretPos++;
                            }
                            var charIndex = maskCaretMap.indexOf(caretPos);
                            // Strip out non-mask character that user would have deleted if mask hadn't been in the way.
                            valUnmasked = valUnmasked.substring(0, charIndex) + valUnmasked.substring(charIndex + 1);
                            valAltered = true;
                        }

                        // Caret Repositioning
                        // ===================

                        // Ensure that typing always places caret ahead of typed character in cases where the first char of
                        // the input is a mask char and the caret is placed at the 0 position.
                        if (isAddition && (caretPos <= caretPosMin)) {
                            caretPos = caretPosMin + 1;
                        }

                        if (caretBumpBack) {
                            caretPos--;
                        }

                        // Make sure caret is within min and max position limits
                        caretPos = caretPos > caretPosMax ? caretPosMax : caretPos < caretPosMin ? caretPosMin : caretPos;

                        // Scoot the caret back or forth until it's in a non-mask position and within min/max position limits
                        while (!isValidCaretPosition(caretPos) && caretPos > caretPosMin && caretPos < caretPosMax) {
                            caretPos += caretBumpBack ? -1 : 1;
                        }

                        if ((caretBumpBack && caretPos < caretPosMax) || (isAddition && !isValidCaretPosition(caretPosOld))) {
                            caretPos++;
                        }
                        //Delete Handing
                        var tempCaretPos, value;
                        if (caretPos <= 4) {
                            tempCaretPos = caretPos;
                        } else if (caretPos <= 7) {
                            tempCaretPos = caretPos - 1;
                        } else if (caretPos <= 10) {
                            tempCaretPos = caretPos - 2;
                        } else if (caretPos <= 13) {
                            tempCaretPos = caretPos - 3;
                        } else if (caretPos <= 16) {
                            tempCaretPos = caretPos - 4;
                        } else if (caretPos <= 18) {
                            tempCaretPos = caretPos - 5;
                        }
                        if (eventType === 'input' && (isKeyBackspace || isKeyDelete)) {
                            valUnmasked = oldValueUnmasked.substring(0, tempCaretPos).concat("0") + oldValueUnmasked.substring(tempCaretPos + 1);
                            if (parseInt(valUnmasked.slice(4, 6)) === 0 && parseInt(valUnmasked.slice(6, 8)) !== 0) {
                                valUnmasked = oldValueUnmasked;
                                caretPos = caretPos + 2;
                            }
                            var valueUnmasked1 = parseInt(valUnmasked.slice(0, 4));
                            var valueUnmasked2 = parseInt(valUnmasked.slice(4, 6));
                            if (!((valueUnmasked1 % 4 === 0 && valueUnmasked1 % 100 !== 0) || valueUnmasked1 % 400 === 0) && valueUnmasked2 === 2) {
                                if (parseInt(valUnmasked.charAt(6)) === 2 && parseInt(valUnmasked.charAt(7)) === 9) {
                                    valUnmasked = oldValueUnmasked;
                                    caretPos = isKeyBackspace ? caretPos + 1 : caretPos;
                                }
                            }
                        }
                        //非删除操作
                        if (eventType === 'input' && !isKeyBackspace && !isKeyDelete) {
                            value = val.toString();
                            angular.forEach(maskComponents, function (component) {
                                value = value.replace(component, '');
                            });
                            var valueUnmasked1 = parseInt(valUnmasked.slice(0, 4));
                            var valueUnmasked2 = parseInt(valUnmasked.slice(4, 6));
                            var valueUnmasked4 = parseInt(valUnmasked.charAt(4));
                            var valueUnmasked5 = parseInt(valUnmasked.charAt(5));
                            var valueUnmasked6 = parseInt(valUnmasked.charAt(6));
                            var valueUnmasked7 = parseInt(valUnmasked.charAt(7));
                            var valueUnmasked8 = parseInt(valUnmasked.charAt(8));
                            var valueUnmasked9 = parseInt(valUnmasked.charAt(9));
                            if (value.length > 14 || (value.length > 8 && value.length < 14)) {
                                value = value.slice(0, tempCaretPos) + value.slice(tempCaretPos + 1);
                            }
                            if (valUnmasked === oldValueUnmasked && valUnmasked !== value) {
                                caretPos = caretPos === 5 || caretPos === 8 ? caretPos - 2 : caretPos - 1;
                            }
                            if (parseInt(valUnmasked.slice(4, 6)) === 0 && parseInt(valUnmasked.slice(6, 8)) !== 0) {
                                valUnmasked = oldValueUnmasked;
                                caretPos = caretPos === 5 || caretPos === 8 ? caretPos - 2 : caretPos - 1;
                            } else if (valueUnmasked4 === 1 && valueUnmasked5 > 2) {
                                valUnmasked = oldValueUnmasked;
                                caretPos = caretPos === 5 || caretPos === 8 ? caretPos - 2 : caretPos - 1;
                            }
                            if (((valueUnmasked1 % 4 === 0 && valueUnmasked1 % 100 !== 0) || valueUnmasked1 % 400 === 0) && valueUnmasked2 === 2) {
                                if (valueUnmasked6 >= 3) {
                                    valUnmasked = oldValueUnmasked;
                                    caretPos = caretPos === 5 || caretPos === 8 ? caretPos - 2 : caretPos - 1;
                                }
                            } else if (!valUnmasked.slice(0, 8).match(/([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})(((0[13578]|1[02])(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(0[1-9]|[12][0-9]|30))|(02(0[1-9]|[1][0-9]|2[0-8])))/)) {
                                if (valueUnmasked2 === 2 && valueUnmasked6 > 2) {
                                    valUnmasked = oldValueUnmasked;
                                    caretPos = caretPos === 5 || caretPos === 8 ? caretPos - 2 : caretPos - 1;
                                } else if (valueUnmasked2 === 2 && ((valueUnmasked6 === 2 && valueUnmasked7 > 8) || valueUnmasked6 > 2)) {
                                    valUnmasked = oldValueUnmasked;
                                    caretPos = caretPos === 5 || caretPos === 8 ? caretPos - 2 : caretPos - 1;
                                } else if (valueUnmasked6 === 3 && valueUnmasked6 > 1) {
                                    valUnmasked = oldValueUnmasked;
                                    caretPos = caretPos === 5 || caretPos === 8 ? caretPos - 2 : caretPos - 1;
                                } else if (valUnmasked.slice(4, 6).match(/0[469]|11/) && valueUnmasked6 === 3 && valueUnmasked6 > 0) {
                                    valUnmasked = oldValueUnmasked;
                                    caretPos = caretPos === 5 || caretPos === 8 ? caretPos - 2 : caretPos - 1;
                                }
                            }
                            if (valueUnmasked8 === 2 && valueUnmasked9 >= 4) {
                                valUnmasked = oldValueUnmasked;
                                caretPos = caretPos === 5 || caretPos === 8 || caretPos === 14 ? caretPos - 2 : caretPos - 1;
                            }
                        }

                        // Update values
                        valMasked = maskValue(valUnmasked);

                        oldValue = valMasked;
                        oldValueUnmasked = valUnmasked;
                        iElement.val(valMasked);
                        if (valAltered) {
                            // We've altered the raw value after it's been $digest'ed, we need to $apply the new value.
                            scope.$apply(function () {
                                controller.$setViewValue(valUnmasked);
                            });
                        }
                        if (initCount === 0 && eventType !== 'input') {
                            caretPos = 0;
                            initCount++;
                        }
                        oldCaretPosition = caretPos;
                        setCaretPosition(this, caretPos);
                    }

                    function isValidCaretPosition(pos) {
                        return maskCaretMap.indexOf(pos) > -1;
                    }

                    function getCaretPosition(input) {
                        if (input.selectionStart !== undefined) {
                            return input.selectionStart;
                        } else if (document.selection) {
                            // Curse you IE
                            input.focus();
                            var selection = document.selection.createRange();
                            selection.moveStart('character', -input.value.length);
                            return selection.text.length;
                        }
                        return 0;
                    }

                    function setCaretPosition(input, pos) {
                        if (input.offsetWidth === 0 || input.offsetHeight === 0) {
                            return; // Input's hidden
                        }
                        if (input.setSelectionRange) {
                            input.focus();
                            input.setSelectionRange(pos, pos);
                        }
                        else if (input.createTextRange) {
                            // Curse you IE
                            var range = input.createTextRange();
                            range.collapse(true);
                            range.moveEnd('character', pos);
                            range.moveStart('character', pos);
                            range.select();
                        }
                    }

                    function getSelectionLength(input) {
                        if (input.selectionStart !== undefined) {
                            return (input.selectionEnd - input.selectionStart);
                        }
                        if (document.selection) {
                            return (document.selection.createRange().text.length);
                        }
                        return 0;
                    }

                    // https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/indexOf
                    if (!Array.prototype.indexOf) {
                        Array.prototype.indexOf = function (searchElement /*, fromIndex */) {
                            "use strict";
                            if (this === null) {
                                throw new TypeError();
                            }
                            var t = Object(this);
                            var len = t.length >>> 0;
                            if (len === 0) {
                                return -1;
                            }
                            var n = 0;
                            if (arguments.length > 1) {
                                n = Number(arguments[1]);
                                if (n !== n) { // shortcut for verifying if it's NaN
                                    n = 0;
                                } else if (n !== 0 && n !== Infinity && n !== -Infinity) {
                                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
                                }
                            }
                            if (n >= len) {
                                return -1;
                            }
                            var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
                            for (; k < len; k++) {
                                if (k in t && t[k] === searchElement) {
                                    return k;
                                }
                            }
                            return -1;
                        };
                    }

                };
            }
        };
    }
    ]);

/**
 * focus时，input:text内容全选
 */
angular.module('hr.directives').directive('autoselect', [function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (element.is("input") && attr.type === "text") {
                var selected = false;
                var time = parseInt(attr["autoselect"]);
                element.bind("mouseup", function (e) {
                    if (selected) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    selected = false;
                });
                if (time > 0) {
                    element.bind("focus", function (event) {
                        setTimeout(function () {
                            selected = true;
                            event.target.select();
                        }, time);
                    });
                } else {
                    element.bind("focus", function (event) {
                        selected = true;
                        event.target.select();
                    });

                }
            }
        }
    };
}]);

/**
 * hrAutofocus，自动获得焦点，如果是select2，应使用hr-autofocus="select2"，其它元素直接加hr-autofocus就可以。
 */
angular.module('hr.directives').directive('hrAutofocus', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            setTimeout(function () {
                if (attr["hrAutofocus"] === "select2") {
                    element.select2("focus");
                } else {
                    element.focus();
                }
            }, 100);

        }
    };
}]);

/**
 * clickOutside指令，外部点击时触发,click-outside="func()"
 * func为自己指定的方法，一般为关闭当前层的方法，inside-id=""
 * 点击指定id的输入框时，当前层不关闭
 */
angular.module('hr.directives').directive('clickOutside', ['$document', function ($document) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var isCurrentElement = false;
            $(element).on('mousedown', function (e) {
                isCurrentElement = true;
                //e.preventDefault();
                e.stopPropagation();
            });

            $(element).on('mouseup', function (e) {
                isCurrentElement = false;
            });

            $("#" + attrs["insideId"]).on('mousedown', function (e) {
                isCurrentElement = false;
                e.stopPropagation();
            });

            $("#" + attrs["insideId"]).on('blur', function (e) {
                if (!isCurrentElement) {
                    setTimeout(function () {
                        scope.$apply(attrs.clickOutside);
                    });
                }
                isCurrentElement = false;
            });

            $document.on('mousedown', function () {
                scope.$apply(attrs.clickOutside);
                isCurrentElement = false;
            });
        }
    };
}]);

/**
 * clickInside指令，内部点击时触发
 */
angular.module('hr.directives').directive('clickInside', ['$document', function ($document) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, ctrl) {
            $(element).bind('focus click', function (e) {
                scope.$apply(attrs.clickInside);
                e.stopPropagation();
            });
        }
    };
}]);

angular.module('hr.directives').directive('scrollInside', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, ctrl) {
            $(element).bind('scroll', function (e) {
                scope.$apply(attrs.scrollInside);
                e.stopPropagation();
            });
        }
    };
});


/**
 * bindKeyBoardEvent指令，内部获得焦点或者点击时触发
 */
angular.module('hr.directives').directive('bindKeyBoardEvent', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, ctrl) {
            $(element).bind('focus click', function (e) {
                scope.$apply(attrs.bindKeyBoardEvent);
                e.stopPropagation();
            });
        }
    };
});

/**
 *使元素可拖动
 */
angular.module('hr.directives').directive('hrDraggable', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (attr["modal"] !== undefined) {
                scope.$watch(attr["modal"], function (newValue) {
                    if (newValue) {
                        setTimeout(function () {
                            $(".modal").draggable({handle: ".modal-header"});
                        }, 100);
                    } else {
                        $(".modal").attr("style", "");
                    }
                }, true);
                $(window).resize(function () {
                    $(".modal").attr("style", "");
                });
            } else {
                element.draggable($parse(attr["hrDraggable"])(scope));
            }
        }
    };
}]);

/**
 *使元素可拖拽改变尺寸大小。
 */
angular.module('hr.directives').directive('hrResizable', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (attr["modal"] !== undefined) {
                scope.$watch(attr["modal"], function (newValue) {
                    if (newValue) {
                        setTimeout(function () {
                            $(".modal").resizable({handles: "e, w"});
                        }, 100);
                    }
                }, true);
            } else {
                element.resizable($parse(attr["hrResizable"])(scope));
            }
        }
    };
}]);

/**
 * 设置table每个列的宽度
 */
angular.module('hr.directives').directive('hrSetTableWidth', [function () {
    return {
        restrict: 'A',
        compile: function (tElement, tAttrs, transclude) {
            var widthArray = eval(tAttrs["hrSetTableWidth"]);
            $(tElement).find('tr').first().children().each(function (index, dom) {
                $(dom).width(widthArray[index]);
            });
            return function (scope, element, attrs) {
            };
        }
    };
}]);

/**
 * 回车循环
 */
angular.module('hr.directives').directive('enterLoop', ['$debounce', function ($debounce) {
    var select2Open = false;

    function bindEnterLoopEvent(element, scope) {
        if ($(element).attr('ui-select2') !== undefined) {
            $(element).on('select2-selecting', function () {
                $debounce(function () {
                    focusNextDom(element, scope);
                }, 100);
            });
            $(element).on('select2-opening', function (e) {
                if (event instanceof KeyboardEvent && event.which == 13) {
                    e.preventDefault();
                    $debounce(function () {
                        focusNextDom(element, scope);
                    }, 100);
                }
            });
            return;
        }
        if ($(element).is('input[type="checkbox"]')) {
            $(element).click(function () {
                setItemFocus($(this));
            });
        }
    };

    function setItemFocus(dom) {
        var itemDom = $(dom);
        if (itemDom.attr("enterindex") === "-1") {
            return;
        }
        if (itemDom.hasClass('select2-offscreen') || itemDom.hasClass("select2-container")) {
            $("#select2-drop-mask").click();
            if (select2Open) {
                itemDom.select2('open');
            } else {
                itemDom.select2('focus');
            }
            return;
        }
        if (itemDom.is("input")) {
            var type = itemDom.attr("type");
            switch (type) {
                case"radio":
                case"button":
                case"checkbox":
                case"submit":
                    itemDom.focus();
                    break;
                case"text":
                case"password":
                    itemDom.focus();
                    itemDom.select();
                    break;
                default :
                    itemDom.focus();
                    itemDom.select();
            }
        } else if (itemDom.is("select") || itemDom.is("button") || itemDom.is("a")) {
            itemDom.focus();
        } else if (itemDom.is("textarea")) {
            itemDom.focus();
            itemDom.select();
        }
    };

    var focusNextDom = function (element, scope) {
        var loopName = element[0].attributes["enter-loop"].nodeValue;
        var loopDoms = $("[enter-loop='" + loopName + "']");
        var sortedLoopDoms = loopDoms.toArray().sort(function (obj1, obj2) {
            return parseInt($(obj1).attr('enterindex'), 10) - parseInt($(obj2).attr('enterindex'), 10);
        });
        select2Open = sortedLoopDoms.some(function (item, index) {
            if ($(item).attr("select2-open") && $(item).attr("select2-open") === "true") {
                return true;
            }
        });
        var length = sortedLoopDoms.length;
        var currentIndex = $(sortedLoopDoms).index(element);
        var nextIndex = (currentIndex === length - 1) ? 0 : currentIndex + 1;
        var nextDom = $(sortedLoopDoms[nextIndex]);
        var option = element.attr('enter-option');
        if (option !== undefined) {
            var condition = scope.$eval(option);
            switchFun(condition, element, nextDom, loopName, scope);
        } else {
            checkDom(element, nextDom, loopName, scope);
        }
    };
    var switchFun = function (condition, element, nextDom, loopName, scope) {
        switch (typeof condition) {
            case "boolean" :
                if (condition) {
                    checkDom(element, element, loopName, scope);
                } else {
                    $(element).blur();
                }
                break;
            case "string" :
                if (condition.trim() == "") {
                    checkDom(element, nextDom, loopName, scope);
                } else {
                    checkDom(element, $("#" + condition.trim()), loopName, scope)
                }
                break;
            case "function" :
                condition(function (result) {
                    switchFun(result, element, nextDom, loopName, scope);
                });
                break;
            default :
                checkDom(element, nextDom, loopName, scope);
        }
    };
    var checkDom = function (element, nextDom, loopName, scope) {
        if ($(element).attr("ui-date") !== undefined || $(element).attr("hr-date-time") !== undefined) {
            $(element).datepicker("hide");
        }
        if (nextDom.attr('disabled') === 'disabled' || nextDom.attr('readonly') === 'readonly' || (nextDom.css("display") === "none" && !nextDom.attr("ng-grid-select2")) ||
            nextDom.hasClass('select2-container-disabled')) {
            focusNextDom(nextDom, scope);
            return;
        }
        setItemFocus(nextDom);
    };
    var setOptions = function (element) {
        if (element.attr("is-open") == true) {

        }
    };
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            setOptions(element);
            bindEnterLoopEvent(element, scope);
            if ($(element).attr("ui-date") !== undefined || $(element).attr("hr-date-time") !== undefined) {
                $(element).on("keydown", function (e) {
                    if (e.keyCode === 13) {
                        $debounce(function () {
                            focusNextDom(element, scope);
                        }, 100);
                        e.stopPropagation();
                    }
                });
                return false;
            }
//            if ($(element).attr("is-grid")) {
//                $(element).on("keydown", function (e) {
//                    if (e.keyCode === 13) {
//                        e.stopPropagation();
//                    }
//                });
//            }
            $(element).on("keydown", function (e) {
                if (e.keyCode === 13) {
                    $debounce(function () {
                        focusNextDom(element, scope);
                    }, 100);
                }
            });
        }
    };
}]);

///**
// * 码表辅助输入
// */
//angular.module('hr.directives').directive('hrdict', ["HrDictIndexedDbService", "$templateCache", "$compile", "$http",
//    function (HrDictIndexedDbService, $templateCache, $compile, $http) {
//        return {
//            required: 'ngModel',
//            restrict: "E",
//            scope: {
//                ngModel: '=',
//                callback: '&',
//                hrReadonly: "="
//            },
//            link: function (scope, element, attr) {
//                var template = angular.element($templateCache.get('hrdict.html'));
//                if (element.attr("enter-loop")) {
//                    template.find("select").attr("enter-loop", element.attr("enter-loop"));
//                    template.find("select").attr("enterindex", element.attr("enterindex"));
//                    element.removeAttr("enter-loop");
//                    if (element.attr("enter-option")) {
//                        template.find("select").attr("enter-option", "$parent.$parent." + element.attr("enter-option"));
//                    }
//                }
//                if (element.attr("id")) {
//                    template.find("select").attr("id", element.attr("id"));
//                    element.removeAttr("id");
//                }
//                element.append(template);
//                scope.modelConfig = attr.modelconfig;
//                $compile(template)(scope);
//                function _updateDictCodeDbData() {
//                    var arrayTmp = [];
//                    hrIndexedDB("BASE_CODE_DICT").getStoreDataByIndex("codeTypeName", attr.tablename, function (data) {
//                        if (!data.length) {
//                            $http.get(Path.getUri("api/base-code-dict/code-type-name/") + attr.tablename).success(function (Oracldata) {
//                                Oracldata.push({codeId: "", codeName: ""});
//                                scope.dicts= Oracldata;
//                            })
//                        } else {
//                            data.push({codeId: "", codeName: ""});
//                            scope.$apply(function () {
//                                scope.dicts = data;
//                            });
//                        }
//
//                    });
//
//
//                }
//
//                setTimeout(function () {
//                    _updateDictCodeDbData();
//                }, 100);
//                scope.dictCodeDb = hrIndexedDB("BASE_CODE_DICT");
//                scope.$watch("dictCodeDb.status", function (newvalue, oldvalue) {
//                    console.info("监听到状态变化******" + newvalue);
//                    if (newvalue && newvalue === "success") {
//                        _updateDictCodeDbData();
//                    }
//                });
//            }
//        };
//    }]);
/**
 * 码表辅助输入(重新设计)
 */
angular.module('hr.directives').directive('hrdict', ["hrIndexedDB", "$http", "$parse", "$q", function (hrIndexedDB, $http, $parse, $q) {
    //默认的Select2配置
    var defaultHrdictSelect2Options = {
        id: "codeId",//指定那个字段作为本记录的id，
        placeholder: "　",
        formatResult: function (dict) {
            return "<span class='select2-input'>" + dict.codeName + "</span>";
        },//格式化显示列表样式函数
        formatSelection: function (dict) {
            return "<span class='select2-input'>" + dict.codeName + "</span>";
        }//格式化选中结果样式
    };
    //生成select2（使用input元素定义）中的需要使用的查询函数（query）和初始化函数(initSelection);使用$scope.hrdictData中定义的数据，设置select2的query和initSelection函数。
    //如果$scope.hrdictData有数据，则使用数组中的数据; 如果没有数据，而且给了一个promise，则使用promise
    function query_initSelection($scope, promise, idField) {
        function queryResults(query, reg, result) {//遍历数据，并回调结果
            $scope.hrdictData.forEach(function (dict) {
                if (query.term.length === 0 || reg.test(dict.inputCode)) {
                    result.results.push(dict);
                }
            });
            query.callback(result);
        }

        var dataOption = {};//承载select2中query函数、initSelection函数的对象
        dataOption.query = function (query) {//select2中的查询函数，查询所用数据将由数组$scope.hrdictData来提供
            var result = {results: []};
            var reg = new RegExp(query.term.toUpperCase());
            if ($scope.hrdictData.length) {//如果有数据，则使用数组中的数据
                queryResults(query, reg, result);
            } else if (!$scope.hrdictData.length && promise) {//如果没有数据，而且给了一个promise，则使用promise
                promise.then(function (datas) {
                    queryResults(query, reg, result);
                });
            }
        };
        function selectResult(id, callback) {
            $scope.hrdictData.forEach(function (dict) {
                if (id == dict[idField]) {
                    callback(dict);
                }
            });
        }

        dataOption.initSelection = function (element, callback) {//input元素定义的select2，需要定义的初始化函数
            var id = $(element).val();
            if ($scope.hrdictData.length) {//如果有数据，则使用数组中的数据
                selectResult(id, callback)
            } else if (!$scope.hrdictData.length && promise) {//如果没有数据，而且给了一个promise，则使用promise
                promise.then(function (datas) {
                    selectResult(id, callback)
                });
            }
        };
        return dataOption;
    }

    //获取字典数据，然后给$scope.hrdictData赋值；如果在indexDB里面没有取到值，则发送$http请求取值
    function getDictCodeData($scope, deferred, tableName, $attrs) {
        if ($attrs.source === "1") {
            $http.get(Path.getUri("api/base-code-dict/code-type-name/") + tableName).success(function (data) {
//                data.push({codeId: "", codeName: ""});
                $scope.hrdictData = data;
                deferred.resolve($scope.hrdictData);
            });
        } else {
            hrIndexedDB("BASE_CODE_DICT").getStoreDataByIndex("codeTypeName", tableName, function (data) {
                if (!data || !data.length) {
                    $http.get(Path.getUri("api/base-code-dict/code-type-name/") + tableName).success(function (data) {
//                        data.push({codeId: "", codeName: ""});
                        $scope.hrdictData = data;
                        deferred.resolve($scope.hrdictData);
                    })
                } else {
//                    data.push({codeId: "", codeName: ""});
                    $scope.$apply(function () {
                        $scope.hrdictData = data;
                        deferred.resolve($scope.hrdictData);
                    });
                }
            });
        }
    }

    return {
        required: 'ngModel',
        restrict: "EA",
        template: "<input class=\"select2-container\" ui-select2=\"hrdictSelect2Options\" ng-model=\"MODEL_FIELD\"/>",
        scope: true,
        controller: ["$scope", "$element", "$attrs", function ($scope, $element, $attrs) {
            //根据$attrs.tablename，决定从哪张码表中获取数据，如CHARGE_TYPE_DICT等，提供select2查询所用数据
            $scope.hrdictData = [];//定义变量，查出来的码表数据，将会存储在本变量里面
            var deferred = $q.defer();
            getDictCodeData($scope, deferred, $attrs.tablename, $attrs);
            var promise = deferred.promise;

            //根据$attrs.modelconfig属性，配置ngModel绑定具体的字典值。
            switch ($attrs.modelconfig) {
                case "1" ://设置modelconfig为“1”，取得字典“对象”
                    $scope.hrdictSelect2Options = angular.extend({}, defaultHrdictSelect2Options, query_initSelection($scope, promise, "codeId"));
                    break;
                case "2" ://设置modelconfig为“2”，取得"codeName"值
                    $scope.hrdictSelect2Options = angular.extend({}, defaultHrdictSelect2Options, query_initSelection($scope, promise, "codeName"), {
                        id: "codeName",
                        hrResultType: "id"
                    });
                    break;
                default://不设置modelconfig，默认取得字典“codeId”值
                    $scope.hrdictSelect2Options = angular.extend({}, defaultHrdictSelect2Options, query_initSelection($scope, promise, "codeId"), {
                        id: "codeId",
                        hrResultType: "id"
                    });
            }
        }],
        compile: function (tElement, tAttrs) {
            var tInputElement = tElement.children(0);
            tInputElement.attr("ng-model", "$parent." + tAttrs.ngModel);//强制使用父作用域的ngModel，大家不要自己添加（即对父作用域的ngModel进行读写）

            if (tAttrs.ngChange) {//如果有定义的ngChange，则赋予ngChange功能
                tInputElement.attr("ng-change", tAttrs.ngChange);
            }
            if (tAttrs.ngReadonly) {//如果有定义的ngReadonly，则赋予ngReadonly功能
                tInputElement.attr("ng-readonly", tAttrs.ngReadonly);
            }
            if (tElement.attr("enter-loop")) {
                tInputElement.attr("enter-loop", tElement.attr("enter-loop"));
                tInputElement.attr("enterindex", tElement.attr("enterindex"));
                tElement.removeAttr("enter-loop");
                if (tElement.attr("enter-option")) {
                    tInputElement.attr("enter-option", tElement.attr("enter-option"));//只读的话，不用加$parent
                }
            }
            if (tElement.attr("id")) {
                tInputElement.attr("id", tElement.attr("id"));
                tElement.removeAttr("id");
            }
            //需要自定义样式时  传入此参数   by xut
            if (tElement.attr("className")) {
                tInputElement.addClass(tElement.attr("className"));
            }
        }
    };
}]);
angular.module('hr.directives').directive("hrGlobalKeys", function () {
    return {
        restrict: 'E',
        scope: {},
        template: '<span>(<span class="text-underline" ng-bind="bingKeyValue"/>)</span>',
        replace: true,
        link: function (scope, element, attr) {
            scope.bingKeyValue = HrKeys.getKeyboardByCode(attr.keyname);
        }
    };
});

/**
 * 作为一个元素的属性存在：如果监听的表达式值为true，则将焦点放到本元素上。
 */
angular.module('hr.directives').directive("conditionFocus", [function () {
    return function (scope, element, attrs) {
        var dereg = scope.$watch(attrs.conditionFocus, function (newValue) {
            if (newValue) {
                element.focus();
            }
        });
        element.bind("$destroy", function () {
            if (dereg) {
                dereg();
            }
        });
    };
}]);

/**
 * select2关闭后回调函数
 */
angular.module('hr.directives').directive("select2Close", ["$parse", function ($parse) {
    return {
        restrict: "A",
        compile: function ($element, attr) {
            var fn = $parse(attr["select2Close"]);
            return function (scope, element, attr) {
                element.on("select2-close", function (event) {
                    scope.$apply(function () {
                        fn(scope, {$event: event});
                    });
                });
            };
        }
    };
}]);

/**
 * 如果属性为true，则打开select2
 */
angular.module('hr.directives').directive("conditionSelect2Open", ["$parse", "$timeout", function ($parse, $timeout) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            scope.$watch(attrs.conditionSelect2Open, function (newValue) {
                if (newValue) {
                    $timeout(function () {
                        element.select2("open");
                    }, 100);
                }
            });
        }
    };
}]);

/**
 * 作为一个元素的属性存在：如果监听的表达式值为true，则将本元素中所绑定的ngModel值设为0。
 */
angular.module('hr.directives').directive("resetToZero", ["$parse", function ($parse) {
    return function (scope, element, attrs) {
        var dereg = scope.$watch(attrs.resetToZero, function (newValue) {
            if (newValue) {
                if (attrs.ngModel) {
                    $parse(attrs.ngModel).assign(scope, 0);
                }
            }
        });
        element.bind("$destroy", function () {
            if (dereg) {
                dereg();
            }
        });
    };
}]);


/**
 * 作为一个元素的属性存在：如果监听的表达式值为true，则将本元素中所绑定的ngModel值设为空字符串。
 */
angular.module('hr.directives').directive("resetToEmptyString", ["$parse", function ($parse) {
    return function (scope, element, attrs) {
        var dereg = scope.$watch(attrs.resetToEmptyString, function (newValue) {
            if (newValue) {
                if (attrs.ngModel) {
                    var _getter = $parse(attrs.ngModel);
                    if (_getter(scope)) {
                        _getter.assign(scope, "");
                    } else {
                        _getter.assign(scope.$parent, "");
                    }
                }
            }
        });
        element.bind("$destroy", function () {
            if (dereg) {
                dereg();
            }
        });
    };
}]);

/**
 * TODO:作为一个元素的属性存在：如果监听的ngModel值发生变化，则执行modelChange指令后面绑定的表达式（替换掉了ngChange），尚未完善，回头借鉴ngClick等指令的写法重写。
 */
angular.module('hr.directives').directive("modelChange", ["$parse", function ($parse) {
    return {
        restrict: "A",
        require: "^ngModel",
        controller: ["$scope", "$element", "$attrs", function ($scope, $element, $attrs) {
            var dereg = $scope.$watch($attrs.ngModel, function (newvalue, oldvalue) {
                if (newvalue !== oldvalue) {
                    $scope[$attrs.modelChange](newvalue, oldvalue, $scope.$index);
                }
            });
            $element.bind("$destroy", function () {
                if (dereg) {
                    dereg();
                }
            });
        }]
    };
}]);

/**
 * 输入框内容仅限数值的指令(输入内容不允许为 负值)
 */
angular.module('hr.directives').directive("numberOnly", ["$parse", function ($parse) {
    return function (scope, element, attrs) {
        element.bind("keyup", function () {
            if (event.keyCode == 37 || event.keyCode == 39) {
                return false;
            }
            var val = element.val().replace(/[^\d.]/g, '');
            if (attrs.max) {
                if (val > parseInt(attrs.max)) {
                    val = attrs.max;
                }
            }
            if (attrs.min) {
                if (val <= parseInt(attrs.min) && val) {
                    val = attrs.min;
                }
            }
            element.val(val);
            if (attrs.ngModel) {
                $parse(attrs.ngModel).assign(scope, val);
            }
            return false;
        });
        element.bind("afterpaste", function () {
            var val = element.val().replace(/[^\d.]/g, '');
            if (attrs.max) {
                if (val > parseInt(attrs.max)) {
                    val = attrs.max;
                }
            }
            if (attrs.min) {
                if (val <= parseInt(attrs.min)) {
                    val = attrs.min;
                }
            }
            element.val(val);
            if (attrs.ngModel) {
                $parse(attrs.ngModel).assign(scope, val);
            }
            return false;
        });
    };
}]);
/**
 * 输入框内只能输入数字(正、负数以及小数)
 */
angular.module('hr.directives').directive("numberOnlyByCondition", ["$parse", function ($parse) {
    return function (scope, element, attrs) {
        element.bind("keyup", function () {
            if (event.keyCode == 37 || event.keyCode == 39) {
                return false;
            }

            var num_enum_type = {
                positive_integer: /^(0|[1-9]\d*)$/,      // 正整数 + 0
                positive_float: /^\d*\.{0,1}\d{0,4}$/, //正小数
                positive_num: /^([1-9]\d*\.\d*|0\.\d+|[1-9]\d*|0)$/,   //正数 + 0

                negative_integer: /[^0-9|^\\-|^\\.]\d*$/g,   //负整数
                negative_float: /^-(\d*\.{0,1}\d{0,4})$/,//负小数
                negative_num: /^-(\d*\.{0,1}\d{0,4})$/,    //负数

                integer: /^((0|[1-9]\d*)$)|[^0-9|^\\-|^\\.]\d*$/g,        //所有整数
                float: /^-(\d*\.{0,1}\d{0,4})$|(^\d*\.{0,1}\d{0,4}$)/g,    //所有小数

                all_num: /^(([1-9]\d*\.\d*|0\.\d+|[1-9]\d*|0)$)|(^-(\d*\.{0,1}\d{0,4})$)/g    //所有数
            };

            var para_config = {
                indicator: attrs.numberType,
                decimal: attrs.decimalType
            };

            var val = element.val(); //初始数据值

            var testFunc = function (text, reg) {
                if (reg.test(text)) {
                    return text;
                } else if (text.length === 1) {
                    return "";
                } else {
                    return testFunc(text.substr(0, text.length - 1), reg);
                }
            };

            if (para_config.indicator) {
                if ("-" === para_config.indicator) {
                    if (para_config.decimal && "integer" === para_config.decimal) {
                        //负整数
                        val = testFunc(val, num_enum_type.negative_integer);
                    } else if (para_config.decimal && "float" === para_config.decimal) {
                        //负小数
                        val = testFunc(val, num_enum_type.negative_float);
                    } else {
                        //负数
                        val = testFunc(val, num_enum_type.negative_num);
                    }
                } else if ("+" === para_config.indicator) {
                    if (para_config.decimal && "integer" === para_config.decimal) {
                        //正整数
                        val = testFunc(val, num_enum_type.positive_integer)
                    } else if (para_config.decimal && "float" === para_config.decimal) {
                        //正数
                        val = testFunc(val, num_enum_type.positive_float);
                    } else {
                        val = testFunc(val, num_enum_type.positive_num);
                    }
                }
            } else {
                if ("float" === para_config.decimal) {
                    //所有小数
                    val = testFunc(val, num_enum_type.float);
                } else if ("integer" === para_config.decimal) {
                    //所有整数
                    val = testFunc(val, num_enum_type.integer);
                } else {
                    //所有数
                    val = testFunc(val, num_enum_type.all_num);
                }
            }
            if (attrs.maxLength && val.length > parseInt(attrs.maxLength)) {
                val = val.substr(0, val.length - 1);
            }
            element.val(val);
            if (attrs.ngModel) {
                $parse(attrs.ngModel).assign(scope, val);
            }
            return false;
        });
        element.bind("afterpaste", function () {
            element.val("");
            if (attrs.ngModel) {
                $parse(attrs.ngModel).assign(scope, "");
            }
            return false;
        });
    };
}]);

/**
 * 输入框内容自动大写
 */
angular.module('hr.directives').directive("upperCaseOnly", ["$parse", function ($parse) {
    return function (scope, element, attrs) {
        element.bind("keyup", function () {
            var val = element.val().toUpperCase();
            element.val(val);
            if (attrs.ngModel) {
                $parse(attrs.ngModel).assign(scope, val);
            }
            return false;
        });
        element.bind("afterpaste", function () {
            var val = element.val().toUpperCase();
            element.val(val);
            if (attrs.ngModel) {
                $parse(attrs.ngModel).assign(scope, val);
            }
            return false;
        });
    };
}]);

angular.module('hr.directives').directive("hrNumberOnly", ['$parse', function ($parse) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.bind("keypress", function () {
                if (event.keyCode < 45 || event.keyCode > 57 || event.keyCode === 47) {
                    event.returnValue = false;
                    return;
                }
            });


        }
    };
}]);

/**
 * 输入框内容不能为特殊字符
 */
angular.module('hr.directives').directive("noSpecialString", ["$parse", function ($parse) {
    return function (scope, element, attrs) {
        element.bind("keyup", function () {
            var val = element.val().replace(/[\W]/g, '');
            element.val(val);
            if (attrs.ngModel) {
                $parse(attrs.ngModel).assign(scope, val);
            }
            return false;
        });
        element.bind("afterpaste", function () {
            var val = element.val().replace(/[^\d]/g, '');
            element.val(val);
            if (attrs.ngModel) {
                $parse(attrs.ngModel).assign(scope, val);
            }
            return false;
        });
    };
}]);

/**
 * 延迟cloak 300ms解决页面晃动问题
 */
angular.module('hr.directives').directive("hrCloak", function () {
    return {
        compile: function (element, attr) {
            setTimeout(function () {
                attr.$set('hrCloak', undefined);
                element.removeClass('hr-cloak');
            }, 300);
        }
    };
});

/**
 * 输入框失去焦点 保留两位小数
 */
angular.module('hr.directives').directive("round2bit", ['$parse', '$filter', function ($parse, $filter) {
    return function ($scope, element, attrs) {
        element.blur(function () {
            if (attrs.ngModel) {
                var _getter = $parse(attrs.ngModel);
                var _numberStr2Round = (_getter($scope) || 0);
                _getter.assign($scope, $filter('number')(_numberStr2Round, 2).split(",").join(""));
                $scope.$apply();
            }
        });
    };
}]);

/**
 * 可以用ui-select2的文本绑定变量
 */
angular.module('hr.directives').directive('hrSelectTextModel', ["$parse", function ($parse) {
    return function ($scope, $element, $attrs) {
        $element.bind("select2-selecting", function (event) {
            $scope.$apply(function () {
                if (event.object) {
                    $parse($attrs.hrSelectTextModel).assign($scope, event.object.text);
                }
            });
        });

    };
}]);

angular.module('hr.service').factory('HrHttp', ['$http', '$q', function ($http, $q) {

    var get = function (url) {
        var deferred = $q.defer();
        $http.get(url).success(function (data, status, headers, config) {
            deferred.resolve(data);
        }).error(function (err, status, headers, config) {
            deferred.reject(err);
        });
        return deferred.promise;
    };

    var post = function (url, data) {
        var deferred = $q.defer();
        $http.post(url, data).success(function (data, status, headers, config) {
            deferred.resolve(data);
        }).error(function (err, status, headers, config) {
            deferred.reject(err);
        });
        return deferred.promise;
    };

    return {
        "get": get,
        "post": post
    };
}]);

angular.module('hr.service').factory('HrBaseCode', ['$http', 'hrIndexedDB', function ($http, hrIndexedDB) {
    function getBaseCode(codeTypeName, callback) {
//        hrIndexedDB("BASE_CODE_DICT").getStoreDataByIndex("codeTypeName", codeTypeName, function (data) {
//            console.log(data);
//            console.log("sdjfksdjfkdsjfkdsjfk");
//            if (!data.length) {
        $http.get(Path.getUri("api/base-code-dict/code-type-name/") + codeTypeName).success(function (resultData) {
            if (typeof callback === "function") {
                callback(resultData);
            }
        }).error(function (resultData, status) {
            if (typeof callback === "function") {
                callback([]);
            }
        });
//            } else {
//                if (typeof callback === "function") {
//                    callback(data);
//                }
//            }
//        });
    }

    return {
        getBaseCode: getBaseCode
    };
}]);

angular.module('hr.service').factory('HrFileReader', ['$q', function ($q) {
    var onLoad = function (reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.resolve(reader.result);
            });
        };
    };

    var onError = function (reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.reject(reader.result);
            });
        };
    };

    var onProgress = function (reader, scope) {
        return function (event) {
            scope.$broadcast("fileProgress",
                {
                    total: event.total,
                    loaded: event.loaded
                });
        };
    };

    var getReader = function (deferred, scope) {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        reader.onprogress = onProgress(reader, scope);
        return reader;
    };

    function readAsDataURL(file, scope) {
        var deferred = $q.defer();

        var reader = getReader(deferred, scope);
        reader.readAsDataURL(file);

        return deferred.promise;
    }

    return {
        readAsDataURL: readAsDataURL
    };
}]);

angular.module('hr.directives').directive('hrFileInput', ['$parse', function ($parse) {
    return {
        restrict: "EA",
        template: "<input type='file'  />",
        replace: true,
        link: function (scope, element, attrs) {
            var accept = attrs.hrFileAccept;
            if (accept !== undefined) {
                element[0].setAttribute("accept", accept);
            }

            var modelGet = $parse(attrs.hrFileInput);
            var modelSet = modelGet.assign;
            var onChange = $parse(attrs.onChange);

            var updateModel = function () {
                scope.$apply(function () {
                    modelSet(scope, element[0].files[0]);
                    onChange(scope);
                });
            };
            element.bind('change', updateModel);
        }
    };
}]);

angular.module('hr.service').factory('HrServerTime', ['$http', function ($http) {
    function getTimeFromServer(callback) {
        $http.get(Path.getUri("api/common-resource/datetime"))
            .success(function (data) {
                var now = new Date();
                now.setTime(data);
                if (typeof callback === "function") {
                    callback(now);
                }
            })
            .error(function (data) {
                callback(new Date());
            });
    }

    return {
        getTimeFromServer: getTimeFromServer
    };
}]);

/**
 * loading
 */
angular.module('hr.directives').directive("hrLoading", [function () {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attr) {
            $scope.$watch($attr.hrLoading, function (newValue, oldValue) {
                if (newValue) {
                    $element.append('<div class="alert-level" style="background-color:rgba(0,0,0,0)"><i class="spin icon-loading" style="position:absolute;left: 0;right: 0;top: 0;bottom: 0;margin: auto;"></i></div>');
                } else {
                    $element.empty();
                }
            });
        }
    };
}]);

//hr-cloak 页面晃动
angular.element(document).find('head').append('<style type="text/css">@charset "UTF-8";[hr\\:cloak],[hr-cloak],[data-hr-cloak],[x-hr-cloak],.hr-cloak,.x-hr-cloak{display:none;}ng\\:form{display:block;}</style>');

//屏蔽键盘事件（非输入框）
Mousetrap.bind(["backspace"], function () {
    return false;
});

$(document).keydown(function (event) {
    if (event.keyCode === 8 && !$("input").is(":focus") && !$("textarea").is(":focus")) {
        return false;
    }
});

angular.module("template/accordion/accordion-group.html", []).run(["$templateCache", function ($templateCache) {
    $templateCache.remove("template/accordion/accordion-group.html");
    $templateCache.put("template/accordion/accordion-group.html",
        "<div class=\"accordion-group\">\n" +
        "  <div class=\"accordion-heading\" >" +
        "<a class=\"accordion-toggle\" ng-click=\"isOpen = !isOpen\">" +
        "<span class='dis-inblock'><i ng-class=\"{'icon-plus-2':!isOpen, 'icon-minus-2':isOpen}\"></i></span>" +
        "<span class='dis-inblock' accordion-transclude=\"heading\"></div></a></span>\n" +
        "  <div class=\"accordion-body\" collapse=\"!isOpen\">\n" +
        "    <div class=\"accordion-inner\" ng-transclude></div>  </div>\n" +
        "</div>");
}]);


angular.module('hr.service').factory('HrOrderStatus', function () {
    function getNameByCode(orderStatus) {
        if (orderStatus === orderStatusEnum.OPEN) {
            return "开立";
        } else if (orderStatus === orderStatusEnum.SUBMIT) {
            return "提交";
        } else if (orderStatus === orderStatusEnum.EXECUTE) {
            return "执行";
        } else if (orderStatus === orderStatusEnum.STOP) {
            return "停止";
        } else if (orderStatus === orderStatusEnum.CANCEL) {
            return "作废";
        } else if (orderStatus === orderStatusEnum.RETURN) {
            return "审核未通过";
        }
        return "";
    }

    function getClassByCode(orderStatus) {
        if (orderStatus === orderStatusEnum.OPEN) {
            return "i-gray";
        } else if (orderStatus === orderStatusEnum.SUBMIT) {
            return "i-blue";
        } else if (orderStatus === orderStatusEnum.EXECUTE) {
            return "i-green";
        } else if (orderStatus === orderStatusEnum.STOP) {
            return "fg-color-red"
        } else if (orderStatus === orderStatusEnum.CANCEL) {
            return "i-black";
        } else if (orderStatus === orderStatusEnum.RETURN) {
            return "i-pink";
        }
        return "";
    }

    function getRowClassByCode(orderStatus) {
        if (orderStatus === orderStatusEnum.OPEN) {
            return "order-color01";
        } else if (orderStatus === orderStatusEnum.SUBMIT) {
            return "order-color02";
        } else if (orderStatus === orderStatusEnum.EXECUTE) {
            return "order-color03";
        } else if (orderStatus === orderStatusEnum.STOP) {
            return "order-color04";
        } else if (orderStatus === orderStatusEnum.CANCEL) {
            return "order-color06";
        } else if (orderStatus === orderStatusEnum.RETURN) {
            return "order-color07";
        }
        return "";
    }

    function getRowSelectedClassByCode(orderStatus) {
        if (orderStatus === orderStatusEnum.OPEN) {
            return "fg-color-blue";
        } else if (orderStatus === orderStatusEnum.SUBMIT) {
            return "fg-color-black";
        } else if (orderStatus === orderStatusEnum.EXECUTE) {
            return "fg-color-black";
        } else if (orderStatus === orderStatusEnum.STOP) {
            return "fg-color-red";
        } else if (orderStatus === orderStatusEnum.CANCEL) {
            return "fg-color-black";
        } else if (orderStatus === orderStatusEnum.RETURN) {
            return "fg-color-black";
        }
        return "";
    }

    return {
        getNameByCode: getNameByCode,
        getClassByCode: getClassByCode,
        getRowClassByCode: getRowClassByCode,
        getRowSelectedClassByCode: getRowSelectedClassByCode
    };
});

//医嘱计价属性
angular.module('hr.service').factory('HrBillingAttr', function () {
    return {
        NORMAL_BILL: 0,//计价
        MANUAL_BILL: 2,//手工计价
        NOT_BILL: 3//不计价
    };
});

//医嘱摆药属性
angular.module('hr.service').factory('HrDrugBillingAttr', function () {
    return {
        NORMAL: 0,//正常
        SELF_OWNED_MEDICINE: 1,//自备药
        NONE: 2,//不摆药
        PACK_MEDICINE: 3//出院带药
    };
});


//计价属性filter
angular.module('hr.filters').filter("billingAttr", function () {
    return function (input) {
        if (input === 0) {
            return "计价";
        } else if (input === 2) {
            return "手工计价"
        } else if (input === 3) {
            return "不计价"
        } else {
            return input;
        }
    };
});

//摆药属性filter
angular.module('hr.filters').filter("drugBillingAttr", function () {
    return function (input) {
        if (input === 0) {
            return "正常";
        } else if (input === 1) {
            return "自备药"
        } else if (input === 2) {
            return "不摆药"
        } else if (input === 3) {
            return "出院带药"
        } else {
            return input;
        }
    };
});

/**
 * hrProgress是数据处理时使用的进度条，在保存、修改、删除、查询等数据处理时将页面锁定，给用户展现一个友好的正在加载的
 * 状态，防止在数据处理过程中用户继续操作,isProcessing变量可以用来判断是否已经打开hrProgress，或数据是否正在处理中，
 * 在程序中需要在数据处理前后手动调用hrProgress.open()和hrProgress.close()和判断isProcessing变量，进行相应处理，
 * 防止事件重入。
 * 例如：controller中依赖注入hrProgress,在保存数据前加入下面这段代码
 if (hrProgress.isProcessing) {
            return false;
        } else {
            hrProgress.open();
        }
 *      在保存成功或失败回调方法里都关闭progress
 hrProgress.close();
 */
angular.module('hr.service').factory('hrProgress', ['$templateCache', function ($templateCache) {
    var isProcessing = false;
    var progress = null;
    var hotKeys = null;
    var open = function () {
        if (isProcessing) {
            console.warn("hrProgress is open");
            return false;
        } else {
            //获取快捷键
            hotKeys = angular.copy(Mousetrap.getKeyMap());
            Mousetrap.reset();
            isProcessing = true;
            progress = new HrProgress().open();
        }
    };

    var close = function () {
        if (isProcessing) {
            isProcessing = false;
            Mousetrap.setKeyMap(hotKeys);
            progress.close();
        } else {
            console.warn("hrProgress is close");
        }
    };

    function HrProgress() {
        this._element = angular.element($templateCache.get('hr-progress.html'));
    }

    HrProgress.prototype.open = function () {
        $(window.top.document).find('body').append(this._element);
        return this;
    };

    HrProgress.prototype.close = function () {
        this._element.remove();
    };

    return {
        "isProcessing": isProcessing,
        "open": open,
        "close": close
    };
}]);
/**
 * hrAutosize回车换行调整textarea高度
 */
angular.module('hr.directives').directive('hrAutosize', [function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.autosize();
            scope.$watch(attrs.ngModel, function (newValue, oldValue) {
                element.trigger('autosize.resize');
            }, true);
        }
    }
}]);


angular.module('hr.directives').directive('ngRightClick', function ($parse) {
    return function (scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function (event) {
            scope.$apply(function () {
                event.preventDefault();
                fn(scope, {$event: event});
            });
        });
    };
});


