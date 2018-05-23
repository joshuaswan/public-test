angular.module('hr.service').factory('Medicare', ['$http', 'PluginManager', function ($http, PluginManager) {
    var insurAccounts = {
        insurNo : "323456789",
        patientId : "P000806",
        name : "金秀贤",
        sex : "男",
        dateOfBirth : "1990-04-25",
        cardNo : "323456789012344",
        icNo : "3234567876432",
        idNo : "320134198804561",
        fromHosp : "解放军总医院",
        fromHospDate : "2014-05-10",
        personType : "02",
        personCount : 3000,
        chronicCode : "",
        fundType : "01",
        jcLevel : "",
        hospFlag : "",
        createDate : "",
        operator : getStaffDict().staffName
    };


    var businessObj1 = {
        operationType : "GetPersonInfo",
        chargeType: "北京医保"
    };

    PluginManager.sendTransToPlugin("apportion", "001", angular.toJson(businessObj1), {
        success: function (data) {
            console.log("------get info success------------");
            console.log(data);
        },
        error: function (data) {
            console.log("------get info error------------");
            console.log(data);
        }
    });

    var sendTransToMedicare = function(callBack){
        $http.post(Path.getUri("api/beijing-medicare/legal-account/"),insurAccounts).success(function(data,status){
            callBack.success(data);
        }).error(function(data,status){
            callBack.error(data);
            });
    };

    return{
        "sendTransToMedicare": sendTransToMedicare
    };
}]);