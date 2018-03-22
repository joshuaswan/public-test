/**
 * 此module是自定义指令的html代码模版缓存
 */
angular.module('hr.templateCache').run(['$templateCache', function ($templateCache) {
    $templateCache.put('patient-allergy.html', "<div  hr-draggable modal=\"modalShow\" close=\"closeModalCallback()\" options=\"modalOption\">\n        <div class=\"modal-header\">\n            <button type=\"button\" class=\"close\" ng-click=\"closeModal()\">&times;</button>\n            <h5 id=\"myModalLabel\">过敏史</h5>\n        </div>\n        <div class=\"modal-body modal-allergy-body\">\n            <div class=\"form-horizontal\">\n                <div class=\"control-group allergy-type\">\n                    <label class=\"control-label\">\n                        <b class=\"red-star\">*</b>过敏源类型\n                    </label>\n\n                    <div class=\"controls\">\n                        <select ui-select2 id=\"allergyTypePatientAllergy\" ng-disabled=\"opts.operationStatus==1\"\n                                enter-loop=\"150\" enterindex=\"-1\" hr-autofocus=\"select2\"\n                                ng-model=\"patientAllergy.allergyType\">\n                            <option ng-repeat=\"allergyType in allergyDict.allergyTypeList\"\n                                    code=\"{{allergyType.inputCode}}\"\n                                    value=\"{{allergyType.codeId}}\">{{allergyType.codeName}}\n                            </option>\n                        </select>\n                    </div>\n                </div>\n                <div class=\"control-group allergen-degree\">\n                    <label class=\"control-label\">过敏程度</label>\n\n                    <div class=\"controls\">\n                        <select ui-select2 id=\"allergenDegreePatientAllergy\"\n                                enter-loop=\"150\" enterindex=\"2\" \n                                ng-model=\"patientAllergy.allergenDegree\">\n                            <option ng-repeat=\"allergenDegree in allergyDict.allergenDegreeList\"\n                                    code=\"{{allergenDegree.inputCode}}\"\n                                    value=\"{{allergenDegree.codeId}}\">{{allergenDegree.codeName}}\n                            </option>\n                        </select>\n                    </div>\n                </div>\n                <div class=\"control-group allergen-symptom\" ng-if=\"patientAllergy.allergyType == \'01\'\">\n                    <label class=\"control-label\" ng-show=\"patientAllergy.allergyType == \'01\'\">\n                        <b class=\"red-star\">*</b>过敏药品\n                    </label>\n\n                    <div class=\"controls\">\n                        <input type=\"text\" class=\"input-medium\" id=\"allergenDrugNameHistory\"  ng-disabled=\"opts.operationStatus==1\"\n                               enter-loop=\"150\" enterindex=\"4\" ng-model=\"patientAllergy.allergenDrugName\" ng-focus=\"drugSearchFocus()\" ng-change=\'changeAllergenDrugName()\'\n                               type-writing=\"{{allergyOpt}}\" >\n                       \n                    </div>\n                </div>\n\n                <div class=\"control-group allergen-info\" ng-if=\"patientAllergy.allergyType != \'01\'\">\n                    <label class=\"control-label\">\n                        <b class=\"red-star\">*</b>过敏源\n                    </label>\n\n                    <div class=\"controls\">\n                        <input ui-select2=\"patientAllergySelect2Option\" id=\"allergenPatientAllergy\"  ng-disabled=\"opts.operationStatus==1\"\n                               enter-loop=\"150\" enterindex=\"4\" ng-model=\"allergenInfo\"> \n                    </div>\n                </div>\n\n                <div class=\"control-group allergen-symptom\">\n                    <label class=\"control-label\">过敏症状</label>\n\n                    <div class=\"controls\">\n                        <input type=\"text\" class=\"input-medium\" maxlength=\'40\'\n                               id=\"allergenSymptomPatientAllergy\"\n                               ng-focus=\"closeDrugSearch()\"\n                               enter-loop=\"150\" enterindex=\"5\"\n                               ng-model=\"patientAllergy.allergenSymptom\">\n                    </div>\n                </div>\n                <div class=\"control-group allergy-date\">\n                    <label class=\"control-label\">发生时间</label>\n\n                    <div class=\"controls\">\n                        <input class=\"input-medium\" id=\"beginDatePatientAllergy\"\n                               enter-loop=\"150\" enterindex=\"6\"\n                               ng-model=\"patientAllergy.beginDate\" hr-date-time=\"pastHistoryDateOption\" type=\"text\">\n                    </div>\n                </div>\n                <div class=\"control-group allergen-status\">\n                    <label class=\"control-label\">当前状态</label>\n\n                    <div class=\"controls\">\n                        <select ui-select2 id=\"allergenStatusPatientAllergy\"\n                                enter-loop=\"150\" enterindex=\"8\"\n                                ng-model=\"patientAllergy.allergenStatus\">\n                            <option value=\"0\">继续过敏</option>\n                            <option value=\"1\">不再过敏</option>\n                        </select>\n                    </div>\n\n                </div>\n            </div>\n        </div>\n        <div class=\"modal-footer\">\n            \n            <label class=\"checkbox margin-left10 pull-left\" ng-hide=\"modalSource==\'pastHistory\'\" >\n            <input type=\"checkbox\"  ng-model=\"copyOption.isSave\" ng-true-value=\"1\"\n            ng-false-value=\"0\" ng-checked=\"true\">存入过敏史\n            </label>\n            <label class=\"checkbox margin-left10 pull-left\">\n                <input type=\"checkbox\" ng-model=\"patientAllergy.ownComplaintDisease\" ng-true-value=\"1\"\n                       enter-loop=\"150\" enterindex=\"8\" ng-false-value=\"0\">患者自述\n            </label>\n            <label class=\"checkbox margin-left10 pull-left\">\n                <input type=\"checkbox\" ng-model=\"patientAllergy.inhospitalDisease\" ng-true-value=\"1\"\n                       enter-loop=\"150\" enterindex=\"9\" ng-false-value=\"0\">本院发生\n            </label>\n            <button class=\"btn btn-primary\" enter-loop=\"150\" enterindex=\"10\" id=\"AllergyModalSave\" ng-click=\"saveModal()\">\n                确定\n            </button>\n            <button class=\"btn cancel\" ng-click=\"closeModal()\">关闭</button>\n        </div>\n    \n</div>\n<div id=\"drugSelect2\" ng-controller=\"typeWritingCtrl\" ng-if=\"focusDrugSelect\">\n    <div ng-show=\"leftShow\" id=\"drugInfoSelect\" class=\"hc-ime\" click-outside=\"close()\"\n         inside-id=\"drugInfoInputCode\">\n        <div class=\"hc-ime-left\" id=\"basicDrugInfo\">\n            <div class=\"search-content\" id=\"leftSearch2\">\n                <table class=\"table table-striped\">\n                    <tbody>\n                    <tr ng-repeat=\"leftRow in leftRowList\"\n                        ng-dblclick=\"selectedValue()\"\n                        ng-click=\"activateLeftRowFunc(leftRow)\"\n                        ng-class=\"{\'bg-selected-color\': leftRow==activateLeftRow}\">\n                        <td>\n                            <nobr>{{leftRow.drugName}}</nobr>\n                        </td>\n                    </tr>\n                    </tbody>\n                </table>\n            </div>\n            <div class=\"search-footer\">\n                <form class=\'form-inline\'>\n                <label class=\"checkbox\" id=\"a\" for=\"allergyFuzzySearch\"><input type=\"checkbox\"\n                                                                        name=\"allergySearchType\"\n                                                                        id=\"allergyFuzzySearch\"\n                                                                        ng-model=\"fuzzyMatch\"\n                                                                  ng-change=\"changeDrugSearchType()\"/>模糊匹配\n                </label>\n                </form>\n            </div>\n        </div>\n    </div>\n</div>\n\n\n\n\n");
    $templateCache.put('disease-history.html', "<div hr-draggable  modal=\"modalShow\" close=\"closeModalCallback()\" options=\"modalOption\">\n    <!--新增疾病史-->\n    <div class=\"modal-header\">\n        <button type=\"button\" class=\"close\" ng-click=\"closeModal()\">&times;</button>\n        <h5>疾病史</h5>\n    </div>\n\n    <div class=\"modal-body modal-disease-history-body\">\n        <div class=\"form-horizontal\">\n\n\n            <div class=\"control-group disease-history-name\">\n                <label class=\"control-label\">\n                    <b class=\"red-star\">*</b>疾病名称\n                </label>\n\n                <div class=\"controls\">\n                    <input type=\"text\" hr-autofocus ng-disabled=\"opts.operationStatus==1\"\n                           enter-loop=\"140\" enterindex=\"1\"\n                           class=\"input-medium input-two\"\n                           id=\"diseaseModalDescription\"\n                           diagnosis-dict=\"diseaseDiagnosisDictOption\"\n                           ng-model=\"diseaseHistory.description\"\n                            >\n\n                </div>\n            </div>\n            <div class=\"control-group\">\n                <label class=\"control-label\">发病时间</label>\n\n                <div class=\"controls\">\n                    <input hr-date-time=\"pastHistoryDateOption\" class=\"input-date\" id=\"diseaseModalBeginDate\"\n                           enter-loop=\"140\" enterindex=\"2\" ng-change=\"changeDiseaseBeginDate(diseaseHistory)\"\n                           ng-model=\"diseaseHistory.beginDate\" type=\"text\">\n                </div>\n            </div>\n            <div class=\"control-group label-four\">\n                <label class=\"control-label\">持续时间</label>\n\n                <div class=\"controls\">\n                    <!--<div class=\"input-append\">-->\n                        <input type=\"text\" class=\"duration-time\" id=\"diseaseModalDurationTime\"\n                               enter-loop=\"140\" enterindex=\"3\"\n                          ng-model=\"diseaseHistory.durationTime\">\n                        <select ui-select2 class=\"duration-time-unit\" ng-model=\"diseaseHistory.durationTimeUnit\">\n                            <option value=\"年\">年</option>\n                            <option value=\"月\">月</option>\n                        </select>\n                    <!--</div>-->\n                </div>\n            </div>\n            \n            <div class=\"control-group chronic-Disease label-four\">\n                <label class=\"control-label\">慢病标识</label>\n\n                <div class=\"controls\">\n                    <select ui-select2 id=\"diseaseModalChronicDisease\"\n                            enter-loop=\"140\" enterindex=\"4\"\n                            ng-model=\"diseaseHistory.chronicDisease\">\n                        <option value=\"0\">慢病</option>\n                        <option value=\"1\">急症</option>\n                    </select>\n                </div>\n            </div>\n            <div class=\"control-group disease-status\">\n                <label class=\"control-label\">当前状态</label>\n\n                <div class=\"controls\">\n                    <select ui-select2\n                            enter-loop=\"140\" enterindex=\"5\" id=\"diseaseModalDiseaseStatus\"\n                            ng-model=\"diseaseHistory.diseaseStatus\">\n                        <option value=\"0\">未治愈</option>\n                        <option value=\"1\">治愈</option>\n                    </select>\n                </div>\n            </div>\n            <div class=\"control-group treat-condition label-four\">\n                <label class=\"control-label\">治疗情况</label>\n\n                <div class=\"controls\">\n                    <input type=\"text\" class=\"input-medium input-two\" id=\"diseaseModalTreatment\"\n                           enter-loop=\"140\" enterindex=\"6\"\n                           ng-model=\"diseaseHistory.treatment\">\n                </div>\n            </div>\n        </div>\n    </div>\n    <div class=\"modal-footer\">\n        <label class=\"checkbox margin-left10  pull-left\" ng-hide=\"modalSource==\'pastHistory\'\" style=\'display: none;\'>\n            <input type=\"checkbox\" ng-model=\"copyOption.isSave\"   \n                   ng-checked=\"true\"    ng-true-value=\"1\"    ng-false-value=\"0\">存入疾病史\n </label>\n <label class=\"checkbox margin-left10 pull-left\">\n     <input type=\"checkbox\"  ng-model=\"diseaseHistory.ownComplaintDisease\" ng-true-value=\"1\"\n            enter-loop=\"140\" enterindex=\"8\"  ng-false-value=\"0\">患者自述\n </label>\n <label class=\"checkbox margin-left10 pull-left\">\n     <input type=\"checkbox\"  ng-model=\"diseaseHistory.inhospitalDisease\" ng-true-value=\"1\"\n            enter-loop=\"140\" enterindex=\"9\"  ng-false-value=\"0\">本院诊断\n </label>\n\n <button class=\"btn btn-primary\"  id=\"diseaseModalSave\" enter-loop=\"140\" enterindex=\"10\" ng-click=\"saveModal()\">确定</button>\n <button class=\"btn cancel\" ng-click=\"closeModal()\">关闭</button>\n    </div>\n</div>");
    $templateCache.put('operation-history.html', "<div hr-draggable modal=\"modalShow\" close=\"closeModalCallback()\" options=\"modalOption\">\n    <!--新增手术史-->\n    <div class=\"modal-header\">\n        <button type=\"button\" class=\"close\" ng-click=\"closeModal()\">&times;</button>\n        <h5>手术史</h5>\n    </div>\n\n    \n    <div class=\"modal-body\">\n        <div class=\"form-horizontal\">\n\n            <div class=\"control-group\">\n                <label class=\"control-label\">手术时间</label>\n\n                <div class=\"controls\">\n                    <input hr-date-time=\"pastHistoryDateOption\" class=\"input-date\" id=\"operationModalOperationDate\"\n                            hr-autofocus\n                           ng-model=\"operationHistory.operationDate\" type=\"text\">\n                </div>\n            </div>\n\n            <div class=\"control-group disease-history-name\">\n                <label class=\"control-label\">\n                    <b class=\"red-star\">*</b>手术名称\n                </label>\n\n                <div class=\"controls\">\n                    <input type=\"text\" name=\"operationNameOperationHistory\" ng-disabled=\"opts.operationStatus==1\"\n                           enter-loop=\"160\" enterindex=\"2\"\n                           class=\"input-medium operate-input-style\"\n                           id=\"operationModalOperationName\"\n                            operation-dict=\"diseaseOperationDictOption\"\n                   ng-model=\"operationHistory.operationName\">\n                </div>\n            </div>\n        </div>\n    </div>\n    \n    <div class=\"modal-footer\">\n        <label class=\"checkbox margin-left10 pull-left\" ng-hide=\"modalSource==\'pastHistory\'\" style=\'display: none;\'>\n            <input type=\"checkbox\"  ng-model=\"copyOption.isSave\" ng-checked=\"true\"  ng-true-value=\"1\" ng-false-value=\"0\">\n            存入手术史                                                                                                             \n        </label>\n        <label class=\"checkbox margin-left10 pull-left\">\n            <input type=\"checkbox\"  ng-model=\"operationHistory.ownComplaintDisease\" ng-true-value=\"1\"\n                   enter-loop=\"160\" enterindex=\"3\"  ng-false-value=\"0\">患者自述\n        </label>\n        <label class=\"checkbox margin-left10 pull-left\">\n            <input type=\"checkbox\"  ng-model=\"operationHistory.inhospitalDisease\" ng-true-value=\"1\"\n                   enter-loop=\"160\" enterindex=\"4\"  ng-false-value=\"0\">本院发生\n        </label>\n        \n        <button class=\"btn btn-primary\" enter-loop=\"160\" enterindex=\"5\" id=\"operationModalSave\" ng-click=\"saveModal()\">确定</button>\n        <button class=\"btn cancel\" ng-click=\"closeModal()\">关闭</button>\n    </div>\n    \n</div>\n<div ng-include=\"\'templates/outp/type-writing-operation.html \'\" id=\"drugSelect\" click-outside=\"closeThis()\" ng-controller=\"typeWritingCtrl\"></div>");
    $templateCache.put('family-history.html', "<div hr-draggable modal=\"modalShow\" close=\"closeModalCallback()\" options=\"modalOption\">\n    <div class=\"modal-header\">\n        <button type=\"button\" class=\"close\" ng-click=\"closeModal()\">&times;</button>\n        <h5>家族史</h5>\n    </div>\n\n    \n    <div class=\"modal-body family-past-history\">\n            <div class=\"outp-mr-past-history li-striped\"  >\n                <textarea class=\"family-editable\" id=\"familyNameText\" maxlength=\"100\" placeholder=\"请输入家族史...\"  ui-keydown=\"{120:\'bindEventForOutpMrModalOpen(11)\' }\" ng-model=\"familyHistory.familyName\" autofocus></textarea>\n            </div>\n\n    </div>\n    \n    <div class=\"modal-footer\">\n        <label class=\"checkbox margin-left10 pull-left\" ng-hide=\"modalSource==\'pastHistory\'\">\n            <input type=\"checkbox\"  ng-model=\"copyOption.isSave\"  ng-true-value=\"1\" ng-false-value=\"0\" >\n            存入家族史                                                                                                             \n        </label>\n        <button class=\"btn btn-primary\" enter-loop=\"160\" enterindex=\"5\" id=\"familyModalSave\" ng-click=\"saveModal()\">确定</button>\n        <button class=\"btn cancel\" ng-click=\"closeModal()\">关闭</button>\n    </div>\n    \n</div>\n");
    // <div class="control-group allergen-symptom" ng-show="patientAllergy.allergyType == '01'">
    //     <label class="control-label">药物分类</label>
    //
    //     <div class="controls">
    //     <input type="text" class="input-medium"  ng-disabled="opts.operationStatus==1"
    // id="allergenDrugClass"  ng-disabled="opts.operationStatus==1"
    // enter-loop="150" enterindex="3"
    // ng-model="patientAllergy.allergenDrugClassName"
    // ng-focus="focusAllergenDrugClass()" ng-click="focusAllergenDrugClass()">
    //
    //     <div class="hr-drug-class"                             ng-if="showAllergenDrugClass"
    //     hr-drug-class
    //     on-selected-item="onSelectedItem(object)"
    // click-outside="unfocusAllergenDrugClass()" inside-id="allergenDrugClass"
    // ng-init="callback = setOrderDrugInfoValue">
    //     </div>
    //
    //
    //     </div>
    //     </div>
}]);
angular.module('hr').controller('DoctorStationModalController', ['$scope', 'modal', '$http', '$timeout', 'hrIndexedDB', 'hrDialog', 'hrProgress', function ($scope, modal, $http, $timeout, hrIndexedDB, hrDialog, hrProgress) {

    $scope.bindEventForOutpMrModalOpen = function (catagory) {
        if ($scope.modalSource !== "mr") {
            return;
        }
        if(catagory===11){
            angular.element($("#outpMrMain")).scope().bindEventForOutpMrOpen(catagory);
        }
    };

    /*初始化过敏史*/
    var initPatientAllergy = function () {
        $scope.copyOption.isSave=1;
        $scope.showAllergenDrugClass = false;
        $scope.patientAllergy = $scope.copyOption.patientAllergy;
        if ($scope.copyOption.patientAllergy.beginDate !== null) {
            var beginDate = new Date(Number($scope.copyOption.patientAllergy.beginDate));
            $scope.patientAllergy.beginDate = HrDate.formatDate(beginDate, HrDate.YY_MM_DD);
        }
        if ($scope.copyOption.patientAllergy.endDate !== null) {
            var endDate = new Date(Number($scope.copyOption.patientAllergy.endDate));
            $scope.patientAllergy.endDate = HrDate.formatDate(endDate, HrDate.YY_MM_DD);
        }
        $scope.allergyDict = $scope.copyOption.allergyDict;
        var AllergenInfo = function () {
            this.id = "";
            this.text = "";
            this.code = "";
        };
        $scope.allergenInfo = new AllergenInfo();
        if ($scope.copyOption.operationStatus === "1") {
            $scope.allergenInfo = {
                "id": $scope.patientAllergy.allergen,
                "text": $scope.patientAllergy.allergen,
                "code": $scope.patientAllergy.allergen
            };
        }
        $scope.createSearchChoice = function (text) {
            if (text === "") {
                return;
            }
            var filterList = $scope.allergyDict.allergenList.filter(function (item, index, array) {
                if (item.text === text) {
                    return true;
                }
            });
            if (filterList.length !== 0) {
                $scope.allergenInfo = filterList[0];
            } else {
                var newObject = {id: text, text: text, code: text};
                $scope.allergenInfo = newObject;
                $scope.allergyDict.allergenList.push(newObject);
            }
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };
        $scope.$watch('allergenInfo', function (newValue, oldValue) {
            if (newValue === null && oldValue !== null || typeof newValue === 'string' && oldValue !== null) {
                $scope.allergenInfo = oldValue;
                return;
            }
            var index = $scope.allergyDict.allergenList.indexOf(newValue);
            if (index < 0 && newValue !== null && newValue !== undefined) {
                $scope.createSearchChoice(newValue.text);
            }
        }, true);
        $scope.patientAllergySelect2Option = {
            data: $scope.allergyDict.allergenList,
            matcher: function (term, text) {
                var isMatch = false;
                $scope.allergyDict.allergenList.forEach(function (item) {
                    if (item.text === text) {
                        var code = item.code || '';
                        isMatch = code.toUpperCase().indexOf(term.toUpperCase()) >= 0
                            || text.toUpperCase().indexOf(term.toUpperCase()) >= 0;
                    }
                });
                return isMatch;
            },
            createSearchChoice: function (term, data) {
                var matchedItems = $(data).filter(function (index, item) {
                    return item.text === term;
                });
                if (matchedItems.length === 0) {
                    return {id: term, text: term, code: term};
                }
            }
        };
        $("body").on("select2-selecting", "#allergenPatientAllergy", function (e) {
            if (e.object) {
                $scope.allergenInfo= e.object;
            }
        })

    };

    $scope.focusDrugSelect=false;

    //关闭过敏药品搜索框
    $scope.closeDrugSearch=function(){
        var scope=angular.element($("#drugSelect2")).scope();
        if(scope){
            scope .close();
            $scope.focusDrugSelect=false;
            Mousetrap.reset();
        }
    };

    //光标定位
    $scope.drugSearchFocus=function(){
        $scope.focusDrugSelect=true;
        $timeout(function(){
            $("#allergenDrugNameHistory").select();
        },100);
        // var allergenDrugName=$scope.patientAllergy.allergenDrugName;
        // if(allergenDrugName){
        //     $timeout(function(){
        //         var scope= angular.element($("#drugSelect2")).scope();
        //         if(scope){
        //             scope.searchByInputCode(allergenDrugName, $scope.allergyOpt, $("#allergenDrugNameHistory"));
        //         }
        //     },100);
        // }
    };

    //$scope.foucsAllergen=function(){
    //    if($scope.patientAllergy.allergyType !== '01'){
    //        return "allergenPatientAllergy";
    //    }else{
    //        return "allergenDrugClass";
    //    }
    //};
    var initDiseaseHistory = function () {
        $scope.diseaseHistory = $scope.copyOption.diseaseHistory;
        if ($scope.copyOption.diseaseHistory.beginDate !== null) {
            var beginDate = new Date(Number($scope.copyOption.diseaseHistory.beginDate));
            $scope.diseaseHistory.beginDate = HrDate.formatDate(beginDate, HrDate.YY_MM_DD);
        }
        $scope.selectedItems = [];
        $scope.selectDiseaseHistoryDiagnosisCallback = function (diagnosisDict) {
            $scope.diseaseHistory.description = diagnosisDict.diagnosisName;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };
        $scope.diseaseDiagnosisDictOption = {
            selectedItems: $scope.selectedItems,
            afterSelection: $scope.selectDiseaseHistoryDiagnosisCallback,
            dropdownAutoWidth: false
        };
    };

    var initOperationHistory = function () {
        $scope.operationHistory = $scope.copyOption.operationHistory;
        if ($scope.copyOption.operationHistory.operationDate !== null) {
            var operationDate = new Date(Number($scope.copyOption.operationHistory.operationDate));
            $scope.operationHistory.operationDate = HrDate.formatDate(operationDate, HrDate.YY_MM_DD);
        }
        $scope.selectedItems = [];
        $scope.selectOperationHistoryDiagnosisCallback = function (operationDict) {
            $scope.operationHistory.operationName = operationDict.operationName;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };
        $scope.diseaseOperationDictOption = {
            selectedItems: $scope.selectedItems,
            afterSelection: $scope.selectOperationHistoryDiagnosisCallback,
            dropdownAutoWidth: true
        };
    };

    var initFamilyHistory=function(){
        if ($scope.copyOption.operationStatus === "0") {
            $scope.copyOption.isSave = 1;
        }
        $scope.familyHistory = $scope.copyOption.familyHistory;
        $scope.selectedItems = [];
    };

    $scope.copyOption = angular.copy($scope.opts);

    //通过发病时间计算持续时间
    $scope.changeDiseaseBeginDate = function (diseaseHistory) {
        if (diseaseHistory.beginDate && diseaseHistory.durationTime === 0||diseaseHistory.durationTime === "") {
            var beginDate = new Date(diseaseHistory.beginDate);
            if (!diseaseHistory.endDate) {
                diseaseHistory.endDate = new Date();
            } else {
                diseaseHistory.endDate = new Date(diseaseHistory.endDate);
            }
            var year = diseaseHistory.endDate.getFullYear() - beginDate.getFullYear();
            var month = diseaseHistory.endDate.getMonth() - beginDate.getMonth();
            if (month === 0) {
                month++;
            }
            var number = 0;
            var unit = "";
            if (year > 0) {
                var diff = diseaseHistory.endDate.getMonth() + 12 - beginDate.getMonth();
                if (year === 1 && diff < 12) {
                    number = diff;
                    unit = "月";
                } else {
                    number = year;
                    unit = "年";
                }
            } else if (month > 0) {
                number = month;
                unit = "月";
            } else {
                number = 0;
                unit = "月";
            }
            diseaseHistory.durationTime = number;
            diseaseHistory.durationTimeUnit = unit;
            console.log(diseaseHistory);
        }
    };

    //通过持续时间计算发病时间
    $scope.changeDiseaseDurationTime = function (diseaseHistory) {
        if (diseaseHistory.durationTime && Number(diseaseHistory.durationTime) && diseaseHistory.durationTime != 0) {
            var endDate =  new Date();
            if (diseaseHistory.durationTimeUnit == "年") {
                var year = endDate.getFullYear() - diseaseHistory.durationTime;
                var month = endDate.getMonth() + 1;
                var date = endDate.getDate();
                //if(diseaseHistory.beginDate){
                //    diseaseHistory.beginDate = HrDate.formatDate(new Date(diseaseHistory.beginDate));
                //}else{
                diseaseHistory.beginDate = HrDate.formatDate(new Date(year + "/" + month + "/" + date), HrDate.YY_MM_DD);
                // }
            } else {
                //if(diseaseHistory.beginDate){
                //    diseaseHistory.beginDate = HrDate.formatDate(new Date(diseaseHistory.beginDate));
                //}else {
                endDate.setMonth(endDate.getMonth() - diseaseHistory.durationTime);
                var year = endDate.getFullYear();
                var month = endDate.getMonth() + 1;
                var date = endDate.getDate();
                //}
                diseaseHistory.beginDate = HrDate.formatDate(new Date(year + "/" + month + "/" + date), HrDate.YY_MM_DD);


            }
        }
    };


    var init = function () {
        if ($scope.modalType === "patientAllergy") {
            initPatientAllergy();
        } else if ($scope.modalType === "diseaseHistory") {
            initDiseaseHistory();
        } else if ($scope.modalType === "operationHistory") {
            initOperationHistory();
        }else if ($scope.modalType === "familyHistory") {
            initFamilyHistory();
        }
    };

    init();

    /*modal显隐*/
    $scope.modalShow = true;
    /*modal Option*/
    $scope.modalOption = {
        dialogClass: "past-history-modal modal fade in",
        backdropFade: true,
        dialogFade: true,
        keyboard: false,
        backdrop: true,
        backdropClick: true
    };

    var currentDate = new Date();
    $scope.pastHistoryDateOption = {
        pickerType: "datePicker",
        changeYear: true,
        changeMonth: true,
        showMonthAfterYear: true,
        yearRange: currentDate.getFullYear() - 100 + ":" + currentDate.getFullYear(),
        dateFormat: "yy-mm-dd",
        defaultDate: "-5y"
    };
    $scope.closeModalCallback = function () {
//        modal.close(null);
    };
    $scope.closeModal = function () {
        $scope.modalShow = false;
        modal.safeClose();
    };
    function savePastHistoryAllergy() {
        if($scope.patientAllergy.allergyType !== '01'){
            $scope.patientAllergy.allergen = $scope.allergenInfo.text;
        }

        if (hrProgress.isProcessing) {
            return false;
        } else {
            hrProgress.open();
        }
        $http.post(Path.getUri("api/outp-past-history/patient-allergy?startDate=" + ($scope.copyOption.startDate || "") + "&arrivedTime=" + ($scope.copyOption.arrivedTime || "") ), $scope.patientAllergy)
            .success(function (data) {
                hrProgress.close();
                $scope.opts.patientAllergy = data;
                modal.close($scope.opts);
                $scope.modalShow = false;
                hrDialog.dialog(hrDialog.typeEnum.SUCCESS, {message: "保存成功!"}).close(function (result) {
                    console.info(result);
                });
            })
            .error(function (data) {
                hrProgress.close();
                hrDialog.dialog(hrDialog.typeEnum.WARN, {message: "保存失败!"}).close(function (result) {
                    console.info(result);
                });
                console.info(data);
            });
    }
    function savePastHistoryDisease() {
        if (hrProgress.isProcessing) {
            return false;
        } else {
            hrProgress.open();
        }
        $http.post(Path.getUri("api/outp-past-history/disease-history?startDate=" + ($scope.copyOption.startDate || "")  + "&arrivedTime=" + ($scope.copyOption.arrivedTime || "") ), $scope.diseaseHistory)
            .success(function (data) {
                hrProgress.close();
                $scope.opts.diseaseHistory = data;
                modal.close($scope.opts);
                $scope.modalShow = false;
                hrDialog.dialog(hrDialog.typeEnum.SUCCESS, {message: "保存成功!"}).close(function (result) {
                    console.info(result);
                });
            })
            .error(function (data) {
                hrProgress.close();
                hrDialog.dialog(hrDialog.typeEnum.WARN, {message: "保存失败!"}).close(function (result) {
                    console.info(result);
                });
                console.info(data);
            });
    }
    function savePastHistoryOperation() {
        if (hrProgress.isProcessing) {
            return false;
        } else {
            hrProgress.open();
        }
        $http.post(Path.getUri("api/outp-past-history/operation-history?startDate=" + ($scope.copyOption.startDate || "")  + "&arrivedTime=" + ($scope.copyOption.arrivedTime || "") ), $scope.operationHistory)
            .success(function (data) {
                hrProgress.close();
                $scope.opts.operationHistory = data;
                modal.close($scope.opts);
                $scope.modalShow = false;
                hrDialog.dialog(hrDialog.typeEnum.SUCCESS, {message: "保存成功!"}).close(function (result) {
                    console.info(result);
                });
            })
            .error(function (data) {
                hrProgress.close();
                hrDialog.dialog(hrDialog.typeEnum.WARN, {message: "保存失败!"}).close(function (result) {
                    console.info(result);
                });
                console.info(data);
            });
    }
    function savePastHistoryFamily(){
        if (hrProgress.isProcessing) {
            return false;
        } else {
            hrProgress.open();
        }
        $http.post(Path.getUri("api/outp-past-history/family-history?startDate=" + ($scope.copyOption.startDate || "")  + "&arrivedTime=" + ($scope.copyOption.arrivedTime || "") ), $scope.familyHistory)
            .success(function (data) {
                hrProgress.close();
                $scope.opts.familyHistory = data;
                modal.close($scope.opts);
                $scope.modalShow = false;
                hrDialog.dialog(hrDialog.typeEnum.SUCCESS, {message: "保存成功!"}).close(function (result) {
                    console.info(result);
                });
            })
            .error(function (data) {
                hrProgress.close();
                hrDialog.dialog(hrDialog.typeEnum.WARN, {message: "保存失败!"}).close(function (result) {
                    console.info(result);
                });
                console.info(data);
            });
    }
    function saveMrAllergy() {
        //$scope.copyOption.isSave=1;
        if($scope.patientAllergy.allergyType !== '01'){
            $scope.patientAllergy.allergen = $scope.allergenInfo.text;
        }
        $scope.opts.patientAllergy = $scope.patientAllergy;
        $scope.opts.isSave = $scope.copyOption.isSave;
        delete $scope.opts.operationStatus;
        delete $scope.opts.allergyDict;
        modal.close($scope.opts);
        $scope.modalShow = false;
    }
    function saveMrDisease() {
        $scope.copyOption.isSave=1;
        $scope.opts.diseaseHistory = $scope.diseaseHistory;
        $scope.opts.isSave = $scope.copyOption.isSave;
        delete $scope.opts.operationStatus;
        modal.close($scope.opts);
        $scope.modalShow = false;
    }
    function saveMrOperation() {
        $scope.copyOption.isSave=1;
        $scope.opts.operationHistory = $scope.operationHistory;
        $scope.opts.isSave = $scope.copyOption.isSave;
        delete $scope.opts.operationStatus;
        modal.close($scope.opts);
        $scope.modalShow = false;
    }
    function saveMrFamily(){
        // $scope.copyOption.isSave=1;
        $scope.opts.familyHistory = $scope.familyHistory;
        $scope.opts.isSave = $scope.copyOption.isSave;
        delete $scope.opts.operationStatus;
        modal.close($scope.opts);
        $scope.modalShow = false;
    }
    $scope.saveModal = function () {
        if ($scope.modalType === "patientAllergy") {
            if($scope.patientAllergy.allergyType === '01'){
                if($scope.patientAllergy.allergenDrugName.trim() === ""){
                    hrDialog.dialog(hrDialog.typeEnum.WARN, {message: "过敏药品不能为空！"})
                        .close(function () {
                            return
                        });
                    return false;
                }
                $scope.patientAllergy.allergen=$scope.patientAllergy.allergenDrugName;
            } else {
                if ($scope.allergenInfo.text === "") {
                    hrDialog.dialog(hrDialog.typeEnum.WARN, {message: "请输入过敏源！"})
                        .close(function () {
                            return
                        });
                    return false;
                }
            }

            if ($scope.modalSource === "pastHistory") {
                savePastHistoryAllergy();
            } else if ($scope.modalSource === "mr") {
                saveMrAllergy();
            }
        } else if ($scope.modalType === "diseaseHistory") {
            if ($scope.diseaseHistory.description === "") {
                hrDialog.dialog(hrDialog.typeEnum.WARN, {message: "请选择或输入疾病名称！"})
                    .close(function () {
                        return
                    });
                return false;
            } else if ($scope.diseaseHistory.durationTime == 0 && $scope.diseaseHistory.beginDate == null) {
                hrDialog.dialog(hrDialog.typeEnum.WARN, {message: "发病时间和持续时间不能同时为空！"})
                    .close(function () {
                        return
                    });
                return false;
            }
            if ($scope.modalSource === "pastHistory") {
                savePastHistoryDisease();
            } else if ($scope.modalSource === "mr") {
                saveMrDisease();
            }
        } else if ($scope.modalType === "operationHistory") {
            if ($scope.operationHistory.operationName === "") {
                hrDialog.dialog(hrDialog.typeEnum.WARN, {message: "请输入手术名称！"})
                    .close(function () {
                        return
                    });
                return false;
            }
            if ($scope.modalSource === "pastHistory") {
                savePastHistoryOperation();
            } else if ($scope.modalSource === "mr") {
                saveMrOperation();
            }
        } else if ($scope.modalType === "familyHistory") {
            if ($scope.familyHistory.familyName === "") {
                hrDialog.dialog(hrDialog.typeEnum.WARN, {message: "请输入家族史！"})
                    .close(function () {
                        return
                    });
                return false;
            }
            if ($scope.modalSource === "pastHistory") {
                savePastHistoryFamily();
            } else if ($scope.modalSource === "mr") {
                saveMrFamily();
            }
        }
    };

    $scope.changeAllergenDrugName=function(){
        if($scope.patientAllergy.allergenDrugName===""){
            $scope.patientAllergy.allergenDrugCode = "";
            $scope.patientAllergy.allergenDrugName = "";
            $scope.patientAllergy.drugType = "";
            $scope.patientAllergy.allergen="";
        }
    };

    $scope.$watch("operationHistory.operationDate",function(newValue,oldValue){
        if(newValue !== null){
            $("#operationModalOperationName").focus();
        }
    },true);

    $scope.focusAllergenDrugClass = function () {
        $scope.closeDrugSearch();
        $scope.showAllergenDrugClass = true;
    };

    $scope.unfocusAllergenDrugClass = function () {
        $scope.showAllergenDrugClass = false;
        $timeout(function () {
            $("#allergenDrugNameHistory").focus();
        }, 100);
    };

    $scope.onSelectedItem = function (node) {
        if(node.grade===1){
            return
        }
        $scope.patientAllergy.allergenDrugClass = node.codeId;
        $scope.patientAllergy.allergenDrugClassName = node.codeName;
        $scope.patientAllergy.allergen = getAllergyName($scope.patientAllergy);
        $scope.unfocusAllergenDrugClass();
    };

    $scope.allergyOpt = {
        "queryUrl": "drug-info/allergy-drug-info-vo?inputCode=",
        "isDisplayRight": false,
        "leftReceiveName": 'allergyDrugInfo',
        "id":"drugSelect2"
    };

    $scope.$on('allergyDrugInfo', function (status, data) {
        if(data.drugInfoCode){
            var scope=angular.element($("#allergenDrugNameHistory")).scope();
            if(data.drugType===2){
                scope.patientAllergy.allergenDrugClass = data.drugInfoCode;
                scope.patientAllergy.allergenDrugClassName = data.drugName;
            }else{
                scope.patientAllergy.allergenDrugCode = data.drugInfoCode;
            }
            scope.patientAllergy.allergenDrugName = data.drugName;
            scope.patientAllergy.drugType = data.drugType;
            // scope.patientAllergy.allergen = getAllergyName(scope.patientAllergy);
            if (!scope.$$phase) {
                scope.$apply();
            }
            Mousetrap.unbind("enter");
            $("#allergenSymptomPatientAllergy").focus();

        }
    });

    var getAllergyName = function (patientAllergy) {
        if(patientAllergy.allergyType === '01'){
            if(patientAllergy.allergenDrugClassName != ''){
                if(patientAllergy.allergenDrugName != ''){
                    return patientAllergy.allergenDrugClassName + ' ' + patientAllergy.allergenDrugName;
                } else {
                    return patientAllergy.allergenDrugClassName;
                }
            } else {
                return patientAllergy.allergenDrugName;
            }
        }
        return '';
    }

}]);
/**
 * 医生站既往史Modal
 */

