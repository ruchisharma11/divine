/**
 * Created by ruchi1 on 12/8/2015.
 */
App.controller('VerifiedController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout,$state, $window, ngDialog) {
    'use strict';
    $scope.loading = true;
    $scope.pageLoaded = false;
    $scope.searchPaging = false;
    $scope.total_pages;
    $scope.last_page;
    $scope.page_no = 1;
    $scope.total_records;

    $scope.options = [10, 25, 50, 100];
    $scope.page_length = $scope.options[0];

    var start, end, searchArray;
    var completeList = [];

    var putData = function (column, dataArray, index) {
        var d = {
            index:"",
            id: "",
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            registrationDate: "",
            orderCreatedTime: "",
            totalTrips: "",
            isBlocked: "",
            isDeleted: "",
            isEdited: ""


        };
        d.index = index;
        d.id = column._id;
        d.firstName = column.firstName;
        d.lastName = column.lastName;
        d.email = column.email;
        d.phoneNumber = column.phoneNumber;
        d.registrationDate = column.registrationDate.toString().split("T")[0];
        d.totalTrips = column.totalTrips;
        if (column.isBlocked == true) {
            d.is_block = 1;
        }

        if (column.isBlocked == false) {
            d.is_block = 0;
        }
        d.isDeleted = column.isDeleted;
        d.isEdited = column.isEdited;
        dataArray.push(d);
        //console.log(data);

    };

    var createPageArray = function (start, end) {
        var page_arr = [];
        start = start < 2 ? 2 : start;
        end = end > $scope.total_pages - 1 ? $scope.total_pages - 1 : end;
        for (var i = start; i <= end; i++) {
            page_arr.push(i);
        }
        $scope.pages = page_arr;
    };
    $scope.getCustomerList = function (page_number) {
        $scope.last_page = $scope.page_no;
        $scope.page_no = page_number;
        $scope.limit = $scope.page_length;
        $scope.skip = $scope.limit * ($scope.page_no-1);
        //$scope.skip = $scope.page_no == $scope.total_pages ? $scope.total_records - 1 : $scope.skip;
        var index = (page_number - 1) * $scope.page_length;
        $.get(MY_CONSTANT.url + '/api/admin/showServiceProvider/' + $cookieStore.get('obj1') + '/' + $cookieStore.get('obj') + '/' + $scope.skip + '/' + $scope.limit, function (data) {
            var dataArray = [];
            $scope.total_records = data.data.spCount;
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
            $scope.total_pages = Math.ceil(data.data.spCount / $scope.page_length);
            data.data.serviceProviderDetails.forEach(function (column) {
                putData(column, dataArray, ++index);

            });
    $scope.loading=false;
            $scope.$apply(function () {
                $scope.list = dataArray;
                $scope.loading = false;
                if ($scope.total_pages > 7) {
                    if ($scope.page_no == 1) {
                        start = 2;
                        end = $scope.total_pages > 6 ? 5 : $scope.total_pages;
                    }
                    else {
                        if ($scope.page_no != $scope.last_page) {
                            if ($scope.last_page < $scope.page_no) {
                                start = $scope.page_no - 1;
                                end = $scope.page_no + 2;
                            }
                            else {
                                start = $scope.page_no - 2;
                                end = $scope.page_no + 1;
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
    var getCustomers = function () {
        $.get(MY_CONSTANT.url + '/api/admin/showServiceProvider/' +  $cookieStore.get('obj1') + '/' +  $cookieStore.get('obj') + '/' + 0 + '/' + 0, function (data) {
            completeList = data.data.serviceProviderDetails;
        });
    };
    getCustomers ();

    $scope.searchResults = function (start, end, page) {
        if (searchArray.length != completeList.length) {
            var filteredArray = [];
            $scope.pageLoaded = false;
            $scope.searchPaging = true;
            $scope.page_no = page;
            end = end > searchArray.length ? searchArray.length : end;
            $scope.total_pages = Math.ceil(searchArray.length / $scope.page_length);
            createPageArray(0, $scope.total_pages);
            for (var i = start; i < end; i++) {
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
    $scope.$watch('search', function (value) {
        $scope.page_no = 1;
        searchArray = [];
        var index = 0;
        value = value.toLowerCase();
        if (!completeList.length)
            getCustomers();
        else {
            completeList.forEach(function (column) {
                var found = column._id.toLowerCase().search(value) > -1||column.firstName.toLowerCase().search(value) > -1 ;
                found = found || column.lastName.toLowerCase().search(value) > -1|| column.email.toLowerCase().search(value) > -1 || column.phoneNumber.search(value) > -1 || column.totalTrips<=parseInt(value) ;
                if (found)
                    putData(column, searchArray, ++index);
            });
            $scope.searchResults(0, $scope.page_length, $scope.page_no);
        }
    });



    // Delete Dialog========================================================================================================
    $scope.deleteArtist= function (userid) {
        $scope.dele_val = userid;
        console.log('1. id',$scope.dele_val);
        $scope.value = true;
        $scope.addTeam = {};
        ngDialog.open({
            template: 'app/views/delete-artist-dialog.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    $scope.delete = function () {
        //$scope.dele_val=id;
        //console.log('2. id',$scope.dele_val);
        $.ajax({
            type: 'PUT',
            url: MY_CONSTANT.url + '/api/admin/deleteUser' ,
            dataType: 'json',

            data:
            {
                "adminId": $cookieStore.get('obj1'),
                "accessToken": $cookieStore.get('obj'),
                "userId": $scope.dele_val,
                "userType": "sp"
            },
            success: function (data) {
                //console.log('abc',details);
                console.log('aaa',data.details);
                if (data.details.code==200) {
                    alert('Data Updated');
                    $scope.$apply();
                    $scope.getCustomerList(1);
                    ngDialog.close();
                    $state.reload();
                }
                else
                    alert("Error");
            }
        });

    };

    // Change Status Dialog=============================================================================================
    $scope.changeStatus = function (status, userid) {

        $scope.user_val = userid;
        console.log( 'id',$scope.user_val );
        if (status == 1) {
            $scope.stat = "block";
            $scope.stat_btn = "Block";
            $scope.status = 1;
        }
        else {
            $scope.stat = "unblock";
            $scope.stat_btn = "Unblock";
            $scope.status = 0;
        }
        $scope.value = true;
        $scope.addTeam = {};
        ngDialog.open({
            template: 'app/views/status-artist-dialog.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };
    if ($scope.status==1) {
        $scope.change = function (user_val) {
            console.log("dfs");
            console.log(user_val);
            var data = {
                "adminId": $cookieStore.get('obj1'),
                "accessToken": $cookieStore.get('obj'),
                "userId": user_val,
                "userType": "sp"
            };
            $.ajax({
                method: 'PUT',
                url: 'http://divine.clicklabs.in:8888/api/admin/blockUser',
                dataType: 'json',
                data: data,
                success: function (data) {
                    //$window.location.reload();
                    ngDialog.close();
                    $state.reload();
                }


            });

        };
    }
    else{
        $scope.change = function (user_val) {
            console.log("dfs");
            console.log(user_val);
            var data = {
                "adminId": $cookieStore.get('obj1'),
                "accessToken": $cookieStore.get('obj'),
                "userId": user_val,
                "userType": "sp"
            };
            console.log(data);
            console.log("asadf");
            $.ajax({
                method: 'PUT',
                url: 'http://divine.clicklabs.in:8888/api/admin/unblockUser',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log(data);
                    //$window.location.reload();
                    ngDialog.close();
                    $state.reload();
                },
                error: function (data) {
                    console.log(data);
                    //$window.location.reload();
                  //  $state.reload();
                }
            });
        };
    }
    // change status ends here==========================================================================================



    //edit driver==============================================================================================================
    $scope.editArtist = {};
    $scope.Artist = function (json) {


        console.log('a', json);
        $scope.editArtist.id_pop = json.id;
        //$scope.editService.category = [{value: json.category}];
        // $scope.updateVal = json.category;
        $scope.editArtist.firstName = json.firstName;
        $scope.editArtist.lastName = json.lastName;
        $scope.editArtist.phoneNumber = json.phoneNumber;
        $scope.editArtist.email = json.email;
        $scope.editArtist.registrationDate = json.registrationDate;


        $scope.value = true;
        $scope.addTeam = {};
        ngDialog.open({
            template: 'app/views/edit-artist-popup.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };
});

App.controller('EditArtistController', function ($scope, $http, $location, $cookies, $cookieStore, $state, MY_CONSTANT, $window, ngDialog) {
    'use strict';

    $scope.successMsg = '';
    $scope.errorMsg = '';
    $scope.addService = {};
    // alert("dldk");ababdul.shamim@clicklabs.codul.shamim@clicklabs.co

    $scope.EditService = function (editArtist) {


        console.log(editArtist.id_pop,editArtist.email,editArtist.phoneNumber);
        $.ajax({
            type: 'PUT',
            url: MY_CONSTANT.url + '/api/admin/editServiceProviderDetails' ,
            //headers: {'authorization': 'bearer' + " " + $cookieStore.get('accessToken')},
            data:
            {
                "adminId": $cookieStore.get('obj1'),
                "accessToken": $cookieStore.get('obj'),
                "userId": editArtist.id_pop,
                "email": editArtist.email,
                "phoneNumber": editArtist.phoneNumber,
                "firstName":editArtist.firstName,
                "lastName": editArtist.lastName,
                "isValet":false,
                "isChauffeur":false,
                "isDesignatedDriver":false,

            },
            success: function (data) {
                console.log(data);
                $window.alert("Data Updated");
                $scope.$apply();
                ngDialog.close();
                $state.reload();
            }
        });
    }
//edit panel end===========================================================================================================================

});