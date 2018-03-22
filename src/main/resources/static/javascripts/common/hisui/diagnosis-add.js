/**
 * 此module是自定义指令的html代码模版缓存
 */
angular.module('hr.templateCache').run(['$templateCache', function ($templateCache) {
    $templateCache.put('diagnosis-add.html','<div class="input-append">\n    <input type="text" class="input-medium diagnosis-input" ng-model="diagDescs" id="diagnosis-input" >\n    <button  class="btn diagnosis-btn" type="button" ng-click="diagnosisAddDivIsShow()"  id="addDiagnosisBtn"><i class="icon-pencil"></i></button>\n</div>\n    <div class="diagnosis-add" ng-show="diagnosisAddIsShow" click-outside="diagnosisClickOut()">\n    <div class="diagnosis-add-header">\n        <!--<button type="button" class="close" ng-click="diagnosisAddDivIsFalse()">&times;</button>-->\n        <!--<h5>诊断</h5>-->\n    </div>\n    <div class="diagnosis-add-body">\n        <div class="body-content" ng-repeat="diagnosisVO in DiagnoseVOs">\n            <input type="text" class="input-medium" name="diagnosisName" id="diagnosisName0" ng-focus="setNowIndex($index)"\n                   index="0"\n                   diagnosis-dict="diagnosisOption" ng-model="diagnosisVO.diagDesc">\n            <a ng-click="delDiagnosis($index)">\n                <i class="icon-cancel-2" data-toggle="tooltip" data-placement="top" title="删除"\n                   data-original-title="删除"></i>\n            </a>\n            <a class="new-content" id="addOutpMrDiagnosis0" ng-click="addDiagnosis($index)"\n               ng-show="diagnosisVO.addBtnIsShow">\n                <i class="icon-plus-2" data-toggle="tooltip" data-placement="top" title="新增"\n                   data-original-title="新增"></i>\n            </a>\n        </div>\n    </div>\n    <span class="dia-waring">{{waring}}</span>\n</div>\n     \n\n\n   \n\n\n        ');

}]);
/**
 * 通用诊断字典新增服务
 * 如果需要该变前面诊断的长度需要添加diagnosis-input的样式控制
 */