//医生站既往史Modal
angular.module('hr.service').factory('doctorStationModal', ['$templateCache', '$document', '$compile', '$rootScope',
    '$controller', '$q', 'hrIndexedDB', '$http', 'hrDialog', '$timeout',
    function ($templateCache, $document, $compile, $rootScope, $controller, $q, hrIndexedDB, $http, hrDialog, $timeout) {
        var modalTypeEnum = {
            PATIENT_ALLERGY: "patientAllergy",
            OPERATION_HISTORY: "operationHistory",
            DISEASE_HISTORY: "diseaseHistory",
            FAMILY_HISTORY: "familyHistory"
        };
        var modalSourceEnum = {
            MR: "mr",
            PAST_HISTORY: "pastHistory"
        };

        function DoctorStationModal(modalType, modalSource, opts) {
            this._modalType = modalType;
            this._modalSource = modalSource;
            this._opts = opts;
            this._element = null;
            this._activeElement = null;
            if (angular.equals(modalTypeEnum.PATIENT_ALLERGY, this._modalType)) {
                this._element = angular.element($templateCache.get('patient-allergy.html'));
            } else if (angular.equals(modalTypeEnum.OPERATION_HISTORY, this._modalType)) {
                this._element = angular.element($templateCache.get('operation-history.html'));
            } else if (angular.equals(modalTypeEnum.DISEASE_HISTORY, this._modalType)) {
                this._element = angular.element($templateCache.get('disease-history.html'));
            }else if (angular.equals(modalTypeEnum.FAMILY_HISTORY, this._modalType)) {
                this._element = angular.element($templateCache.get('family-history.html'));
            }
        }

        DoctorStationModal.prototype.open = function () {
            if(event){
                event.stopPropagation();
                event.preventDefault();
            }
            this._activeElement = $(document.activeElement);
            this._activeElement.blur();
            var locals = {modal: this, hrIndexedDB: hrIndexedDB, $http: $http, $timeout: $timeout, hrDialog: hrDialog};
            var $scope = locals.$scope = locals.$scope ? locals.$scope : $rootScope.$new();
            $scope.modalSource = this._modalSource;
            $scope.opts = this._opts;
            $scope.modalType = this._modalType;
            $document.find('body').append(this._element);
            $controller('DoctorStationModalController', locals);
            $compile(this._element)($scope);
            this.deferred = $q.defer();
            var promise = this.deferred.promise;
            promise.close = function (fn) {
                promise.then(function (result) {
                    fn(result);
                });
                return promise;
            };
            if($scope.opts.operationStatus==="1"){
                var patientAllergy=$scope.opts.patientAllergy;
                if (patientAllergy && (patientAllergy.allergyType === "02" || patientAllergy.allergyType === "03")) {
                    $timeout(function(){
                        angular.element($("#allergenPatientAllergy")).scope().allergenInfo={text:patientAllergy.allergen}
                    },100)
                }
            }
            return promise;
        };
        DoctorStationModal.prototype.close = function (result) {
            this._element.remove();
            this._activeElement.focus();
            this.deferred.resolve(result);
        };
        DoctorStationModal.prototype.safeClose = function (result) {
            this._element.remove();
        };
        return {
            modalType: modalTypeEnum,
            source: modalSourceEnum,
            modal: function (modalType, modalSource, opts) {
                return new DoctorStationModal(modalType, modalSource, opts).open();
            }
        };
    }]);


