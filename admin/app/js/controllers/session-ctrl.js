App.controller('OngoingSessionController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $window, ngDialog, getCategories) {
    'use strict';
    $scope.loading = true;

    var getServiceList = function () {
        var accessToken=$cookieStore.get('obj');
        console.log(accessToken);
        var  adminId= $cookieStore.get('obj1');
        console.log(adminId);
        $.get(MY_CONSTANT.url + '/api/admin/showBookings/'+adminId+'/'+accessToken+'/'+0+'/'+0+'/VALET',


        //access_token: $cookieStore.get('obj').accesstoken

         function (data) {
             console.log(data);
            var dataArray = [];
            console.log(data);
            if (data.error) {
                console.log(data);
                ngDialog.open({
                    template: '<p>Something went wrong !</p>',
                    className: 'ngdialog-theme-default',
                    plain: true,
                    showClose: false,
                    closeByDocument: false,
                    closeByEscape: false
                });
                return false;
            }
            data.data.bookingDetails.forEach(function (column) {
                var d = {
                    orderid: "",
                    servicetype: "",
                    currenttype: "",
                    jobstatus: "",
                    payment:"",
                    ordercreatedtime:"",
                    pickuplocationname:"",
                    dropsoffspid:"",
                    Lat: "",
                    Lng:"",
                    fullName: "",
                   // pikupspid: "",
                   // serviceStartTime:''
                };
                //var book_date = column.booking_date.toString().split("T"[0]);
            //    var date = column.service_date.toString().split("T")[0];
               // var date='';
              //  var startTimeHours = column.start_time.split(":")[0];
               /// var startTimeMinutes = column.start_time.split(":")[1];
               // var suffix = startTimeHours >= 12 ? "PM" : "AM",
                //    hours12 = startTimeHours % 12;
               // var displayTime = hours12 + ":" + startTimeMinutes + " " + suffix;

{ d.orderId = column.orderId;
                d.serviceType = column.serviceType;
                d.currentType= column.currentType;
                d.jobStatus = column.jobStatus;
                 d.payment = column.paymentDetails[1];
                 d.orderCreatedTime = column.orderCreatedTime;
    markr.Lat=column.Lat;
    markr.Lng=column.Lng;
    dataArray.push(d);
    markersCoords.push(markr);
}

            });

             console.log(dataArray);
             console.log(markersCoords);
             $scope.$apply(function () {
                 $scope.list = dataArray;
                 // console.log($scope.list);
                 // Define global instance we'll use to destroy later
                 var dtInstance;
                 $scope.loading = false;
                 $timeout(function () {
                     if (!$.fn.dataTable)
                         return;
                     dtInstance = $('#datatable2').dataTable({
                         'paging': true, // Table pagination
                         'ordering': true, // Column ordering
                         'info': true, // Bottom left status text
                         'bDestroy': true,
                         // Text translation options
                         // Note the required keywords between underscores (e.g _MENU_)
                         oLanguage: {
                             sSearch: 'Search all columns:',
                             sLengthMenu: '_MENU_ records per page',
                             info: 'Showing page _PAGE_ of _PAGES_',
                             zeroRecords: 'Nothing found - sorry',
                             infoEmpty: 'No records available',
                             infoFiltered: '(filtered from _MAX_ total records)'
                         }
                     });
                     var inputSearchClass = 'datatable_input_col_search';
                     var columnInputs = $('tfoot .' + inputSearchClass);

                     // On input keyup trigger filtering
                     columnInputs
                         .keyup(function () {
                             dtInstance.fnFilter(this.value, columnInputs.index(this));
                         });
                 });
                 $scope.$on('$destroy', function () {
                     dtInstance.fnDestroy();
                     $('[class*=ColVis]').remove();
                 });
             });

         });
    };

    getServiceList();
    //console.log('jdklajdkl');
    // Cancel Dialog
    $scope.cancelSession = function (userid) {
        $scope.dele_val = userid;
        $scope.value = true;
        $scope.addTeam = {};
        ngDialog.open({
            template: 'app/views/cancel-dialog.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    $scope.cancel = function () {

        $.post(MY_CONSTANT.url + '/admin_cancel_booking',
            {
                access_token: $cookieStore.get('obj').accesstoken,
                booking_id: $scope.dele_val
            },
            function (data) {
                $window.location.reload();

            });

    };

})


myApp.directive('map',function(markersCoords)
{


    return {
        restrict: 'E',
        template: '<div id="mapSize" style="height: 500px;width: 100%"></div>',
        link: function (scope){
            var mapProp;
            //var coordinates=new google.maps.LatLng(d.Lat, d.Lng);
            //console.log(coordinates);
            var chd= new google.maps.LatLng(30.7500 , 76.7800);
            mapProp ={
                center:chd,
                zoom: 2,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map=new google.maps.Map(document.getElementById("mapSize"), mapProp);
            /*var marker=new google.maps.Marker({
             position: coordinates,
             });*/
            var createMarkers = function(map) {
                console.log(markersCoords);
                markersCoords.forEach(function(column){
                    var marker = new google.maps.Marker({
                        map: map,
                        position: new google.maps.LatLng(column.Lat,column.Lng)
                    });
                });
            };
            scope.$watch(function(){return markersCoords;},function(value){
                createMarkers(map);
                console.log(value);
            },true);
            ///marker.setMap(map);
        },
        replace: true
    }
});

App.controller('UpcomingSessionController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $window, ngDialog, getCategories) {
    'use strict';
    $scope.loading = true;

    var getServiceList = function () {
        $.post(MY_CONSTANT.url + '/upcoming_booking', {
            access_token: $cookieStore.get('obj').accesstoken

        }, function (data) {
            var dataArray = [];
            data = JSON.parse(data);
            data = data.bookings;
            ////console.log(data);
            if (data.error) {
                ngDialog.open({
                    template: '<p>Something went wrong !</p>',
                    className: 'ngdialog-theme-default',
                    plain: true,
                    showClose: false,
                    closeByDocument: false,
                    closeByEscape: false
                });
                return false;
            }
            data.forEach(function (column) {
             // console.log(column);
                var d = {
                    id: "",
                    booking_id: "",
                    service_id: "",
                    technician_id: "",
                    address: "",
                    customer_name: "",
                    artist_name: "",
                    booking_date:"",
                    service_date: "",
                    start_time: "",
                    status: "",
                    cost: "",
                    category: "",
                    service_name: "",
                    city_techs: "",
                    assigned_to:""
                };
                //console.log(column.categories);
                //var book_date = column.booking_date.toString().split("T")[0];
                  var booking_ids = column.booking_id;
                $scope.city_teks = [];
                var getTechList = function () {
                    $.post(MY_CONSTANT.url + '/assign_list', {
                        booking_id: booking_ids
                    },
                    function (data) {
                        //data = data.service_codes;
                        //console.log(data);

                        data = JSON.parse(data);
                        //$scope.city_teks=data;
                        // for (var i=0; i < data.length;i++)
                        // {
                        //    console.log(data.length);
                        //     $scope.city_teks[i]=data[i];


                        // }

                        console.log('data artist');
                        console.log(data);
                        d.city_techs = data;//$scope.city_teks;
                });
                };

            getTechList();

                var date = column.service_date.toString().split("T")[0];
                var startTimeHours = column.start_time.split(":")[0];
                var startTimeMinutes = column.start_time.split(":")[1];
                var suffix = startTimeHours >= 12 ? "PM" : "AM",
                    hours12 = startTimeHours % 12;
                var displayTime = hours12 + ":" + startTimeMinutes + " " + suffix;
                d.id = column.id;
                d.booking_id = column.booking_id;
                d.service_id = column.service_id;
                d.technician_id = column.technician_id;
                d.address = column.address;
                d.customer_name = column.customer_name;
                d.artist_name = column.artist_name;
                d.start_time = displayTime;
                d.cost = column.cost;
                d.category = getCategories.getListFormat(column.categories);
                d.booking_date = column.booking_date;
                d.assigned_to = column.assigned_to;
                d.service_date = date;
                d.status = column.status;
                d.service_name = getCategories.getListFormat(column.treatments);
                dataArray.push(d);

            });

            $scope.$apply(function () {
                $scope.list = dataArray;
                console.log(dataArray);


                // Define global instance we'll use to destroy later
                var dtInstance;
                $scope.loading = false;
                $timeout(function () {
                    if (!$.fn.dataTable)
                        return;
                    dtInstance = $('#datatable2').dataTable({
                        'paging': true, // Table pagination
                        'ordering': true, // Column ordering
                        'info': true, // Bottom left status text
                        'bDestroy': true,
                        // Text translation options
                        // Note the required keywords between underscores (e.g _MENU_)
                        oLanguage: {
                            sSearch: 'Search all columns:',
                            sLengthMenu: '_MENU_ records per page',
                            info: 'Showing page _PAGE_ of _PAGES_',
                            zeroRecords: 'Nothing found - sorry',
                            infoEmpty: 'No records available',
                            infoFiltered: '(filtered from _MAX_ total records)'
                        }
                    });
                    var inputSearchClass = 'datatable_input_col_search';
                    var columnInputs = $('tfoot .' + inputSearchClass);

                    // On input keyup trigger filtering
                    columnInputs
                        .keyup(function () {
                            dtInstance.fnFilter(this.value, columnInputs.index(this));
                        });
                });

                // When scope is destroyed we unload all DT instances
                // Also ColVis requires special attention since it attaches
                // elements to body and will not be removed after unload DT
                $scope.$on('$destroy', function () {
                    dtInstance.fnDestroy();
                    $('[class*=ColVis]').remove();
                });
            });

        });
    };

    getServiceList();

    // Change Status Dialog
    $scope.assignArtist = function (bookingId, artistId) {
        $scope.artistId = artistId;
        $scope.bookingId = bookingId;
        $scope.value = true;
        $scope.addTeam = {};
        ngDialog.open({
            template: 'app/views/assign-dialog.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    $scope.assign = function () {

        $.post(MY_CONSTANT.url + '/assign_new_artist',
            {


                access_token: $cookieStore.get('obj').accesstoken,
                booking_id: $scope.bookingId,
                artist_id: $scope.artistId
            },
            function (data) {
                ////console.log(data);
                $window.location.reload();

            });
    };

    // Cancel Dialog
    $scope.cancelSession = function (userid) {
        $scope.dele_val = userid;
        $scope.value = true;
        $scope.addTeam = {};
        ngDialog.open({
            template: 'app/views/cancel-dialog.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    $scope.cancel = function () {

        $.post(MY_CONSTANT.url + '/admin_cancel_booking',
            {
                access_token: $cookieStore.get('obj').accesstoken,
                booking_id: $scope.dele_val
            },
            function (data) {
                $window.location.reload();

            });

    };

});
App.value('markersCoords',[]);
App.controller('PastSessionController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, ngDialog, $window, convertdatetime, getCategories, markersCoords) {
    'use strict';
    $scope.loading = true;
    console.log('past');
    var getServiceList = function () {
        var accessToken=$cookieStore.get('obj');
        console.log(accessToken);
        var  adminId= $cookieStore.get('obj1');
        console.log(adminId);
        $.get(MY_CONSTANT.url + '/api/admin/showBookings/'+adminId+'/'+accessToken+'/'+0+'/'+0+'/VALET',
            //access_token: $cookieStore.get('obj').accesstoken

            function (data) {
                console.log(data);
                var dataArray = [];
                console.log(data);
                if (data.error) {
                    console.log(data);
                    ngDialog.open({
                        template: '<p>Something went wrong !</p>',
                        className: 'ngdialog-theme-default',
                        plain: true,
                        showClose: false,
                        closeByDocument: false,
                        closeByEscape: false
                    });
                    return false;
                }
                data.data.bookingDetails.forEach(function (column) {

                    var d = {
                        orderid: "",
                        servicetype: "",
                        currenttype: "",
                        jobstatus: "",
                        payment:"",
                        ordercreatedtime:"",
                        pickuplocationname:"",
                        dropsoffspid:"",
                        Lat: "",
                        Lng:"",
                        fullName: "",
                        // pikupspid: "",
                        // serviceStartTime:''

                    };
                    var markr = {};
                    //var book_date = column.booking_date.toString().split("T"[0]);
                    //    var date = column.service_date.toString().split("T")[0];
                    // var date='';
                    //  var startTimeHours = column.start_time.split(":")[0];
                    /// var startTimeMinutes = column.start_time.split(":")[1];
                    // var suffix = startTimeHours >= 12 ? "PM" : "AM",
                    //    hours12 = startTimeHours % 12;
                    // var displayTime = hours12 + ":" + startTimeMinutes + " " + suffix;

                     {  d.orderId = column.orderId;
                         d.serviceType = column.serviceType;
                         d.currentType= column.currentType;
                         d.jobStatus = column.jobStatus;
                         d.payment = column.paymentDetails.status;
                         d.orderCreatedTime = column.orderCreatedTime;
                         markr.Lat=column.Lat;
                         markr.Lng=column.Lng;
                         dataArray.push(d);
                         markersCoords.push(markr);
                     }

                });

                console.log(dataArray);
                console.log(markersCoords);
                $scope.$apply(function () {
                    $scope.list = dataArray;
                    // console.log($scope.list);
                    // Define global instance we'll use to destroy later
                    var dtInstance;
                    $scope.loading = false;
                    $timeout(function () {
                        if (!$.fn.dataTable)
                            return;
                        dtInstance = $('#datatable2').dataTable({
                            'paging': true, // Table pagination
                            'ordering': true, // Column ordering
                            'info': true, // Bottom left status text
                            'bDestroy': true,
                            // Text translation options
                            // Note the required keywords between underscores (e.g _MENU_)
                            oLanguage: {
                                sSearch: 'Search all columns:',
                                sLengthMenu: '_MENU_ records per page',
                                info: 'Showing page _PAGE_ of _PAGES_',
                                zeroRecords: 'Nothing found - sorry',
                                infoEmpty: 'No records available',
                                infoFiltered: '(filtered from _MAX_ total records)'
                            }
                        });
                        var inputSearchClass = 'datatable_input_col_search';
                        var columnInputs = $('tfoot .' + inputSearchClass);

                        // On input keyup trigger filtering
                        columnInputs
                            .keyup(function () {
                                dtInstance.fnFilter(this.value, columnInputs.index(this));
                            });
                    });
                    $scope.$on('$destroy', function () {
                        dtInstance.fnDestroy();
                        $('[class*=ColVis]').remove();
                    });
                });

            });
    };

    getServiceList();
    console.log('jdklajdkl');
    // Cancel Dialog
    $scope.cancelSession = function (userid) {
        $scope.dele_val = userid;
        $scope.value = true;
        $scope.addTeam = {};
        ngDialog.open({
            template: 'app/views/cancel-dialog.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    $scope.cancel = function () {

        $.post(MY_CONSTANT.url + '/admin_cancel_booking',
            {
                access_token: $cookieStore.get('obj').accesstoken,
                booking_id: $scope.dele_val
            },
            function (data) {
                $window.location.reload();

            });

    };

})


myApp.directive('map',function(markersCoords)
{


    return {
        restrict: 'E',
        template: '<div id="mapSize" style="height: 500px;width: 100%"></div>',
        link: function (scope){
            var mapProp;
            //var coordinates=new google.maps.LatLng(d.Lat, d.Lng);
            //console.log(coordinates);
            var chd= new google.maps.LatLng(30.7500 , 76.7800);
            mapProp ={
                center:chd,
                zoom: 2,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map=new google.maps.Map(document.getElementById("mapSize"), mapProp);
            /*var marker=new google.maps.Marker({
                position: coordinates,
            });*/
            var createMarkers = function(map) {
                console.log(markersCoords);
                markersCoords.forEach(function(column){
                    var marker = new google.maps.Marker({
                        map: map,
                        position: new google.maps.LatLng(column.Lat,column.Lng)
                    });
                });
            };
            scope.$watch(function(){return markersCoords;},function(value){
                createMarkers(map);
                console.log(value);
            },true);
            ///marker.setMap(map);
        },
        replace: true
    }
});