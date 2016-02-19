var myApp = angular.module('Divine', ['divine','angularPayments']);

myApp.run(["$log", function ($log) {
}]);

App.constant("MY_CONSTANT", {
    "url": "http://divine.clicklabs.in:8888",
    "url1":"http://divine.clicklabs.in:8080",

});

App.constant("responseCode", {
    "SUCCESS": 200
});
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        'use strict';

        $locationProvider.html5Mode(false);

        // default route
        $urlRouterProvider.otherwise('/page/login');

        //
        // Application Routes
        // -----------------------------------
        $stateProvider
            //
            // Single Page Routes
            // -----------------------------------
            .state('page', {
                url: '/page',
                templateUrl: 'app/pages/page.html',
                resolve: helper.resolveFor('modernizr', 'icons', 'parsley'),
                controller: ["$rootScope", function ($rootScope) {
                    $rootScope.app.layout.isBoxed = false;
                }]
            })
            .state('page.login', {
                url: '/login',
                title: "Login",
                templateUrl: 'app/pages/login.html'
            })

            .state('page.recover', {
                url: '/recover',
                title: "Recover",
                templateUrl: 'app/pages/recover.html'
            })
            .state('page.terms', {
                url: '/terms',
                title: "Terms & Conditions",
                templateUrl: 'app/pages/terms.html'
            })
            .state('page.404', {
                url: '/404',
                title: "Not Found",
                templateUrl: 'app/pages/404.html'
            })

            //App routes
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: helper.basepath('app.html'),
                controller: 'AppController',
                resolve: helper.resolveFor('modernizr', 'icons', 'screenfull', 'whirl', 'ngDialog')
            })
            .state('app.notifications', {
                url: "/notifications",
                title: 'Notifications',
                templateUrl: helper.basepath('notification-list.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins')
            })
            //.state('app.dashboard', {
            //    url: '/dashboard',
            //    title: 'Dashboard',
            //    templateUrl: helper.basepath('dashboard.html'),
            //    resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'datatables', 'datatables-pugins')
            //})
            .state('app.dashboard-new', {
                url: '/dashboard-new',
                title: 'Dashboard New',
                templateUrl: helper.basepath('dashboard-new.html'),
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'datatables', 'datatables-pugins')
            })
            //.state('app.scheduler', {
            //    url: '/scheduler',
            //    title: 'Scheduler',
            //    templateUrl: helper.basepath('scheduler.html'),
            //    resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'datatables', 'datatables-pugins')
            //})
            .state('app.customers', {
                url: '/customers',
                title: 'Customer Information',
                templateUrl: helper.basepath('customer_list.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins', 'inputmask')
            })
            .state('app.customerInfo', {
                url: "/customerinfo/{id:[0-9]*}",
                title: 'Customer Details',
                templateUrl: helper.basepath('customer-info.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins')
            })
            .state('app.verified-artist', {
                url: '/verified-artist',
                title: 'Verified Artists',
                templateUrl: helper.basepath('verified_artist.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ui.select', 'taginput', 'inputmask', 'moment', 'localytics.directives', 'slider','parsley')
            })

            .state('app.add_artist', {
                url: '/add_artist',
                title: 'New Requested Artists',
                templateUrl: helper.basepath('add_artist.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins')
            })
            //.state('app.addsession', {
            //    url: '/add-session',
            //    title: 'Add Manual Session',
            //    templateUrl: helper.basepath('add_session.html'),
            //    resolve: helper.resolveFor('parsley', 'inputmask', 'ui.select')
            //})
            .state('app.ongoing', {
                url: '/in-progress',
                title: 'In progress Session',
                templateUrl: helper.basepath('ongoing.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins')
            })
            .state('app.upcoming', {
                url: '/upcoming',
                title: 'Upcoming Session',
                templateUrl: helper.basepath('upcoming.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins')
            })
            .state('app.past', {
                url: '/past',
                title: 'Past Session',
                templateUrl: helper.basepath('past.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins')
            })


        /**=========================================================
         * Conversion of Date & Time Format common factory
         =========================================================*/
        App.factory('convertdatetime', function () {
            return {

                convertDate: function (DateTime) {
                    var _utc = new Date(DateTime);
                    if (_utc.getUTCMonth().toString().length == 1) {
                        var month = "0" + (parseInt(_utc.getUTCMonth()) + 1);
                    } else {
                        month = parseInt(_utc.getUTCMonth()) + 1;
                    }
                    if (_utc.getUTCDate().toString().length == 1) {
                        var day = "0" + (parseInt(_utc.getUTCDate()) + 1);
                    } else {
                        day = parseInt(_utc.getUTCDate()) + 1;
                    }
                    var _utc = _utc.getUTCFullYear() + "-" + month + "-" + day;
                    return _utc;
                },

                convertPromoDate: function (DateTime) {
                    //if (dateTime) {
                    //    var date = dateTime;
                    //    if(!date.getTime()){
                    //        var str = dateTime.replace(/-/g,'/');
                    //        date = new Date(str);
                    //    }
                    //    var off_to_deduct = date.getTimezoneOffset();
                    //    date = new Date( date.getTime() + (off_to_deduct * 60000));
                    //
                    //    var date_appointment = (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();


                    // }

                    var _utc = new Date(DateTime);
                    if (_utc.getMonth().toString().length == 1) {
                        var month = "0" + (parseInt(_utc.getMonth()) + 1);
                    } else {
                        month = parseInt(_utc.getMonth() + 1);
                    }
                    if (_utc.getDate().toString().length == 1) {
                        var day = "0" + (parseInt(_utc.getDate()));
                    } else {
                        day = parseInt(_utc.getDate());
                    }
                    var _utc = _utc.getFullYear() + "-" + month + "-" + day;
                    return _utc;
                },


                convertDateTime: function (DateTime) {
                    var actualEndTimeDate = DateTime.split("T")[0];
                    var actualEndTimeTime = DateTime.split("T")[1];
                    var actualEndTimeDateString = actualEndTimeDate.split("-");
                    var finalEndDate = actualEndTimeDateString[1] + "/" + actualEndTimeDateString[2] + "/" + actualEndTimeDateString[0];
                    var actualEndTimeTimeString = actualEndTimeTime.split(".")[0];
                    actualEndTimeTimeString = actualEndTimeTimeString.split(":");
                    var actualEndsuffix = actualEndTimeTimeString[0] >= 12 ? "PM" : "AM",
                        actualEndhours12 = actualEndTimeTimeString[0] % 12;
                    var actualEnddisplayTime1 = actualEndhours12 + ":" + actualEndTimeTimeString[1] + " " + actualEndsuffix;
                    var actualEnddisplayTime = finalEndDate + " " + actualEnddisplayTime1;
                    return actualEnddisplayTime;
                },
                convertTime: function (time) {
                    var startTimeHours = time.split(":")[0];
                    var startTimeMinutes = time.split(":")[1];
                    var startsuffix = startTimeHours >= 12 ? "PM" : "AM",
                        starthours12 = startTimeHours % 12;
                    var startdisplayTime = starthours12 + ":" + startTimeMinutes + " " + startsuffix;
                    return startdisplayTime
                },
                localOffset: function () {
                    var date = new Date();
                    //var localOffset = date.getTimezoneOffset() * 60000;
                    var localOffset = (-1) * date.getTimezoneOffset();
                    //var stamp = Math.round(new Date(localOffset).getTime());
                    return localOffset;
                },
                convertCalendarDate: function (DateTime) {

                    /*Convert datetime in proper format*/
                    DateTime = DateTime + ":00";
                    var date_split = DateTime.split("/");
                    DateTime = date_split[0] + "-" + date_split[1] + "-" + date_split[2];

                    /*Convert datetime in utc format*/
                    var _utc = new Date(DateTime);
                    if (_utc.getUTCMonth().toString().length == 1) {
                        var month = "0" + (parseInt(_utc.getUTCMonth()) + 1);
                    } else {
                        month = parseInt(_utc.getUTCMonth()) + 1;
                    }
                    if (_utc.getUTCDate().toString().length == 1) {
                        var day = "0" + (parseInt(_utc.getUTCDate()));
                    } else {
                        day = parseInt(_utc.getUTCDate());
                    }

                    if (_utc.getUTCHours().toString().length == 1) {
                        var hour = "0" + (parseInt(_utc.getUTCHours()));
                    } else {
                        hour = parseInt(_utc.getUTCHours());
                    }
                    if (_utc.getUTCMinutes().toString().length == 1) {
                        var min = "0" + (parseInt(_utc.getUTCMinutes()));
                    } else {
                        min = parseInt(_utc.getUTCMinutes());
                    }
                    if (_utc.getUTCSeconds().toString().length == 1) {
                        var sec = "0" + (parseInt(_utc.getUTCSeconds()));
                    } else {
                        sec = parseInt(_utc.getUTCSeconds());
                    }
                    var _utc = _utc.getUTCFullYear() + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
                    return _utc;
                }
            };
        });


        /**=========================================================
         * Provides a simple demo for bootstrap datepicker
         =========================================================*/

        App.controller('DatepickerDemoCtrl', ['$scope', function ($scope) {
            $scope.today = function () {
                $scope.dt = new Date();
            };
            $scope.today();

            $scope.clear = function () {
                $scope.dt = null;
            };

            // Disable weekend selection
            //$scope.disabled = function (date, mode) {
            //    //return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
            //};

            $scope.toggleMin = function () {
                $scope.minDate = $scope.minDate ? null : new Date();
            };
            $scope.toggleMin();

            $scope.open = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.opened = true;
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.initDate = new Date('2016-15-20');
            $scope.formats = ['yyyy-MM-dd', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[0];

        }]);

        /**=============================================================
         * Provides a simple demo for bootstrap datepicker for reports
         =============================================================*/

        App.controller('DatepickerReportsCtrl', ['$scope', function ($scope) {
            $scope.today = function () {
                $scope.dt = new Date();
            };
            $scope.today();
            //$scope.maxDate = new Date();

            $scope.clear = function () {
                $scope.dt = null;
            };

            $scope.open = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.opened = true;
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.initDate = new Date('2016-15-20');
            $scope.formats = ['yyyy-MM-dd', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[0];

        }]);

        /**=========================================================
         * Provides a simple demo for buttons actions
         =========================================================*/

        App.controller('ButtonsCtrl', ['$scope', function ($scope) {

            $scope.radioModel = 'Left';

        }]);

        /**=========================================================
         * Initializes the masked inputs
         =========================================================*/

        App.directive('masked', function () {
            return {
                restrict: 'A',
                controller: ["$scope", "$element", function ($scope, $element) {
                    var $elem = $($element);
                    if ($.fn.inputmask)
                        $elem.inputmask();
                }]
            };
        });

        /**=========================================================
         * Module: now.js
         * Provides a simple way to display the current time formatted
         =========================================================*/

        App.directive("now", ['dateFilter', '$interval', function (dateFilter, $interval) {
            return {
                restrict: 'E',
                link: function (scope, element, attrs) {

                    var format = attrs.format;

                    function updateTime() {
                        var dt = dateFilter(new Date(), format);
                        element.text(dt);
                    }

                    updateTime();
                    $interval(updateTime, 1000);
                }
            };
        }]);

        /**=========================================================
         * Module: flot.js
         * Initializes the Flot chart plugin and handles data refresh
         =========================================================*/

        App.directive('flot', ['$http', '$timeout', function ($http, $timeout) {
            'use strict';
            return {
                restrict: 'EA',
                template: '<div></div>',
                scope: {
                    dataset: '=?',
                    options: '=',
                    series: '=',
                    callback: '=',
                    src: '='
                },
                link: linkFunction
            };

            function linkFunction(scope, element, attributes) {
                var height, plot, plotArea, width;
                var heightDefault = 220;

                plot = null;

                width = attributes.width || '100%';
                height = attributes.height || heightDefault;

                plotArea = $(element.children()[0]);
                plotArea.css({
                    width: width,
                    height: height
                });

                function init() {
                    var plotObj;
                    if (!scope.dataset || !scope.options) return;
                    plotObj = $.plot(plotArea, scope.dataset, scope.options);
                    scope.$emit('plotReady', plotObj);
                    if (scope.callback) {
                        scope.callback(plotObj, scope);
                    }

                    return plotObj;
                }

                function onDatasetChanged(dataset) {
                    if (plot) {
                        plot.setData(dataset);
                        plot.setupGrid();
                        return plot.draw();
                    } else {
                        plot = init();
                        onSerieToggled(scope.series);
                        return plot;
                    }
                }

                scope.$watchCollection('dataset', onDatasetChanged, true);

                function onSerieToggled(series) {
                    if (!plot || !series) return;
                    var someData = plot.getData();
                    for (var sName in series) {
                        angular.forEach(series[sName], toggleFor(sName));
                    }

                    plot.setData(someData);
                    plot.draw();

                    function toggleFor(sName) {
                        return function (s, i) {
                            if (someData[i] && someData[i][sName])
                                someData[i][sName].show = s;
                        };
                    }
                }

                scope.$watch('series', onSerieToggled, true);

                function onSrcChanged(src) {

                    if (src) {

                        $http.get(src)
                            .success(function (data) {

                                $timeout(function () {
                                    scope.dataset = data;
                                });

                            }).error(function () {
                                $.error('Flot chart: Bad request.');
                            });

                    }
                }

                scope.$watch('src', onSrcChanged);
            }

        }]);

    }]);
