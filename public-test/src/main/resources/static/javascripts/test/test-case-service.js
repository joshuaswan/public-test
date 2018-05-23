//angular.module("testCaseApp").factory("testCaseServices", ["$http", "hrDialog",
//    function ($http, hrDialog) {
//        var sendGetRequest = function(requestUri,callback){
//            HrUtils.httpRequest($http,requestUri,function(data){
//                callback(data);
//            },function(){
//
//            },hrDialog,HrUtils.httpMethod.GET,null);
//        };
//
//        return{
//            //获取测试项目信息
//            getAllTestProject:function(callback){
//                sendGetRequest("api/all-test-project",function(data){
//                    callback(data);
//                });
//            },
//            //查询对应测试项目中项目分组和测试用例信息
//            queryTestCase:function(nodeType,parentId,callback){
//                HrUtils.httpRequest($http,"api/test-case/get-test-case" + nodeType+"/"+parentId,function(data){
//                    callback(data);
//                },function(data,status){
//                    HrUtils.httpError(data,status,hrDialog);
//                },hrDialog,HrUtils.httpMethod.POST);
//            }
//        }
//    }
//])