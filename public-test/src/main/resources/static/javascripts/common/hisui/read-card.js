angular.module('hr.templateCache').run(['$templateCache', function ($templateCache) {
    $templateCache.put('read-card-template.html', '    <div class="control-group papers-num" >\n        <label class="control-label" ng-bind="displayLabel"></label>\n\n        <div class="controls">\n            <input class="input-medium" style="width: 85px;" type="text" tablename="DEFINED_IDENTIFICATION_CLASS" id="cardType"  ng-focus="changeKeyBoardArea()"\n                   table-dict-tips="cardTypeOptions" ng-model="visitRecord.cardType" ng-disabled="isReadOnly">\n\n            <div class="input-append" style="margin-left:-4.5px;">\n                <input id="cardNo" class="input-large" type="text" style="width: 210px;border-left: 0;"  ng-disabled="isReadOnly"\n                       ng-model="visitRecord.cardNo"    ng-focus="changeKeyBoardArea()"   ng-show="noenter!==\'true\'"\n                       ui-keypress="{13:\'keypressQueryPatientbyCardId()\'}" click-outside="clickOutSide()"  maxlength="40"/>\n                <button class="btn fg-emphasize-color" style="width:69px;" ng-click="clickRead()" type="button">读卡</button>\n            </div>\n        </div>\n    </div>\n\n    <div hr-draggable modal="modalSameCodePatient" options="modalSameCodePatientOpts">\n        <div class="modal-header">\n            <button type="button" class="close" ng-click="closeSameCodePatient(\'close\')">&times;</button>\n            <h5>身份证号重复患者列表</h5>\n        </div>\n        <div class="modal-body">\n            <div id="general-height2" class="gridStyle" ng-grid="sameCodePatientGrid" ></div>\n        </div>\n        <div class="modal-footer">\n            <button class="btn btn-primary" ng-click="selectOnePatient()">确&nbsp;认</button>\n            <button class="btn btn-primary" ng-click="closeSameCodePatient(\'close\')">取&nbsp;消</button>\n        </div>\n    </div>\n\n    <style type="text/css">\n    .same-patient-modal.modal{width:97%;top:10%;}\n    .same-patient-modal.modal .icon-link-color{color:#2d89ef;padding-top: 5px;}\n    .same-patient-modal.modal.fade{opacity: 1;}\n    </style>\n    \n\n   \n\n\n        ');
}]);

