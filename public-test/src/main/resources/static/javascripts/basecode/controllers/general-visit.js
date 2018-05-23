baseCodeDictApp.controller("baseCodeDictController",
    function baseCodeDictController($scope,$http,hrDialog){

        var baseURL = Path.getUri("api");
        $scope.baseCodeTypes = [];
        $scope.showSaveMessageBox = false;
        $scope.showUpdateMessageBox = false;
        $scope.showDelMessageBox = false;
        $scope.showNoDataMessageBox = false;
        $scope.showDeleteMessageBox = false;
        $scope.showWarnMessageBox = false;
        $scope.editSearch = false;
        $scope.addSearch = false;
        $scope.sunBaseCodes = [];
        $scope.baseCodes = [];
        $scope.maxSerialNo = "";
        $scope.gradeCodeName = "";
        $scope.sureDel = "";
        $scope.showIndex = "";

        $scope.displayHighlight = function(baseCode,index){
            $scope.selectedBaseCode = baseCode;
            $scope.showIndex = index;
            console.log($scope.showIndex);
            $scope.editSearch = true;
            $scope.addSearch = true;
            $scope.sureDel = $scope.selectedBaseCode.codeName;
            $scope.clearEditBaseDict();
            $("#fou-add-search").removeClass('i-disable');
            $("#fou-edit-search").removeClass('i-disable');
            $("#fou-del-search").removeClass('i-disable');
            $("#fou-up-search").removeClass('i-disable');
            $("#fou-down-search").removeClass('i-disable');
            $http.get(baseURL+"/base-code-dict/max-nextNodes/"+baseCode.codeTypeId+"?codeId="+baseCode.codeId).success(function(data,status){
                $scope.sunBaseCodes = data;
                $scope.addBaseDict();
            }).error(function(data,status){

                });
            if($scope.selectedBaseCode.upCodeId == "" ||$scope.selectedBaseCode.upCodeId == null){
                $scope.editBaseDict();
            }else{
                $http.get(baseURL+"/base-code-dict/code-dict/"+baseCode.upCodeId+"?typeId="+$scope.selectedBaseCodeType.codeTypeId).success(function(data,status){
                    $scope.upCodeDict = data;
                    $scope.editBaseDict();
                }).error(function(data,status){

                    });
            }

        };

        /**
         * 将List格式化成树形结构
         */
        $scope.treeTableForList = function(){
            var option = {
                theme:'vsStyle',
                expandLevel : 1,
                column : 1
            };
            setTimeout(function(){
                $('#parent').treeTable(option);
            },0.1);

        };


        $scope.addBaseDict = function(){
            if($scope.selectedBaseCode != undefined){
                $scope.addUpCodeId = $scope.selectedBaseCode.codeId;
                $scope.addUpCodeName = $scope.selectedBaseCode.codeName;
                $scope.addCodeTypeName = $scope.selectedBaseCodeType.codeTypeName;
                $scope.addFieldSet();
                $http.get(baseURL+"/base-code-dict/nextSunNo/"+$scope.selectedBaseCodeType.codeTypeId+"/?codeId="+$scope.selectedBaseCode.codeId).success(function(data,status){
                    $scope.maxSerialNo = data;
                }).error(function(data,status){

                    });
            }else if($scope.selectedBaseCodeType !=undefined && $scope.selectedBaseCode == undefined){
                $scope.addUpCodeId = "";
                $scope.addUpCodeName = "";
                $scope.addCodeTypeName = $scope.selectedBaseCodeType.codeTypeName;
                $scope.addFieldSet();
                $http.get(baseURL+"/base-code-dict/nextNo/"+$scope.selectedBaseCodeType.codeTypeId).success(function(data,status){
                    $scope.maxSerialNo = data;
                }).error(function(data,status){

                    });
            }


        };
        $scope.addFieldSet = function(){
            $scope.addCodeId = "";
            $scope.addCodeId = $scope.getBaseCodeId();
            $scope.addCodeName = "";
            $scope.addCodeValue = "";
            $scope.addDefaultValue = "";
            $scope.addInputCode = "";
            $scope.addNote = "";
            $scope.addLeafFlag = true;
            $scope.addStopIndicator = false;
            $scope.addSysFlag = true;
            $scope.addCtrvalue0 = "";
            $scope.addCtrvalue1 = "";
            $scope.addCtrvalue2 = "";
            $scope.addCtrvalue3 = "";
            $scope.addCtrvalue4 = "";
            $scope.addCtrvalue5 = "";
            $scope.extendName();

        };

        $scope.extendName = function(){
            if($scope.selectedBaseCodeType.ctrvalue0 == "" || $scope.selectedBaseCodeType.ctrvalue0 == null){
                $scope.ctrvalue0Name = "控制0的数值";

            }else{
                $scope.ctrvalue0Name = $scope.selectedBaseCodeType.ctrvalue0;
            }
            if($scope.selectedBaseCodeType.ctrvalue1 == "" || $scope.selectedBaseCodeType.ctrvalue1 == null){
                $scope.ctrvalue1Name = "控制1的数值";

            }else{
                $scope.ctrvalue1Name = $scope.selectedBaseCodeType.ctrvalue1;
            }
            if($scope.selectedBaseCodeType.ctrvalue2 == "" || $scope.selectedBaseCodeType.ctrvalue2 == null){
                $scope.ctrvalue2Name = "控制2的数值";

            }else{
                $scope.ctrvalue2Name = $scope.selectedBaseCodeType.ctrvalue2;
            }
            if($scope.selectedBaseCodeType.ctrvalue3 == "" || $scope.selectedBaseCodeType.ctrvalue3 == null){
                $scope.ctrvalue3Name = "控制3的数值";

            }else{
                $scope.ctrvalue3Name = $scope.selectedBaseCodeType.ctrvalue3;
            }
            if($scope.selectedBaseCodeType.ctrvalue4 == "" || $scope.selectedBaseCodeType.ctrvalue4 == null){
                $scope.ctrvalue4Name = "控制4的数值";

            }else{
                $scope.ctrvalue4Name = $scope.selectedBaseCodeType.ctrvalue4;
            }
            if($scope.selectedBaseCodeType.ctrvalue5 == "" || $scope.selectedBaseCodeType.ctrvalue5 == null){
                $scope.ctrvalue5Name = "控制5的数值";

            }else{
                $scope.ctrvalue5Name = $scope.selectedBaseCodeType.ctrvalue5;
            }
        };

        $scope.getBaseCodeId = function(){
            if($scope.selectedBaseCode == undefined
                && $scope.selectedBaseCodeType != undefined){
                if($scope.baseCodes.length == 0){
                    $scope.addCodeId = "01";
                    return $scope.addCodeId;
                }else if($scope.baseCodes.length > 0){
                    $http.get(baseURL+"/base-code-dict/max-one?id="+$scope.selectedBaseCodeType.codeTypeId+"").success(function(data,status){
                        $scope.maxOneValue = data;
                        var subMax = parseInt($scope.maxOneValue);
                        $scope.addCodeId = ((subMax+1)>9?"":"0")+(subMax+1);
                    }).error(function(data,status){

                        });
                    return $scope.addCodeId;
                }
            }else if($scope.selectedBaseCode != undefined ){
                if($scope.sunBaseCodes.length == 0){
                    $scope.addCodeId = $scope.selectedBaseCode.codeId+"01";
                    return $scope.addCodeId;
                }else if($scope.sunBaseCodes.length > 0){
                    $http.get(baseURL+"/base-code-dict/max-next?typeId="+$scope.selectedBaseCodeType.codeTypeId+"&upId="+$scope.selectedBaseCode.codeId+"")
                        .success(function(data,status){
                            $scope.maxNextValue = data;
                            var subMx = $scope.maxNextValue.substr(2,2);
                            var subMax = parseInt(subMx);
                            $scope.addCodeId = $scope.selectedBaseCode.codeId+((subMax+1)>9?"":"0")+(subMax+1)+"";
                        }).error(function(data,status){

                        });
                    return $scope.addCodeId;
                }
            }

        };

        $scope.clearEditBaseDict = function(){

            $scope.editStopIndicator  = false;
            $scope.editSysFlag = false;
            $scope.editLeafFlag = false;
        };

        $scope.editBaseDict = function(){
            if($scope.selectedBaseCode != undefined){
                if($scope.selectedBaseCode.upCodeId == "" ||$scope.selectedBaseCode.upCodeId == null){
                    $scope.editUpCodeId = "";
                    $scope.editUpCodeName = "";
                    $scope.editCodeTypeName = $scope.selectedBaseCodeType.codeTypeName;
                }else{
                    $scope.editUpCodeId = $scope.upCodeDict.codeId;
                    $scope.editUpCodeName = $scope.upCodeDict.codeName;
                    $scope.editCodeTypeName = $scope.selectedBaseCodeType.codeTypeName;
                }
                $scope.editCodeId = $scope.selectedBaseCode.codeId;
                $scope.editCodeName = $scope.selectedBaseCode.codeName;
                $scope.editCodeValue = $scope.selectedBaseCode.codeValue;
                $scope.editDefaultValue = $scope.selectedBaseCode.codeDefaultValue;
                $scope.editInputCode= $scope.selectedBaseCode.inputCode;
                $scope.editNote = $scope.selectedBaseCode.note;
                $scope.editStopIndicator  = $scope.selectedBaseCode.stopIndicator===0?false:true;
                $scope.editSysFlag = $scope.selectedBaseCode.sysFlag===0?false:true;
                $scope.editLeafFlag = $scope.selectedBaseCode.leafFlag===0?false:true;
                $scope.editCtrvalue0 = $scope.selectedBaseCode.ctrvalue0;
                $scope.editCtrvalue1 = $scope.selectedBaseCode.ctrvalue1;
                $scope.editCtrvalue2 = $scope.selectedBaseCode.ctrvalue2;
                $scope.editCtrvalue3 = $scope.selectedBaseCode.ctrvalue3;
                $scope.editCtrvalue4 = $scope.selectedBaseCode.ctrvalue4;
                $scope.editCtrvalue5 = $scope.selectedBaseCode.ctrvalue5;
                $scope.extendName();
            }else{

            }

        };

        //保存新增
        $scope.baseCodeDict = {codeTypeId:"",codeId:"",codeName:"",codeTypeName:"",codeValue:"",inputCode:"",upCodeId:"",
            grade:"",leafFlag:"",stopIndicator:"",sysFlag:"",serialNo:"",note:"",ctrvalue0:"",ctrvalue1:"",ctrvalue2:"",
            ctrvalue3:"",ctrvalue4:"",ctrvalue5:"",ctrvalue6:"",ctrvalue7:"",ctrvalue8:"",ctrvalue9:""};
        $scope.saveAddBaseCodeDict = function(){
            $scope.installNewBaseCode();

//            $scope.upCodeDict.leafFlag = 0;
            if($scope.addCodeTypeName == ""){
                $scope.warnMessage = "请输入编码类型名称";
                $scope.openWarnDialog();
            }else{
                $http.post(baseURL+"/base-code-dict/baseCode",$scope.baseCodeDict).success(function(data,status){
                    if(201 == status){
                        $scope.successMessage = "新增码表成功";
                        $scope.openSuccessDialog();
                        $("#add-base").css({display:"none"});
                        $scope.displayBaseCodeDict($scope.selectedBaseCodeType);
                    }
                }).error(function(data,status){

                    });
            }
            if($scope.selectedBaseCode !== undefined){
                if($scope.sunBaseCodes.length < 1){
                    $scope.selectedBaseCode.leafFlag = 0;
                    $http.post(baseURL+"/base-code-dict/new-baseCode",$scope.selectedBaseCode).success(function(data,status){
                        if(200 == status){
                            $scope.displayBaseCodeDict($scope.selectedBaseCodeType);
                        }
                    }).error(function(data,status){

                        });
                }else if($scope.sunBaseCodes.length >= 1){

                }
            }

        };
        //修改
        $scope.saveUpdateBaseCodeDict = function(){
            $scope.installEditBaseCode();

            if($scope.editCodeTypeName == ""){
                $scope.warnMessage = "请输入编码类型名称";
                $scope.openWarnDialog();
            }else{
                $http.post(baseURL+"/base-code-dict/new-baseCode",$scope.baseCodeDict).success(function(data,status){
                    if(200 == status){
                        $scope.successMessage = "修改码表成功";
                        $scope.openSuccessDialog();
                        $("#edit-base").css({display:"none"});
                        $scope.displayBaseCodeDict($scope.selectedBaseCodeType);
                    }
                }).error(function(data,status){

                    });
            }

        };

        $scope.confirmDel = function(){
            if($scope.selectedBaseCode.leafFlag == 0 || $scope.selectedBaseCode.sysFlag == 1){
                $scope.warnMessage = "非叶子或者系统定义节点不可删除";
                $scope.openWarnDialog();

            }else{
                $http.post(baseURL+"/base-code-dict/del-baseCode",$scope.selectedBaseCode).success(function(data,status){
                    if(200 == status){
                        $scope.successMessage = "删除码表成功";
                        $scope.openSuccessDialog();
                        $scope.displayBaseCodeDict($scope.selectedBaseCodeType);
                    }
                }).error(function(data,status){
                        alert("Failed Error")
                    });
            }
        };
        //删除
        $scope.openConfirmDialog = function() {
            if($scope.selectedBaseCode == undefined){

            }else{
                var opts = {
                    title: '操作窗口',
                    message: '是否删除'+'【'+$scope.sureDel+'】'+'数据',
                    buttons: [
                        {result: "callbackResultCancel", label: '取消', cssClass: 'btn-primary'},
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

        //display
        $scope.displayBaseCodeDict = function(treeNode){
            $http.get(baseURL+"/base-code-dict/code-data/"+treeNode.codeTypeId).success(function(data,status){
                $scope.baseCodes = data;
                $scope.treeTableForList();
                if($scope.baseCodes.length == 0){

                }else{
                    $scope.selectedBaseCode = undefined;
                    $scope.addBaseDict();

                }
            }).error(function(data,status){

                });

        };

        //组装数据
        $scope.installNewBaseCode = function(){
            if($scope.selectedBaseCode == undefined
                && $scope.selectedSunTypeListType != undefined){
                $scope.baseCodeDict.grade = 1;
            }else if($scope.selectedBaseCode != undefined){
                $scope.baseCodeDict.grade = $scope.selectedBaseCode.grade+1;
            }

            $scope.baseCodeDict.codeTypeId = $scope.selectedBaseCodeType.codeTypeId;
            $scope.baseCodeDict.codeId = $scope.addCodeId;
            $scope.baseCodeDict.codeName = $scope.addCodeName;
            $scope.baseCodeDict.codeTypeName = $scope.selectedBaseCodeType.codeTypeName;
            $scope.baseCodeDict.codeValue = $scope.addCodeValue;
            $scope.baseCodeDict.codeDefaultValue = $scope.addDefaultValue;

            $scope.baseCodeDict.inputCode = $scope.addInputCode;
            $scope.baseCodeDict.upCodeId = $scope.addUpCodeId;


            if($scope.addStopIndicator){
                $scope.baseCodeDict.stopIndicator = 1;
            }else{
                $scope.baseCodeDict.stopIndicator = 0;
            }
            if($scope.addSysFlag){
                $scope.baseCodeDict.sysFlag = 1;
            }else{
                $scope.baseCodeDict.sysFlag = 0;
            }
            if($scope.addLeafFlag){
                $scope.baseCodeDict.leafFlag = 1;
            }else{
                $scope.baseCodeDict.leafFlag = 0;
            }
            $scope.baseCodeDict.serialNo = parseInt($scope.maxSerialNo)+1;

            $scope.baseCodeDict.ctrvalue0 = $scope.addCtrvalue0;
            $scope.baseCodeDict.ctrvalue1 = $scope.addCtrvalue1;
            $scope.baseCodeDict.ctrvalue2 = $scope.addCtrvalue2;
            $scope.baseCodeDict.ctrvalue3 = $scope.addCtrvalue3;
            $scope.baseCodeDict.ctrvalue4 = $scope.addCtrvalue4;
            $scope.baseCodeDict.ctrvalue5 = $scope.addCtrvalue5;

            $scope.baseCodeDict.note = $scope.addNote;
            console.log($scope.baseCodeDict);
        };

        $scope.installEditBaseCode = function(){
            $scope.baseCodeDict.codeTypeId = $scope.selectedBaseCode.codeTypeId;
            $scope.baseCodeDict.codeId = $scope.editCodeId;
            $scope.baseCodeDict.codeName = $scope.editCodeName;
            $scope.baseCodeDict.codeTypeName = $scope.selectedBaseCodeType.codeTypeName;
            $scope.baseCodeDict.codeValue = $scope.editCodeValue;
            $scope.baseCodeDict.codeDefaultValue = $scope.editDefaultValue;
            $scope.baseCodeDict.inputCode = $scope.editInputCode;
            $scope.baseCodeDict.upCodeId = $scope.editUpCodeId;
            $scope.baseCodeDict.grade = $scope.selectedBaseCode.grade;
            if($scope.editLeafFlag){
                $scope.baseCodeDict.leafFlag = 1;
            }else{
                $scope.baseCodeDict.leafFlag = 0;
            }
            if($scope.editStopIndicator){
                $scope.baseCodeDict.stopIndicator = 1;
            }else{
                $scope.baseCodeDict.stopIndicator = 0;
            }
            if($scope.editSysFlag){
                $scope.baseCodeDict.sysFlag = 1;
            }else{
                $scope.baseCodeDict.sysFlag = 0;
            }
            console.log($scope.editLeafFlag);
            console.log($scope.editStopIndicator);
            console.log($scope.editSysFlag);
            $scope.baseCodeDict.serialNo = $scope.selectedBaseCode.serialNo;
            $scope.baseCodeDict.ctrvalue0 = $scope.editCtrvalue0;
            $scope.baseCodeDict.ctrvalue1 = $scope.editCtrvalue1;
            $scope.baseCodeDict.ctrvalue2 = $scope.editCtrvalue2;
            $scope.baseCodeDict.ctrvalue3 = $scope.editCtrvalue3;
            $scope.baseCodeDict.ctrvalue4 = $scope.editCtrvalue4;
            $scope.baseCodeDict.ctrvalue5 = $scope.editCtrvalue5;
            $scope.baseCodeDict.note = $scope.editNote;
            console.log($scope.baseCodeDict);
        };
        //编辑获取拼音码
        $scope.getEditPY = function(){
            $scope.editInputCode=CC2PY($scope.editCodeName).toUpperCase();
        };
        //新增获取拼音码
        $scope.getAddPY = function(){
            $scope.addInputCode=CC2PY($scope.addCodeName).toUpperCase();
        };

        $scope.$watch("editStopIndicator",function(newValue,oldValue){
            console.info("测试"+newValue);
        });

        //条件查询
        $scope.searchName = "";
        $scope.getBaseCodes = function(){
            $scope.baseCodes = [];
            $scope.searchName = $scope.searchName.toUpperCase();
            if($scope.selectedBaseCodeType == undefined){

            }else{
                $http.get(baseURL+"/base-code-dict/code-dicts/?name="+$scope.searchName+"&typeId="+$scope.selectedBaseCodeType.codeTypeId)
                    .success(function(data,status){
                        $scope.baseCodes = data;
                        $scope.treeTableForList();
                        if($scope.baseCodes.length == 0){

                        }else{
                            $scope.selectedBaseCode = undefined;
                            $scope.addBaseDict();

                        }
                    }).error(function(data,status){
                    });
            }
        };

        $scope.upIconClick = function(){
            if($scope.selectedBaseCode == undefined){

            }else{
                if($scope.baseCodes[$scope.showIndex-1].upCodeId != null){
                    var defaultSerialNo = $scope.baseCodes[$scope.showIndex-1].serialNo;
                    var defaultSerialNo1 = $scope.selectedBaseCode.serialNo;
                    var defaultId = $scope.baseCodes[$scope.showIndex-1].codeId;
                    var defaultId1 = $scope.selectedBaseCode.codeId;
                    var requestURL = baseURL+"/base-code-dict/exChangeSerNo/?serNo="+ defaultSerialNo
                        +"&codeId="+ defaultId +"&serNo1="+ defaultSerialNo1
                        +"&codeId1="+ defaultId1+"&codeTypeId="+$scope.selectedBaseCodeType.codeTypeId;
                    $http.post(requestURL).success(function(data,status){
                        $scope.displayBaseCodeDict($scope.selectedBaseCodeType);
                    }).error(function(data,status){
                            alert("Failed Error")
                        });
                }
            }
        };

        $scope.downIconClick = function(){
            if($scope.selectedBaseCode == undefined){

            }else{
                if($scope.baseCodes[$scope.showIndex+1].upCodeId != null){
                    var defaultSerialNo = $scope.baseCodes[$scope.showIndex+1].serialNo;
                    var defaultSerialNo1 = $scope.selectedBaseCode.serialNo;
                    var defaultId = $scope.baseCodes[$scope.showIndex+1].codeId;
                    var defaultId1 = $scope.selectedBaseCode.codeId;
                    var requestURL = baseURL+"/base-code-dict/exChangeSerNo/?serNo="+ defaultSerialNo
                        +"&codeId="+ defaultId +"&serNo1="+ defaultSerialNo1
                        +"&codeId1="+ defaultId1+"&codeTypeId="+$scope.selectedBaseCodeType.codeTypeId;
                    $http.post(requestURL).success(function(data,status){
                        $scope.displayBaseCodeDict($scope.selectedBaseCodeType);
                    }).error(function(data,status){
                            alert("Failed Error")
                        });
                }
            }
        };
        //返回九宫格关闭页面
        $scope.close = function () {
            closeThisByMain();
        };
        var mousetrap = Mousetrap;
        var bindGlobalEventKeys = function(){
            mousetrap.bindGlobal('alt+c',function(){
                $scope.close();
                $scope.$apply();
            });
        };
        bindGlobalEventKeys();
        //---------------------------------------------------------------------//
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
        //---------------------------------------------------------------------//
        var setting = {
            view: {
                dblClickExpand: dblClickExpand,
                showIcon:false,
                showLine:false
            },
            data: {
                key: {
                    name: "codeTypeDes"
                },
                simpleData: {
                    enable: true,
                    idKey: "codeTypeId",
                    pIdKey: "upCodeId"
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
        $("#fou-up-search").addClass('i-disable');
        $("#fou-down-search").addClass('i-disable');
        //页面加载数据
        $http.get(baseURL+"/base-code-type/all-type").success(function(data,status){
            $scope.baseCodeTypes = data;
            $.fn.zTree.init($("#treeDemo"), setting, $scope.baseCodeTypes);

        }).error(function(data,status){

            });

        function dblClickExpand(treeId, treeNode) {
            return treeNode.level >= 0;
            }

        function zOnClick(event,treeId,treeNode){
            $scope.selectedBaseCodeType = treeNode;
            $("#editModal").modal('hide');
            $("#addModal").modal('hide');
            $scope.addSearch = false;
            $scope.selectedBaseCode = undefined;
            $scope.addBaseDict();
            if(treeNode.level >1){
                $scope.addSearch = true;
                $("#fou-add-search").removeClass('i-disable');
                $("#fou-edit-search").addClass('i-disable');
                $("#fou-del-search").addClass('i-disable');
                $("#fou-up-search").addClass('i-disable');
                $("#fou-down-search").addClass('i-disable');
                $scope.baseCodes = [];
                $http.get(baseURL+"/base-code-dict/code-data/"+$scope.selectedBaseCodeType.codeTypeId).success(function(data,status){
                    $scope.baseCodes = data;
                    $scope.treeTableForList();
                    if($scope.baseCodes.length == 0){

                    }else{
                        $scope.selectedBaseCode = undefined;
                        $scope.addBaseDict();

                    }
                }).error(function(data,status){

                    });

            }else{
                $("#fou-add-search").addClass('i-disable');
                $("#fou-edit-search").addClass('i-disable');
                $("#fou-del-search").addClass('i-disable');
                $scope.baseCodes = [];
            }
        }



        $(function(){
            var updateTheHeight = function () {
                $("#fou-add-search").click(function(){
                    if($scope.addSearch == false){
                        return false;
                    }else{
                        if($scope.selectedBaseCodeType == undefined){
                            return false;
                        }else{
                            $scope.editSearch = false;
                            $("#fou-edit-search").addClass('i-disable');
                            $("#editModal").modal('hide');
                            $("#addModal").modal('show');
                        }
                    }
                });

                $("#add-gridSearch-cancel").click(function(){
                    if($scope.selectedBaseCode != undefined){
                        $("#fou-edit-search").removeClass('i-disable');
                        $scope.editSearch = true;
                    }else{
                        $("#fou-edit-search").addClass('i-disable');
                        $scope.editSearch = false;
                    }
                    $("#addModal").modal('hide');


                });

                //编辑弹框
                $("#fou-edit-search").click(function(){
                    if($scope.editSearch == false){
                        return false;
                    }else{
                        if($scope.selectedBaseCode != undefined && $scope.selectedBaseCodeType != undefined){
                            $scope.addSearch = false;
                            $("#fou-add-search").addClass('i-disable');
                            $("#editModal").modal('show');
                            $("#addModal").modal('hide');

                        }else{
                            return false;
                        }
                    }

                });

                $("#edit-gridSearch-cancel").click(function(){
                    $("#fou-add-search").removeClass('i-disable');
                    $scope.addSearch = true;
                    $("#editModal").modal('hide');

                });
            };
            $(window).resize(function () {
                updateTheHeight();
            });
            updateTheHeight();

        });
});
