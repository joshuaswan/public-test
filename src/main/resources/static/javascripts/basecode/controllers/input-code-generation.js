///**
// * Created by niuyaoyao on 2016/3/22.
// */
//var inputCodeGenerationApp = angular.module('inputCodeGenerationApp', []);
//inputCodeGenerationApp.controller("inputCodeGenerationController",["$scope","$http",function($scope,$http){
//    $scope.testTxt2 = "";
//    $scope.produce = produce;
//    $scope.column1 = "";
//    $scope.column2 = "";
//    $scope.inputLength = 10;
//
//    function produce() {
//        $http.get(Path.getUri("api/statistics-visitors-inp-loads/test1?tableName=" + $scope.tableName + "&column1=" + $scope.column1 + "&column2=" + $scope.column2 + "&inputLength=" + $scope.inputLength))
//            .success(function (data) {
//                alert("操作成功");
//            }).error(function (data) {
//                console.error(data);
//            })
//    }
//
//    //返回九宫格关闭页面
//    $scope.close = function () {
//        closeThisByMain();
//    };
//
//}]);

/**
 * Created by niuyaoyao on 2016/4/21.
 */
var svnVersionApp = angular.module('svnVersionApp',["hr", 'ngGrid', 'ui', 'ui.bootstrap']);
svnVersionApp.controller('svnVersionController',['$scope','$http',function($scope,$http){
    var baseURL = Path.getUri("api");
    $scope.aColumnDefs = [];
    $scope.aColumnDefss = [];
    $scope.svnData = [];
    $scope.selectedItem = [];
    $scope.svnFiles = [];
    //当前点击获取到的文件
    $scope.filesItem = {};

    $scope.aColumnDefs.push({field : 'svnVersion',displayName : 'SVN版本号',width : '15%'});
    $scope.aColumnDefs.push({field : 'author',displayName : '操作者',width : '19%'});
    $scope.aColumnDefs.push({field : 'log',displayName : '修改信息',width : '46%'});
    $scope.aColumnDefs.push({field : 'commitDate | date:"yy-MM-dd HH:mm"',displayName : '提交时间',width : '20%'});
    $scope.aColumnDefss.push({field : 'commitFiles',displayName : '变动文件'});

    $scope.svnGridOpt = {
        data : "svnData",
        columnDefs : 'aColumnDefs',
        selectedItems : $scope.selectedItem,
        enableRowSelection: true
    };
    $scope.lastSvn = 25000;

    activate();

    function activate() {
        $http.get(baseURL + "/security/build-info/")
            .success(function (data) {
                svnNumber = data.svnNumber;
                $http.get(baseURL + "/base-code-type/svn-version?newSvn=" + svnNumber + "&lastSvn=" + $scope.lastSvn)
                    .success(function (data) {
                        $scope.svnData = angular.copy(data);
                    }).error(function (data) {
                        //console.error(data);
                    });
            }).error(function (data, status, headers, config) {
                console.log("查询构建信息出错！");
            });
    }


    $scope.$watch("selectedItem",function(newValue,oldValue){
        if(newValue){
            $scope.svnFiles = [];
            angular.forEach(newValue,function(item){
                for(prop in item.commitFiles){
                    $scope.svnFiles.push(prop);
                }
            });
        }
    },true);
}]);