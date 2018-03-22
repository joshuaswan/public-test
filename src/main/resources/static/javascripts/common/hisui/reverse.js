angular.module('hr.service').factory("reverseBusiness",["PluginManager",function(PluginManager){

    /**
     *冲正交易输入参数
     * @param cardType 卡类型
     * @param tradeNo 业务编码
     * @param operationType 操作类型
     * @param businessNo 时间(14)+医院编号+流水号(4)
     * @param reverseReason 冲正原因
     */
    var reverse = function(cardType, operationType, tradeNo, businessNo,reverseReason){};
    //冲正交易输入参数
    var reverseResult = {
        state : {
            success: "",//标识操作是否成功
            errorMessage: ""//错误原因，如果成功则为空
        }
    };

    return {
        reverseBusiness : reverse
    };
}]);
