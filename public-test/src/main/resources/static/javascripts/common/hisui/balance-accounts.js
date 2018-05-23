angular.module('hr.service').factory("",["PluginManager",function(PluginManager){

    /**
     *对账输入参数
     * @param cardType 卡类型
     * @param operatorId 收费员id
     */
    var balanceAccount = function (cardType, operatorId){
    };
    //对账结果输出参数
    var balanceAccountResult = {
        state :{
            success:"",  //对账成功
            errorMessage :"" //失败原因
        }
    };

    return {
        balanceAccount : balanceAccount
    };
}]);