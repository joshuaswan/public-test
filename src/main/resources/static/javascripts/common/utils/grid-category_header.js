//angular.module('hr.templateCache').run(['$templateCache', function ($templateCache) {
//    $templateCache.put('category_header.html', '<div  class="ngTopPanel categoryStyle">\n    <div class="ngHeaderContainer" style="height:{{headerRowHeight}}px;">\n        <div class="categoryHeaderScroller" style="height:{{headerRowHeight}}px;position:absolute">  <!-- fixes scrollbar issue -->\n            <div class="ngHeaderCell" ng-repeat="cat in categories"  style="left: {{cat.left}}px; width: {{cat.width}}px">\n                <div class="ngVerticalBar" style="height:100%" ng-class="{ ngVerticalBarVisible: !$last }">&nbsp;</div>\n                <div class="ngHeaderText" style="text-align:center">{{cat.displayName}}</div>\n            </div>\n        </div>\n    </div>\n</div>');
//}]);

angular.module('hr.service').directive('categoryHeader', function($timeout) {
    function link(scope, element, attrs) {

        // create cols as soon as $gridscope is avavilable
        // grids in tabs with lazy loading come later, so we need to
        // setup a watcher
        scope.$watch('categoryHeader.$gridScope', function(gridScope, oldVal) {
            if (!gridScope) {
                return;
            }
            // setup listener for scroll events to sync categories with table
            var viewPort = scope.categoryHeader.$gridScope.domAccessProvider.grid.$viewport[0];
            var headerContainer = scope.categoryHeader.$gridScope.domAccessProvider.grid.$headerContainer[0];

            // watch out, this line usually works, but not always, because under certains conditions
            // headerContainer.clientHeight is 0
            // unclear how to fix this. a workaround is to set a constant value that equals your row height
            scope.headerRowHeight=  headerContainer.clientHeight;
            if(scope.headerRowHeight || scope.headerRowHeight < 10){
                scope.headerRowHeight=  30;
            }

            angular.element(viewPort).bind("scroll", function() {
                // copy total width to compensate scrollbar width
                $(element).find(".categoryHeaderScroller")
                    .width($(headerContainer).find(".ngHeaderScroller").width());
                $(element).find(".ngHeaderContainer")
                    .scrollLeft($(this).scrollLeft());
            });

            // setup listener for table changes to update categories
            scope.categoryHeader.$gridScope.$on('ngGridEventColumns', function(event, reorderedColumns) {
                createCategories(event, reorderedColumns);
            });
            $timeout(function () {
                createCategories(null, scope.categoryHeader.$gridScope.columns);

            });

        });
        var createCategories = function(event, cols) {
            scope.categories = [];
            var lastDisplayName = "";
            var totalWidth = 0;
            var left = 0;
            angular.forEach(cols, function(col, key) {
                if (!col.visible) {
                    return;
                }
                totalWidth += col.width;
                var displayName = (typeof(col.colDef.categoryDisplayName) === "undefined") ?
                    "\u00A0" : col.colDef.categoryDisplayName;
                if (displayName !== lastDisplayName) {
                    scope.categories.push({
                        displayName: lastDisplayName,
                        width: totalWidth - col.width,
                        left: left
                    });
                    left += (totalWidth - col.width);
                    totalWidth = col.width;
                    lastDisplayName = displayName;
                }
            });
            if (totalWidth > 0) {
                scope.categories.push({
                    displayName: lastDisplayName,
                    width: totalWidth,
                    left: left
                });
            }
        };
    }
    return {
        scope: {
            categoryHeader: '='
        },
        restrict: 'EA',
        templateUrl: Path.getUri('javascripts/common/utils/category_header.html'),
        link: link
    };
});