//读卡指令
angular.module('hr.directives').directive("readCard", ["$parse", "$http", "hrDialog", "HrReadCard", "HrCardType",
    function ($parse, $http, hrDialog, HrReadCard, HrCardType) {
        var readCardObject = {
            restrict: "E",
            templateUrl: "read-card-template.html",
            scope: {
                callback: "=",
                option: "=",
                focus: "=",
                config: "@"   //noCheck    clinic表示来自挂号等需要调主索引的界面; patient表示来自主索引，
            },
            controller: ["$scope", function ($scope) {
                var unitCode = getTopLevelConfig("unit-code") || "60002530009";   //医院体系代码
                var hospitalBaseCode = getTopLevelConfig("hospital-base-code") || "600025";  //基层医疗机构代码

                $scope.displayLabel = ($scope.noenter === "true" ? "卡类型" : "证件及编号" );

                $scope.visitRecord = {
                    cardType: "",
                    cardNo: "",
                    insuranceNo: ""
                };
                $scope.cacheCardInfo = angular.copy($scope.visitRecord);

                $scope.$watch('visitRecord', function (newValue, oldValue) {
                    if (isNull(newValue.cardNo)) {
                        $scope.cacheCardInfo.cardNo = "";
                    }
                    if (isNull(newValue.cardType)) {
                        $scope.cacheCardInfo.cardType = "";
                    }
                }, true);

                $scope.changeKeyBoardArea = function () {
                    $scope.focus.setFocusPatientInfo(true);
                };

                $scope.clickOutSide = function(){
                    $scope.focus.toChangeMouse(true);
                };

                //根据患者id查询出的患者信息（将证件类型和证件号）
                $scope.option.setPatientInfo = function (patientInfo) {
                    console.log("主界面传给指令的数据---------");
                    console.log(patientInfo);
                    if (isNull(patientInfo)) {
                        $scope.visitRecord = {
                            cardType: "",
                            cardNo: "",
                            insuranceNo: ""
                        };
                        $scope.cacheCardInfo = angular.copy($scope.visitRecord);
                        return false;
                    }
                    if ($scope.config === "return" || $scope.config === "appoint") {
                        $scope.isReadOnly = patientInfo;
                        return false;
                    }
                    if (!isNull(patientInfo.idno)) {
                        $scope.visitRecord = {
                            cardType: HrCardType.ID_CARD,
                            cardNo: patientInfo.idno,
                            insuranceNo: ""
                        };
                        return false;
                    }
                };

                //卡类型指令输入框参数
                $scope.cardTypeOptions = {
                    selectedItem: function (data, status) {
                        $scope.visitRecord.cardNo = "";
                        if (!HrStr.isNull(data)) {
                            $scope.visitRecord.cardType = data.codeName;
                        }
                        if (status !== "outside") {
                            setTimeout(function () {
                                $("#cardType").blur();
                                $("#cardNo").focus();
                            }, 0);
                        }
                    }
                };

                //-----------------------------------------读卡入口---------------------------------------------------------
                //快捷键读卡
                $scope.option.readCard = function (cardInfo) {
                    $scope.visitRecord.cardType = cardInfo.cardType;
                    $scope.clickRead();
                };

                //根据卡类型和卡号查询
                $scope.keypressQueryPatientbyCardId = function () {
                    if ($scope.visitRecord.cardType === HrCardType.BEIJING_INSURANCE) {
                        return false;
                    }
                    $scope.visitRecord.insuranceNo = ($scope.visitRecord.cardType === HrCardType.MILITARY_MEDICAL ? $scope.visitRecord.cardNo : "");
                    var readResult = angular.copy($scope.visitRecord);
                    readResult.isFromRead = false;
                    if ((isNull(readResult.cardNo) && isNull(readResult.insuranceNo)) ||
                        ($scope.cacheCardInfo.cardType === readResult.cardType &&
                            ((!isNull(readResult.cardNo) && $scope.cacheCardInfo.cardNo === readResult.cardNo) ||
                                (!isNull(readResult.insuranceNo) && $scope.cacheCardInfo.insuranceNo === readResult.insuranceNo)))) {
                        return false;
                    }
                    if (isNull($scope.visitRecord.cardType)) {
                        return false;
                    }
                    $scope.cacheCardInfo = angular.copy(readResult);

                    $http.get(Path.getUri("api/identification-class/by-identification-name/") + $scope.visitRecord.cardType).success(function (identification) {
                        readResult.classType = identification.classType;
                        if (identification.classType === "3") {
                            isReturnReadObject(readResult);
                        } else if (identification.classType === "4") {
                            isReturnReadObject(readResult);
                        } else {
                            $http.get(Path.getUri("api/pat-identification-rec/get-patientId-by-identification/") + identification.identificationClassCode + "/" + $scope.visitRecord.cardNo).success(function (patientId) {
                                if (patientId) {
                                    queryPatMasterByPatientId(patientId, function (patMaster) {
                                        returnedCardResult(patMaster.patientid, patMaster, true, readResult.isFromRead);
                                    });
                                } else {
                                    hrDialog.dialog(hrDialog.typeEnum.WARN, {message: "不存在该卡类型的患者ID！"});
                                }
                            }).error(function (data, status) {
                                    hrDialog.dialog(hrDialog.typeEnum.EXCEPTION, {message: "查询患者识别号对照表出错！"});
                                });
                        }
                    });
                };

                //根据设备类型读外设
                $scope.clickRead = function () {
                    if (!$scope.visitRecord.cardType) {
                        return false;
                    }
                    HrReadCard.readCard($scope.visitRecord.cardType, function (readCardResult) {
//                    var readCardResult = {};
//                    switch ($scope.visitRecord.cardType) {
//                        case HrCardType.ID_CARD :
//                            readCardResult = {
//                                name: "宋某波",
//                                sex: "女",
//                                nation: "壮族",
//                                birthday: "2011-11-11",
//                                address: "河北省沧州市沧县旧州镇",
//                                cardType: "身份证",
//                                idCardNo: "110103392009073015",
//                                insuranceNo: "",
//                                insuranceType: "",
//                                newAddress: "河北省石家庄市元氏县赵同乡",
////                                photoLocation : "C:\\Users\\miao\\AppData\\Local\\Temp\\heren\\idcard\\zp.bmp",
//                                state: {success: true}
//                            };
//                            break;
//                        case HrCardType.BEIJING_INSURANCE :
//                            readCardResult = {
//                                name: "测试卡11",
//                                sex: "男",
//                                nation: "",
//                                birthday: "1972-11-11",
//                                address: "",
//                                cardType: "北京医保",
//                                idCardNo: "132130198911112222",
//                                insuranceNo: "107765716011",
//                                insuranceType: "",
//                                chargeType: "北京医保",
//                                state: {success: true}
//                            };
//                            break;
//                        case HrCardType.MILITARY_MEDICAL:
//                            readCardResult = {
//                                accountBalance: "0",
//                                accountRatedAmount: "0",
//                                accountType: "",
//                                assignCenter: "1070000000",
//                                assignDate: "20110423",
//                                birthPlace: "350623",
//                                birthday: "1981-10-01",
//                                cardNo: "815107110412120206",
//                                cardStatus: "0",
//                                cardType: "军队医改",
//                                chargeType: "军队医改",
//                                designatedHospital: "600200",
//                                designatedPoliclinic: "60020040106",
//                                expirationDate: "350623198912015736",
//                                fundType: "", gradeOfDuty: "",
//                                gradeOfTechnic: "", gradeOfTitle: "",
//                                identity: "士兵", initialAmount: "0",
//                                insuranceNo: "2222222", insuranceType: "免费医疗",
//                                isFromRead: true, maritalStatus: "", name: "李十", nation: "苗族",
//                                patientId: "", rankCode: "", relatedInsuranceNo1: "",
//                                relationship1: "", settleDate: "", sex: "女", state: {success: true}, subsidyType: "", unit: "60020000178", workingStatus: "0"
//                            };
//                            break;
//                    }
                        console.log("读卡得到的数据-----------------");
                        console.log(readCardResult);
                        if (readCardResult.state.success) {
                            $http.get(Path.getUri("api/identification-class/by-identification-name/") + $scope.visitRecord.cardType).success(function (identification) {
                                readCardResult.isFromRead = true;
                                readCardResult.classType = identification.classType;
                                readCardResult.cardType = $scope.visitRecord.cardType;
                                isReturnReadObject(readCardResult);
                            });
                        } else {
                            hrDialog.dialog(hrDialog.typeEnum.EXCEPTION, { message: readCardResult.state.errorMessage, detail: readCardResult.state.errorMessage });
                        }
                    });
                };

                var getAddressCode = function (address, callback) {
                    $http.get(Path.getUri("api/common-resource/id-card-inf/") + address).success(function (data) {
                        callback(data.districtNo);
                    }).error(function () {
                            callback("");
                        });
                };

                /**
                 *
                 * @param checkStatus  true直接返回，false不返回
                 * @param readResult 读出的卡信息
                 */
                $scope.readResult = null;
                var isReturnReadObject = function (readResult) {
                    switch (readResult.cardType) {
                        case HrCardType.ID_CARD :
                            readResult.cardNo = readResult.idCardNo || readResult.cardNo;
                            $scope.visitRecord.cardNo = readResult.cardNo;
                            if (readResult.isFromRead) {
                                getAddressCode(readResult.address, function (addressCode) {
                                    readResult.birthPlace = addressCode;
                                    readResult.nativePlace = addressCode;
                                    readResult.registeredResidenceCode = addressCode;

                                    getAddressCode(readResult.newAddress, function (addressCode) {
                                        readResult.presentAddressCode = addressCode;
                                        $scope.readResult = angular.copy(readResult);
                                        queryPatMasterByIdNo(readResult, readResult.cardNo);
                                    });
                                });
                            } else {
                                $scope.readResult = angular.copy(readResult);
                                queryPatMasterByIdNo(readResult, readResult.cardNo);
                            }
                            break;
                        case HrCardType.BEIJING_INSURANCE :
                            $scope.visitRecord.cardNo = readResult.insuranceNo;
                            $scope.readResult = angular.copy(readResult);
                            queryPatMasterBySecurityNo(readResult, readResult.insuranceNo);
                            break;
                        case HrCardType.MILITARY_MEDICAL:
                            $scope.visitRecord.cardNo = readResult.insuranceNo;
                            $scope.readResult = angular.copy(readResult);
                            queryPatientByInsuranceNo(readResult, readResult.insuranceNo);
                            break;
                        default :
                            queryPatMasterByOtherCard(readResult, readResult.cardNo);
                            $scope.readResult = angular.copy(readResult);
                    }
                };

                //根据患者身份证号查询主索引
                var queryPatMasterByIdNo = function (readResult, idNo) {
                    if (checkIsExistCardNo(readResult.cardType, idNo)) {
                        var url = Path.getUri("api/patient") + "/byidno/" + idNo;
                        queryPatMasterByCondition(url, readResult);
                    }
                };

                //根据医保账号和医保类型查询主索引
                var queryPatMasterBySecurityNo = function (readResult, securityNo) {
                    if (checkIsExistCardNo(readResult.cardType, securityNo)) {
                        var url = Path.getUri("api/patient") + "/by-securityno/" + readResult.cardType + "/" + securityNo;
                        queryPatMasterByCondition(url, readResult);
                    }
                };

                //根据患者Id查询主索引信息
                var queryPatientByInsuranceNo = function (readResult, insuranceNo) {
                    //根据患者类型查询军保账户，根据patientId查询患者类型
                    if (checkIsExistCardNo(readResult.cardType, insuranceNo)) {
                        var insuranceAccount = {
                            insuranceNo: insuranceNo,
                            patientId: readResult.patientId,
                            name: readResult.name,
                            sex: readResult.sex,
                            dateOfBirth: readResult.birthday,
                            unit: readResult.unit,
                            identityClass: readResult.identity,
                            insuranceType: readResult.insuranceType,
                            accountRatedAmount: readResult.accountRatedAmount,
                            accountInitialAmount: readResult.initialAmount,
                            accountBalance: readResult.accountBalance,
                            relatedInsuranceNo1: readResult.relatedInsuranceNo1,
                            relationship1: readResult.relationship1,
                            accountStatus: '0',
                            operator: getStaffDict().staffName,
                            birthPlace: readResult.birthPlace,
                            nation: readResult.nation,
                            maritalStatus: readResult.maritalStatus,
                            designatedPoliclinic: readResult.designatedPoliclinic,
                            designatedHospital: readResult.designatedHospital,
                            workingStatus: readResult.workingStatus,
                            fundType: readResult.fundType,
                            subsidyType: readResult.subsidyType
                        };
                        $http.post(Path.getUri("api/army-insurance/legal-account/") + unitCode + "/" + hospitalBaseCode, insuranceAccount).success(function (accountInfo) {
                                console.log("军人保障卡账户信息--------------------------");
                                console.log(accountInfo);
                                if (accountInfo) {
                                    //todo 合法性校验
                                    readResult.birthPlace = accountInfo.birthPlace;
                                    readResult.birthday = accountInfo.birthday;
                                    readResult.designatedPoliclinic = accountInfo.designatedPoliclinic;
                                    readResult.idNo = accountInfo.idNo;
                                    readResult.idCardNo = accountInfo.idNo;
                                    readResult.identity = accountInfo.identity;
                                    readResult.name = accountInfo.name;
                                    readResult.namePhonetic = accountInfo.namePhonetic;
                                    readResult.nation = accountInfo.nation;
                                    readResult.patientId = accountInfo.patientId;
                                    readResult.sex = accountInfo.sex;
                                    readResult.unit = accountInfo.unit;
                                    readResult.workingStatus = accountInfo.workingStatus;
                                    queryPatMasterByPatientIdInsurance(accountInfo.patientId, function (patMaster) {
                                        if (patMaster) {
                                            checkCardInfoAndPatMaster(readResult, patMaster, function (patMasterInfo) {
                                                returnedCardResult(patMasterInfo.patientid, patMasterInfo, true, readResult.isFromRead);
                                            });
                                        } else {
                                            readResult.patientId = "";
                                            returnedCardResult(readResult.patientId, readResult, false, readResult.isFromRead);
                                        }
                                    });
                                } else {
                                    hrDialog.dialog(hrDialog.typeEnum.WARN, {message: '不存在【' + readResult.insuranceNo + '】的军队医改账户信息！'}).close(function () {
                                        $scope.callback.getPatientInfoFromCard();
                                    });
                                }
                            }
                        ).error(function (data, status) {
                                HrUtils.httpError(data, status, hrDialog);
                            });
                    }
                };

                var queryPatMasterByPatientIdInsurance = function (patientId, callback) {
                    if (patientId) {
                        $http.get(Path.getUri("api/patient") + "/byid/" + patientId).success(function (patient) {
                            callback(patient);
                        }).error(function () {
                                callback();
                            });
                    } else {
                        callback();
                    }
                };

                //查询主索引返回信息
                var queryPatMasterByPatientId = function (patientId, callback) {
                    if (patientId) {
                        $http.get(Path.getUri("api/patient") + "/byid/" + patientId).success(function (patient) {
                            callback(patient);
                        }).error(function () {
                                hrDialog.dialog(hrDialog.typeEnum.EXCEPTION, {message: '查询主索引出错！'});
                            });
                    } else {
                        callback();
                    }
                };

                //根据其他卡类型和卡号查询主索引
                var queryPatMasterByOtherCard = function (readResult, cardNo) {
                    if (checkIsExistCardNo(readResult.cardType, cardNo)) {
                        var url = Path.getUri("api/pat-identification-rec/get-rec-patientId/") + cardNo;
                        queryPatMasterByCondition(url, readResult);
                    }
                };

                //校验是否存在卡号
                var checkIsExistCardNo = function (cardType, cardNo) {
                    if (cardNo) {
                        return true;
                    } else {
                        hrDialog.dialog(hrDialog.typeEnum.WARN, {message: '请填写【' + cardType + '】编号！'});
                    }
                };

                //查询主索引
                var queryPatMasterByCondition = function (url, readResult) {
                    $http.get(url).success(function (patMasterList) {
                        isExistPatMaster(readResult, patMasterList);
                    }).error(function () {
                            hrDialog.dialog(hrDialog.typeEnum.WARN, {message: '根据【' + readResult.cardType + '】的查询主索引出错！'});
                        });
                };

                /**
                 *返回主索引信息
                 * @param readResult 读到的卡信息
                 * @param patMasterList 查询到的患者主索引信息
                 */
                var isExistPatMaster = function (readResult, patMasterList) {
                    if (patMasterList.length > 1) {
                        $scope.sameCodePatients = [];
                        $scope.sameCodePatients = patMasterList;
                        $scope._originalKeyMap = angular.copy(Mousetrap.getKeyMap());
                        Mousetrap.reset();
                        bindKey();
                        $scope.modalSameCodePatient = true;
                    } else if (patMasterList.length === 1) {
                        if (readResult.isFromRead) {
                            checkCardInfoAndPatMaster(readResult, patMasterList[0], function (patMasterInfo) {
                                if ($scope.config !== "patient" && (patMasterInfo.mergedindicator === 0 || patMasterInfo.mergedindicator === "0")) {
                                    checkIsMerged(patientId, function (remainId) {
                                        hrDialog.dialog(hrDialog.typeEnum.WARN, {title: '提示', message: '该证件号的患者已经被合并，请使用保留的ID[' + remainId + ']号！'}).close(
                                            function () {
                                                queryPatMasterByPatientId(remainId, function (patMaster) {
                                                    returnedCardResult(patMaster.patientid, patMaster, true, readResult.isFromRead);
                                                });
                                            }
                                        );
                                    });
                                } else {
                                    returnedCardResult(patMasterInfo.patientid, patMasterInfo, true, readResult.isFromRead);
                                }
                            });
                        } else {
                            var patientId = patMasterList[0].patientId || patMasterList[0].patientid;
                            var merged = patMasterList[0].mergedindicator || patMasterList[0].mergedIndicator;
                            if ((merged === 0 || merged === "0") && $scope.config !== "patient") {
                                checkIsMerged(patientId, function (remainId) {
                                    hrDialog.dialog(hrDialog.typeEnum.WARN, {title: '提示', message: '该证件号的患者已经被合并，请使用保留的ID[' + remainId + ']号！'}).close(
                                        function () {
                                            queryPatMasterByPatientId(remainId, function (patMaster) {
                                                returnedCardResult(patMaster.patientid, patMaster, true, readResult.isFromRead);
                                            });
                                        }
                                    );
                                });
                            } else {
                                queryPatMasterByPatientId(patientId, function (patMaster) {
                                    returnedCardResult(patMaster.patientid, patMaster, true, readResult.isFromRead);
                                });
                            }
                        }
                    } else {
                        if (readResult.isFromRead) {
                            returnedCardResult(readResult.patientid, readResult, false, readResult.isFromRead);
                        } else {
                            if ($scope.config === "appoint") {
                                if (readResult.classType === "3") {
                                    returnedCardResult("", {idCardNo: readResult.cardNo}, false, false);
                                } else if (readResult.classType === "4") {
                                    returnedCardResult("", {insuranceNo: readResult.cardNo, insuranceType: readResult.cardType}, false, false);
                                }
                            } else {
                                hrDialog.dialog(hrDialog.typeEnum.WARN, {message: "不存在该编号的患者信息！"}).close(function () {
                                    $scope.callback.getPatientInfoFromCard();
                                });
                            }
                        }
                    }
                };

                var checkIsMerged = function (patientId, callback) {
                    $http.get(Path.getUri("api/patient/notMerged/") + patientId).success(function (remainId) {
                        if (remainId) {
                            callback(remainId);
                        } else {
                            hrDialog.dialog(hrDialog.typeEnum.WARN, {message: "不存在保留的患者ID！"});
                        }
                    });
                };

                var updateOtherInfo = function (checkCondition, photoFile, callback) {
                    var requestUri = Path.getUri("api/patient/update-pat-master/" + getStaffDict().staffName + "/" + getStaffDict().empId);
                    var updateObject = {
                        name: checkCondition.name,
                        sex: checkCondition.sex,
                        nation: checkCondition.nation,
                        dateOfBirth: checkCondition.birthday,
                        identity: checkCondition.identity,
                        birthPlace: checkCondition.birthPlace,
                        chargeType: checkCondition.chargeType,
                        nativePlace: checkCondition.nativePlace,
                        idNo: checkCondition.idNo,
                        securityType: checkCondition.insuranceType,
                        securityNo: checkCondition.insuranceNo,
                        registeredResidenceCode: checkCondition.registeredResidenceCode,
                        presentAddressCode: checkCondition.presentAddressCode,
                        patientId: checkCondition.patientId,
                        photoFile: photoFile
                    };
                    $http.put(requestUri, updateObject).success(function (data, status) {
                        callback(data);
                    }).error(function () {
                            callback();
                        });
                };

                //将卡信息更新到主索引
                var updatePatMaster = function (checkCondition, callback) {
                    if (checkCondition.photoLocation) {
                        $http.get(Path.getWebstartUri("api/file?path=" + checkCondition.photoLocation)).success(function (photoFile) {
                            updateOtherInfo(checkCondition, photoFile, function (data) {
                                callback(data);
                            });
                        }).error(function (data, status) {
                                console.log(status);
                                console.log(data);
                            });
                    } else {
                        updateOtherInfo(checkCondition, "", function (data) {
                            callback(data);
                        });
                    }
                };

                //校验卡内信息和主索引信息是否一致
                var checkCardInfoAndPatMaster = function (readResult, pat, callback) {
                    var patientId = pat.patientId || pat.patientid;
                    if (readResult.name === pat.name) {
                        updatePatMaster({
                            name: readResult.name,
                            sex: readResult.sex,
                            birthday: readResult.birthday,
                            nation: readResult.nation,
                            identity: readResult.identity,
                            birthPlace: readResult.birthPlace,
                            chargeType: readResult.chargeType,
                            nativePlace: readResult.nativePlace,
                            idNo: readResult.idCardNo,
                            photoLocation: readResult.photoLocation,
                            insuranceType: (readResult.classType === "4" ? readResult.cardType : ""),
                            insuranceNo: readResult.insuranceNo,
                            registeredResidenceCode: readResult.registeredResidenceCode,
                            presentAddressCode: readResult.presentAddressCode,
                            patientId: patientId}, function (patMasterInfo) {
                            if (patMasterInfo) {
                                queryPatMasterByPatientId(patMasterInfo.patientid, function (patMaster) {
                                    if (patMaster) {
                                        callback(patMaster);
                                    } else {
                                        hrDialog.dialog(hrDialog.typeEnum.EXCEPTION, {message: "查询主索引失败！"});
                                    }
                                });
                            } else {
                                hrDialog.dialog(hrDialog.typeEnum.EXCEPTION, {message: "同步主索引信息失败！"});
                            }
                        });
                    } else {
                        if ($scope.config !== "noCheckName") {
                            //提示不一致，误操作
                            hrDialog.dialog(hrDialog.typeEnum.WARN, {message: "患者卡内姓名和主索引不一致！"}).close(function () {
                                $scope.callback.getPatientInfoFromCard();
                            });
                        } else {
                            returnedCardResult(patientId, readResult, false, readResult.isFromRead);
                        }
                    }
                };


                //-------------------------------------------输出信息---------------------------------------------------
                /**
                 *
                 * @param patientId
                 * @param readResult
                 * @param fromPat  true来自主索引 false来自读卡
                 */
                var returnedCardResult = function (patientId, readResult, fromPat, isFromRead) {
                    var returnedObject = {};
                    console.log("------------------------------------------");
                    console.log(readResult);
                    if (fromPat) {
                        returnedObject = {
                            patientId: patientId,
                            patientName: readResult.name,
                            patientSex: readResult.sex,
                            patientBirth: readResult.dateofbirth,
                            identity: readResult.identity,
                            chargeType: readResult.chargetype,
                            idNo: readResult.idno,
                            birthPlace: readResult.birthPlaceCode,   //出生地
                            nation: readResult.nation,
                            insuranceType: readResult.securitytype,  //医保类型
                            insuranceNo: readResult.securityno,  //医保账号
                            nextOfKin: readResult.nextofkin,
                            phoneNumber: readResult.phonenumber
                        };
                    } else {
                        returnedObject = {
                            patientId: patientId,
                            patientName: readResult.name,
                            patientSex: readResult.sex,
                            patientBirth: readResult.birthday,
                            identity: readResult.identity,
                            chargeType: readResult.chargeType,
                            idNo: readResult.idCardNo,
                            birthPlace: readResult.birthPlace,
                            nation: readResult.nation,
                            insuranceType: readResult.insuranceType,  //医保类型
                            insuranceNo: readResult.insuranceNo,  //医保账号
                            nextOfKin: "",
                            phoneNumber: ""
                        };
                    }

                    returnedObject.cardType = $scope.visitRecord.cardType;
                    returnedObject.isFromRead = isFromRead;
                    if (isFromRead && HrCardType.ID_CARD === returnedObject.cardType) {
                        returnedObject.photoLocation = $scope.readResult.photoLocation;//照片路径
                        returnedObject.nativePlace = $scope.readResult.nativePlace;
                        returnedObject.registeredResidenceCode = $scope.readResult.registeredResidenceCode;
                        returnedObject.presentAddressCode = $scope.readResult.presentAddressCode;
                    }
                    getIdentityAndChargeTypeByCardType(returnedObject.cardType, function (identificationClassDict) {
                        if ($scope.readResult) {
                            returnedObject.unit = $scope.readResult.unit;
                            returnedObject.gradeOfDuty = $scope.readResult.gradeOfDuty;
                            returnedObject.designatedPoliclinic = $scope.readResult.designatedPoliclinic;
                            returnedObject.workingStatus = $scope.readResult.workingStatus;
                        }
                        returnedObject.chargeType = (isNull(identificationClassDict.defaultChargeType) ? returnedObject.chargeType : identificationClassDict.defaultChargeType);
                        returnedObject.identity = (isNull(identificationClassDict.defaultIdentity) || readResult.cardType === HrCardType.MILITARY_MEDICAL ? returnedObject.identity : identificationClassDict.defaultIdentity);
                        returnedObject.classType = identificationClassDict.classType;
                        console.log("从读卡指令返回到主界面的对象----------------------");
                        console.log(returnedObject);
                        $scope.callback.getPatientInfoFromCard(returnedObject);
                    });
                };

                var getIdentityAndChargeTypeByCardType = function (cardType, callback) {
                    $http.get(Path.getUri("api/identification-class/by-identification-name/") + cardType).success(function (identificationClassDict) {
                        callback(identificationClassDict);
                    }).error(function (data, status) {
                            HrUtils.httpError(data, status, hrDialog);
                        });
                };

                //--------------------------处理证件号相同患者信息start----------------------------------
                $scope.selectedPats = [];
                $scope.modalSameCodePatient = false;

                $scope.modalSameCodePatientOpts = {
                    dialogClass: "modal same-patient-modal",
                    backdropFade: true,
                    dialogFade: true,
                    keyboard: false,
                    backdrop: true,
                    backdropClick: false
                };

                $scope.sameCodePatientGrid = {
                    data: 'sameCodePatients',
                    selectedItems: $scope.selectedPats,
                    i18n: 'zh-cn',
                    enableRowSelection: true,
                    multiSelect: false,
                    enableColumnResize: true,
                    beforeSelectionChange: function (rowItem, event) {
                        if (event.type === "keydown" && event.keyCode === 13) {
                            return false;
                        }
                        return true;
                    },

                    columnDefs: [
                        {field: 'patientId', displayName: '患者ID', width: "11%"},
                        {field: 'name', displayName: '姓名', width: "11%"},
                        {field: 'sex', displayName: '性别', width: "5%"},
                        {field: 'age ', displayName: '年龄', width: "5%"},
                        {field: 'birthPlace ', displayName: '出生地', width: "20%"},
                        {field: 'nowAddress ', displayName: '现住址', width: "20%"},
                        {field: 'phoneNum ', displayName: '联系电话', width: "12%"} ,
                        {field: 'nextOfkIn ', displayName: '联系人', width: "9%"} ,
                        {field: 'relationship ', displayName: '关系', width: "8%"}
                    ],
                    rowTemplate: "<div ng-style=\"{ \'cursor\': row.cursor }\" ng-repeat=\"col in renderedColumns\" ng-dblclick=\"selectOnePatient()\"\n    ng-class=\"col.colIndex()\" class=\"ngCell {{col.cellClass}}\">\n    <div class=\"ngVerticalBar\" ng-style=\"{height: rowHeight}\" ng-class=\"{ ngVerticalBarVisible: !$last }\">&nbsp;</div>\n    <div ng-cell></div>\n</div>                                                                         "
                };

                $scope.$on('ngGridEventData', function () {
                    $scope.sameCodePatientGrid.selectRow(0, true);
                    setTimeout(function () {
                        $scope.sameCodePatientGrid.ngGrid.$viewport.focus();
                    }, 0);
                    $scope.sameCodePatientGrid.ngGrid.$viewport.bind("keydown", function (event) {
                        var index = $scope.sameCodePatientGrid.$gridScope.selectionProvider.lastClickedRow.rowIndex;
                        var selectedObject = angular.copy($scope.sameCodePatients[index]);
                        if (event.keyCode === 13 && selectedObject) {
                            if (!$scope.$$phase) {
                                $scope.$apply(getAddedAndConvertPatientInfo(selectedObject));
                            }
                        }
                    });
                });

                function getAddedAndConvertPatientInfo(patientInfo) {
                    if ($scope.readResult.isFromRead) {
                        checkCardInfoAndPatMaster($scope.readResult, patientInfo, "", function (patMasterInfo) {
                            queryPatMasterByPatientId(patMasterInfo.patientid, function (patMaster) {
                                returnedCardResult(patMaster.patientid, patMaster, true, $scope.readResult.isFromRead);
                            });
                        });
                    } else {
                        queryPatMasterByPatientId(patientInfo.patientId, function (patMaster) {
                            returnedCardResult(patMaster.patientid, patMaster, true, $scope.readResult.isFromRead);
                        });
                    }
                    $scope.closeSameCodePatient();
                }

                $scope.selectOnePatient = function () {
                    getAddedAndConvertPatientInfo($scope.selectedPats[0]);
                };

                $scope.closeSameCodePatient = function (indicator) {
                    Mousetrap.reset();
                    Mousetrap.setKeyMap($scope._originalKeyMap);
                    $scope.modalSameCodePatient = false;
                    if (indicator === "close") {
                        $scope.callback.getPatientInfoFromCard(null);
                    }
                };
                //----------------------------处理相同患者信息end------------------------------------------------------------
                var readCardKey = function () {
                    $http.get(Path.getUri("api/identification-class/all-identification")).success(function (identification) {
                        angular.forEach(identification, function (object) {
                            if (object.hotKey) {
                                Mousetrap.bindGlobal(object.hotKey, function (e) {
                                    e.preventDefault();
                                    $scope.visitRecord.cardType = object.identificationClassName;
                                    $scope.clickRead();
                                    if(!$scope.$$phase){
                                        $scope.$apply();
                                    }
                                    return false;
                                });
                            }
                        });
                    });
                };

                readCardKey();

                $scope.option.bindReadCardKey = function () {
                    readCardKey();
                };

                var bindKey = function () {
                    readCardKey();
                    Mousetrap.bindGlobal('esc', function () {
                        $scope.closeSameCodePatient("close");
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    });
                };

            }],
            link: function (scope, element, attrs) {
                scope.configOption = attrs.config;
                scope.noenter = attrs.noenter;
            }
        };
        return  readCardObject;
    }]);