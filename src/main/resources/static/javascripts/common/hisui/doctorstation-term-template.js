/**
 * 此module是自定义指令的html代码模版缓存
 */
angular.module('hr.templateCache').run(['$templateCache', function ($templateCache) {
    $templateCache.put('doctor-term-template.html', "<div hr-draggable modal=\"modalOutpMrTermTemplate\"\n     close=\"closeCallbackOutpMrTermTemplate()\"\n     options=\"modalOptsOutpMrTermTemplate\">\n    <div class=\"modal-header\">\n        <button type=\"button\" class=\"close\" ng-click=\"closeOutpMrTermTemplate()\">&times;</button>\n        <h5 id=\"myModalLabel\">{{getOutpMrTermTemplateName(outpMrTermTemplateInfo.termId)}}</h5>\n    </div>\n    <div class=\"modal-body mr-modal-body mr-term-modal-body\">\n        <div class=\"outp-mr-term-template li-striped\"  >\n            <ul class=\"unstyled\">\n                <li ng-repeat=\"outpMrTermTemplate in outpMrTermTemplateList\" id=\"searchOutpMrTermTemplateList{{$index}}\"\n                    ng-click=\"clickSearchOutpMrTermTemplate(outpMrTermTemplate)\"\n                    ng-dblclick=\"dblSearchOutpMrTermTemplate(outpMrTermTemplate)\"\n                    ng-class=\"setClassOutpMrTermTemplate(outpMrTermTemplate)\">\n                    {{outpMrTermTemplate.termContent}}\n                </li>\n            </ul>\n        </div>\n        <div>\n            <textarea type=\"text\" id=\"termTemplateContent\" ui-keydown=\"{13:\'focusSaveTermTemplate()\' }\" class=\"input-medium\" ng-model=\"outpMrTermTemplateInfo.content\" rows=\"1\"  />\n        </div>\n    </div>\n    <div class=\"modal-footer\">\n        <label class=\"radio inline pull-left\">\n            <input type=\"radio\" ng-model=\"outpMrTermTemplateSearch.outpMrTermTemplateType\" name=\"outpMrTermTemplateType\" value=\"1\" >本科\n        </label>\n        <label class=\"radio inline pull-left\">\n            <input type=\"radio\" ng-model=\"outpMrTermTemplateSearch.outpMrTermTemplateType\" name=\"outpMrTermTemplateType\" value=\"0\" >个人\n        </label>\n        <button class=\"btn btn-primary\" id=\"saveTermTemplate\" ng-disabled=\"notAuthorized\" ng-click=\"saveOutpMrTermTemplate()\">保存</button>\n        <button class=\"btn btn-primary\" ng-disabled=\"notAuthorized\" ng-click=\"deleteOutpMrTermTemplate()\">删除</button>\n        <button class=\"btn btn-primary\" id=\"addTermTemplate\" ng-click=\"addOutpMrTermTemplate()\">确定</button>\n        <button class=\"btn cancel\" ng-click=\"closeOutpMrTermTemplate()\">关闭</button>\n    </div>\n</div>\n\n\n\n\n");
}]);

