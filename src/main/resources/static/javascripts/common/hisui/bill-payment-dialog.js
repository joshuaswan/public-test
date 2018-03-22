angular.module('hr.templateCache').run(['$templateCache', function ($templateCache) {
    $templateCache.put('bill-payment-dialog.html', '<div class="modal fade in hc-bill-payment-dialog" id="billPayment" tabindex="-1" role="dialog"\n     aria-labelledby="myModalLabel" aria-hidden="true" close="closeCallBack()" options="popPaymentOpts"\n     ng-init="triangleFlag = false">\n    <div class="modal-header">\n        <button type="button" class="close" ng-click="closePayModal()">&times;</button>\n        <h5>支付</h5>\n    </div>\n    <div class="modal-body form-horizontal">\n        <div class="hc-payment-main">\n            <div class="hc-payment-patient-info">\n                <div class="control-group label-four">\n                    <label class="control-label">患者姓名:</label>\n                    <div class="controls">\n                        <span class="sp-medium overflow-ellipsis" title="{{patient.name}}"\n                              ng-bind="patient.name">&nbsp;</span>\n                    </div>\n                </div>\n                <div class="control-group label-two">\n                    <label class="control-label">费别:</label>\n                    <div class="controls">\n                        <span class="sp-medium overflow-ellipsis" title="{{patientPaymentInfo.chargeType}}"\n                              ng-bind="patientPaymentInfo.chargeType"></span>\n                    </div>\n                </div>\n                <div class="control-group label-two fact-no">\n                    <label class="control-label">\n                        <div ng-if="patientPaymentInfo.factRcptFlag">NO.:</div>\n                    </label>\n                    <div class="controls">\n                        <!--<span class="sp-medium overflow-ellipsis"-->\n                        <!--title="{{rcptUsingRec.rcptPrefix + rcptUsingRec.currentNo}}" ng-init="factNoFlag=false"-->\n                        <!--ng-dblclick="factNoFlag = !factNoFlag"-->\n                        <!--ng-bind="rcptUsingRec.rcptPrefix + rcptUsingRec.currentNo">-->\n                        <!--&nbsp;-->\n                        <!--</span>-->\n                        <div class="input-append">\n                            <span class="overflow-ellipsis uneditable-input">{{rcptUsingRec.rcptPrefix}}</span>\n                            <input type="number" class="input-medium" ng-blur="checkFactCurrentNo()" ng-model="rcptUsingRec.currentNo"\n                                   ng-disabled="currentNoDisabled" ng-init="currentNoDisabled = true"/>\n                            <span class="add-on" ng-click="currentNoDisabled = !currentNoDisabled">\n                                <i class="icon-pencil"></i>\n                            </span>\n                        </div>\n                    </div>\n                    <!--<div class="adjust-fact-no" ng-if="factNoFlag">-->\n                    <!--<a><i class="icon-plus" ng-click="addFactCurrentNo()"></i></a>-->\n                    <!--<a><i class="icon-minus" ng-click="reduceFactCurrentNo()"></i></a>-->\n                    <!--</div>-->\n                </div>\n\n            </div>\n            <div class="hc-payment-charge-info">\n                <div class="control-group">\n                    <span class="control-label">合计:</span>\n                    <div class="controls">\n                        <span class="sp-medium overflow-ellipsis text-right money-font-large" title="{{settleInfo.totalCharges | number:2}}">\n                            {{settleInfo.totalCharges | number:2}}\n                        </span>\n                        <span class="unit">元</span>\n                        <span class="right-panel">\n                            <i ng-class="{\'icon-arrow-right-2\': !triangleFlag , \'icon-arrow-left-2\': triangleFlag}"\n                               ng-click="showApportionInfo()"></i>\n                        </span>\n                    </div>\n                </div>\n                <div class="control-group">\n                    <span class="control-label">应收:</span>\n                    <div class="controls">\n                        <span class="sp-medium overflow-ellipsis text-right money-font-large money-font-blue"\n                              title="{{settleInfo.totalNeedSelfpay | number:2}}">\n                            {{settleInfo.totalNeedSelfpay | number:2}}\n                        </span>\n                        <span class="unit">元</span>\n                    </div>\n                </div>\n            </div>\n            <div class="separate-line"></div>\n            <div class="payment-choose-style">\n                <div class="hc-payment-pay-way">\n                    <div class="control-group" ng-repeat="paymentsMoney in paymentsMoneys">\n                        <label class="control-label">\n                            <select id="money-type" hr-autofocus ng-model="paymentsMoney.moneyType"\n                                    ui-select2="billPaymentSetting.moneyTypeOptions"\n                                    ng-readonly="moneyTypeDisabled()" ng-change="changeMoneyType(paymentsMoney)"\n                                    enter-loop="1" enterindex="1">\n                                <option ng-repeat="moneyType in moneyTypes" value="{{moneyType.moneyTypeCode}}">\n                                    {{moneyType.moneyTypeName}}\n                                </option>\n                            </select>\n                        </label>\n                        <div class="controls">\n                            <input type="text" ng-model="paymentsMoney.paymentAmount"\n                                   ng-if="!payAmountIsReadonly(paymentsMoney.moneyType)"\n                                   class="input-medium text-right money-font-large money-font-blue"\n                                   hr-number-only round2bit autoselect condition-focus="paymentAmountFocusFlag"\n                                   enter-loop="1" enterindex="2">\n\n                            <span class="uneditable-input overflow-ellipsis money-font-large"\n                                  title=" {{paymentsMoney.paymentAmount | number : 2}}"\n                                  ng-if="payAmountIsReadonly(paymentsMoney.moneyType)">\n                                {{paymentsMoney.paymentAmount | number : 2}}\n                            </span>\n\n                            <span class="unit">元</span>\n\n                            <span ng-click="showPaymentExtendInfo(paymentsMoney)">\n                                <a><i class="icon-arrow-right-2" title="支付详情"></i></a>\n                            </span>\n\n                            <span ng-if="patientPaymentInfo.multiPayment && paymentsMoneys.length != 1"\n                                  ng-click="removePayment($index)">\n                                <a><i class="icon-cancel" title="删除支付方式"></i></a>\n                            </span>\n\n                            <span ng-click="addNewPayment()" ng-if="patientPaymentInfo.multiPayment && $last">\n                                <a><i class="icon-plus" title="添加支付方式"></i></a>\n                            </span>\n                        </div>\n                    </div>\n                </div>\n                <!--<div bill-payment-pay-way="options.result.paymentsMoneys" money-types="moneyTypes" patient-payment-info="patientPaymentInfo"></div>-->\n                <div class="hc-payment-changes">\n                    <div class="control-group">\n                        <span class="control-label"> 找零:</span>\n                        <div class="controls">\n                            <span class="sp-medium overflow-ellipsis text-right money-font-large money-font-blue" title="{{changeTotal | number:2}}">\n                                {{changeTotal | number:2}}\n                            </span>\n                            <span class="unit">元</span>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class="hc-payment-apportion-info" ng-if="triangleFlag">\n            <div class="apportion-info">\n                <ul class="inline">\n                    <li ng-repeat="(sectName, apportAmount) in settleInfo.apportionItemses">\n                        <span class="sect-name" ng-bind="sectName">:</span>\n                        <span class="apport-amount" ng-bind="apportAmount | number : 2">元</span>\n                    </li>\n                </ul>\n            </div>\n            <div class="payment-extend-info">\n                <div class="reduce" ng-if="paymentExtendFlag.reduceShowFlag">\n                    <label class="radio">\n                        <span><input type="radio" name="reduceRadios" value="percentage" ng-change="changeReduceRadio(\'percentage\')"\n                                     ng-model="paymentExtendFlag.activePaymentsMoney.extraInfo.reduce.reduceRadio">免去比例(%)</span>\n                        <input type="text" class="input-medium percentage" autoselect ng-change="changeReduceRadio(\'percentage\')"\n                               ng-model="paymentExtendFlag.activePaymentsMoney.extraInfo.reduce.reducePercentage"\n                               ng-focus="paymentExtendFlag.activePaymentsMoney.extraInfo.reduce.reduceRadio = \'percentage\'">\n                    </label>\n                    <label class="radio">\n                        <span><input type="radio" name="reduceRadios" value="sum" ng-change="changeReduceRadio(\'sum\')"\n                                     ng-model="paymentExtendFlag.activePaymentsMoney.extraInfo.reduce.reduceRadio">免去金额</span>\n                        <input type="text" class="input-medium sum" autoselect ng-change="changeReduceRadio(\'sum\')"\n                               ng-model="paymentExtendFlag.activePaymentsMoney.extraInfo.reduce.reduceSum"\n                               ng-focus="paymentExtendFlag.activePaymentsMoney.extraInfo.reduce.reduceRadio = \'sum\'">\n                    </label>\n                    <label class="radio">\n                        <span><input type="radio" name="reduceRadios" value="all" ng-change="changeReduceRadio(\'all\')"\n                                     ng-model="paymentExtendFlag.activePaymentsMoney.extraInfo.reduce.reduceRadio">全免</span>\n                    </label>\n                    <label class="radio reduce-reason">\n                        <span>减免原因</span>\n                        <input type="text" class="input-medium" ng-model="paymentExtendFlag.activePaymentsMoney.extraInfo.reduce.reduceCause">\n                    </label>\n                </div>\n            </div>\n        </div>\n    </div>\n    <div class="modal-footer">\n        <div class="btn-container">\n            <button id="payment-submit-button" class="btn btn-primary" ng-click="confirmPayment()" enter-loop="1"\n                    enterindex="3" enter-option="false">确认\n            </button>\n            <button class="btn" ng-click="closePayModal()">取消</button>\n        </div>\n    </div>\n</div>\n\n<div class="modal-backdrop fade in" ng-if="show"></div>\n\n<style type="text/css">\n    .hc-bill-payment-dialog.modal {\n        width: 550px;\n        display: none;\n    }\n\n    .hc-bill-payment-dialog .modal-header {\n        background-color: #2f94e1;\n        cursor: move;\n    }\n\n    .hc-bill-payment-dialog .money-font-large {\n        font-size: 40px\n    }\n\n    .hc-bill-payment-dialog .money-font-blue {\n        color: #126db3\n    }\n\n    .hc-bill-payment-dialog .separate-line {\n        border-top: 1px solid #ccc;\n        margin: 5px 0\n    }\n\n    .hc-bill-payment-dialog .modal-body {\n        overflow: hidden;\n    }\n\n    .hc-bill-payment-dialog .modal-body .hc-payment-main {\n        width: 550px;\n        display: inline-block;\n        border-right: solid 1px #ddd;\n    }\n\n    .hc-bill-payment-dialog .modal-body .hc-payment-patient-info .control-group .controls .sp-medium {\n        width: 80px;\n    }\n\n    .hc-bill-payment-dialog .modal-body .hc-payment-patient-info .control-group .controls .input-medium {\n        width: 70px;\n    }\n\n    .hc-bill-payment-dialog .modal-body .hc-payment-patient-info .control-group.fact-no .controls .overflow-ellipsis {\n        font-size: 16px;\n        height: 24px;\n        line-height: 24px;\n        width: auto;\n    }\n\n    .hc-bill-payment-dialog .modal-body .hc-payment-charge-info .control-group:first-child {\n        margin-bottom: 20px;\n        margin-top: 10px;\n    }\n\n    .hc-bill-payment-dialog .modal-body .hc-payment-charge-info .control-group .controls .sp-medium,\n    .hc-bill-payment-dialog .modal-body .payment-choose-style .hc-payment-changes .control-group .controls .sp-medium {\n        display: inline-block;\n        vertical-align: middle;\n        width: 290px;\n        height: 40px;\n        line-height: 40px;\n    }\n\n    .hc-bill-payment-dialog .modal-body .payment-choose-style {\n        overflow-y: auto;\n        max-height: 246px;\n    }\n\n    .hc-bill-payment-dialog .modal-body .control-group .controls .summery {\n        display: inline-block;\n        vertical-align: middle;\n        text-align: right;\n        width: 290px;\n    }\n\n    .hc-bill-payment-dialog .modal-body .right-panel {\n        display: inline-block;\n        height: 35px;\n        line-height: 35px;\n        vertical-align: top;\n        width: 22px;\n        text-align: center;\n        cursor: pointer;\n    }\n\n    .hc-bill-payment-dialog .modal-body .right-panel i {\n        top: 12px;\n        border-right-color: #267dad;\n        border-left-color: #267dad;\n    }\n\n    .hc-bill-payment-dialog .modal-body .hc-payment-pay-way .control-group {\n        margin-left: 3px;\n        margin-bottom: 20px;\n    }\n\n    .hc-bill-payment-dialog .modal-body .hc-payment-pay-way .control-group .control-label {\n        width: 120px;\n        height: 30px;\n        margin-top: 24px;\n    }\n\n    .hc-bill-payment-dialog .modal-body .hc-payment-pay-way .control-group .control-label .select2-container {\n        width: 88px;\n    }\n\n    .hc-bill-payment-dialog .modal-body .hc-payment-pay-way .control-group .controls {\n        margin-left: 128px;\n        margin-top: 18px;\n    }\n\n    .hc-bill-payment-dialog .modal-body .hc-payment-pay-way .control-group .controls .uneditable-input {\n        font-size: 44px;\n        text-align: right;\n        height: 44px;\n        line-height: 44px;\n        color: #126db3;\n        width: auto;\n        min-width: 263px;\n        max-width: 263px;\n    }\n\n    .hc-bill-payment-dialog .modal-body .hc-payment-pay-way .control-group .controls .input-medium {\n        width: 262px;\n        height: 44px;\n        font-weight: bold;\n        font-size: 44px;\n    }\n\n    .hc-bill-payment-dialog .modal-body .hc-payment-changes {\n        margin-bottom: 10px;\n    }\n\n    .hc-bill-payment-dialog .modal-body .hc-payment-apportion-info ul.inline li {\n        display: block;\n    }\n\n    .hc-bill-payment-dialog .modal-body .hc-payment-apportion-info {\n        display: inline-block;\n        position: absolute;\n        top: 5px;\n    }\n\n    .hc-bill-payment-dialog .modal-body .hc-payment-apportion-info ul.inline {\n        margin-top: 10px;\n        margin-left: 10px;\n    }\n\n    .hc-bill-payment-dialog .modal-body .hc-payment-apportion-info .apportion-info {\n        min-height: 100px;\n    }\n\n    .hc-bill-payment-dialog .modal-body .hc-payment-apportion-info .payment-extend-info {\n\n    }\n\n    .hc-bill-payment-dialog .modal-body .hc-payment-apportion-info .payment-extend-info label.radio {\n        margin-top: 5px;\n    }\n\n    .hc-bill-payment-dialog .modal-body .hc-payment-apportion-info .payment-extend-info label.radio span {\n        display: inline-block;\n        width: 100px;\n    }\n\n    .hc-bill-payment-dialog .modal-body .hc-payment-apportion-info .payment-extend-info label.radio.reduce-reason span {\n        display: inline-block;\n        width: 67px;\n        margin-left: 8px;\n    }\n\n    .hc-bill-payment-dialog .modal-body .hc-payment-apportion-info .payment-extend-info label.radio .input-medium.percentage {\n        width: 99px;\n    }\n\n    .hc-bill-payment-dialog .modal-body .hc-payment-apportion-info .payment-extend-info label.radio .input-medium.sum {\n        width: 99px;\n    }\n\n    .hc-bill-payment-dialog .modal-body .hc-payment-apportion-info .payment-extend-info label.radio.reduce-reason .input-medium {\n        width: 124px;\n    }\n\n</style>');
}]);

