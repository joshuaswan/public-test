angular.module("hr.service").factory("paymentService", ["$http", "HrBaseCode", function($http, HrBaseCode) {
    var payWayDicts = [];
    var moneyType = {
        CASH: {moneyTypeCode: "现金", moneyTypeName: "现金"},
        POS: {moneyTypeCode: "刷卡", moneyTypeName: "刷卡"},
        PREPAYMENT: {moneyTypeCode: "预交金", moneyTypeName: "预交金"},
        CHECK: {moneyTypeCode: "支票", moneyTypeName: "支票"},
        TRANSFER: {moneyTypeCode: "银行转账", moneyTypeName: "银行转账"},
        HOSPITAL_PAID: {moneyTypeCode: "垫支", moneyTypeName: "垫支"},
        REDUCE: {moneyTypeCode: "减免", moneyTypeName: "减免"},
        ROUND: {moneyTypeCode: "取整舍入", moneyTypeName: "取整舍入"}
    };
    var payWayIsPatientPayMap = {};

    var PaymentsMaster = function () {
        this.payNo = "";
        this.clinicCate = "";
        this.payStatus = 1;
        this.totalPay = 0;
        this.refundedPayNo = "";
        this.refundedPayDate = null;
        this.acctNo = "";
        this.operatorEmpId = "";
        this.operatorEmpName = "";
        this.operationDate = null;
        this.groupNo = "";
        this.paymentsMoneys = [];
        this.outpSettleMasters = [];
        this.inpSettleMasters = [];
    };

    var PaymentsMoney = function() {
        this.moneyType = "现金";
        this.payPurpose = "付款";
        this.paymentAmount = 0;
    };
    //获取码表中的支付字典
    HrBaseCode.getBaseCode("PAY_WAY_DICT", function (data) {
        HrArray.pushAll(payWayDicts, data);
        payWayDicts.forEach(function(payWayDict) {
            payWayIsPatientPayMap[payWayDict.codeName] = payWayDict.ctrvalue3;
        });
    });

    var getPaymentsMasterDefault = function() {
        return new PaymentsMaster();
    };

    var createPaymentsMaster = function (clinicCate, payStatus, operatorEmpId, operatorEmpName,
                                                    paymentsMoneys, settleMasters, HrClinicCate) {
        var paymentsMaster = new PaymentsMaster();
        paymentsMaster.clinicCate = clinicCate;
        paymentsMaster.payStatus = payStatus;
        paymentsMaster.operatorEmpId = operatorEmpId;
        paymentsMaster.operatorEmpName = operatorEmpName;
        paymentsMaster.paymentsMoneys = paymentsMoneys;
        if (angular.equals(HrClinicCate.INP, clinicCate)) {
            paymentsMaster.inpSettleMasters = settleMasters;
        } else {
            paymentsMaster.outpSettleMasters = settleMasters;
        }
        return paymentsMaster;
    };

    var getRefundPaymentsMaster = function(settleMasters, oriPaymentsMasters, groupPaymentsMasters, clinicCate, operatorEmpId,
                                           operatorEmpName, HrClinicCate) {
        var paymentsMaster = new PaymentsMaster();
        paymentsMaster.clinicCate = clinicCate;
        paymentsMaster.operatorEmpId = operatorEmpId;
        paymentsMaster.operatorEmpName = operatorEmpName;
        paymentsMaster.paymentsMoneys = [];
        paymentsMaster.groupNo = groupPaymentsMasters[0].groupNo;
        if (angular.equals(HrClinicCate.INP, clinicCate)) {
            paymentsMaster.inpSettleMasters = settleMasters;
        } else {
            paymentsMaster.outpSettleMasters = settleMasters;
        }
        var totalNeedPay = 0;
        var totalRealPay = 0;
        settleMasters.forEach(function(settleMaster) {
            totalNeedPay = HrMath.fixArithmetic(totalNeedPay, settleMaster.totalNeedSelfpay, "+");
        });
        paymentsMaster.totalPay = totalNeedPay;

        paymentsMaster.payStatus = -1;
        var oriPaymentsMoneys = angular.copy(oriPaymentsMasters.paymentsMoneys);

        oriPaymentsMoneys.forEach(function(oriPaymentsMoney) {
            var paymentsMoney = new PaymentsMoney();
            paymentsMoney.moneyType = oriPaymentsMoney.moneyType;
            paymentsMoney.paymentAmount = -oriPaymentsMoney.paymentAmount;
            paymentsMaster.paymentsMoneys.push(paymentsMoney);
            totalRealPay = HrMath.fixArithmetic(totalRealPay, paymentsMoney.paymentAmount, "+");
        });
        paymentsMaster.paymentsMoneys.sort(function(a, b) {
            return a - b;
        });
        var difference = HrMath.fixArithmetic(totalNeedPay, totalRealPay, "-");

        if (difference < 0) {
            var paymentsMoney = new PaymentsMoney();
            paymentsMoney.moneyType = moneyType.CASH.moneyTypeCode;
            paymentsMoney.paymentAmount = difference;
            paymentsMaster.paymentsMoneys.push(paymentsMoney);
        } else if (difference > 0) {
            paymentsMaster.paymentsMoneys.forEach(function(paymentsMoneys) {
                if (difference !== 0) {
                    if (paymentsMoneys.paymentAmount >= 0 || angular.equals(moneyType.ROUND.moneyTypeCode, paymentsMoneys.moneyType)) {

                    } else {
                        if (difference > -paymentsMoneys.paymentAmount) {
                            paymentsMoneys.paymentAmount = 0;
                            difference = HrMath.fixArithmetic(difference, paymentsMoneys.paymentAmount, "+");
                        } else {
                            paymentsMoneys.paymentAmount = HrMath.fixArithmetic(difference, paymentsMoneys.paymentAmount, "+");
                            difference = 0;
                        }
                    }
                }
            });
        }

        if (paymentsMaster.paymentsMoneys.length > 1) {
            paymentsMaster.paymentsMoneys = paymentsMaster.paymentsMoneys.filter(function(paymentsMoney) {
                return paymentsMoney.paymentAmount !== 0;
            });
        }

        if (angular.equals(HrClinicCate.INP, clinicCate)) {
            var tempPaymentsMoneys = paymentsMaster.paymentsMoneys;
            paymentsMaster.paymentsMoneys = [];
            var paymentsMoneyCash = new PaymentsMoney();
            paymentsMoneyCash.moneyType = moneyType.CASH.moneyTypeCode;
            paymentsMoneyCash.paymentAmount = 0;
            tempPaymentsMoneys.forEach(function(paymentsMoney) {
                if (angular.equals(payWayIsPatientPayMap[paymentsMoney.moneyType], "1")) {
                    paymentsMaster.paymentsMoneys.push(paymentsMoney);
                } else {
                    paymentsMoneyCash.paymentAmount = HrMath.fixArithmetic(paymentsMoneyCash.paymentAmount, paymentsMoney.paymentAmount, "+")
                }
            });
            if (paymentsMoneyCash.paymentAmount !== 0) {
                paymentsMaster.paymentsMoneys.splice(0, 0, paymentsMoneyCash);
            }
        }

        return paymentsMaster;
    };

    var createPaymentsMasterForMoreSettleMasters = function (clinicCate, payStatus, operatorEmpId, operatorEmpName,
                                                                        paymentsMoneys, settleMasters, HrClinicCate) {
        paymentsMoneys.forEach(function(paymentsMoney) {
            paymentsMoney.$$remainingPaymentAmount = paymentsMoney.paymentAmount;
        });
        settleMasters.forEach(function(settleMaster) {
            var totalNeedSelPay = settleMaster.totalNeedSelfpay;
            settleMaster.$$paymentsMoneys = [];

            paymentsMoneys.forEach(function(paymentsMoney) {
                if (paymentsMoney.$$remainingPaymentAmount != 0 && totalNeedSelPay !== 0) {
                    if (paymentsMoney.$$remainingPaymentAmount < 0) {
                        if (totalNeedSelPay > -paymentsMoney.$$remainingPaymentAmount) {
                            var tempPaymentsMoney = angular.copy(paymentsMoney);
                            tempPaymentsMoney.paymentAmount = paymentsMoney.$$remainingPaymentAmount;
                            settleMaster.$$paymentsMoneys.push(tempPaymentsMoney);
                            paymentsMoney.$$remainingPaymentAmount = 0;
                            totalNeedSelPay = HrMath.fixArithmetic(totalNeedSelPay, paymentsMoney.$$remainingPaymentAmount, "-");
                        }
                    }
                }
            });

            paymentsMoneys.forEach(function(paymentsMoney) {
                if (paymentsMoney.$$remainingPaymentAmount != 0 && totalNeedSelPay !== 0) {
                    if (totalNeedSelPay > paymentsMoney.$$remainingPaymentAmount) {
                        var tempPaymentsMoney = angular.copy(paymentsMoney);
                        tempPaymentsMoney.paymentAmount = paymentsMoney.$$remainingPaymentAmount;
                        settleMaster.$$paymentsMoneys.push(tempPaymentsMoney);
                        paymentsMoney.$$remainingPaymentAmount = 0;
                        totalNeedSelPay = HrMath.fixArithmetic(totalNeedSelPay, paymentsMoney.$$remainingPaymentAmount, "-");
                    } else if (totalNeedSelPay <= paymentsMoney.$$remainingPaymentAmount) {
                        var tempPaymentsMoney = angular.copy(paymentsMoney);
                        tempPaymentsMoney.paymentAmount = totalNeedSelPay;
                        settleMaster.$$paymentsMoneys.push(tempPaymentsMoney);
                        paymentsMoney.$$remainingPaymentAmount = HrMath.fixArithmetic(paymentsMoney.$$remainingPaymentAmount, totalNeedSelPay, "-");
                        totalNeedSelPay = 0;
                    }
                }
            });
        });
        var paymentsMasters = [];
        settleMasters.forEach(function(settleMaster) {
            var paymentsMaster = new PaymentsMaster();
            paymentsMaster.clinicCate = clinicCate;
            paymentsMaster.payStatus = payStatus;
            paymentsMaster.operatorEmpId = operatorEmpId;
            paymentsMaster.operatorEmpName = operatorEmpName;
            paymentsMaster.paymentsMoneys = settleMaster.$$paymentsMoneys;
            if (angular.equals(HrClinicCate.INP, clinicCate)) {
                paymentsMaster.inpSettleMasters = [settleMaster];
            } else {
                paymentsMaster.outpSettleMasters = [settleMaster];
            }
            paymentsMasters.push(paymentsMaster);
        });

        return paymentsMasters;
    };

    var getPaymentsMasterByRefundPaymentsMaster = function(refundPaymentsMaster, showPaymentsMoneys, paymentsMaster,
                                                                      groupPaymentsMasters, settleMasters, clinicCate, operatorEmpId, operatorEmpName, HrClinicCate) {
        paymentsMaster.clinicCate = clinicCate;
        paymentsMaster.operatorEmpId = operatorEmpId;
        paymentsMaster.operatorEmpName = operatorEmpName;
        paymentsMaster.paymentsMoneys = [];
        paymentsMaster.groupNo = groupPaymentsMasters[0].groupNo;
        if (angular.equals(HrClinicCate.INP, clinicCate)) {
            paymentsMaster.inpSettleMasters = settleMasters;
        } else {
            paymentsMaster.outpSettleMasters = settleMasters;
        }
        var totalNeedPay = 0;//收支付金额
        settleMasters.forEach(function(settleMaster) {
            totalNeedPay = HrMath.fixArithmetic(totalNeedPay, settleMaster.totalNeedSelfpay, "+");
        });
        refundPaymentsMaster.paymentsMoneys.forEach(function(paymentsMoney) {
            if (totalNeedPay !== 0) {
                if (paymentsMoney.paymentAmount >= 0) {
                    if (totalNeedPay > paymentsMoney.paymentAmount) {
                        var tempPaymentsMoney = angular.copy(paymentsMoney);
                        paymentsMaster.paymentsMoneys.push(tempPaymentsMoney);
                        totalNeedPay = HrMath.fixArithmetic(totalNeedPay, tempPaymentsMoney.paymentAmount, "-");
                        paymentsMoney.$$remainingPaymentAmount = 0;
                    } else {
                        var tempPaymentsMoney = angular.copy(paymentsMoney);
                        tempPaymentsMoney.paymentAmount = totalNeedPay;
                        paymentsMaster.paymentsMoneys.push(tempPaymentsMoney);
                        totalNeedPay = 0;
                        paymentsMoney.$$remainingPaymentAmount = HrMath.fixArithmetic(totalNeedPay, tempPaymentsMoney.paymentAmount, "-");
                    }
                } else {
                    if (totalNeedPay >= -paymentsMoney.paymentAmount) {
                        var tempPaymentsMoney = angular.copy(paymentsMoney);
                        tempPaymentsMoney.paymentAmount = -tempPaymentsMoney.paymentAmount;
                        paymentsMaster.paymentsMoneys.push(tempPaymentsMoney);
                        totalNeedPay = HrMath.fixArithmetic(totalNeedPay, paymentsMoney.paymentAmount, "+");
                        paymentsMoney.$$remainingPaymentAmount = 0;
                    } else {
                        var tempPaymentsMoney = angular.copy(paymentsMoney);
                        tempPaymentsMoney.paymentAmount = totalNeedPay;
                        paymentsMaster.paymentsMoneys.push(tempPaymentsMoney);
                        paymentsMoney.$$remainingPaymentAmount = HrMath.fixArithmetic(totalNeedPay, paymentsMoney.paymentAmount, "+");
                        totalNeedPay = 0;
                    }
                }
            }
        });

        refundPaymentsMaster.paymentsMoneys.forEach(function(paymentsMoney) {
            if (paymentsMoney.$$remainingPaymentAmount !== 0) {
                var tempPaymentsMoney = angular.copy(paymentsMoney);
                tempPaymentsMoney.paymentAmount = tempPaymentsMoney.$$remainingPaymentAmount;
                showPaymentsMoneys.push(tempPaymentsMoney);
            }
        });
    };

    return {
        moneyType: moneyType,
        getPaymentsMasterDefault: getPaymentsMasterDefault,
        createPaymentsMaster: createPaymentsMaster,
        getRefundPaymentsMaster: getRefundPaymentsMaster,
        createPaymentsMasterForMoreSettleMasters: createPaymentsMasterForMoreSettleMasters,
        getPaymentsMasterByRefundPaymentsMaster: getPaymentsMasterByRefundPaymentsMaster
    };
}]);