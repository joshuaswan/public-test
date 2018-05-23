angular.module('hr.templateCache').run(['$templateCache', function ($templateCache) {
    $templateCache.put('bill-refund-payment-template.html','<div hr-draggable modal="show" close="closeCallBack()" options="refundConfirmOpts">\n    <div class="modal-header">\n        <button type="button" class="close" ng-click="cancelRefund()">&times;</button>\n        <h5>确认退费</h5>\n    </div>\n    <div class="modal-body">\n        <div class="form-horizontal bordered-bottom">\n            <div class="control-group label-four">\n                <label class="control-label">票据类型:</label>\n                <div class="controls">\n                    <span class="sp-medium">{{rcptUsingRec.rcptType}}</span>\n                </div>\n            </div>\n            <div class="control-group label-three">\n                <label class="control-label">NO.:</label>\n                <div class="controls">\n                    <span class="sp-medium">{{rcptUsingRec.rcptPrefix + rcptUsingRec.currentNo}}</span>\n                </div>\n            </div>\n        </div>\n        <ul class="money">\n            <li ng-repeat="paymentsMoney in refundPaymentsMoneys">\n                <div ng-if="paymentsMoney.paymentAmount > 0">\n                    <span class="status"><strong>[收]&nbsp;</strong></span>\n                    <span class="money-type">{{paymentsMoney.moneyType}}:</span>\n                    <span class="pay-amount overflow-ellipsis" title="{{paymentsMoney.paymentAmount | number:2}}" ng-bind="paymentsMoney.paymentAmount | number:2"></span>\n                    <span class="units">元</span>\n                </div>\n                <div ng-if="paymentsMoney.paymentAmount <= 0">\n                    <span class="status"><strong>[退]&nbsp;</strong></span>\n                    <span class="money-type">{{paymentsMoney.moneyType}}:</span>\n                    <span class="pay-amount overflow-ellipsis" title="{{-paymentsMoney.paymentAmount | number:2}}"  ng-bind="-paymentsMoney.paymentAmount | number:2"></span>\n                    <span class="units">元</span>\n                </div>\n            </li>\n        </ul>\n    </div>\n    <div class="modal-footer">\n        <button class="btn btn-primary" ng-click="confirmRefund()" condition-focus="confirmButtonFocusFlag">确认</button>\n        <button class="btn" ng-click="cancelRefund()">取消</button>\n    </div>\n</div>\n<style type="text/css">\n    .modal.refund-confirm-modal {\n        width: 468px;\n    }\n    .modal-footer {\n        padding: 5px;\n    }\n    .refund-confirm-modal .modal-body .form-horizontal .control-group:first-child .controls .sp-medium{\n        width:100px;\n    }\n    .refund-confirm-modal .modal-body .form-horizontal .control-group:nth-child(2) .controls .sp-medium{\n        width:138px;\n    }\n    .refund-confirm-modal .money .status {\n        display: inline-block;\n        line-height: 50px;\n        height: 50px;\n        vertical-align: top;\n        font-size: 30px;\n    }\n\n    .refund-confirm-modal .money .money-type {\n        display: inline-block;\n        line-height: 50px;\n        height: 50px;\n        width: 100px;\n        text-align: right;\n        vertical-align: top;\n        font-size: 20px;\n    }\n    \n    .refund-confirm-modal .money .pay-amount {\n        font-size: 44px;\n        color: #126db3;\n        display: inline-block;\n        line-height: 50px;\n        height: 50px;\n        vertical-align: top;\n        width: auto;\n        max-width:282px ;\n    }\n\n    .refund-confirm-modal .money .units {\n        display: inline-block;\n        line-height: 50px;\n        height: 50px;\n        vertical-align: top;\n    }\n\n    .refund-confirm-modal .money {\n        padding: 0;\n        margin: 0px 0px 3px 7px;\n    }\n</style>');
}]);

//退费支付页面
angular.module('hr.directives').directive('billRefundPayment', ['$debounce', function($debounce) {
    var billRefundPaymentDialog = {
        restrict: "E",
        templateUrl: "bill-refund-payment-template.html",
        scope: {
            show: "=",//显隐控制相关的变量：true显示，false隐藏
            close: "&",//关闭时的回调函数
            options: "="//配置本窗口的参数对象
        },
        controller: ['$scope', '$element', '$http', 'hrDialog', function($scope, $element, $http, hrDialog) {
            //确认退费页面modal参数
            $scope.refundConfirmOpts = {
                dialogClass: "modal refund-confirm-modal",
                backdropFade: true,
                dialogFade: true,
                keyboard: true,
                backdrop: true,
                backdropClick: false
            };
            //确定按钮获得焦点标记
            $scope.confirmButtonFocusFlag = true;
            //应退费总额
            $scope.totalRefundPayments = 0;
            $scope.rcptUsingRec = null;

            //绑定键盘事件
            function _bindKeys() {
                Mousetrap.reset();
                Mousetrap.bind(["backspace"], function () {
                    return false;
                });
                Mousetrap.bindGlobal(["f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10"], function () {
                    return false;
                });
            }

            var deregShow = $scope.$watch("show", function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    if (newValue) {
                        $scope.keyMap = angular.copy(Mousetrap.getKeyMap());
                        _bindKeys();
                    } else {
                        Mousetrap.reset();
                        Mousetrap.setKeyMap($scope.keyMap);
                    }
                }
            }, true);

            $element.bind("$destroy", function () {
                if(deregShow) {deregShow();}
            });

            //关闭页面的回调函数
            $scope.closeCallBack = function(refundFlag) {
                $scope.show = false;
                $scope.close();
            };
            //确认退费
            $scope.confirmRefund = function() {
                $scope.options.refundFlag = true;
                $scope.options.result.refundFlag = true;
                $scope.show = false;
            };
            //取消退费
            $scope.cancelRefund = function() {
                $scope.options.refundFlag = false;
                $scope.options.result.refundFlag = false;
                $scope.show = false;
            };
            //设置初始化参数
            $scope.options.setRefundInfo = function(refundInfo) {
                $scope.options.refundFlag = false;
                $scope.options.result = {
                    refundFlag: false
                };
                $scope.totalRefundPayments = 0;
                $scope.refundPaymentsMoneys = refundInfo.refundPaymentsMoneys;
                $scope.refundPaymentsMoneys.forEach(function(paymentsMoney) {
                    $scope.totalRefundPayments = HrMath.fixArithmetic($scope.totalRefundPayments, paymentsMoney.paymentAmount, "+");
                });
                //查询实票管理票据号
                $scope.rcptUsingRec = null;
                if (refundInfo.factRcptFlag) {
                    $http.get(Path.getUri("api/rcpt-using/fact-no/" + refundInfo.operatorId + "/" + refundInfo.rcptType)).success(
                        function (data) {
                            $scope.rcptUsingRec = data[0];
                            $scope.options.result.rcptUsingRec = $scope.rcptUsingRec;
                        }
                    ).error(
                        function (data, status) {
                            hrDialog.dialog(hrDialog.typeEnum.WARN, {message: "请领取票据"}).close(function() {
                                $scope.show = false;
                            });
                            return;
                        }
                    );
                }
            };
        }]
    };
    return billRefundPaymentDialog;
}]);