/**支付页面指令*/
angular.module('hr.directives').directive("billPaymentDialog", ["$parse", "$http", "hrDialog", "HrClinicCate", "paymentService", function ($parse, $http, hrDialog, HrClinicCate, paymentService) {
    var billPaymentDialogDirectiveObject = {
        restrict: "E",
        templateUrl: "bill-payment-dialog.html",
        scope: {
            show: "=",//显隐控制相关的变量：true显示，false隐藏。
            close: "&",//关闭时的回调代码
            options: "="//配置本支付窗口的参数对象，同时本次交易完成后的结果信息也会放置到本对象的result属性上。
        },
        controller: ["$scope", "$element", function ($scope, $element) {
            /***
             * 通过支付窗口的配置对象（options），作为使用支付指令的入口：调用options对象的setPatientPaymentInfo方法，传入参数。
             *
             * 需要传入的本次支付所用的信息（参数对象）。
             * 需要传入的参数分别为：
             *  patientId:"patientId",
             *  chargeType:"自费"
             *  clinicCate: "", //1-门诊2-住院 3-挂号
             *  extraPayInfo: {totalCharges: number, totalNeedPay: number, apportionItems: array}
             * @param patientPaymentInfo
             *
             * 支付成功之后，options对象中的result属性会存有本次支付的相关信息。
             * 成功信息（result）包括：
             * (1)paymentsMoneys:生成的支付方式及金额数组
             */

            //弹出支付窗口参数
            var popPaymentOpts = {
                dialogClass: "modal hc-bill-payment-dialog",
//                backdropFade: true,
//                dialogFade: true,
                keyboard: false,
                backdrop: false,
//                backdropClick: false,
                show: false
            };
            $('#billPayment').modal(popPaymentOpts);

            $scope.keyMap = {};

            //根据患者Id获取患者信息
            $scope.patient = {};
            //实票据记录
            $scope.rcptUsingRec = null;

            //本次支付支持的支付类型
            $scope.moneyTypes = [];
            //系统支持的支付类型
            $scope.options.moneyTypeEnum = paymentService.moneyType;
            //本次支付的参数信息
            $scope.patientPaymentInfo = {};//解决HTML模版中，如果没有录入任何数据，则抛出patientPaymentInfo为undefined的错误
            //预交金账户信息
            $scope.prepaymentAccount = {};
            //结算信息
            $scope.settleInfo = {totalCharges: 0, oriTotalNeedSelfpay: 0, totalNeedSelfpay: 0, apportionItemses: {}};
            //支付明细
            $scope.paymentsMoneys = [];
            //找零
            $scope.changeTotal = 0;
            //额外支付信息显示标志
            $scope.paymentExtendFlag = {
                activePaymentsMoney: {},
                reduceShowFlag: false
            };

            var getPrepaymentAccount = function (patient, _patientPaymentInfo, callback) {
                HrUtils.httpRequest($http, "api/prepayments/account/" + patient.patientid, function (data) {
                    $scope.prepaymentAccount = data;
                    callback(patient, _patientPaymentInfo, $scope.prepaymentAccount);
                }, function (data, status) {
                    $scope.prepaymentAccount = {outpPrepayments: 0, inpPrepayments: 0};
                    callback(patient, _patientPaymentInfo, $scope.prepaymentAccount);
                }, hrDialog);
            };

            var initPaymentDialog = function (patient, _patientPaymentInfo, prepaymentAccount) {
                $scope.moneyTypes = angular.copy(_patientPaymentInfo.moneyTypes) || [$scope.options.moneyTypeEnum.CASH];
                $scope.settleInfo.totalCharges = 0;
                $scope.settleInfo.oriTotalNeedSelfpay = 0;
                $scope.settleInfo.totalNeedSelfpay = 0;
                $scope.settleInfo.apportionItemses = {};
                $scope.settleInfo.totalCharges = _patientPaymentInfo.extraPayInfo.totalCharges;
                $scope.settleInfo.oriTotalNeedSelfpay = angular.copy(_patientPaymentInfo.extraPayInfo.totalNeedPay);
                $scope.settleInfo.totalNeedSelfpay = angular.copy(_patientPaymentInfo.extraPayInfo.totalNeedPay);

                _patientPaymentInfo.extraPayInfo.apportionItems.forEach(function (apportionItem) {
                    if ($scope.settleInfo.apportionItemses[apportionItem.sectName]) {
                        $scope.settleInfo.apportionItemses[apportionItem.sectName] = HrMath.fixArithmetic(
                            $scope.settleInfo.apportionItemses[apportionItem.sectName], apportionItem.apportAmount, "+");
                    } else {
                        $scope.settleInfo.apportionItemses[apportionItem.sectName] = apportionItem.apportAmount;
                    }
                });

                if (_patientPaymentInfo.clinicCate !== HrClinicCate.INP && $scope.prepaymentAccount.outpPrepayments === 0) {
                    if (angular.equals($scope.moneyTypes[0], paymentService.moneyType.PREPAYMENT) && $scope.moneyTypes.length !== 1) {
                        $scope.moneyTypes.splice(0, 1);
                    }
                }

                if (angular.equals($scope.moneyTypes[0], paymentService.moneyType.PREPAYMENT)) {
                    if (_patientPaymentInfo.clinicCate === HrClinicCate.INP) {
                        $scope.paymentsMoneys.push(
                            {
                                moneyType: $scope.options.moneyTypeEnum.PREPAYMENT.moneyTypeCode,
                                paymentAmount: $scope.prepaymentAccount.inpPrepayments,
                                transFlag: 1//支付实际发生标记 1-发生，0-未发生
                            }
                        );
                    } else {
                        if ($scope.prepaymentAccount.outpPrepayments >= $scope.settleInfo.totalNeedSelfpay) {
                            $scope.paymentsMoneys.push(
                                {
                                    moneyType: $scope.options.moneyTypeEnum.PREPAYMENT.moneyTypeCode,
                                    paymentAmount: $scope.settleInfo.totalNeedSelfpay,
                                    transFlag: 1//支付实际发生标记 1-发生，0-未发生
                                }
                            );
                        } else {
                            $scope.paymentsMoneys.push(
                                {
                                    moneyType: $scope.options.moneyTypeEnum.PREPAYMENT.moneyTypeCode,
                                    paymentAmount: $scope.prepaymentAccount.outpPrepayments,
                                    transFlag: 1//支付实际发生标记 1-发生，0-未发生
                                }
                            );
                        }
                    }

                } else if (angular.equals($scope.moneyTypes[0], paymentService.moneyType.CASH)) {
                    $scope.paymentsMoneys.push(
                        {
                            moneyType: $scope.options.moneyTypeEnum.CASH.moneyTypeCode,
                            paymentAmount: "",//支付不再默认填写东西
                            transFlag: 1//支付实际发生标记 1-发生，0-未发生
                        }
                    );
                } else if (angular.equals($scope.moneyTypes[0], paymentService.moneyType.POS)) {
                    $scope.paymentsMoneys.push(
                        {
                            moneyType: $scope.options.moneyTypeEnum.POS.moneyTypeCode,
                            paymentAmount: $scope.settleInfo.totalNeedSelfpay,
                            transFlag: 1//支付实际发生标记 1-发生，0-未发生
                        }
                    );
                }

                if (!_patientPaymentInfo.extraPayInfo) {
                    hrDialog.dialog(hrDialog.typeEnum.WARN, {title: "收费付款提示", message: "支付信息不能为空！"});
                    return false;
                }
            };

            $scope.options.setPatientPaymentInfo = function (patientPaymentInfo) {
                //从主框架获取支付时舍入方式
                var billPayRoundType = getTopLevelConfig("Bill_Pay_Round_Type");
                console.log("从主框架获取支付时舍入方式=" + billPayRoundType);
                if (billPayRoundType !== null) {
                    patientPaymentInfo.billPayRoundType = billPayRoundType;
                }
                console.log("最终支付时舍入方式=" + patientPaymentInfo.billPayRoundType);
                $scope.prepaymentAccount = {};
                $scope.paymentsMoneys = [];
                $scope.options.result = {};
                var _patientPaymentInfo = $scope.patientPaymentInfo = patientPaymentInfo || {};
                //查询实票管理票据号
                $scope.rcptUsingRec = null;
                if (_patientPaymentInfo.factRcptFlag) {
                    $http.get(Path.getUri("api/rcpt-using/fact-no/" + _patientPaymentInfo.operatorId + "/" +
                        _patientPaymentInfo.rcptType)).success(
                        function (data) {
                            $scope.rcptUsingRec = data[0];
                            $scope.rcptUsingRec.oriCurrentNo = $scope.rcptUsingRec.currentNo;
                        }
                    ).error(
                        function (data, status) {
                            hrDialog.dialog(hrDialog.typeEnum.WARN, {message: "请领取票据"}).close(function () {
                                $scope.show = false;
                            });
                            return;
                        }
                    );
                }
                $http.get(Path.getUri("api/patient/byid/" + _patientPaymentInfo.patientId)).success(function (data, status, header) {
                    $scope.patient = data;
                    getPrepaymentAccount($scope.patient, _patientPaymentInfo, initPaymentDialog);
                }).error(function (data, status, header, config) {
                    hrDialog.dialog(hrDialog.typeEnum.WARN, {title: "收费付款提示", message: data.message});
                });
            };

            $scope.closePayModal = function () {
                $scope.show = false;
            };

            //监测真是收据号变化
            var currentNoReg = new RegExp(/^\d+$/);
            $scope.checkFactCurrentNo = function() {
                console.log("checkFactCurrentNo");
                console.log($scope.rcptUsingRec);
                if (!currentNoReg.test($scope.rcptUsingRec.currentNo)) {
                    $scope.rcptUsingRec.currentNo = $scope.rcptUsingRec.oriCurrentNo;
                }
                if ($scope.rcptUsingRec.currentNo > $scope.rcptUsingRec.endNo) {
                    $scope.rcptUsingRec.currentNo = $scope.rcptUsingRec.endNo;
                }
                if ($scope.rcptUsingRec.currentNo < $scope.rcptUsingRec.oriCurrentNo) {
                    $scope.rcptUsingRec.currentNo = $scope.rcptUsingRec.oriCurrentNo;
                }
            };

            function _bindKeys() {
                Mousetrap.reset();
                Mousetrap.bind(["backspace"], function () {
                    return false;
                });
                Mousetrap.bindGlobal('esc', function () {
                    $scope.closePayModal();

                    if (!$scope.$$phase) {
                        $scope.$digest();
                    }
                });
                Mousetrap.bindGlobal(["f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10"], function () {
                    return false;
                });
            }

            //支付确认
            var paymentTotalMoneyTypeFlag = true;
            $scope.confirmPayment = function () {
                $scope.paymentAmountFocusFlag = false;
                var resultPaymentsMoneys = angular.copy($scope.paymentsMoneys);
                if ($scope.paymentsMoneys.length <= 0) {
                    hrDialog.dialog(hrDialog.typeEnum.WARN, {
                        title: "收费提示", message: "请先选择填写完整支付方式、支付金额等信息",
                        preventFocus: true
                    })
                        .close(function () {
                            $scope.paymentAmountFocusFlag = true;
                        });
                    return false;
                }
                if ($scope.paymentsMoneys.some(function (_paymentsMoney) {
                        return !_paymentsMoney.moneyType;
                    })) {
                    hrDialog.dialog(hrDialog.typeEnum.WARN, {title: "收费提示", message: "金额类型不得为空", preventFocus: true})
                        .close(function () {
                            $scope.paymentAmountFocusFlag = true;
                        });
                    return false;
                }
                if ($scope.paymentsMoneys.some(function (_paymentsMoney) {
                        return _paymentsMoney.paymentAmount < 0 || HrStr.isNull(_paymentsMoney.paymentAmount);
                    })) {
                    hrDialog.dialog(hrDialog.typeEnum.WARN, {title: "收费提示", message: "支付金额无效", preventFocus: true})
                        .close(function () {
                            $scope.paymentAmountFocusFlag = true;
                        });
                    return false;
                }
                if (paymentTotalMoneyTypeFlag === false) {
                    hrDialog.dialog(hrDialog.typeEnum.WARN, {title: "收费付款提示", message: "不允许使用两种相同的支付方式支付!"});
                    return false;
                    paymentTotalMoneyTypeFlag = true;
                }
                var _paymentTotal = 0;
                $scope.paymentsMoneys.forEach(function (_paymentsMoney) {
                    _paymentTotal = HrMath.fixArithmetic(_paymentTotal, parseFloat(_paymentsMoney.paymentAmount), "+");
                });
                if (_paymentTotal < $scope.settleInfo.totalNeedSelfpay) {
                    hrDialog.dialog(hrDialog.typeEnum.WARN, {
                        title: "收费提示",
                        message: "支付金额不得小于应付金额",
                        preventFocus: true
                    })
                        .close(function () {
                            $scope.paymentAmountFocusFlag = true;
                        });
                    return;
                }

                if ($scope.changeTotal) {//如果有找零，则从现金中扣除（不保留找零这一支付方式）
                    if ($scope.patientPaymentInfo.clinicCate === HrClinicCate.INP) {
                        resultPaymentsMoneys.push(
                            {
                                moneyType: $scope.options.moneyTypeEnum.CASH.moneyTypeCode,
                                paymentAmount: -angular.copy($scope.changeTotal),
                                transFlag: 1//支付实际发生标记 1-发生，0-未发生
                            }
                        );
                    } else {
                        resultPaymentsMoneys.forEach(function (_paymentsMoney) {
                            if (_paymentsMoney.moneyType === $scope.options.moneyTypeEnum.CASH.moneyTypeCode) {
                                _paymentsMoney.paymentAmount = HrMath.fixArithmetic(_paymentsMoney.paymentAmount, $scope.changeTotal, "-");
                            }
                        });
                    }
                }
                $scope.options.result.rcptUsingRec = $scope.rcptUsingRec;

                if (!angular.equals($scope.settleInfo.totalNeedSelfpay, $scope.settleInfo.oriTotalNeedSelfpay)) {
                    resultPaymentsMoneys.push(
                        {
                            moneyType: $scope.options.moneyTypeEnum.ROUND.moneyTypeCode,
                            paymentAmount: HrMath.fixArithmetic($scope.settleInfo.oriTotalNeedSelfpay, $scope.settleInfo.totalNeedSelfpay, "-"),
                            transFlag: 1//支付实际发生标记 1-发生，0-未发生
                        }
                    );
                }

                resultPaymentsMoneys.forEach(function(paymentsMoney) {
                    paymentsMoney.payPurpose = "付款";
                    if (angular.equals(paymentsMoney.moneyType, paymentService.moneyType.REDUCE.moneyTypeCode)) {
                        paymentsMoney.reduceCause = paymentsMoney.extraInfo.reduce.reduceCause;
                    }
                    delete paymentsMoney.extraInfo;
                });
                $scope.options.result.paymentsMoneys = resultPaymentsMoneys;
                $scope.close();
                $scope.show = false;
            };

            $scope.closeCallBack = function () {
                $scope.options.result.paymentsMoneys = [];
                $scope.close();
                $scope.triangleFlag = false;
                $scope.show = false;
            };

            $scope.moneyTypeDisabled = function () {
                if ($scope.moneyTypes.length === 1
                    && angular.equals($scope.moneyTypes[0].moneyTypeCode, paymentService.moneyType.PREPAYMENT.moneyTypeCode)) {
                    return true;
                }
            };

            //当前支付方式是否允许输入金额
            $scope.payAmountIsReadonly = function (moneyType) {
                if (angular.equals(paymentService.moneyType.PREPAYMENT.moneyTypeCode, moneyType)) {
                    return true;
                }
                if (angular.equals(paymentService.moneyType.POS.moneyTypeCode, moneyType)) {
                    return true;
                }
            };

            //新增支付方式
            $scope.addNewPayment = function () {
                if (!$scope.patientPaymentInfo.multiPayment) {
                    hrDialog.dialog(hrDialog.typeEnum.WARN, {title: "收费提示", message: "不允许使用多种支付方式"});
                    return;
                }
                var totalAlreadyPaymentAmount = 0;
                $scope.paymentsMoneys.forEach(function (item) {
                    totalAlreadyPaymentAmount = HrMath.fixArithmetic(totalAlreadyPaymentAmount, item.paymentAmount, "+");
                });
                if (totalAlreadyPaymentAmount >= $scope.settleInfo.totalNeedSelfpay) {
                    hrDialog.dialog(hrDialog.typeEnum.WARN, {title: "收费提示", message: "当前支付金额已经足够"});
                    return;
                }
                $scope.paymentsMoneys.push(
                    {
                        moneyType: $scope.options.moneyTypeEnum.CASH.moneyTypeCode,
                        paymentAmount: "",
                        transFlag: 1
                    }
                );
            };

            //删除支付方式
            $scope.removePayment = function (index) {
                $scope.paymentsMoneys.splice(index, 1);
            };

            //显示分摊信息
            $scope.showApportionInfo = function () {
                $scope.triangleFlag = !$scope.triangleFlag;
                if ($scope.triangleFlag) {
                    $(".hc-bill-payment-dialog").css("width", "800px");
                } else {
                    $(".hc-bill-payment-dialog").css("width", "550px");
                }
            };

            //显示额外支付信息
            $scope.showPaymentExtendInfo = function(paymentsMoney) {
                $scope.paymentExtendFlag.activePaymentsMoney = paymentsMoney;
                $scope.paymentExtendFlag.activePaymentsMoney.extraInfo = {
                    reduce : {
                        reduceRadio: "",
                        reducePercentage: 0,
                        reduceSum: 0,
                        reduceCause: "患者欠费"
                    }
                };
                if (angular.equals(paymentsMoney.moneyType, paymentService.moneyType.REDUCE.moneyTypeCode)) {
                    $scope.showApportionInfo();
                    $scope.paymentExtendFlag.reduceShowFlag = true;
                }
            };

            $scope.changeReduceRadio = function(flag) {
                if (angular.equals("all", flag)) {
                    $scope.paymentExtendFlag.activePaymentsMoney.paymentAmount = $scope.settleInfo.oriTotalNeedSelfpay;
                } else if (angular.equals("sum", flag)) {
                    $scope.paymentExtendFlag.activePaymentsMoney.paymentAmount = $scope.paymentExtendFlag.activePaymentsMoney.extraInfo.reduce.reduceSum;
                } else if (angular.equals("percentage", flag)) {
                    $scope.paymentExtendFlag.activePaymentsMoney.paymentAmount =
                        HrMath.fixArithmetic($scope.paymentExtendFlag.activePaymentsMoney.extraInfo.reduce.reducePercentage, $scope.settleInfo.oriTotalNeedSelfpay, "*") / 100;
                }
            };

            //增大当前真实票据号
            $scope.addFactCurrentNo = function () {
                if (angular.isUndefined($scope.rcptUsingRec.oriCurrentNo)) {
                    $scope.rcptUsingRec.oriCurrentNo = $scope.rcptUsingRec.currentNo;
                }
                if ($scope.rcptUsingRec.currentNo < $scope.rcptUsingRec.endNo) {
                    $scope.rcptUsingRec.currentNo++;
                }
            };

            //减小当前真实票据号
            $scope.reduceFactCurrentNo = function () {
                if (angular.isUndefined($scope.rcptUsingRec.oriCurrentNo)) {
                    $scope.rcptUsingRec.oriCurrentNo = $scope.rcptUsingRec.currentNo;
                }
                if ($scope.rcptUsingRec.currentNo > $scope.rcptUsingRec.oriCurrentNo) {
                    $scope.rcptUsingRec.currentNo--;
                }
            };

            //支付方式改变时触发函数
            $scope.changeMoneyType = function (paymentsMoney) {
                calculateRound($scope.paymentsMoneys);
                if (angular.equals(paymentService.moneyType.PREPAYMENT.moneyTypeCode, paymentsMoney.moneyType)) {
                    if ($scope.patientPaymentInfo.clinicCate === HrClinicCate.INP) {
                        paymentsMoney.paymentAmount = $scope.prepaymentAccount.inpPrepayments;
                    } else {
                        if ($scope.prepaymentAccount.outpPrepayments >= $scope.settleInfo.totalNeedSelfpay) {
                            paymentsMoney.paymentAmount = $scope.settleInfo.totalNeedSelfpay;
                        } else {
                            paymentsMoney.paymentAmount = $scope.prepaymentAccount.outpPrepayments;
                        }
                    }
                    return;
                }
                if (angular.equals(paymentService.moneyType.POS.moneyTypeCode, paymentsMoney.moneyType)) {
                    var totalAlreadyPaymentAmount = 0;
                    var paymentsMoneyIndex = $scope.paymentsMoneys.indexOf(paymentsMoney);
                    $scope.paymentsMoneys.forEach(function (item, index) {
                        if (paymentsMoneyIndex !== index && !angular.equals(paymentService.moneyType.CASH.moneyTypeCode, item.moneyType)) {
                            totalAlreadyPaymentAmount = HrMath.fixArithmetic(totalAlreadyPaymentAmount, item.paymentAmount, "+");
                        }
                    });
                    paymentsMoney.paymentAmount = HrMath.fixArithmetic($scope.settleInfo.totalNeedSelfpay, totalAlreadyPaymentAmount, "-");
                    return;
                }
                if (angular.equals(paymentService.moneyType.CASH.moneyTypeCode, paymentsMoney.moneyType)) {
                    paymentsMoney.paymentAmount = "";
                    return;
                }
            };

            //计算四舍五入
            var calculateRound = function(_paymentsMoneys) {
                if (_paymentsMoneys.length === 1 && angular.equals(_paymentsMoneys[0].moneyType, paymentService.moneyType.CASH.moneyTypeName)) {
                    if (angular.equals($scope.patientPaymentInfo.billPayRoundType, "1")) {
                        $scope.settleInfo.totalNeedSelfpay = Math.round($scope.settleInfo.oriTotalNeedSelfpay * 10) / 10;
                    } else {
                        $scope.settleInfo.totalNeedSelfpay = Math.floor($scope.settleInfo.oriTotalNeedSelfpay * 10) / 10;
                    }
                } else {
                    $scope.settleInfo.totalNeedSelfpay = $scope.settleInfo.oriTotalNeedSelfpay;
                }
            };

            //计算找零
            var deregPaymentsMoneys = $scope.$watch("paymentsMoneys", function (_paymentsMoneys) {
                if (_paymentsMoneys) {
                    //计算四舍五入
                    calculateRound(_paymentsMoneys);
                    var paymentTotal = 0;
                    var paymentTotalMoneyTypeTemps = [];
                    _paymentsMoneys.forEach(function (_paymentsMoney) {
//                        paymentTotal += (parseFloat(_paymentsMoney.paymentAmount) || 0);
                        paymentTotal = HrMath.fixArithmetic(paymentTotal, (parseFloat(_paymentsMoney.paymentAmount) || 0), "+");
                        if (_paymentsMoneys.length !== 1) {
                            paymentTotalMoneyTypeTemps.push(_paymentsMoney.moneyType);
                        }
                    });
                    paymentTotalMoneyTypeTemps.sort();
                    console.log(paymentTotalMoneyTypeTemps);
                    //判断是否有重复的收费方式
                    for (var i = paymentTotalMoneyTypeTemps.length - 1; i >= 0; i--) {
                        if (paymentTotalMoneyTypeTemps[i] === paymentTotalMoneyTypeTemps[i + 1]) {
                            paymentTotalMoneyTypeFlag = false;
                            break;
                        } else {
                            paymentTotalMoneyTypeFlag = true;
                        }
                    }
                    //if (paymentTotalMoneyTypeFlag === false) {
                    //    hrDialog.dialog(hrDialog.typeEnum.WARN, {title: "收费付款提示", message: "不允许使用两种相同的支付方式支付!"});
                    //}
                    console.log(paymentTotalMoneyTypeFlag);
                    var changeTotal = HrMath.fixArithmetic(paymentTotal, $scope.settleInfo.totalNeedSelfpay, "-");
                    //$scope.changeTotal = changeTotal;
                    $scope.changeTotal = (changeTotal < 0) ? 0 : changeTotal;
                }
            }, true);
            $element.bind("$destroy", function () {
                if (deregPaymentsMoneys) {
                    deregPaymentsMoneys();
                }
            });
            var deregShow = $scope.$watch("show", function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    if (newValue) {
                        $scope.keyMap = angular.copy(Mousetrap.getKeyMap());
                        _bindKeys();
                        $scope.show = true;
                        $(".hc-bill-payment-dialog.modal")[0].style.display = "block";
                        setTimeout(function () {
                            $(".select2-container").select2("focus");
                        }, 350);
                    } else {
                        Mousetrap.reset();
                        Mousetrap.setKeyMap($scope.keyMap);
                        $scope.show = false;
                        $(".hc-bill-payment-dialog.modal")[0].style.display = "none";
                    }
                }
            }, true);
            $element.bind("$destroy", function () {
                if (deregShow) {
                    deregShow();
                }
            });
        }]
    };
    return billPaymentDialogDirectiveObject;
}]);