angular.module('hr').controller('DoctorTermTemplateController', ['$scope', '$http', '$timeout', '$filter', 'hrDialog', 'modal', function ($scope, $http, $timeout, $filter, hrDialog, modal) {

    var initOutpMrTermTemplatePara = function () {
        $scope.outpMrTermTemplateList = [];
        $scope.selectedOutpMrTermTemplate = {};
        $scope.outpMrTermTemplateSearch = {
            "outpMrTermTemplateType": "0"
        };
        $scope.notAuthorized = false;//是否没有操作模版权限
    };

    $scope.focusSaveTermTemplate=function(){
        setTimeout(function(){
            $("#saveTermTemplate").focus();
        },100);
    };

    $scope.deleteOutpMrTermTemplate = function () {
        if (angular.equals($scope.selectedOutpMrTermTemplate, {})) {
            hrDialog.dialog(hrDialog.typeEnum.WARN, {message: "没有选择删除的模板！"})
                .close(function () {
                });
            return;
        }
        hrDialog.dialog(hrDialog.typeEnum.CONFIRM, {message: "确定要删除吗?"})
            .close(function (result) {
                if (result === "ok") {
                    var url = Path.getUri("api/outp-mr-term-template/delete-data/" + $scope.selectedOutpMrTermTemplate.itemsId);
                    $http.get(url).success(function (data, status) {
                        //initOutpMrTermTemplatePara();
                        initOutpMrTermTemplate();
                    }).error(function (data) {
                        hrDialog.dialog(hrDialog.typeEnum.WARN, {message: "未知错误。请退出！"})
                            .close(function () {
                            });
                    });
                }
            });
    };

    $scope.saveOutpMrTermTemplate = function () {
        $scope.outpMrTermTemplateInfo.content = $scope.outpMrTermTemplateInfo.content.trim();
        if ($scope.outpMrTermTemplateInfo.content === "") {
            hrDialog.dialog(hrDialog.typeEnum.WARN, {message: "保存内容不能为空！"})
                .close(function () {
                });
            return;
        }
        if ($scope.outpMrTermTemplateInfo.content.length >= 100) {
            hrDialog.dialog(hrDialog.typeEnum.WARN, {message: "保存内容不能超过100个字符！"})
                .close(function () {
                });
            return;
        }

        var outpMrTermTemplate = new OutpMrTermTemplate();
        outpMrTermTemplate.termId = $scope.outpMrTermTemplateInfo.termId;
        outpMrTermTemplate.termContent = $scope.outpMrTermTemplateInfo.content;
        if ($scope.outpMrTermTemplateSearch.outpMrTermTemplateType === "0") {
            outpMrTermTemplate.doctorId = $scope.outpMrTermTemplateInfo.doctorId;
        } else {
            outpMrTermTemplate.doctorId = "";
        }
        outpMrTermTemplate.deptCode = $scope.outpMrTermTemplateInfo.deptCode;
        outpMrTermTemplate.createDate = angular.copy($scope.serverTime);

        var url = Path.getUri("api/outp-mr-term-template/data");
        $http.post(url, outpMrTermTemplate).success(function (data, status) {
            hrDialog.dialog(hrDialog.typeEnum.SUCCESS, {title: "成功！", message: "已保存！"})
                .close(function () {
                    $scope.outpMrTermTemplateInfo.content = "";
                    //initOutpMrTermTemplatePara();
                    initOutpMrTermTemplate();
                });

        }).error(function (data) {
            hrDialog.dialog(hrDialog.typeEnum.WARN, {message: "未知错误。请退出！"})
                .close(function () {
                });

        });
    }


    $scope.addOutpMrTermTemplate = function () {
        if (angular.equals($scope.selectedOutpMrTermTemplate, {})) {
            return;
        }
        $scope.closeSearchOutpMrTermTemplate();

    };

    var initOutpMrTermTemplate = function () {
        var url = "";
        if ($scope.outpMrTermTemplateSearch.outpMrTermTemplateType === "0") {
            $scope.notAuthorized = false;
            url = Path.getUri("api/outp-mr-term-template/doctor?termId=" + $scope.outpMrTermTemplateInfo.termId + "&doctorId=" + $scope.outpMrTermTemplateInfo.doctorId);
        } else {
            $scope.notAuthorized = !$scope.permission;
            url = Path.getUri("api/outp-mr-term-template/dept?termId=" + $scope.outpMrTermTemplateInfo.termId + "&deptCode=" + $scope.outpMrTermTemplateInfo.deptCode);
        }
        $http.get(url).success(function (data) {
            $scope.outpMrTermTemplateList = angular.copy(data);
            if ($scope.outpMrTermTemplateList.length > 0) {
                $scope.selectedOutpMrTermTemplate = $scope.outpMrTermTemplateList[0];
                $scope.bindKeyBoardEventOutpMrTermTemplate();
            }
        });
    };

    $scope.getOutpMrTermTemplateName = function (termId) {
        if (termId === 1) {
            return "主诉";
        } else if (termId === 2) {
            return "现病史";
        } else if (termId === 3) {
            return "体格检查";
        } else if (termId === 4) {
            return "辅助检查结果";
        } else if (termId === 5) {
            return "建议";
        } else if (termId === 6) {
            return "既往史（其他）";
        } else if (termId === 7) {
            return "处置";
        } else if (termId === 'D1') {
            return "检查目的";
        } else  if (termId === 11){
            return "家族史[模版]";
        } else  if (termId === 12){
            return "月经史[模版]";
        } else  if (termId === 13){
            return "婚育史[模版]";
        } else  if (termId === 14){
            return "个人史[模版]";
        } else  if (termId === 15){
            return "其他[模版]";
        }
        return "";
    };

    $scope.bindKeyBoardEventOutpMrTermTemplate = function () {
        //$scope.bindEventOutpMrTermTemplate = true;
        //Mousetrap.reset();
        //Mousetrap.bindGlobal('up', outpMrTermTemplateUp);
        //Mousetrap.bindGlobal('down', outpMrTermTemplateDown);
        //Mousetrap.bindGlobal('enter', outpMrTermTemplateEnter);
    };

    var outpMrTermTemplateUp = function () {
        if ($scope.bindEventOutpMrTermTemplate) {
            for (var k = 0; k < $scope.outpMrTermTemplateList.length; k++) {
                if ($scope.outpMrTermTemplateList[k].termId === $scope.selectedOutpMrTermTemplate.termId &&
                    $scope.outpMrTermTemplateList[k].termContent === $scope.selectedOutpMrTermTemplate.termContent) {
                    if (k === 0) {
                        $scope.selectedOutpMrTermTemplate = $scope.outpMrTermTemplateList[$scope.outpMrTermTemplateList.length - 1];
                    } else {
                        $scope.selectedOutpMrTermTemplate = $scope.outpMrTermTemplateList[k - 1];
                    }

                    return;
                }
            }
        }
    };

    var outpMrTermTemplateDown = function () {
        if ($scope.bindEventOutpMrTermTemplate) {
            for (var k = 0; k < $scope.outpMrTermTemplateList.length; k++) {
                if ($scope.outpMrTermTemplateList[k].termId === $scope.selectedOutpMrTermTemplate.termId &&
                    $scope.outpMrTermTemplateList[k].termContent === $scope.selectedOutpMrTermTemplate.termContent) {
                    if (k === $scope.outpMrTermTemplateList.length - 1) {
                        $scope.selectedOutpMrTermTemplate = $scope.outpMrTermTemplateList[0];
                    } else {
                        $scope.selectedOutpMrTermTemplate = $scope.outpMrTermTemplateList[k + 1];
                    }

                    return;
                }
            }
        }
    };

    var outpMrTermTemplateEnter = function () {
        if ($scope.bindEventOutpMrTermTemplate) {
            $scope.addOutpMrTermTemplate();

        }
    };

    $scope.setClassOutpMrTermTemplate = function (outpMrTermTemplate) {
        if (angular.equals($scope.selectedOutpMrTermTemplate, outpMrTermTemplate)) {
            return "bg-selected-color";
        } else {
            return "";
        }
    };

    $scope.clickSearchOutpMrTermTemplate = function (outpMrTermTemplate) {
        $scope.selectedOutpMrTermTemplate = outpMrTermTemplate;
    };

    $scope.dblSearchOutpMrTermTemplate = function (outpMrTermTemplate) {
        $scope.selectedOutpMrTermTemplate = outpMrTermTemplate;
        $scope.closeSearchOutpMrTermTemplate();
    };


    //$scope.$watch('modalMr.modalOutpMrTermTemplate', function (newValue, oldValue) {
    //    if (newValue) {
    //        if ($scope.outpMrTermTemplateInfo.termId !== -1) {
    //            initOutpMrTermTemplatePara();
    //            initOutpMrTermTemplate();
    //        } else {
    //            while ($scope.outpMrTermTemplateInfo.termId === -1) {
    //                setTimeout(function () {
    //                    if ($scope.outpMrTermTemplateInfo.termId !== -1) {
    //                        initOutpMrTermTemplatePara();
    //                        initOutpMrTermTemplate();
    //                    }
    //                }, 100);
    //            }
    //        }
    //
    //    }
    //});

    $scope.$watch('outpMrTermTemplateSearch.outpMrTermTemplateType', function (newValue, oldValue) {
        //if ($scope.outpMrTermTemplateInfo.termId !== -1) {
        //    $scope.selectedOutpMrTermTemplate = {};
        //    initOutpMrTermTemplate();
        //}
        initOutpMrTermTemplate();
    });

    $scope.closeSearchOutpMrTermTemplate = function () {
        $scope.bindEventOutpMrTermTemplate = false;
        $scope.outpMrTermTemplateInfo.statusClose = 1;
        $scope.outpMrTermTemplateInfo.outpMrTermTemplateModel = $scope.selectedOutpMrTermTemplate;
        modal.close($scope.outpMrTermTemplateInfo);
        $scope.modalOutpMrTermTemplate = false;
    };

    $scope.closeOutpMrTermTemplate = function () {
        $scope.modalOutpMrTermTemplate = false;
        modal.safeClose();
    };

    /*modal显隐*/
    $scope.modalOutpMrTermTemplate = true;
    /*modal Option*/
    $scope.modalOptsOutpMrTermTemplate = {
        backdropFade: true,
        dialogFade: true,
        keyboard: false,
        backdrop: true,
        backdropClick: true
    };

    initOutpMrTermTemplatePara();
    initOutpMrTermTemplate();

    $timeout(function () {
        $("#addTermTemplate").focus();
    }, 100, true);
}]);
/**
 * 医生站既往史Modal
 */

