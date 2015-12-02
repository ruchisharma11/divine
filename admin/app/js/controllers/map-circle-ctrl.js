/**
 * Created by sanjay on 3/28/15.
 */
myApp.controller('MapCircleController', ['$scope', '$timeout', '$http', 'uiGmapLogger', 'uiGmapGoogleMapApi'
        , function ($scope, $timeout, $http, $log, GoogleMapApi) {


            $log.currentLevel = $log.LEVELS.debug;
            var center = {
                latitude: 44,
                longitude: -108
            };

            $scope.map = {
                center: center,
                pan: true,
                zoom: 4,
                refresh: false,
                events: {},
                bounds: {}
            };
            $scope.numCircles=2;
            $scope.circles = [
                {
                    id: 1,
                    center: {
                        latitude: 44,
                        longitude: -108
                    },
                    radius: 500000,
                    stroke: {
                        color: '#CCC',
                        weight: 2,
                        opacity: 1
                    },
                    fill: {
                        color: '#CCC',
                        opacity: 0.5
                    },
                    draggable: false, // optional: defaults to false
                    clickable: false, // optional: defaults to true
                    editable: false, // optional: defaults to false
                    visible: true, // optional: defaults to true
                    events: {
                        center_changed: function (circle, eventName, model, args) {
                            console.log(circle);
                            console.log(eventName);
                            console.log(model);
                            console.log(args);
                            $log.debug("circle center_changed " + circle.getCenter());
                        },
                        radius_changed: function (circle, eventName, model, args) {
                            console.log(circle);
                            console.log(eventName);
                            console.log(model);
                            console.log(args);
                            $log.debug("circle radius_changed "+ circle.getRadius());
                        }
                    }
                },
                {
                    id: 2,
                    center: {
                        latitude: 40,
                        longitude: -100
                    },
                    radius: 400000,
                    stroke: {
                        color: '#CCC',
                        weight: 2,
                        opacity: 1
                    },
                    fill: {
                        color: '#CCC',
                        opacity: 0.5
                    },
                    geodesic: true, // optional: defaults to false
                    draggable: false, // optional: defaults to false
                    clickable: false, // optional: defaults to true
                    editable: false, // optional: defaults to false
                    visible: true, // optional: defaults to true
                    events: {
                        center_changed: function (circle, eventName, model, args) {
                            console.log(circle);
                            console.log(eventName);
                            console.log(model);
                            console.log(args);
                            $log.debug("circle center_changed " + circle.getCenter());
                        },
                        radius_changed: function (circle, eventName, model, args) {
                            console.log(circle);
                            console.log(eventName);
                            console.log(model);
                            console.log(args);
                            $log.debug("circle radius_changed "+ circle.getRadius());
                        }
                    }
                }
            ];
            $scope.addCircle=function(){
                var circles=$scope.circles;
                circles.push({
                    id: ++$scope.numCircles,
                        center: {
                        latitude: $scope.latitude,
                            longitude: $scope.longitude
                    },
                    radius: 400000,
                        stroke: {
                        color: '#08B21F',
                            weight: 2,
                            opacity: 1
                    },
                    fill: {
                        color: '#08B21F',
                            opacity: 0.5
                    },
                    geodesic: true, // optional: defaults to false
                        draggable: true, // optional: defaults to false
                        clickable: true, // optional: defaults to true
                        editable: true, // optional: defaults to false
                        visible: true, // optional: defaults to true
                        events: {
                        center_changed: function (circle, eventName, model, args) {
                            console.log(circle);
                            console.log(eventName);
                            console.log(model);
                            console.log(args);
                            $log.debug("circle center_changed " + circle.getCenter());
                        },
                        radius_changed: function (circle, eventName, model, args) {
                            console.log(circle);
                            console.log(eventName);
                            console.log(model);
                            console.log(args);
                            $log.debug("circle radius_changed "+ circle.getRadius());
                        }
                    }
                });
                $scope.circles=circles;
            };
            $scope.deleteCircle=function(id){
                $scope.circles=$scope.circles.filter(function (el) {
                    return el.id !== id;
                });
            }

        }]
);