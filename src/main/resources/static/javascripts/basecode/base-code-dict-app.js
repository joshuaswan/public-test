var baseCodeDictApp = angular.module('baseCodeDictApp', ['ui','hr','ngGrid']);

baseCodeDictApp.filter('sysMark', function () {
    return function(input) {
        if(input===1){
            return "系统";
        }
        if(input===0){
            return "非系统";
        }
    };
});
baseCodeDictApp.filter('leafMark', function () {
    return function(input) {
        if(input===1){
            return "是";
        }
        if(input===0){
            return "否";
        }
    };
});
baseCodeDictApp.filter('stopMark', function () {
    return function(input) {
        if(input===1){
            return "停用";
        }
        if(input===0){
            return "在用";
        }
    };
});