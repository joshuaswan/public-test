baseCodeDictApp.value('ui.config', {
    jq: {
        tooltip: {
            placement: 'right'
        },
        dialog: {
            autoOpen: false
        }
    },
    date: {
        changeMonth: true,
        changeYear: true
    },
    select2: {
        allowClear: true
    }
});
baseCodeDictApp.controller("baseCodeTypeDictController",
    function baseCodeTypeDictController($scope,$http,hrDialog){

        var baseURL = Path.getUri("api");
        $scope.codeTypeId = "";
        $scope.addSave = "";
        $scope.showSaveMessageBox = false;
        $scope.showUpdateMessageBox = false;
        $scope.showDelMessageBox = false;
        $scope.showDeleteMessageBox = false;
        $scope.showWarnMessageBox = false;
        $scope.maxOneValue = "";
        $scope.sureDel = "";

        $scope.baseCodeType = {codeTypeId:"",codeTypeName:"",upCodeId:"",struct:"",fieldName:"",defaultCodeId:"",
            note:"",codeTypeDes:"",ctrvalue0:"",ctrvalue1:"",ctrvalue2:"",ctrvalue3:"",ctrvalue4:"",ctrvalue5:"",
            ctrvalue6:"",ctrvalue7:"",ctrvalue8:"",ctrvalue9:"", codeTypeClass: "1"};
        $scope.addCodeType = function(){
            if($scope.baseCodeTypes.length == 0 || $scope.selectedBaseCodeType == undefined){
                $scope.baseCodeType.upCodeId = "";
                $scope.upCodeTypeName = "";
                $scope.baseCodeType.codeTypeId = $scope.getBaseCodeTypeId();
            }else if($scope.baseCodeTypes.length > 0){
                $scope.baseCodeType.upCodeId = $scope.selectedBaseCodeType.id;
                $scope.upCodeTypeName = $scope.selectedBaseCodeType.name;
                $scope.baseCodeType.codeTypeId = $scope.getSunCodeTypeId($scope.selectedBaseCodeType.id);
            }
            $scope.addSave = "add";
            $scope.baseCodeType.codeTypeName = "";
            $scope.baseCodeType.struct = "";
            $scope.baseCodeType.fieldName = "";
            $scope.baseCodeType.defaultCodeId = "";
            $scope.baseCodeType.note = "";
            $scope.baseCodeType.codeTypeDes = "";
            $scope.baseCodeType.ctrvalue0 = "";
            $scope.baseCodeType.ctrvalue1 = "";
            $scope.baseCodeType.ctrvalue2 = "";
            $scope.baseCodeType.ctrvalue3 = "";
            $scope.baseCodeType.ctrvalue4 = "";
            $scope.baseCodeType.ctrvalue5 = "";
            $scope.baseCodeType.ctrvalue6 = "";
            $scope.baseCodeType.ctrvalue7 = "";
            $scope.baseCodeType.ctrvalue8 = "";
            $scope.baseCodeType.ctrvalue9 = "";
            $scope.baseCodeType.codeTypeClass = "1";
            $scope.getMaxOneValue();
        };

        $scope.editCodeType = function(){
            $scope.addSave = "";
            $scope.baseCodeType.upCodeId = $scope.selectedBaseCodeType.pId;
            $scope.upCodeTypeName = $scope.upCodeTypeDict.codeTypeName;
            $scope.baseCodeType.codeTypeId = $scope.selectedBaseCodeType.id;
            $scope.baseCodeType.codeTypeName = $scope.selectedCodeType.codeTypeName;
            $scope.baseCodeType.struct = $scope.selectedCodeType.struct;
            $scope.baseCodeType.fieldName = $scope.selectedCodeType.fieldName;
            $scope.baseCodeType.defaultCodeId = $scope.selectedCodeType.defaultCodeId;
            $scope.baseCodeType.note = $scope.selectedCodeType.note;
            $scope.baseCodeType.codeTypeDes =  $scope.selectedBaseCodeType.name;
            $scope.baseCodeType.ctrvalue0 = $scope.selectedCodeType.ctrvalue0;
            $scope.baseCodeType.ctrvalue1 = $scope.selectedCodeType.ctrvalue1;
            $scope.baseCodeType.ctrvalue2 = $scope.selectedCodeType.ctrvalue2;
            $scope.baseCodeType.ctrvalue3 = $scope.selectedCodeType.ctrvalue3;
            $scope.baseCodeType.ctrvalue4 = $scope.selectedCodeType.ctrvalue4;
            $scope.baseCodeType.ctrvalue5 = $scope.selectedCodeType.ctrvalue5;
            $scope.baseCodeType.ctrvalue6 = $scope.selectedCodeType.ctrvalue6;
            $scope.baseCodeType.ctrvalue7 = $scope.selectedCodeType.ctrvalue7;
            $scope.baseCodeType.ctrvalue8 = $scope.selectedCodeType.ctrvalue8;
            $scope.baseCodeType.ctrvalue9 = $scope.selectedCodeType.ctrvalue9;
            $scope.baseCodeType.codeTypeClass = ($scope.selectedCodeType.codeTypeClass === null || $scope.selectedCodeType.codeTypeClass === null) ?
                    "1" : $scope.selectedCodeType.codeTypeClass + "";
        };
        $scope.confirmDel = function(){
            if($scope.selectedBaseCodeType == undefined){

            }else{
                $http.delete(baseURL+"/base-code-type/del-type/"+$scope.selectedBaseCodeType.id).success(function(data,status){
                    if(200 == status){
                        $scope.successMessage = "删除码表类型成功";
                        $scope.openSuccessDialog();
                        $scope.reloadZTreeData();
                        $scope.clearCodeTypeData();
                    }
                }).error(function(data,status){
                    HrUtils.httpError (data, status, hrDialog);
                    });
            }
        };

        $scope.openConfirmDialog = function() {
            if($scope.selectedBaseCodeType == undefined){

            }else{
                var opts = {
                    title: '操作窗口',
                    message: '是否将'+'【'+$scope.sureDel+'】'+'删除',
                    buttons: [
                        {result: "callbackResultCancel", label: '取消',cssClass: 'btn-primary'},
                        {result: 'confirmDel', label: '删除'}
                    ]
                };
                hrDialog.dialog(hrDialog.typeEnum.CONFIRM, opts)
                    .close(function (result) {
                        if(result === 'confirmDel'){
                            $scope.confirmDel();
                        }
                    });
            }

        };

        $scope.clearCodeTypeData = function(){
            $scope.baseCodeType.upCodeId = "";
            $scope.upCodeTypeName = "";
            $scope.baseCodeType.codeTypeId = "";
            $scope.baseCodeType.codeTypeName = "";
            $scope.baseCodeType.struct = "";
            $scope.baseCodeType.fieldName = "";
            $scope.baseCodeType.defaultCodeId = "";
            $scope.baseCodeType.note = "";
            $scope.baseCodeType.codeTypeDes = "";
            $scope.baseCodeType.ctrvalue0 = "";
            $scope.baseCodeType.ctrvalue1 = "";
            $scope.baseCodeType.ctrvalue2 = "";
            $scope.baseCodeType.ctrvalue3 = "";
            $scope.baseCodeType.ctrvalue4 = "";
            $scope.baseCodeType.ctrvalue5 = "";
            $scope.baseCodeType.ctrvalue6 = "";
            $scope.baseCodeType.ctrvalue7 = "";
            $scope.baseCodeType.ctrvalue8 = "";
            $scope.baseCodeType.ctrvalue9 = "";
            $scope.baseCodeType.codeTypeClass = "1";
        };

        //返回九宫格关闭页面
        //$scope.close = function () {
        //    closeThisByMain();
        //};
        var mousetrap = Mousetrap;
        var bindGlobalEventKeys = function(){
            mousetrap.bindGlobal('alt+c',function(){
                $scope.close();
                $scope.$apply();
            });
        };
        bindGlobalEventKeys();
        //---------------------------------------------------------------------//

        //重置页面
        $scope.clearCodeType = function(){
            $scope.baseCodeType.codeTypeName = "";
            $scope.baseCodeType.struct = "";
            $scope.baseCodeType.fieldName = "";
            $scope.baseCodeType.defaultCodeId = "";
            $scope.baseCodeType.note = "";
            $scope.baseCodeType.codeTypeDes = "";
            $scope.baseCodeType.ctrvalue0 = "";
            $scope.baseCodeType.ctrvalue1 = "";
            $scope.baseCodeType.ctrvalue2 = "";
            $scope.baseCodeType.ctrvalue3 = "";
            $scope.baseCodeType.ctrvalue4 = "";
            $scope.baseCodeType.ctrvalue5 = "";
            $scope.baseCodeType.ctrvalue6 = "";
            $scope.baseCodeType.ctrvalue7 = "";
            $scope.baseCodeType.ctrvalue8 = "";
            $scope.baseCodeType.ctrvalue9 = "";
            $scope.baseCodeType.codeTypeClass = "1";
        };

        $scope.getBaseCodeTypeId = function(){
            var baseCode = "";
            if($scope.selectedBaseCode == undefined){
                if($scope.baseCodeTypes.length == 0){
                    baseCode = "00";
                    return baseCode;
                }else if($scope.baseCodeTypes.length > 0){
                    var mxNo =  parseInt($scope.maxOneValue);
                    baseCode = ((mxNo+1)>9?"":"0")+(mxNo+1);
                    return baseCode;
                }
            }
        };

        $scope.getSunCodeTypeId = function(codeTypeId){
            if($scope.sunBaseCodeTypes.length==0){
                if(codeTypeId.length < 6){
                    $scope.baseCodeType.codeTypeId = codeTypeId+"00";
                    return $scope.baseCodeType.codeTypeId;
                }else{
                    return "";
                }
            }else if($scope.sunBaseCodeTypes.length > 0){
                $http.get(baseURL+"/base-code-type/max-next?id="+codeTypeId+"").success(function(data,status){
                    $scope. maxNextValue = data;
                    if($scope. maxNextValue.length == 4){
                        var subMx = $scope.maxNextValue.substr(2,2);
                        var subMax = parseInt(subMx);
                    }else if($scope. maxNextValue.length == 6){
                        var subMx = $scope.maxNextValue.substr(4,2);
                        var subMax = parseInt(subMx);
                    }
                    $scope.baseCodeType.codeTypeId = codeTypeId+((subMax+1)>9?"":"0")+(subMax+1)+"";
                });
                return $scope.baseCodeType.codeTypeId;
            }
        };

        $scope.saveBaseCodeType = function(){
            if($scope.addSave == "add"){
                if($scope.baseCodeType.codeTypeId == ""){
                    $scope.warnMessage = "目前支持到添加第三节点";
                    $scope.openWarnDialog();
                }else{
                    if($scope.baseCodeType.codeTypeDes == ""){
                        $scope.warnMessage = "编码类型描述不能为空";
                        $scope.openWarnDialog();
                    }else{
                        $http.post(baseURL+"/base-code-type/base-type",$scope.baseCodeType).success(function(data,status){
                            if(201 == status){
                                $scope.successMessage = "新增码表类型成功";
                                $scope.openSuccessDialog();
                                $scope.reloadZTreeData();
                                $scope.clearCodeTypeData();
                            }
                        }).error(function(data,status){
                            HrUtils.httpError (data, status, hrDialog);
                            });
                    }

                }
            }else{
                if($scope.baseCodeType.codeTypeDes == ""){
                    $scope.warnMessage = "编码类型描述不能为空";
                    $scope.openWarnDialog();
                }else{
                    $http.post(baseURL+"/base-code-type/new-type",$scope.baseCodeType).success(function(data,status){
                        if(200 == status){
                            $scope.successMessage = "修改码表类型成功";
                            $scope.openSuccessDialog();
                            $scope.reloadZTreeData();
                            $scope.clearCodeTypeData();
                        }
                    }).error(function(data,status){
                        HrUtils.httpError (data, status, hrDialog);
                        });
                }

            }
        };

        //重新调取数据
        $scope.reloadZTreeData = function(){
            $scope.selectedBaseCodeType = undefined;
            $http.get(baseURL+"/base-code-type/all-type").success(function(data,status){
                $scope.baseCodeTypes = data;
                if($scope.baseCodeTypes.length == 0){
                    zNodes = [];
                    $("#fou-add-search").removeClass('i-disable');
                    $("#fou-edit-search").addClass('i-disable');
                    $("#fou-del-search").addClass('i-disable');
                    $scope.clearCodeTypeData();
                    $.fn.zTree.init($("#treeDemo"), setting, zNodes);
                }else if($scope.baseCodeTypes.length>0){
                    zNodes = [];
                    for(var i= 0;i<$scope.baseCodeTypes.length;i++){
                        var zNode = { id:"", pId:"", name:"", open:false};
                        zNode.id = $scope.baseCodeTypes[i].codeTypeId;
                        zNode.pId = $scope.baseCodeTypes[i].upCodeId;
                        zNode.name = $scope.baseCodeTypes[i].codeTypeDes;
                        zNodes.push(zNode);
                    }
                    $.fn.zTree.init($("#treeDemo"), setting, zNodes);
                }
                $scope.getMaxOneValue();

            }).error(function(data,status){

                });
        };

        $scope.getSunBaseCodeTypes = function(){
            $http.get(baseURL+"/base-code-type/"+$scope.selectedBaseCodeType.id).success(function(data,status){
                $scope.sunBaseCodeTypes = data;
            }).error(function(data,status){

                });
        };
        $scope.getUpCodeTypeDict = function(){
            $http.get(baseURL+"/base-code-type/typeId/"+$scope.selectedBaseCodeType.id).success(function(data,status){
                $scope.selectedCodeType = data;
                $http.get(baseURL+"/base-code-type/upId/"+$scope.selectedBaseCodeType.pId).success(function(data,status){
                    $scope.upCodeTypeDict = data;
                    $scope.editCodeType();
                }).error(function(data,status){

                    });
            }).error(function(data,status){

                });
        };

        $scope.refCodeType = function(){
            $scope.selectedBaseCodeType = undefined;
            $("#fou-add-search").removeClass('i-disable');
            $("#fou-edit-search").addClass('i-disable');
            $("#fou-del-search").addClass('i-disable');
            $scope.clearCodeTypeData();
            $http.get(baseURL+"/base-code-type/all-type").success(function(data,status){
                $scope.baseCodeTypes = data;
                if($scope.baseCodeTypes.length == 0){
                    zNodes = [];
                    $.fn.zTree.init($("#treeDemo"), setting, zNodes);
                }else if($scope.baseCodeTypes.length>0){
                    zNodes = [];
                    for(var i= 0;i<$scope.baseCodeTypes.length;i++){
                        var zNode = { id:"", pId:"", name:"", open:false};
                        zNode.id = $scope.baseCodeTypes[i].codeTypeId;
                        zNode.pId = $scope.baseCodeTypes[i].upCodeId;
                        zNode.name = $scope.baseCodeTypes[i].codeTypeDes;
                        zNodes.push(zNode);
                    }
                    $.fn.zTree.init($("#treeDemo"), setting, zNodes);
                }
                $scope.getMaxOneValue();
            }).error(function(data,status){

                });
        };
     //-----------------------------------------------------------------------//
        $scope.warnMessage = "";
        $scope.successMessage = "";
        $scope.openWarnDialog = function() {
            hrDialog.dialog(hrDialog.typeEnum.WARN, {message:$scope.warnMessage})
                .close(function(result) {
                });
        };
        $scope.openSuccessDialog = function() {
            hrDialog.dialog(hrDialog.typeEnum.SUCCESS,{message:$scope.successMessage})
                .close(function(result) {
                });
        };

     //-----------------------------------------------------------------------//
        var setting = {
            view: {
                dblClickExpand: dblClickExpand,
                showIcon:false,
                showLine:false
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback:{
                onClick:zOnClick
            }
        };
        var zNodes =[];

        $("#fou-add-search").addClass('i-disable');
        $("#fou-edit-search").addClass('i-disable');
        $("#fou-del-search").addClass('i-disable');

        //页面加载数据
        $http.get(baseURL+"/base-code-type/all-type").success(function(data,status){
            $scope.baseCodeTypes = data;
            $("#fou-add-search").removeClass('i-disable');
            if($scope.baseCodeTypes.length ==0 ){
            }else if($scope.baseCodeTypes.length>0){
                for(var i= 0;i<$scope.baseCodeTypes.length;i++){
                    var zNode = { id:"", pId:"", name:"", open:false};
                    zNode.id = $scope.baseCodeTypes[i].codeTypeId;
                    zNode.pId = $scope.baseCodeTypes[i].upCodeId;
                    zNode.name = $scope.baseCodeTypes[i].codeTypeDes;
                    zNodes.push(zNode);
                }
                $.fn.zTree.init($("#treeDemo"), setting, zNodes);
            }
            $scope.getMaxOneValue();

        }).error(function(data,status){

            });

        $scope.getMaxOneValue = function(){
            $http.get(baseURL+"/base-code-type/max-one").success(function(data,status){
                $scope.maxOneValue = data;
            }).error(function(data,status){

                });
        };

        //双击节点事件
        function dblClickExpand(treeId, treeNode) {
            return treeNode.level >= 0;
        };

        //单击节点事件
        function zOnClick(event,treeId, treeNode){
            $scope.selectedBaseCodeType = treeNode;
            $scope.clearCodeTypeData();
            $scope.sureDel = $scope.selectedBaseCodeType.name;
            if(treeNode.level >= 0){
                $("#fou-edit-search").removeClass('i-disable');
                $("#fou-add-search").removeClass('i-disable');
                $("#fou-del-search").removeClass('i-disable');
                $scope.getSunBaseCodeTypes();
                $scope.getUpCodeTypeDict();
            }
        };

    });