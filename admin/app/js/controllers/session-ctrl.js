App.controller('OngoingSessionController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $window, ngDialog) {
    'use strict';
    $scope.loading = true;
    $scope.pageLoaded = false;
    $scope.searchPaging = false;
    $scope.total_pages;
    $scope.last_page;
    $scope.page_no = 1;
    $scope.total_records;

    $scope.options = [10,25,50,100];
    $scope.page_length = $scope.options[0];

    var start, end, searchArray;
    var completeList = [];

    var putData = function(column, dataArray, index) {
        var d = {
            index : "",
            orderId: "",
            serviceType: "",
            currentType: "",
            jobStatus: "",
            payment: "",
            orderCreatedTime: "",

            pickuplocationname: ""
            //dropsoffspid:"",
            //Lat: "",
            //Lng: "",
            // fullName: "",
        };
        d.index = index;
        d.orderId = column.orderId;
        d.serviceType = column.serviceType;
        d.currentType = column.currentType;

        if(column.orderStatus=="SPRESPONDED")
            d.jobStatus="SP RESPONDED";
        else if (column.orderStatus=="SPRESPONDEDDELIVERY")
            d.jobStatus="SP RESPONDED DELIVERY";
        else if (column.orderStatus=="SPARRIVED")
            d.jobStatus="SP ARRIVED";
        else if (column.orderStatus=="SPPICKUPCAR")
            d.jobStatus="SP PICKUP CAR";
        else if (column.orderStatus=="EXTRASERVICES")
            d.jobStatus="EXTRA SERVICES";
        else if (column.orderStatus=="PAYMENTDUE")
            d.jobStatus="PAYMENT DUE";
        else if (column.orderStatus=="STARTSERVICE")
            d.jobStatus="START SERVICE";
        else d.jobStatus = column.orderStatus?column.orderStatus:'';

        d.payment = column.paymentDetails.status;
        d.orderCreatedTime = column.orderCreatedTime.split("T")[0];
        d.pickUpLocationName = column.pickUpLocationName;
        dataArray.push(d);

    };

    var createPageArray = function(start, end) {
        var page_arr = [];
        start = start<2?2:start;
        end = end>$scope.total_pages-1?$scope.total_pages-1:end;
        for(var i=start;i<=end;i++) {
            page_arr.push(i);
        }
        $scope.pages = page_arr;
    };
    $scope.getCustomerList=function (page_number) {
        $scope.last_page = $scope.page_no;
        $scope.page_no = page_number;
        $scope.limit=$scope.page_length;
        $scope.skip = $scope.limit * ($scope.page_no-1);
        //$scope.skip = $scope.page_no == $scope.total_pages?$scope.total_records-1:$scope.skip;
        var index = (page_number - 1) * $scope.page_length;
        $.get(MY_CONSTANT.url + '/api/admin/showBookings/'+$cookieStore.get('obj1')+'/'+$cookieStore.get('obj')+'/'+$scope.skip+'/'+$scope.limit+'/VALET?isInProgress=true', function (data) {
            var dataArray = [];
            $scope.total_records = data.data.bookingsCount;
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
            $scope.total_pages = Math.ceil(data.data.bookingsCount/$scope.page_length);
            data.data.bookingDetails.forEach(function (column) {
                putData(column, dataArray, ++index);

            });
            $scope.loading=false;

            $scope.$apply(function () {
                $scope.list = dataArray;
                $scope.loading = false;
                if($scope.total_pages>7) {
                    if($scope.page_no == 1) {
                        start = 2;
                        end = $scope.total_pages>6?5:$scope.total_pages;
                    }
                    else {
                        if($scope.page_no!=$scope.last_page) {
                            if($scope.last_page < $scope.page_no) {
                                start = $scope.page_no - 1;
                                end = $scope.page_no + 2;
                            }
                            else {
                                start = $scope.page_no - 2;
                                end = $scope.page_no +1;
                            }
                        }
                    }
                }
                else {
                    start = 2;
                    end = $scope.total_pages;
                }
                createPageArray(start, end);
                $scope.searchPaging = false;
                $scope.pageLoaded = true;
            });
        });
    };

    $scope.getCustomerList($scope.page_no);

    // ****Search in customer list***//
    var getPastSession = function() {
        $.get(MY_CONSTANT.url + '/api/admin/showBookings/'+$cookieStore.get('obj1')+'/'+$cookieStore.get('obj')+'/'+0+'/'+0+'/VALET?isInProgress=true', function (data) {
            completeList = data.data.bookingDetails;
        });
    };
    getPastSession();

    $scope.searchResults = function(start, end, page) {
        if(searchArray.length!=completeList.length) {
            var filteredArray = [];
            $scope.pageLoaded = false;
            $scope.searchPaging = true;
            $scope.page_no = page;
            $scope.value;
            end = end>searchArray.length?searchArray.length:end;
            $scope.total_pages = Math.ceil(searchArray.length/$scope.page_length);
            createPageArray(0, $scope.total_pages);
            for(var i=start;i<end;i++) {
                filteredArray.push(searchArray[i]);
            }
            $scope.list = filteredArray;
        }
        else {
            $scope.searchPaging = false;
            $scope.pageLoaded = true;
            $scope.getCustomerList(1);
        }
    };
    // Search for data
    $scope.$watch('search', function(value) {
        $scope.page_no = 1;
        searchArray = [];
        var index = 0;
        value = value.toLowerCase();
        if(!completeList.length)
            getPastSession();
        else {
            completeList.forEach(function(column) {
                var found = column.orderId==value || column.orderCreatedTime.search(value)>-1|| column.currentType.toLowerCase().search(value)>-1 ||  column.paymentDetails.status.toLowerCase().search(value)>-1|| column.orderStatus.toLowerCase().search(value)>-1;
                found = found || column.pickUpLocationName.toLowerCase().search(value)>-1 || column.serviceType.toLowerCase().search(value)>-1|| column. orderCreatedTime.toLowerCase().search(value)>-1|| column.pickUpLocationName.toLowerCase().search(value)>-1;
                if(found)
                    putData(column, searchArray, ++index);
            });
            $scope.searchResults(0, $scope.page_length, $scope.page_no);
        }
    });
    //****************************//
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



    App.controller('PastSessionController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $window, ngDialog) {
        'use strict';
        $scope.loading = true;
        $scope.pageLoaded = false;
        $scope.searchPaging = false;
        $scope.total_pages;
        $scope.last_page;
        $scope.page_no = 1;
        $scope.total_records;

        $scope.options = [10,25,50,100];
        $scope.page_length = $scope.options[0];

        var start, end, searchArray;
        var completeList = [];

        var putData = function(column, dataArray, index) {
                var d = {
                    index : "",
                    orderId: "",
                    serviceType: "",
                    currentType: "",
                    jobStatus: "",
                    payment: "",
                    orderCreatedTime: "",
                    pickuplocationname: ""
                    //dropsoffspid:"",
                    //Lat: "",
                    //Lng: "",
                    // fullName: "",
                };
            d.index = index;
                d.orderId = column.orderId;
                d.serviceType = column.serviceType;
                d.currentType = column.currentType;
            d.jobStatus = column.orderStatus?column.orderStatus:'';
                d.payment = column.paymentDetails.status;
            d.orderCreatedTime = column.orderCreatedTime.split("T")[0];
            d.serviceCost=column.paymentDetails.totalServiceCost;
                d.pickUpLocationName = column.pickUpLocationName;
                //markr.Lat=column.Lat;
                //markr.Lng=column.Lng;
                dataArray.push(d);

        };

        var createPageArray = function(start, end) {
            var page_arr = [];
            start = start<2?2:start;
            end = end>$scope.total_pages-1?$scope.total_pages-1:end;
            for(var i=start;i<=end;i++) {
                page_arr.push(i);
            }
            $scope.pages = page_arr;
        };
        $scope.getCustomerList=function (page_number) {
            $scope.last_page = $scope.page_no;
            $scope.page_no = page_number;
            $scope.limit=$scope.page_length;
            $scope.skip = $scope.limit * ($scope.page_no-1);
            //$scope.skip = $scope.page_no == $scope.total_pages?$scope.total_records-1:$scope.skip;
            console.log($scope.skip);
            var index = (page_number - 1) * $scope.page_length;
            $.get(MY_CONSTANT.url + '/api/admin/showBookings/'+$cookieStore.get('obj1')+'/'+$cookieStore.get('obj')+'/'+$scope.skip+'/'+$scope.limit+'/VALET?orderStatus=COMPLETED', function (data) {
                var dataArray = [];
                $scope.total_records = data.data.bookingsCount;
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
                $scope.total_pages = Math.ceil(data.data.bookingsCount/$scope.page_length);
                data.data.bookingDetails.forEach(function (column) {
                    putData(column, dataArray, ++index);

                });
                $scope.loading=false;

                $scope.$apply(function () {
                    $scope.list = dataArray;
                    $scope.loading = false;
                    if($scope.total_pages>7) {
                        if($scope.page_no == 1) {
                            start = 2;
                            end = $scope.total_pages>6?5:$scope.total_pages;
                        }
                        else {
                            if($scope.page_no!=$scope.last_page) {
                                if($scope.last_page < $scope.page_no) {
                                    start = $scope.page_no - 1;
                                    end = $scope.page_no + 2;
                                }
                                else {
                                    start = $scope.page_no - 2;
                                    end = $scope.page_no +1;
                                }
                            }
                        }
                    }
                    else {
                        start = 2;
                        end = $scope.total_pages;
                    }
                    createPageArray(start, end);
                    $scope.searchPaging = false;
                    $scope.pageLoaded = true;
                });
            });
        };

        $scope.getCustomerList($scope.page_no);

        // ****Search in customer list***//
        var getPastSession = function() {
            $.get(MY_CONSTANT.url + '/api/admin/showBookings/'+$cookieStore.get('obj1')+'/'+$cookieStore.get('obj')+'/'+0+'/'+0+'/VALET?orderStatus=COMPLETED', function (data) {
                completeList = data.data.bookingDetails;
            });
        };
        getPastSession();

        $scope.searchResults = function(start, end, page) {
            if(searchArray.length!=completeList.length) {
                var filteredArray = [];
                $scope.pageLoaded = false;
                $scope.searchPaging = true;
                $scope.page_no = page;
                end = end>searchArray.length?searchArray.length:end;
                $scope.total_pages = Math.ceil(searchArray.length/$scope.page_length);
                createPageArray(0, $scope.total_pages);
                for(var i=start;i<end;i++) {
                    filteredArray.push(searchArray[i]);
                }
                $scope.list = filteredArray;
            }
            else {
                $scope.searchPaging = false;
                $scope.pageLoaded = true;
                $scope.getCustomerList(1);
            }
        };
        // Search for data
        $scope.$watch('search', function(value) {
            $scope.page_no = 1;
            searchArray = [];
            var index = 0;
            value = value.toLowerCase();
            if(!completeList.length)
                getCustomers();
            else {
                completeList.forEach(function(column) {
                    var found = column.orderId==value || column.orderCreatedTime.search(value)>-1|| column.currentType.toLowerCase().search(value)>-1 ||  column.paymentDetails.status.toLowerCase().search(value)>-1|| column.orderStatus.toLowerCase().search(value)>-1;
                    found = found || column.pickUpLocationName.toLowerCase().search(value)>-1 || column.serviceType.toLowerCase().search(value)>-1|| column. orderCreatedTime.toLowerCase().search(value)>-1|| column.pickUpLocationName.toLowerCase().search(value)>-1;
                    if(found)
                        putData(column, searchArray, ++index);
                });
                $scope.searchResults(0, $scope.page_length, $scope.page_no);
            }
        });
        //****************************//
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


//myApp.directive('map',function(markersCoords)
//{
//
//
//    return {
//        restrict: 'E',
//        template: '<div id="mapSize" style="height: 500px;width: 100%"></div>',
//        link: function (scope){
//            var mapProp;
//            //var coordinates=new google.maps.LatLng(d.Lat, d.Lng);
//            //console.log(coordinates);
//            var chd= new google.maps.LatLng(30.7500 , 76.7800);
//            mapProp ={
//                center:chd,
//                zoom: 2,
//                mapTypeId: google.maps.MapTypeId.ROADMAP
//            };
//            var map=new google.maps.Map(document.getElementById("mapSize"), mapProp);
//            /*var marker=new google.maps.Marker({
//                position: coordinates,
//            });*/
//            var createMarkers = function(map) {
//                console.log(markersCoords);
//                markersCoords.forEach(function(column){
//                    var marker = new google.maps.Marker({
//                        map: map,
//                        position: new google.maps.LatLng(column.Lat,column.Lng)
//                    });
//                });
//            };
//            scope.$watch(function(){return markersCoords;},function(value){
//                createMarkers(map);
//                console.log(value);
//            },true);
//            ///marker.setMap(map);
//        },
//        replace: true
//    }
//});