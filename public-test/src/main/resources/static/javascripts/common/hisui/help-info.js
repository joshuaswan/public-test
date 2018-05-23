/**
 * 此module是自定义指令的html代码模版缓存
 */
angular.module('hr.templateCache').run(['$templateCache', function ($templateCache) {
$templateCache.put('help-info-show.html', "<div class=\" popover right help-show\" ng-show=\"isHelpShow\">\n    <div class=\"arrow\"></div>\n    <h5 class=\"popover-title\">{{options.title}}</h5>\n\n    <div class=\"popover-content\">\n        <div class=\"control-group\">\n            <h5>注解: </h5>\n            <span>\n                {{options.commentStr}}\n            </span>\n        </div>\n        <div class=\"control-group\">\n            <h5>条件: </h5>\n            <span>\n                {{options.conditionStr}}\n            </span>\n        </div>\n        <div class=\"control-group\">\n            <h5>公式: </h5>\n            <span id=\"expressionStr\">\n                {{options.expressionStr}}\n            </span>\n        </div>\n    </div>\n</div>");
}]);
/**
 * help通用服务
 */
angular.module('hr.directives').directive("stHelp", ["$parse", '$document', '$templateCache', '$compile', 'hr.config', function ($parse, $document, $templateCache, $compile, hrConfig, hrIndexedDB) {
    var helpInfo = {
        require: '?ngModel',
        restrict: "A",
        scope: {
            options:"=?",
            isHelpShow:"="
        },
        controller: ["$scope", "hrPosition", "$document", function ($scope, hrPosition, $document) {
            $scope.isHelpShow = false;
            $scope.iconElement = undefined;
            $scope.contentModal = {
                commentStr:'',//注解
                conditionStr:'',//条件
                expressionStr:''//公式
            };

            $scope.options = $scope.options || {};
            ensureDefault($scope.options,'title','无标题');
            ensureDefault($scope.options,'commentStr','无注解');
            ensureDefault($scope.options,'conditionStr','无条件');
            ensureDefault($scope.options,'expressionStr','无公式');


            var seeWidth = document.documentElement.clientWidth;
            var seeHeight = document.documentElement.clientHeight;
            function getTop(e){
                var offsetTop = e.offsetTop;
                if(e.offsetParent != null){
                    offsetTop += getTop(e.offsetParent);
                }
                return offsetTop;
            };

            function getLeft(e){
                var offsetLeft = e.offsetLeft;
                if(e.offsetParent != null){
                    offsetLeft += getLeft(e.offsetParent);
                }
                return offsetLeft;
            }
            /**
             * 定位页面
             * @param element
             */
            $scope.setPosition = function (element) {
                var dom = $(element);
                var domPosition = {top:dom.position().top,left:dom.position().left,height:dom.height()};
                var domLeft = getLeft(dom[0]);
                var helpWidth = $scope.outElement.width();

                $scope.outElement.css("display", "none");
                $(".arrow").css("top","6%");
                setTimeout(function () {
                    console.info($scope.outElement[0].innerHTML);
                    $scope.outElement[0].innerHTML = $scope.outElement[0].innerHTML.replace(/BR/g,'<br/>');
                    $scope.outElement.css("top", "-4px");
                    $scope.outElement.css("display", "block");
                    if(domLeft + helpWidth > seeWidth){
                        $scope.outElement.removeClass("right");
                        $scope.outElement.addClass("left");
                        $scope.outElement.css("left", domPosition.left -$scope.outElement.width() - domPosition.height+15 + "px");
                    }else{
                        $scope.outElement.css("left", domPosition.left + 15+"px");
                    }
                }, 100);
            };
            function ensureDefault(obj, prop, value) {
                if (!obj.hasOwnProperty(prop))
                    obj[prop] = value;
            }
            //改变窗口大小后重新定位搜索页面
            $(window).resize(function () {
                if ($scope.isHelpShow) {
                    $scope.setPosition($scope.iconElement);
                }
            });
            $scope.$watch('isHelpShow',function(newValue,oldValue){
                if(newValue){
                    $scope.setPosition($scope.iconElement);
                }
            });
        }],
        link: function (scope, element, attrs) {
            //将模板添加到页面的dom中
            var template = angular.element($templateCache.get('help-info-show.html'));
            element.parent().css("position","relative");
            element.parent().css("display","inline");
            element.parent().append(template);
            //给添加的dom绑定scope
            $compile(template)(scope);
            scope.iconElement = element;
            scope.outElement = template;
            $(window).resize(function () {
                if (scope.isHelpShow) {
                    scope.setPosition(scope.iconElement);
                }
            });
        }
    };
    return  helpInfo;
}]);