angular.module('hr.directives').directive("diagnosisAdd", ["$document","$templateCache","hrDialog","$compile","$parse","hrPosition", function ($document,$templateCache,hrDialog,$compile,$parse,hrPosition) {
    var diagnosis = {
        restrict: "E",
        templateUrl: "diagnosis-add.html",
        scope: {
            callback: "=",
            ngModel: "="
        },


        controller: ["$scope", function ($scope) {
            $scope._originalKeyMap = angular.copy(Mousetrap.getKeyMap());
            function isRepeat(arr) {
                var hash = {};
                for (var i in arr) {
                    if (hash[arr[i]])
                        return true;
                    hash[arr[i]] = true;

                }

                return false;

            };
            var diagnoseVO = function () {
                this.diagType = "2";
                // 诊断描述
                this.diagDesc = "";
                //诊断编码
                this.diagCode = "";
                //诊断体系 CODING_SYSTEM
                this.codingSystem = "";
                //医疗类别
                this.clinicCate = 2;
                // 确诊标志
                this.diagIndicator = 0;
                //诊断医生
                this.doctor = "";
                //诊断医生编号
                this.doctorId = "";
                this.addBtnIsShow = true;

            };
            $scope.DiagnoseVOs = [];
            $scope.DiagnoseVOs = [
                {diagDesc: "", diagCode: "", codingSystem: "", doctorId: "", addBtnIsShow: true}
            ];
            $scope.selectDiagnosisCallback = function (data,index) {
               console.log(data);
            };
            $scope.setNowIndex=function(index){
                $scope.index=index;
            }


            $scope.diagnosisOption = {
                selectedItems: $scope.DiagnoseVOs,
                afterSelection: $scope.selectDiagnosisCallback,
                dropdownAutoWidth: false
            };

            function arrayToString() {
                setTimeout(function () {
                    var diagDescArray = [];
                    $scope.DiagnoseVOs.forEach(function (diagnosis) {
                        diagDescArray.push(diagnosis.diagDesc);
                    });
                    $scope.diagDescs= diagDescArray.join(";");
                    $scope.$apply();
                }, 100);
            }

            $scope.diagnosisAddDivIsShow = function () {
                $scope.setPosition();
                $scope.makeDiagDescToArray($scope.diagDescs);
                $scope.diagnosisAddIsShow = true;
                setTimeout(function () {
                    $("#diagnosisName0").focus();
                }, 100);
                $scope.bindKeys();

            };
            $scope.makeDiagDescToArray=function(desc){
                $scope.DiagnoseVOs=[];
                if(!isNull(desc)){
                    var tmpArr= desc.split(";")
                    tmpArr.forEach(function(item){
                           if(isNull(item)){
                               return false;
                           }
                            $scope.DiagnoseVOs.push({diagDesc: item, diagCode: "", codingSystem: "", doctorId: "", addBtnIsShow: true})

                    })
                }else{
                    $scope.DiagnoseVOs.push({diagDesc: "", diagCode: "", codingSystem: "", doctorId: "", addBtnIsShow: true})
                }
            };


            /**
             *患者诊断信息录入
             * @param index
             */
            $scope.addDiagnosis = function (index) {
                $scope.DiagnoseVOs.push({diagDesc: "", diagCode: "", codingSystem: "", doctorId: "", addBtnIsShow: true});
                $scope.DiagnoseVOs[index].addBtnIsShow = false;
                $scope.DiagnoseVOs[index + 1].addBtnIsShow = true;
                setTimeout(function () {
                    $("#diagnosisName" + (index + 1)).focus();
                }, 100);
                arrayToString();
            };
            /**
             *患者诊断信息删除
             * @param index
             * @returns {boolean}
             */
            $scope.delDiagnosis = function (index) {
                if (index === 0 && $scope.DiagnoseVOs.length === 1) {
                    $scope.DiagnoseVOs[index] = {diagDesc: "", diagCode: "", codingSystem: "", doctorId: "", addBtnIsShow: true};
                    setTimeout(function () {
                        $("#diagnosisName" + (index)).focus();
                    }, 100);
                    arrayToString();
                    return false;
                }
                if ((index + 1) === $scope.DiagnoseVOs.length) {
                    $scope.DiagnoseVOs[index - 1].addBtnIsShow = true;

                }
                setTimeout(function () {
                    $("#diagnosisName" + (index-1)).focus();
                }, 100);
                $scope.DiagnoseVOs.splice(index, 1);
                arrayToString();
            };
            var _template = "";
            $scope.setPosition=function(targetElement){
                if(targetElement) {
                    _template = angular.element(
                        angular.copy($templateCache.get('diagnosis-add.html'))
                    );
                    $compile(_template)($scope);
                } else {

                    var resultTop = 0;
                    var targetPosition = hrPosition.offset($("#diagnosis-input"));
                    if(targetPosition.top < 202) {
                        resultTop = 30;
                    } else {
                        resultTop = -202;
                    }
                    $(".diagnosis-add").css({top: resultTop + "px"})

                }
            };
            $scope.diagnosisClickOut=function(){
                if(!$scope.diagnosisAddIsShow){
                    return false;
                }

                var descTmp = [];
                $scope.DiagnoseVOs.forEach(function (item) {
                    descTmp.push(item.diagDesc);
                });
                if (isRepeat(descTmp)) {
                    $scope.waring="诊断不能重复！";
                    descTmp = [];
                    return false;
                }
                Mousetrap.reset();
                Mousetrap.setKeyMap($scope._originalKeyMap);
                arrayToString();
                if($scope.diagnosisAddIsShow){
                    $scope.callback.otherFunction();
                }
                $scope.diagnosisAddIsShow = false;


            };
            $scope.bindKeys = function () {
                Mousetrap.reset();
                Mousetrap.bindGlobal("alt+c", function () {
                    $scope.diagnosisClickOut();
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                    return false;
                });
                Mousetrap.bindGlobal("alt+a", function () {
                    $scope.addDiagnosis($scope.DiagnoseVOs.length-1);
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                    return false;
                });
                Mousetrap.bindGlobal("alt+d", function () {
                    $scope.delDiagnosis($scope.index);
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                    return false;
                });



            };


        }],
        link: function (scope, element, attrs) {
//            scope.setPosition(element)
            scope.$watch("diagDescs", function (newValue, oldValue) {
                if (newValue !== undefined) {
                    scope.ngModel = newValue;
                    console.log(newValue);
                }
            }, true);

            //父变 更新子
            scope.$watch('ngModel', function (newValue, oldValue) {
                scope.diagDescs = newValue;
                $parse(attrs.ngModel).assign(scope, newValue);
            }, true);
        }

    };
    return  diagnosis;
}]);
