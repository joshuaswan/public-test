angular.module("hr.service").factory("HrInpMedical", ["$http", "PluginManager", function ($http, PluginManager) {
    var staffObj = getStaffDict();

    var hospitalCode = "";
    var hospitalName = "";

    var inpRecordResult = {
        state: {
            success: false,
            errorMessage: ""
        }
    };

    /**
     * 根据就诊流水号查询诊断类型，描述和其所有编码
     * @param visitNo 住院流水号
     * @param callback
     */
    function getDiagnosisInfo(visitNo, callback) {
        $http.get(Path.getUri("api/diagnosis/diag-category/") + visitNo).success(function (data, status) {
            callback(data);
        }).error(function (data, status) {
                callback(data);
            });
    }

    /**
     * 新建就诊档案
     * @param cardType
     * @param clinicCate
     * @param visitTime
     * @param deptCode
     * @param doctorId
     * @param callback
     * @returns {boolean}
     */
    var newInpRecord = function (cardType, clinicCate, visitNo, visitTime, deptCode, doctorId, doctorName, callback) {
        getDiagnosisInfo(visitNo, function (diagnosis) {
            var businessObj = {
                operationType: "InsertMedical",
                cardType: cardType,
                visitNo: visitNo,
                clinicCate: clinicCate,
                visitTime: visitTime,
                diagnosisInfo: diagnosis,
                deptCode: deptCode,
                doctorId: doctorId,
                operatorId: staffObj.empId,
                operatorName: staffObj.staffName,
                hospitalCode: hospitalCode,
                hospitalName: hospitalName
            };
            console.log("----------------建档输入插件的对象------------------");
            console.log(businessObj);
            PluginManager.sendTransToPlugin("inpMedical", "1", angular.toJson(businessObj), {
                success: function (data) {
                    console.log("-----------建档成功---------------");
                    var appendDescription = angular.fromJson(data.appendDescription);
                    var errorDescription = data.errorDescription;
                    if ((appendDescription === null || appendDescription === undefined) && errorDescription === null) {
                        inpRecordResult.state.success = true;
                    } else if (appendDescription !== null) {
                        inpRecordResult.state = appendDescription;
                    } else {
                        inpRecordResult.state.success = false;
                        inpRecordResult.state.errorMessage = errorDescription;
                    }
                    if (typeof callback === "function") {
                        callback(inpRecordResult.state);
                    }
                },
                error: function (data) {
                    console.log("-----------建档失败---------------");
                    var errorMessage = data.errorDescription;
                    inpRecordResult.state.success = false;
                    if (errorMessage === null || errorMessage === undefined || errorMessage === "") {
                        inpRecordResult.state.errorMessage = "建立就诊档案异常";
                    } else {
                        inpRecordResult.state.errorMessage = errorMessage;
                    }
                    if (typeof callback === "function") {
                        callback(inpRecordResult.state);
                    }
                }
            });
        });
    };

    //就诊档案修改
    var updateInpRecord = function (cardType, clinicCate, visitNo, deptCode, bedNumber, doctorId, doctorName, disChargeTime, disChargeReason, callback) {
        getDiagnosisInfo(visitNo, function (diagnosis) {
            var businessObj = {
                operationType: "InsertMedical",
                cardType: cardType,
                visitNo: visitNo,
                clinicCate: clinicCate,
                deptCode: deptCode,
                bedNumber: bedNumber,
                doctorId: doctorId,
                doctorName: doctorName,
                operatorName: staffObj.staffName,

                diagnosisInfo: diagnosis,
                disChargeTime: disChargeTime,
                disChargeReason: disChargeReason,
                hospitalCode: hospitalCode,
                hospitalName: hospitalName
            };
            PluginManager.sendTransToPlugin("inpMedical", "1", angular.toJson(businessObj), {
                success: function (data) {
                    console.log("-----------修改成功---------------");
                    console.log(data);
                    var appendDescription = angular.fromJson(data.appendDescription);
                    var errorDescription = data.errorDescription;
                    if ((appendDescription === null || appendDescription === undefined) && errorDescription === null) {
                        inpRecordResult.state.success = true;
                    } else if (appendDescription !== null) {
                        inpRecordResult.state = appendDescription;
                    } else {
                        inpRecordResult.state.success = false;
                        inpRecordResult.state.errorMessage = errorDescription;
                    }
                    if (typeof callback === "function") {
                        callback(inpRecordResult.state);
                    }
                },
                error: function (data) {
                    console.log("-----------修改失败---------------");
                    console.log(data);
                    var errorMessage = data.errorDescription;
                    inpRecordResult.state.success = false;
                    if (errorMessage === null || errorMessage === undefined || errorMessage === "") {
                        inpRecordResult.state.errorMessage = "修改就诊档案异常";
                    } else {
                        inpRecordResult.state.errorMessage = errorMessage;
                    }
                    if (typeof callback === "function") {
                        callback(inpRecordResult.state);
                    }
                }
            });
        });
    };

    //撤销就诊档案
    var deleteInpRecord = function (visitNo,callback) {
        var businessObj = {
            operationType: "RemoveMedical",
            visitNo: visitNo,
            operatorName: staffObj.staffName
        };
        PluginManager.sendTransToPlugin("inpMedical", "1", angular.toJson(businessObj), {
            success: function (data) {
                console.log("-----------撤销档案失败成功---------------");
                console.log(data);
                var appendDescription = angular.fromJson(data.appendDescription);
                var errorDescription = data.errorDescription;
                if ((appendDescription === null || appendDescription === undefined) && errorDescription === null) {
                    inpRecordResult.state.success = true;
                } else if (appendDescription !== null) {
                    inpRecordResult.state = appendDescription;
                } else {
                    inpRecordResult.state.success = false;
                    inpRecordResult.state.errorMessage = errorDescription;
                }
                if (typeof callback === "function") {
                    callback(inpRecordResult.state);
                }
            },
            error: function (data) {
                console.log("-----------撤销档案失败---------------");
                console.log(data);
                var errorMessage = data.errorDescription;
                inpRecordResult.state.success = false;
                if (errorMessage === null || errorMessage === undefined || errorMessage === "") {
                    inpRecordResult.state.errorMessage = "撤销就诊档案异常";
                } else {
                    inpRecordResult.state.errorMessage = errorMessage;
                }
                if (typeof callback === "function") {
                    callback(inpRecordResult.state);
                }
            }
        });
    };

    return {
        newMedicalInpRecord: newInpRecord,
        updateMedicalInpRecord: updateInpRecord,
        deleteMedicalInpRecord: deleteInpRecord
    };
}]);