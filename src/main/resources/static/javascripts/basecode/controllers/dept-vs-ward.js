/*护理单元与科室对照维护 create by song 2015/11/23*/
var deptVsWardModule = angular.module("baseCodeDeptVsWard",['ui','hr','ui.bootstrap','ngGrid']);
deptVsWardModule.value('ui.config', {
    select2: {
        allowClear: true,
        matcher: function (term, text, opt) {
            var code = opt.attr('code') || '';
            var reg = new RegExp(term.toUpperCase());
            return reg.test(code) || reg.test(text);
        }
    }
});
deptVsWardModule.controller("DeptVsWardController",["$scope","$http","hrDialog",function($scope,$http,hrDialog){
    var baseURL = Path.getUri("api");
    $scope.wardCodeList=[];//所有护理单元
    $scope.deptCodeList=[];//所有临时科室
    $scope.saveDept={ //待保存的临时科室
        wardCode:"",
        deptCode:""
    };

    //初始化信息
    var init=function(){
        //获取所有的护理单元
        $http.get(baseURL+"/dept-dicts/all/ward-depts").success(function(data){
            console.info(data);
            $scope.wardCodeList=data;
            //$.fn.zTree.init($("#treeDemo"), setting, $scope.wardCodeList);
        }).error(function(data){
            console.info("获取护理单元信息出错");
        });
        //获取所有临时科室
        $http.get(baseURL+"/dept-dicts/by-clinic-attr/0").success(function(data){
            $scope.deptCodeList=data;
            console.info(data);
        }).error(function(data){

        });
    };
    init();

    //选中的护理单元
    $scope.selectedWardInfo={};
    //科室集合
    $scope.deptList=[];
    //选中事件
    $scope.selectedClick=function(index){
        $scope.saveDept.deptCode="";
        $scope.seletedDeptInfo.length=0;
        $scope.selectedWardInfo=index;
        $scope.saveDept.wardCode=$scope.selectedWardInfo.deptId;
        console.info($scope.selectedWardInfo);
        $http.get(baseURL+"/dept-dicts/dept-by-ward/"+index.deptId).success(function(data){
            console.info(data);
            $scope.deptList=data;
        }).error(function(){

        });
    };
/*----------------------科室Grid配置----------------------------------*/
    $scope.seletedDeptInfo=[];
    $scope.deptDictsGrid = {
        data: 'deptList',
        selectedItems:$scope.seletedDeptInfo,
        columnDefs: 'deptGridColumnDefs',
        enableSorting: false
    };
    $scope.deptGridColumnDefs=[{field:'deptId',displayName:'科室代码',width:'25%'},
        {field:'deptName',displayName:'科室名称',width:'25%'},
        {field:'clinicAttr',displayName:'临床科室属性',width:'25%'},
        {field:'internalOrSergery',displayName:'内外科标志',width:'25%'}
    ];


    /*----------------------------------------功能区域------------------------------------------*/
    $scope.showAddOpts=false;
    $scope.oldEditDeptCode='';
    $scope.validSave=true;
    $scope.addBaseDict=function(){//打开新增modal
        if($("#fou-add-search").attr("class")){
            return false;
        };
        $scope.showAddOpts=true;
        $scope.paramModal = true;
    };
    $scope.editBaseDict=function(){//打开编辑
        if($("#fou-edit-search").attr("class")){
            return false;
        };
        $scope.saveDept.deptCode=$scope.seletedDeptInfo[0].deptId;
        $scope.oldEditDeptCode=$scope.seletedDeptInfo[0].deptId;
        $scope.showAddOpts=false;
        $scope.paramModal = true;
    };
    $scope.saveDeptFun=function(){//保存
        $scope.validSave=true;
        if($scope.deptList){
            $scope.deptList.forEach(function(index){
                if(index.deptId===$scope.saveDept.deptCode){
                    $scope.validSave=false;
                    return false;
                };
            });
        };
        if(!$scope.validSave){//不允许保存
            return false;
        }else{
            $scope.deptCodeList.forEach(function(index){
                if(index.deptId==$scope.saveDept.deptCode){
                    $http.post(baseURL+"/dept-dicts/save-deptVsWard?isAdd="+$scope.showAddOpts+"&oldDeptCode="+$scope.oldEditDeptCode,$scope.saveDept).success(function(data){
                        $scope.selectedClick($scope.selectedWardInfo);
                        $scope.closeParamModal();
                        return false;
                    }).error(function(data){
                        console.info("保存临时科室出错");
                    });
                };
            });
        }
    };

    var opts = {
        title: '删除提示',
        message: '是否删除已选择科室？',
        buttons: [
            {result: "yes", label: '是',cssClass:'btn-primary'},
            {result: 'no', label: '否'}
        ]
    };
    $scope.deleteDept=function(){  //删除
        if($("#fou-del-search").attr("class")){
            return false;
        };
        hrDialog.dialog(hrDialog.typeEnum.CONFIRM,opts).close(function(result){
            if(result=='no'|| result=='close'){
                return false;
            }else{
                $scope.saveDept.deptCode=$scope.seletedDeptInfo[0].deptId;
                console.info($scope.saveDept);
                $http.delete(baseURL+"/dept-dicts/delete-deptVsWard?wardCode="+$scope.saveDept.wardCode+"&deptCode="+$scope.saveDept.deptCode).success(function(data){
                    $scope.selectedClick($scope.selectedWardInfo);
                }).error(function(data){

                });
            };
        });

    };
    $scope.close = function () {
        closeThisByMain();
    };


/*-----------------------modal------------------------*/
    $scope.paramModal = false;
    $scope.closeParamModal=function(){
        $scope.paramModal = false;
        $scope.showAddOpts=false;
        $scope.saveDept.deptCode="";
    };
    $scope.opts = {
        dialogClass: "modal",
        backdropFade: true,
        dialogFade: true,
        keyboard: false,
        backdrop: true,
        backdropClick: false
    };

/*---------------------------监听器------------------------------------*/
    $scope.$watch('saveDept.deptCode',function(newValue,oldValue){
        //console.info(newValue);
        //console.info(oldValue);
      if(newValue!=oldValue){
          $scope.saveDept.deptCode=newValue;
      }
    });


    //$scope.wardCodeList=[];
    //function showIconForTree(treeId, treeNode) {
    //    return treeNode.level == 2;
    //}
    //var setting = {
    //    view: {
    //        dblClickExpand: dblClickExpand,
    //        showIcon:showIconForTree,
    //        showLine:false
    //    },
    //    data: {
    //        key: {
    //            name: "deptName"
    //        },
    //        simpleData: {
    //            enable: true,
    //            idKey: "1",
    //            pIdKey: null
    //        }
    //    },
    //    callback:{
    //        onClick:zOnClick
    //    }
    //};
    ////双击伸缩
    //function dblClickExpand(treeId, treeNode) {
    //    return treeNode.level >= 0;
    //}
    ////回调处理函数
    //var zOnClick=function(event, treeId, treeNode){
    //
    //    console.info(treeNode.leafFlag);
    //};

}]);