//医生站既往史Modal
angular.module('hr.service').factory('doctorTermTemplate', ['$templateCache', '$document', '$compile', '$rootScope',
    '$controller', '$q', '$http', '$filter', '$timeout', 'hrDialog',
    function ($templateCache, $document, $compile, $rootScope, $controller, $q, $http, $filter, $timeout, hrDialog) {

        function DoctorTermTemplate(outpMrTermTemplateInfo,permission) {
            this._outpMrTermTemplateInfo = outpMrTermTemplateInfo;
            this._element = angular.element($templateCache.get('doctor-term-template.html'));
            this._activeElement = null;
            this._permission = permission;
        }

        DoctorTermTemplate.prototype.open = function () {
            event.stopPropagation();
            event.preventDefault();
            this._activeElement = $(document.activeElement);
            //this._activeElement.blur();
            var locals = {$http: $http, $timeout: $timeout, $filter: $filter, hrDialog: hrDialog, modal: this};
            var $scope = locals.$scope = locals.$scope ? locals.$scope : $rootScope.$new();
            $scope.outpMrTermTemplateInfo = this._outpMrTermTemplateInfo;
            $scope.permission = this._permission;
            $document.find('body').append(this._element);
            $controller('DoctorTermTemplateController', locals);
            $compile(this._element)($scope);
            this.deferred = $q.defer();
            var promise = this.deferred.promise;
            promise.close = function (fn) {
                promise.then(function (result) {
                    fn(result);
                });
                return promise;
            };
            return promise;
        };
        DoctorTermTemplate.prototype.close = function (result) {
            this._element.remove();
            this._activeElement.focus();
            this.deferred.resolve(result);
        };
        DoctorTermTemplate.prototype.safeClose = function (result) {
            this._element.remove();
        };
        return {
            modal: function (outpMrTermTemplateInfo,permission) {
                return new DoctorTermTemplate(outpMrTermTemplateInfo,permission).open();
            }
        };
    }]);



