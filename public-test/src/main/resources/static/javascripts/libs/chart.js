angular.module('ui.chart', [])
    .directive('uiChart', function () {
        return {
            restrict: 'EACM',
            template: '<div></div>',
            replace: true,
            link: function (scope, elem, attrs) {
                var renderChart = function () {
                    var data = scope.$eval(attrs.uiChart);
                    var width = eval(attrs.chartWidth);
                    var height = eval(attrs.chartHeight);
//                    var width = attrs.chartWidth;
//                    var height = attrs.chartHeight;
                    elem.html('');
                    if (!angular.isArray(data)) {
                        return;
                    }

                    var opts = {};
                    if (!angular.isUndefined(attrs.chartOptions)) {
                        opts = scope.$eval(attrs.chartOptions);
                        if (!angular.isObject(opts)) {
                            throw 'Invalid ui.chart options attribute';
                        }
                    }

                    if (width) {
                        elem.width(width);
                    }
                    if (height) {
                        elem.height(height);
                    }
                    elem.jqplot(data, opts);
                };

                scope.$watch(attrs.uiChart, function () {
                    renderChart();
                }, true);

                scope.$watch(attrs.chartWidth, function () {
                    renderChart();
                }, true);

                scope.$watch(attrs.chartMinDate, function () {
                    renderChart();
                }, true);

                scope.$watch(attrs.chartTicks, function () {
                    renderChart();
                }, true);

                $(window).resize(function () {
                    renderChart();
                });
                scope.$watch(attrs.chartHeight, function () {
                    renderChart();
                }, true);
            }
        };
    });