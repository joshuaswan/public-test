
baseCodeApp.controller("BaseCodeController",
    function BaseCodeController($scope,$http, hrDialog){
        var baseURL = Path.getUri("api");
        $scope.baseCodes = [];
        $scope.baseCodeTypes = [];
        $scope.sunBaseCodeTypes = [];
        $scope.sunBaseCodes = [];
        $scope.sunBaseCodeTypeLists = [];
        $scope.addId = "";
        $scope.maxNextValue = "";
        $scope.maxOneValue = "";
//        $scope.codeTypeId = "";
        $scope.addCodeId = "";

        /**
         * 页面加载数据
         */
        $http.get(baseURL+"/base-code-type/def-type").success(function(data,status){
            $scope.baseCodeTypes = data;
        }).error(function(data,status){

            });


        /**
         * 通过id查找子节点
         */
        $scope.displaySunNode = function(baseCode){
            $scope.selectedBaseCodeType = baseCode;
            $scope.sunBaseCodeTypes = [];
            $scope.selectedSunBaseCodeType = undefined;
            $scope.selectedSunTypeListType = undefined;
            $scope.sunBaseCodeTypeLists = [];
            $http.get(baseURL+"/base-code-type/"+baseCode.codeTypeId).success(function(data,status){
                $scope.sunBaseCodeTypes = data;
                if($scope.sunBaseCodeTypes.length == 0){
                    $scope.baseCodes = [];
                }
            }).error(function(data,status){

                });
        };

        $scope.displaySunNodes = function(sunBaseCodeType){
            $scope.selectedSunBaseCodeType = sunBaseCodeType;
            $scope.sunBaseCodeTypeLists = [];
            $scope.selectedSunTypeListType = undefined;
            $http.get(baseURL+"/base-code-type/"+sunBaseCodeType.codeTypeId).success(function(data,status){
                $scope.sunBaseCodeTypeLists = data;
                $scope.baseCodes = [];
            }).error(function(data,status){

                });

        };
        //高亮显示最末子节点
        $scope.displayHighLight = function(sunBaseCodeTypeList){
            $scope.selectedSunTypeListType = sunBaseCodeTypeList;
            $http.get(baseURL+"/base-code-dict/code-data/"+sunBaseCodeTypeList.codeTypeId).success(function(data,status){
                $scope.baseCodes = data;
                trees();
            }).error(function(data,status){

                });

        };
        function trees(){
            var option = {
                theme:'vsStyle',
                expandLevel : 2,
                column : 1
            };
            setTimeout(function(){
                $('#parent').treeTable(option);
            },100);
        }

        //新增展开
        $scope.addBaseCode = function(){
            if($scope.selectedBaseCode == undefined
                && $scope.selectedSunTypeListType != undefined){
                $scope.displayAddFieldSet();
                $scope.addFieldSet();

            }else if($scope.selectedBaseCode != undefined ){
                if($scope.selectedBaseCode.leafFlag == 0){
                    hrDialog.dialog(hrDialog.typeEnum.WARN, {message: "当前分类不是叶节点，不可添加子项目！"});
                }else{
                    $scope.displayAddFieldSet();
                    $scope.addFieldSet();
                }

            }

        };

        $scope.displayHighlight = function(baseCode){
            $scope.selectedBaseCode = baseCode;
            $scope.addFieldSet();
            $http.get(baseURL+"/base-code-dict/max-nextNodes?codeId="+baseCode.codeId+"").success(function(data,status){
                $scope.sunBaseCodes = data;
            }).error(function(data,status){

                });
        };



        //获取目录级ID
        $scope.getBaseCodeId = function(){
            if($scope.selectedBaseCode == undefined
                && $scope.selectedSunTypeListType != undefined){
                if($scope.baseCodes.length == 0){
                    $scope.addCodeId = "01";
                    return $scope.addCodeId;
                }else if($scope.baseCodes.length > 0){
                    $http.get(baseURL+"/base-code-dict/max-one?id="+$scope.selectedSunTypeListType.codeTypeId+"").success(function(data,status){
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
                    $http.get(baseURL+"/base-code-dict/max-next?typeId="+$scope.selectedSunTypeListType.codeTypeId+"&upId="+$scope.selectedBaseCode.codeId+"")
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

        //编辑展开
        $scope.editBaseCode = function(baseCode){
            $scope.editBaseDcit = baseCode;
            $scope.edCodeId = true;
            $scope.edUpCodeId = true;
            $scope.edUpCodeName = true;
            $scope.editCodeId = $scope.editBaseDcit.codeId;
            $scope.editUpCodeId = $scope.editBaseDcit.upCodeId;
            $scope.editUpCodeName = $scope.editBaseDcit.codeId;
            $scope.editCodeName = $scope.editBaseDcit.codeName;
            $scope.editCodeValue = $scope.editBaseDcit.codeValue;
            $scope.editInputCode= $scope.editBaseDcit.inputCode;
            $scope.editNote = $scope.editBaseDcit.note;
            $scope.editStopIndicator  = $scope.editBaseDcit.stopIndicator;
            $scope.editSysFlag = $scope.editBaseDcit.sysFlag;
            $scope.displayEditFieldSet();
        };

        //新增开
        $scope.addFieldSet = function(){
            $scope.adCodeId = true;
            $scope.adUpCodeId = true;
            $scope.adUpCodeName = true;
            $scope.addCodeId = "";
            $scope.addCodeId = $scope.getBaseCodeId();
            $scope.addUpCodeId = $scope.selectedBaseCode.codeId;
            $scope.addUpCodeName = $scope.selectedBaseCode.codeName;
            $scope.addCodeName = "";
            $scope.addCodeValue = "";
            $scope.addInputCode = "";
            $scope.addNote = "";
            $scope.addStopIndicator = 0;
            $scope.addSysFlag = 0;
        };

        //保存新增
        $scope.baseCodeDict = {codeTypeId:"",codeId:"",codeName:"",codeValue:"",inputCode:"",upCodeId:"",prioritys:"",
            grade:"",leafFlag:"",stopIndicator:"",sysFlag:"",serialNo:"",note:""};
        $scope.saveAddBaseCodeDict = function(){
            $scope.installNewBaseCode();
            $http.post(baseURL+"/base-code-dict/baseCode",$scope.baseCodeDict).success(function(data,status){
                      if(201 == status){
                          hrDialog.dialog(hrDialog.typeEnum.WARN, {message: "新增成功"});
                          $scope.displayHighLight($scope.selectedSunTypeListType);
                      }
                }).error(function(data,status){

                });

        };

        $scope.saveUpdateBaseCodeDict = function(){
            $scope.installEditBaseCode();
            $http.post(baseURL+"/base-code-dict/new-baseCode",$scope.baseCodeDict).success(function(data,status){
                if(200 == status){
                    hrDialog.dialog(hrDialog.typeEnum.WARN, {message: "修改成功"});
                    $('.edit-area').css({display:"none"}) ;
                    $scope.displayHighLight($scope.selectedSunTypeListType);
                }
            }).error(function(data,status){

                });
        };

        //删除
        $scope.delBaseCode = function(baseCode){
            $http.post(baseURL+"/base-code-dict/del-baseCode",baseCode).success(function(data,status){
                if(200 == status){
                    $scope.displayHighLight($scope.selectedSunTypeListType);
                }
            }).error(function(data,status){
                HrUtils.httpError(data, status, hrDialog);
                });
        };

        //组装数据
        $scope.installNewBaseCode = function(){
            if($scope.selectedBaseCode == undefined
                && $scope.selectedSunTypeListType != undefined){
                $scope.baseCodeDict.grade = 1;
                $scope.baseCodeDict.prioritys = 1;
            }else if($scope.selectedBaseCode != undefined){
                $scope.baseCodeDict.grade = $scope.selectedBaseCode.grade+1;
                $scope.baseCodeDict.prioritys = $scope.selectedBaseCode.prioritys;
            }
            $scope.baseCodeDict.codeTypeId = $scope.selectedSunTypeListType.codeTypeId;
            $scope.baseCodeDict.codeId = $scope.addCodeId;
            $scope.baseCodeDict.codeName = $scope.addCodeName;
            var noTest = /^\d{1,3}$/;
            if(noTest.test($scope.addCodeValue)){
                $scope.baseCodeDict.codeValue = $scope.addCodeValue;
            }else{
                hrDialog.dialog(hrDialog.typeEnum.WARN, {message: "编码值不可超过3位数字长度！"});
                $scope.baseCodeDict.codeValue = 1;
            }

            $scope.baseCodeDict.inputCode = $scope.addInputCode;
            $scope.baseCodeDict.upCodeId = $scope.addUpCodeId;


            $scope.baseCodeDict.leafFlag = 0;
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
            $scope.baseCodeDict.serialNo = 1;
            $scope.baseCodeDict.note = $scope.addNote;
        };

        $scope.installEditBaseCode = function(){
            $scope.baseCodeDict.codeTypeId = $scope.editBaseDcit.codeTypeId;
            $scope.baseCodeDict.codeId = $scope.editCodeId;
            $scope.baseCodeDict.codeName = $scope.editCodeName;
            var noTest = /^\d{1,3}$/;
            if(noTest.test($scope.editCodeValue)){
                $scope.baseCodeDict.codeValue = $scope.editCodeValue;
            }else{
                hrDialog.dialog(hrDialog.typeEnum.WARN, {message: "编码值不可超过3位数字长度！"});
                $scope.baseCodeDict.codeValue = 1;
            }
            $scope.baseCodeDict.inputCode = $scope.editInputCode;
            $scope.baseCodeDict.upCodeId = $scope.editUpCodeId;
            $scope.baseCodeDict.prioritys = $scope.editBaseDcit.prioritys;
            $scope.baseCodeDict.grade = $scope.editBaseDcit.grade;
            $scope.baseCodeDict.leafFlag = $scope.editBaseDcit.leafFlag;
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
            $scope.baseCodeDict.serialNo = $scope.editBaseDcit.serialNo;
            $scope.baseCodeDict.note = $scope.editNote;
        };

        $scope.displayAddFieldSet = function(){
            $('.add-area').css({display:"block"}) ;
            $('.edit-area').css({display:"none"}) ;

            $('.cancel').on('click',function(){
                $('.add-area').css({display:"none"}) ;

            })  ;

        };

        $scope.displayEditFieldSet = function(){
            $('.edit-area').css({display:"block"}) ;
            $('.add-area').css({display:"none"}) ;

            $('.cancel').on('click',function(){
                $('.edit-area').css({display:"none"}) ;
            })  ;
        };
    }
);
