/**
 * Created by sanjay on 3/28/15.
 */
myApp.controller('MapController', function ($scope, $http, $cookies, $cookieStore, MY_CONSTANT, $state, $timeout, responseCode) {
    $scope.mapLoading = true;

    loadGoogleMaps();
    $.post(MY_CONSTANT.url + '/driver_heat_map', {
        access_token: $cookieStore.get('obj').accesstoken
    }, function (response) {
        response = JSON.parse(response);
        if (response.status = responseCode.SUCCESS) {
            var data = response.data;
            console.log(data);

            var markerAddresses = [];
            var driverData = data.driver_data;
            driverData.forEach(function (column) {
                var markerAddress = {
                    latitude: "",
                    longitude: ""
                };

                markerAddress.latitude=column.current_location_latitude;
                markerAddress.longitude=column.current_location_longitude;
                markerAddresses.push(markerAddress);
            });
            $scope.mapAddress=markerAddresses;
            console.log($scope.mapAddress);
            $scope.$apply();
            $scope.mapLoading=false;
        }
    })
});

/**=========================================================
 * Module: gmap.js
 * Init Google Map plugin
 =========================================================*/

myApp.directive('gmap', ['$window', 'gmap', function ($window, gmap) {
    'use strict';

    // Map Style definition
    // Get more styles from http://snazzymaps.com/style/29/light-monochrome
    // - Just replace and assign to 'MapStyles' the new style array
    var MapStyles = [{featureType: 'water', stylers: [{visibility: 'on'}, {color: '#bdd1f9'}]}, {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [{color: '#334165'}]
    }, {featureType: 'landscape', stylers: [{color: '#e9ebf1'}]}, {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{color: '#c5c6c6'}]
    }, {featureType: 'road.arterial', elementType: 'geometry', stylers: [{color: '#fff'}]}, {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [{color: '#fff'}]
    }, {featureType: 'transit', elementType: 'geometry', stylers: [{color: '#d8dbe0'}]}, {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{color: '#cfd5e0'}]
    }, {featureType: 'administrative', stylers: [{visibility: 'on'}, {lightness: 33}]}, {
        featureType: 'poi.park',
        elementType: 'labels',
        stylers: [{visibility: 'on'}, {lightness: 20}]
    }, {featureType: 'road', stylers: [{color: '#d8dbe0', lightness: 20}]}];

    gmap.setStyle(MapStyles);

    // Center Map marker on resolution change

    $($window).resize(function () {

        gmap.autocenter();

    });

    return {
        restrict: 'A',
        priority: 1000,
        scope: {
            mapAddress: '='
        },
        link: function (scope, element, attrs) {

            scope.$watch('mapAddress', function (newVal) {
                element.attr('data-address', JSON.stringify(newVal));
                gmap.init(element);

            });
        }
    };

}]);

/**=========================================================
 * Module: google-map.js
 * Services to share gmap functions
 =========================================================*/

myApp.service('gmap', function () {

    return {
        setStyle: function (style) {
            this.MapStyles = style;
        },
        autocenter: function () {
            var refs = this.gMapRefs;
            if (refs && refs.length) {
                for (var r in refs) {
                    var mapRef = refs[r];
                    var currMapCenter = mapRef.getCenter();
                    if (mapRef && currMapCenter) {
                        google.maps.event.trigger(mapRef, 'resize');
                        mapRef.setCenter(currMapCenter);
                    }
                }
            }
        },
        init: function (element) { //initGmap
            var self = this,
                $element = $(element),
                addresses = $element.data('address'),
                titles = $element.data('title') && $element.data('title').split(';'),
                zoom = $element.data('zoom') || 14,
                maptype = $element.data('maptype') || 'ROADMAP', // or 'TERRAIN'
                markers = [];

            if (addresses) {
                for (var a in addresses) {
                    if (typeof addresses[a] == 'string') {
                        markers.push({
                            address: addresses[a],
                            html: (titles && titles[a]) || '',
                            popup: true   /* Always popup */
                        });
                    } else {
                        markers.push({
                            latitude: addresses[a].latitude,
                            longitude: addresses[a].longitude,
                            html: (titles && titles[a]) || '',
                            popup: true
                        });
                    }
                }

                var options = {
                    controls: {
                        panControl: true,
                        zoomControl: true,
                        mapTypeControl: true,
                        scaleControl: true,
                        streetViewControl: true,
                        overviewMapControl: true
                    },
                    scrollwheel: false,
                    maptype: maptype,
                    markers: markers,
                    zoom: zoom
                    // More options https://github.com/marioestrada/jQuery-gMap
                };

                var gMap = $element.gMap(options);

                var ref = gMap.data('gMap.reference');
                // save in the map references list
                if (!self.gMapRefs)
                    self.gMapRefs = [];
                self.gMapRefs.push(ref);

                // set the styles
                if ($element.data('styled') !== undefined) {

                    ref.setOptions({
                        styles: self.MapStyles
                    });

                }
            }
        }
    };
});
