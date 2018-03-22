angular.module("hr.service").factory("HrReadCard", ["$http", "PluginManager", function ($http, PluginManager) {
    var readCard = function(cardType,callback){
        var result = {
            state : {
                success: false,
                errorNo: "",
                errorMessage: ""
            }
        };
        PluginManager.sendTransToPlugin("ReadCard", "0", angular.toJson({cardType: cardType}), {
            success: function (data) {
                var appendDescription = angular.fromJson(data.appendDescription);
                var errorDescription = data.errorDescription;
                console.log("get card info sueecss----success---");
                console.log(data);
                if ((appendDescription === null || appendDescription === undefined) && errorDescription === null) {
                    result = {
                        state : {
                            success: true
                        }
                    }
                } else if (appendDescription !== null) {
                    result = appendDescription;
                } else {
                    result = {
                        state : {
                            success: false,
                            errorMessage: errorDescription
                        }
                    };
                }
                if (typeof callback === "function") {
                    callback(result);
                }
            },
            error: function (data, status) {
                console.log("get card info error----error---");
                console.log(data);
                result = {
                    state : {
                        success: false,
                        errorMessage: ""
                    }
                };
                var errorMessage = data.errorDescription;
                if (errorMessage === null || errorMessage === undefined || errorMessage === "") {
                    result.state.errorMessage = "初始化设备异常";
                } else {
                    result.state.errorMessage = errorMessage;
                }
                if (typeof callback === "function") {
                    callback(result);
                }
            }
        });
    };
    return  {
        readCard : readCard
    };
}]);