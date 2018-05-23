angular.module("hr.service").factory("HrApportion", ["$http", "HrClinicCate", "PluginManager", function($http, HrClinicCate, PluginManager) {

    var settleStatusEnum = {
        RECEIPTS : 1,
        REFUND : -1
    };

    var apportion = function (clinicCate, settleStatus, chargeType, extraInfo, callback) {
        var apportionResult = {
            state: {
                success: false,
                printFactRcpt: false,
                errorNo: "",
                errorMessage: ""
            },
            settleMaster: {}
        };

        if (settleStatus === settleStatusEnum.RECEIPTS) {
            apportionResult.state.printFactRcpt = true;
        }

        if (angular.equals("自费", chargeType)) {
            apportionResult.state.success = true;
            apportionResult.settleMaster = selfApportion(clinicCate, settleStatus, chargeType, extraInfo.billDetails, extraInfo.operatorEmpId, extraInfo.factRcptNo);
            if (typeof callback === "function") {
                callback(apportionResult);
            }
        } else {
            var businessObj = {
                operationType : "Apportion",
                sender: extraInfo.operatorEmpId,
                clinicCate: clinicCate,
                settleStatus: settleStatus,
                chargeType: chargeType,
                invoiceNo: extraInfo.factRcptNo,
                tradeNo: extraInfo.traceNo !== undefined ? extraInfo.traceNo : "",
                recipes: [],
                billDetails: extraInfo.billDetails
            };

            console.log(businessObj);
            PluginManager.sendTransToPlugin("apportion", "001", angular.toJson(businessObj), {
                success: function (data) {
                    console.log("------apportion success------------");
                    console.log(data);
                    var apportionResultTemp = angular.fromJson(data.appendDescription);
                    console.log(apportionResultTemp);
                    var errorDescription = data.errorDescription;
                    if ((apportionResultTemp === null || apportionResultTemp === undefined) && errorDescription === null) {
                        apportionResult.state.success = true;
                        apportionResult.settleMaster = selfApportion(clinicCate, settleStatus, chargeType, extraInfo.billDetails, extraInfo.operatorEmpId, extraInfo.factRcptNo);
                    } else if (apportionResultTemp !== null) {
                        apportionResult = apportionResultTemp;
                        if (apportionResult.state.success) {
                            apportionResult.settleMaster.clinicCate = clinicCate;
                            apportionResult.settleMaster.chargeType = chargeType;
                            apportionResult.settleMaster.settleStatus = settleStatus;
                            apportionResult.settleMaster.operatorEmpId = extraInfo.operatorEmpId;
                            apportionResult.settleMaster.billDetails = extraInfo.billDetails;
                        }
                    } else {
                        apportionResult.state.success = false;
                        apportionResult.state.errorMessage = errorDescription;
                    }
                    if (!apportionResult.state.success) {
                        apportionResult.settleMaster = selfApportion(clinicCate, settleStatus, chargeType, extraInfo.billDetails, extraInfo.operatorEmpId, extraInfo.factRcptNo);
                    }
                    if (typeof callback === "function") {
                        callback(apportionResult);
                    }
                },
                error: function (data) {
                    console.log("------apportion error------------");
                    console.log(data);
                    apportionResult.state.success = false;
                    var errorMessage = data ? data.errorDescription : "未返回分摊信息";
                    if (errorMessage === null || errorMessage === undefined || errorMessage === "") {
                        apportionResult.state.errorMessage = "未返回分摊信息";
                    } else {
                        apportionResult.state.errorMessage = errorMessage;
                    }
                    if (!apportionResult.state.success) {
                        apportionResult.settleMaster = selfApportion(clinicCate, settleStatus, chargeType, extraInfo.billDetails, extraInfo.operatorEmpId, extraInfo.factRcptNo);
                    }
                    if (typeof callback === "function") {
                        callback(apportionResult);
                    }
                }
            });
        }
    };

    var selfApportion = function(clinicCate, settleStatus, chargeType, billDetails, operatorEmpId, factRcptNo) {
        var settleMaster = {};
        var totalCosts = 0;
        var totalCharges = 0;
        billDetails.forEach(function(billDetail) {
            totalCosts = HrMath.fixArithmetic(totalCosts, billDetail.costs, "+");
            totalCharges = HrMath.fixArithmetic(totalCharges, billDetail.charges, "+");
        });
        settleMaster.totalCosts = totalCosts;
        settleMaster.totalCharges= totalCharges;
        settleMaster.totalReduces= 0;
        settleMaster.totalApportBala= 0;
        settleMaster.totalNeedSelfpay= totalCharges;
        settleMaster.apportionItemses = [{sectName: "个人自付", apportAmount: totalCharges, payorType: "1"}];
        if (totalCosts !== totalCharges) {
            settleMaster.apportionItemses.push({sectName: "医院减免", apportAmount: HrMath.fixArithmetic(totalCosts, totalCharges, "-"), payorType: "2"});
        }
        settleMaster.clinicCate = clinicCate;
        settleMaster.chargeType = chargeType;
        settleMaster.settleStatus = settleStatus;
        settleMaster.operatorEmpId = operatorEmpId;
        settleMaster.billDetails = billDetails;

        return settleMaster;
    };

    var confirmApportion = function(chargeType, callback) {
        var result = {
            success: false,
            errorNo: "",
            errorMessage: ""
        };
        if (angular.equals("自费", chargeType)) {
            result.success = true;
            if (typeof callback === "function") {
                callback(result);
            }
        } else {
            var businessObj = {
                operationType : "ConfirmTrade",
                chargeType: chargeType
            };
            console.log(businessObj);
            PluginManager.sendTransToPlugin("apportion", "001", angular.toJson(businessObj), {
                success: function (data) {
                    console.log("------ConfirmTrade success------------");
                    console.log(data);
                    var appendDescription = angular.fromJson(data.appendDescription);
                    var errorDescription = data.errorDescription;
                    if ((appendDescription === null || appendDescription === undefined) && errorDescription === null) {
                        result.success = true;
                    } else if (appendDescription !== null) {
                        result = appendDescription;
                    } else {
                        result.success = false;
                        result.errorMessage = errorDescription;
                    }
                    if (typeof callback === "function") {
                        callback(result);
                    }
                },
                error: function (data) {
                    console.log("------ConfirmTrade error------------");
                    console.log(data);
                    var errorMessage = data.errorDescription;
                    result.success = false;
                    if (errorMessage === null || errorMessage === undefined || errorMessage === "") {
                        result.errorMessage = "确认结算异常";
                    } else {
                        result.errorMessage = errorMessage;
                    }
                    if (typeof callback === "function") {
                        callback(result);
                    }
                }
            });
        }
    };
    return {
        settleStatus: settleStatusEnum,
        apportion: apportion,
        confirmApportion: confirmApportion
    };
}]);