angular.module('hr.directives').directive('hrDrugClass', ['$http', function ($http) {

    return {
        template: '<div><treecontrol class="tree-light" tree-model="treedata" order-by="object.serialNo" selected-node="selectedNode" options="opts" on-selection="selectedItem(node)" ' +
        'double-click-node="dbClick(node)">' +
        '<span title="{{ node.object.codeName }}" class="overflow-ellipsis">{{ node.object.codeName }}</span>'+
        '</treecontrol></div>',

        //template: '<div>test</div>',
        //template: '<div><div ng-repeat="data in treedata">{{data.object.codeName}}</div></div>',
        scope:{
            onSelectedItem: "&"
        },

        compile: function(element, attributes){
            return {
                pre: function(scope, element, attributes, controller, transcludeFn){
                    $http.get(Path.getUri("api/base-code-dict/code-type-name/DRUG_CLASS_DICT")).success(function (data) {
                        scope.treedata = getTreeSourceFactory(data, "upCodeId", "codeId");
                    });
                    scope.opts = {
                        //dirSelectable: false,
                        injectClasses: {
                            "labelSelected": "bg-selected-color"
                        }
                    };
                },
                post: function(scope, element, attributes, controller, transcludeFn){
                }
            }
        },

        link: function (scope, element, attrs, controller) {
            //scope.dbClick = function (node) {
            //    console.debug("ddddddddddddddddddeeee");
            //    console.debug(node);
            //    scope.onSelectedItem(node);
            //}
        },
        controller: ["$scope", function ($scope) {
            $scope.dbClick = function (node) {
                $scope.onSelectedItem(node);
            }

            $scope.selectedItem = function (node) {
                console.debug("dddddddddddddd");
                console.debug(node);
            }
        }]
    };
}]);
