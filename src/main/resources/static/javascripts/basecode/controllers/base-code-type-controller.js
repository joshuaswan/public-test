baseCodeApp.controller("BaseCodeTypeController",
    function BaseCodeTypeController($scope,$http){
        $scope.baseCodeTypes = [];
        $scope.sunBaseCodeTypes = [];
        $scope.sunBaseCodeTypeLists = [];
        var baseURL = Path.getUri("api");
        $scope.addId = "";
        $scope.maxOneValue = "";
        $scope.maxNextValue = "";
        $scope.codeTypeId = "";
        /**
         * 页面加载数据
         */
        $http.get(baseURL+"/base-code-type/def-type").success(function(data,status){
            $scope.baseCodeTypes = data;
        }).error(function(data,status){

            });
        $http.get(baseURL+"/base-code-type/max-one").success(function(data,status){
            $scope.maxOneValue = data;
        }).error(function(data,status){

            });
        /**
         * 通过id查找子节点
         */
        $scope.displaySunNode = function(baseCode){
            $scope.selectedBaseCode = baseCode;
            $scope.sunBaseCodeTypes = [];
            $scope.selectedSunBaseCode = undefined;
            $scope.selectedSunTypeList = undefined;
            $scope.sunBaseCodeTypeLists = [];
            $http.get(baseURL+"/base-code-type/"+baseCode.codeTypeId).success(function(data,status){
                $scope.sunBaseCodeTypes = data;
                console.debug($scope.sunBaseCodeTypes);
                if($scope.addId == "edit-sub"){
                    $scope.editBaseCodeData();
                }else if($scope.addId == "add-sub"){
                    $scope.addBaseCodeData();
                }
            }).error(function(data,status){

                });
        };

        $scope.displaySunNodes = function(sunBaseCodeType){
            $scope.selectedSunBaseCode = sunBaseCodeType;
            $scope.sunBaseCodeTypeLists = [];
            $scope.selectedSunTypeList = undefined;
            $http.get(baseURL+"/base-code-type/"+sunBaseCodeType.codeTypeId).success(function(data,status){
                $scope.sunBaseCodeTypeLists = data;
                if($scope.addId == "edit-sub"){
                    $scope.editSunBaseCodeData();
                }else if($scope.addId == "add-sub"){
                    $scope.addSunBaseCodeData();
                }
            }).error(function(data,status){

                });

        };
        //高亮显示最末子节点
        $scope.displayHighLight = function(sunBaseCodeTypeList){
            $scope.selectedSunTypeList = sunBaseCodeTypeList;
            if($scope.addId == "edit-sub"){
                $scope.editSunTypeListData();
            }else if($scope.addId == "add-sub"){
                $scope.addSunTypeListData();
            }

        };

        /**
         * 根节点添加
         */
        $scope.createBaseCodeType = function(){
            $scope.selectedBaseCode = undefined;
            $scope.selectedSunBaseCode = undefined;
            $scope.selectedSunTypeList = undefined;
            $scope.sunBaseCodeTypes = [];
            $scope.sunBaseCodeTypeLists = [];
            $http.get(baseURL+"/base-code-type/def-type").success(function(data,status){
                $scope.baseCodeTypes = data;
                $scope.codeTypeId = $scope.getBaseCodeTypeId();
                $scope.upCodeId = "";
                $scope.upCodeName = "基础数据类型编码";
                $scope.codeTypeName = "";
                $scope.fieldName = "";
                $scope.note = "";
                $scope.removeReadOnly();
            }).error(function(data,status){

                });

        };

        /**
         * 新增基础编码类型展开
         */
        $scope.addBaseCodeType = function(){
            var aId = document.getElementById("add-sub");
            $scope.addId = aId.id;
            if($scope.selectedBaseCode == undefined){
                $scope.createBaseCodeType();
                $scope.displayFieldSet();
            }else{
                if($scope.selectedSunTypeList != undefined ){
                    $scope.addSunTypeListData();
                    $scope.displayFieldSet();
                }else{
                    if($scope.selectedSunBaseCode == undefined){
                        $scope.addBaseCodeData();
                        $scope.displayFieldSet();
                    }else{
                        $scope.addSunBaseCodeData();
                        $scope.displayFieldSet();
                    }
                }
            }
        };

        $scope.getNextValue = function(id){
            $http.get(baseURL+"/base-code-type/max-next?id="+id+"").success(function(data,status){
                $scope. maxNextValue = data;
            }).error(function(data,status){

                });
        };

        $scope.getSunCodeTypeId = function(codeTypeId){
            if($scope.selectedSunBaseCode == undefined){
                if($scope.sunBaseCodeTypes.length==0){
                    $scope.codeTypeId = codeTypeId+"00";
                    return $scope.codeTypeId;
                }else if($scope.sunBaseCodeTypes.length > 0){
                    $http.get(baseURL+"/base-code-type/max-next?id="+codeTypeId+"").success(function(data,status){
                        $scope. maxNextValue = data;
                        var subMx = $scope.maxNextValue.substr(2,2);
                        var subMax = parseInt(subMx);
                        $scope.codeTypeId = codeTypeId+((subMax+1)>9?"":"0")+(subMax+1)+"";
                    });
                    return $scope.codeTypeId;
                }
            }else{
                if($scope.sunBaseCodeTypeLists.length==0){
                    $scope.codeTypeId = codeTypeId+"00";
                    return $scope.codeTypeId;
                }else if($scope.sunBaseCodeTypeLists.length > 0){
                    $http.get(baseURL+"/base-code-type/max-next?id="+codeTypeId+"").success(function(data,status){
                        $scope. maxNextValue = data;
                        var subMx = $scope.maxNextValue.substr(4,2);
                        var subMax = parseInt(subMx);
                        $scope.codeTypeId = codeTypeId+((subMax+1)>9?"":"0")+(subMax+1)+"";
                    });
                    return $scope.codeTypeId;
                }
            }
            return $scope.codeTypeId;
        };

        /**
         *修改基础编码类型展开
         */
        $scope.editBaseCodeType = function(){
            if($scope.selectedBaseCode == undefined){
                alert("尚未选择基础编码类型！");
            }else{
                var aId2 = document.getElementById("edit-sub");
                $scope.addId = aId2.id;
                if($scope.selectedSunTypeList!=undefined ){
                    $scope.editSunTypeListData();
                    $scope.displayEditFieldSet();
                }else{
                    if($scope.selectedSunBaseCode == undefined){
                        $scope.editBaseCodeData();
                        $scope.displayEditFieldSet();
                    }else{
                        $scope.editSunBaseCodeData();
                        $scope.displayEditFieldSet();
                    }
                }
            }
        };

        /**
         *保存新增基础编码类型
         */
        $scope.baseCodeTypeDict = {codeTypeId:"",codeTypeName:"",upCodeId:"",fieldName:"",note:""};
        $scope.saveAddBaseCodeType = function(){
            $scope.baseCodeTypeDict.codeTypeId = $scope.codeTypeId;
            $scope.baseCodeTypeDict.codeTypeName = $scope.codeTypeName;
            $scope.baseCodeTypeDict.upCodeId = $scope.upCodeId;
            $scope.baseCodeTypeDict.fieldName = $scope.fieldName;
            $scope.baseCodeTypeDict.note = $scope.note;
            if($scope.codeTypeId == ""){
                $scope.nothingDone();
            }else{
                if($scope.fieldName == ""){
                    alert("请输入字段名称后保存！");
                }else{
                    $http.post(baseURL+"/base-code-type/base-type",$scope.baseCodeTypeDict).success(function(data,status){
                         if(201 == status){
                              if($scope.selectedBaseCode == undefined){

                              }
                              if($scope.selectedSunBaseCode == undefined){
                                  $scope.displaySunNode($scope.selectedBaseCode);
                              }else{
                                  $scope.displaySunNodes($scope.selectedSunBaseCode);
                              }
                         }
                    }).error(function(data,status){
                         alert("Failed Error")
                    });
                }
            }
        };
        $scope.nothingDone = function(){

        };
        /**
         * 保存修改基础编码类型
         */
        $scope.saveEditBaseCodeType = function(){
            $scope.baseCodeTypeDict.codeTypeId = $scope.editCodeTypeId;
            $scope.baseCodeTypeDict.codeTypeName = $scope.editCodeTypeName;
            $scope.baseCodeTypeDict.upCodeId = $scope.editUpCodeId;
            $scope.baseCodeTypeDict.fieldName = $scope.editFieldName;
            $scope.baseCodeTypeDict.note = $scope.editNote;
            if($scope.editFieldName == ""){
                alert("请输入字段名称后保存！");
            }else{
                $http.post(baseURL+"/base-code-type/new-type",$scope.baseCodeTypeDict).success(function(data,status){
                    if(200 == status){
                        alert("修改成功！");
                        if($scope.selectedSunBaseCode == undefined){
                            $scope.displaySunNode($scope.selectedBaseCode);
                        }else{
                            $scope.displaySunNodes($scope.selectedSunBaseCode);
                        }
                    }
                }).error(function(data,status){
                        alert("Failed Error")
                    });
            }
        };
        /**
         *删除基础编码类型
         */
        $scope.deleteBaseCodeType = function(){
            if($scope.selectedBaseCode == undefined){
                $scope.nothingDone();
            }else if($scope.selectedBaseCode != undefined &&
                     $scope.selectedSunTypeList == undefined && $scope.selectedSunBaseCode == undefined){
                $http.delete(baseURL+"/base-code-type/del-type/"+$scope.selectedBaseCode.codeTypeId).success(function(data,status){
                    if(200 == status){
                        $scope.createBaseCodeType();
                    }
                }).error(function(data,status){
                        alert("Failed Error")
                    });
            }else if($scope.selectedSunTypeList == undefined && $scope.selectedSunBaseCode != undefined){
                $http.delete(baseURL+"/base-code-type/del-type/"+$scope.selectedSunBaseCode.codeTypeId).success(function(data,status){
                    if(200 == status){
                        $scope.displaySunNode($scope.selectedBaseCode);
                    }
                }).error(function(data,status){
                        alert("Failed Error")
                    });
            }else if($scope.selectedSunTypeList != undefined){
                $http.delete(baseURL+"/base-code-type/del-type/"+$scope.selectedSunTypeList.codeTypeId).success(function(data,status){
                    if(200 == status){
                        $scope.displaySunNodes($scope.selectedSunBaseCode);
                    }
                }).error(function(data,status){
                        alert("Failed Error")
                    });
            }
        };

        $scope.removeReadOnly = function(){
            $scope.addTypeId = true;
            $scope.addCodeId = true;
            $scope.addCodeName = true;
            $scope.addTypeName = false;
            $scope.addField = false;
            $scope.addNote = false;
        };

        $scope.displayFieldSet = function(){
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

        $scope.addSunTypeListData = function(){
            $scope.addTypeId = true;
            $scope.addCodeId = true;
            $scope.addCodeName = true;
            $scope.addTypeName = true;
            $scope.addField = true;
            $scope.addNote = true;
            $scope.codeTypeId = "";
            $scope.upCodeId = $scope.selectedSunTypeList.codeTypeId;
            $scope.upCodeName = $scope.selectedSunTypeList.codeTypeName;
            $scope.codeTypeName = "";
            $scope.fieldName = "";
            $scope.note = "";
        };

        $scope.addBaseCodeData = function(){
            $scope.codeTypeId = "";
            $scope.codeTypeId = $scope.getSunCodeTypeId($scope.selectedBaseCode.codeTypeId);
            $scope.upCodeId = $scope.selectedBaseCode.codeTypeId;
            $scope.upCodeName = $scope.selectedBaseCode.codeTypeName;
            $scope.codeTypeName = "";
            $scope.fieldName = "";
            $scope.note = "";
            $scope.removeReadOnly();
        };

        $scope.addSunBaseCodeData = function () {
            $scope.removeReadOnly();
            $scope.codeTypeId = "";
            $scope.codeTypeId = $scope.getSunCodeTypeId($scope.selectedSunBaseCode.codeTypeId);
            $scope.upCodeId = $scope.selectedSunBaseCode.codeTypeId;
            $scope.upCodeName = $scope.selectedSunBaseCode.codeTypeName;
            $scope.codeTypeName = "";
            $scope.fieldName = "";
            $scope.note = "";
        };

        $scope.editSunTypeListData = function(){
            $scope.typeId = true;
            $scope.codeId = true;
            $scope.codeName = true;
            $scope.editCodeTypeId = $scope.selectedSunTypeList.codeTypeId;
            $scope.editUpCodeId = $scope.selectedSunTypeList.upCodeId;
            $scope.editUpCodeName = $scope.selectedSunBaseCode.codeTypeName;
            $scope.editCodeTypeName = $scope.selectedSunTypeList.codeTypeName;
            $scope.editFieldName = $scope.selectedSunTypeList.fieldName;
            $scope.editNote = $scope.selectedSunTypeList.note;
        };

        $scope.editBaseCodeData = function(){
            $scope.typeId = true;
            $scope.codeId = true;
            $scope.codeName = true;
            $scope.editCodeTypeId = $scope.selectedBaseCode.codeTypeId;
            $scope.editUpCodeId = $scope.selectedBaseCode.upCodeId;
            $scope.editUpCodeName = "";
            $scope.editCodeTypeName = $scope.selectedBaseCode.codeTypeName;
            $scope.editFieldName = $scope.selectedBaseCode.fieldName;
            $scope.editNote = $scope.selectedBaseCode.note;
        };
        $scope.editSunBaseCodeData = function(){
            $scope.typeId = true;
            $scope.codeId = true;
            $scope.codeName = true;
            $scope.editCodeTypeId = $scope.selectedSunBaseCode.codeTypeId;
            $scope.editUpCodeId = $scope.selectedSunBaseCode.upCodeId;
            $scope.editUpCodeName = $scope.selectedBaseCode.codeTypeName;
            $scope.editCodeTypeName = $scope.selectedSunBaseCode.codeTypeName;
            $scope.editFieldName = $scope.selectedSunBaseCode.fieldName;
            $scope.editNote = $scope.selectedSunBaseCode.note;
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

    }
);
