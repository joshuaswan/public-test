(function (window, document) {

// Create all modules and define dependencies to make sure they exist
// and are loaded in the correct order to satisfy dependency injection
// before all nested files are concatenated by Grunt

// Config
    angular.module('ngCsv.config', []).value('ngCsv.config', {
        debug: true
    }).config(['$compileProvider', function ($compileProvider) {
        if (angular.isDefined($compileProvider.urlSanitizationWhitelist)) {
            $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|data):/);
        } else {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|data):/);
        }
    }]);

// Modules
    angular.module('ngCsv.directives', []);
    angular.module('ngCsv',
        [
            'ngCsv.config',
            'ngCsv.directives',
            'ngSanitize'
        ]);
    /**
     * ng-csv module
     * Export Javascript's arrays to csv files from the browser
     *
     * Author: asafdav - https://github.com/asafdav
     */
    angular.module('ngCsv.directives', []).directive('ngCsv', ['$parse', function ($parse) {
        return {
            restrict: 'AC',
            replace: true,
            transclude: true,
            scope: {data: '=ngCsv', filename: '@filename', columnDefs: '=ngColumn', options: '=options'},
            controller: function ($scope, $element, $attrs, $transclude, $filter) {
                $scope.csv = "";
//                    var data = $attrs.$observe("data");
                $scope.$watch('data', function (newValue, oldValue) {
                    $scope.buildCsv(newValue);
                });
                function getProperty(object, property) {
                    if (object === null || object === undefined || object === "") {
                        return null;
                    } else {
                        if (property.indexOf("|") >= 0) {
                            var temp = [];
                            var properties = [];
                            temp = property.trim().split('|');
                            var filters = temp[1];
                            var format = filters.substr(filters.indexOf(":") + 1);
                            while (format.indexOf("\'") >= 0 || format.indexOf("\"") >= 0) {
                                format = format.replace("\'", "");
                                format = format.replace("\"", "");
                            }
                            var value;
                            if (property.indexOf(".") >= 0) {
                                properties = temp[0].trim().split('.');
                                value = $filter((filters.substr(0, filters.indexOf(":"))).trim())(object[properties[0]][properties[1]], format);
                                if (filters.indexOf("number") >= 0 || filters.indexOf("NUMBER") >= 0) {
                                    value = (object[properties[0]][properties[1]] === null) ? 0 : object[properties[0]][properties[1]];
                                }
                            } else {
                                value = $filter((filters.substr(0, filters.indexOf(":"))).trim())(temp[0], format);
                                if (filters.indexOf("number") >= 0 || filters.indexOf("NUMBER") >= 0) {
                                    value = (temp[0] === null) ? 0 : temp[0];
                                }
                            }
                            return value;
                        } else if (property.indexOf(".") >= 0) {
                            var temp = [];
                            temp = property.split('.');
                            return object[temp[0]][temp[1]];
                        } else {
                            return object[property];
                        }
                    }
                };
                function csvStringify(str) {
                    if (str == null) { // we want to catch anything null-ish, hence just == not ===
                        return '';
                    }
                    if (typeof(str) === 'number') {
                        return str;
                    }
                    if (typeof(str) === 'boolean') {
                        return (str ? 'TRUE' : 'FALSE');
                    }
                    if (typeof(str) === 'string') {
                        str = "\t" + str;
                        return str.replace(/"/g, '""');
                    }

                    return JSON.stringify(str).replace(/"/g, '""');
                };
                function swapLastCommaForNewline(str) {
                    var newStr = str.substr(0, str.length - 1);
                    return newStr + "\n";
                };
                $scope.buildCsv = function (data) {
                    var keys = [];
                    var titles = [];
                    for (var f in $scope.columnDefs) {
                        keys.push($scope.columnDefs[f].field);
                        titles.push($scope.columnDefs[f].displayName);
                    }
                    var csvData = 'data:text/csv;charset=ANSI,';
                    for (var k in titles) {
                        csvData += '"' + csvStringify(titles[k]) + '",';
                    }
                    csvData = swapLastCommaForNewline(csvData);
                    var gridData = data;
                    for (var gridRow in gridData) {
                        for (k in keys) {
                            var curCellRaw;
                            if ($scope.options != null && $scope.options.columnOverrides != null && $scope.options.columnOverrides[keys[k]] != null) {
                                curCellRaw = $scope.options.columnOverrides[keys[k]](gridData[gridRow][keys[k]]);
                            } else {
                                if (keys[k].indexOf(".") >= 0) {
                                    curCellRaw = getProperty(gridData[gridRow], keys[k]);
                                } else {
                                    curCellRaw = gridData[gridRow][keys[k]];
                                }

                            }
                            csvData += '"' + csvStringify(curCellRaw) + '",';
                        }
                        csvData = swapLastCommaForNewline(csvData);
                    }
//                        var csvContent = "data:text/csv;charset=utf-8,";
//                        angular.forEach(data, function(row, index){
//                            var dataString, infoArray;
//
//                            if (angular.isArray(row)) {
//                                infoArray = row;
//                            } else {
//                                infoArray = [];
//                                angular.forEach(row, function(field, key){
//                                    this.push(field);
//                                }, infoArray);
//                            }
//                            dataString = infoArray.join(",");
//                            csvContent += index < data.length ? dataString + "\n" : dataString;
//                        });

                    $scope.csv = encodeURI(csvData);
                };
                $scope.getFilename = function () {
                    return $scope.filename ? $scope.filename : "download.csv";
                };
            },
            template: '<div class="csv-wrap">' +
            '<div class="element" ng-transclude></div>' +
            '<a class="hidden-link" ng-hide="true" ng-href="{{ csv }}" download="{{ getFilename() }}"></a>' +
            '</div>',
            link: function (scope, element, attrs) {
                var subject = angular.element(element.children()[0]),
                    link = angular.element(element.children()[1]);

                subject.bind('click', function (e) {
                    link[0].click();
                });
                subject.bind('alt+e', function (e) {
                    link[0].click();
                });
            }
        };
    }]);
})(window, document);