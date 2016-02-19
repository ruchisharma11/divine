/**
 * Created by ruchi1 on 12/8/2015.
 */
App.controller('CustomersController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $state, $window, ngDialog) {
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
    var index1 = 1;
    var putData = function (column, dataArray, index) {
        if (column.isDeleted == false) {

            var d = {
                index: "",
                cust_id: "",
                image: "",
                first_name: "",
                last_name: "",
                phone_no: "",
                email: "",
                total_trips: "",

                //gender: "",
                reg_date: "",
                is_block: "",
                is_delete: "",
                is_edit: ""
            };

            d.index = index;
            //d.index = index1;
            d.cust_id = column._id;
            d.image = "http://divineapp.s3.amazonaws.com/customerImages/" + column.image;
            d.first_name = column.firstName;
            d.last_name = column.lastName;
            d.phone_no = column.phoneNumber;
            d.email = column.email;
            d.total_trips = column.totalTrips;
            //d.gender = column.gender;
            d.reg_date = column.registrationDate;
            if (column.isBlocked == false) {
                d.is_block = 0;
            }
            else if (column.isBlocked == true) {
                d.is_block = 1;
            }
            //d.is_block = column.isBlocked;
            // d.is_delete=column.isDeleted;
            d.is_edit = column.isEdited;

            dataArray.push(d);
            //index1++;
        }
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
        $scope.skip = $scope.limit * ($scope.page_no - 1);
        $scope.skip = $scope.page_no == $scope.total_pages ? $scope.total_records - 1 : $scope.skip;
        var index = (page_number - 1) * $scope.page_length;
        $.get(MY_CONSTANT.url + '/api/admin/showCustomer/' + $cookieStore.get('obj1') + '/' + $cookieStore.get('obj') + '/' + $scope.skip + '/' + $scope.limit, function (data) {
            var dataArray = [];
            $scope.total_records = data.data.customersCount;
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
            $scope.total_pages = Math.ceil(data.data.customersCount / $scope.page_length);
            data.data.customerDetails.forEach(function (column) {
                if (!column.isDeleted) {
                    putData(column, dataArray, ++index);
                }

            });

            $scope.loading = false;
            $scope.$apply(function () {
                $scope.list = dataArray;
                console.log($scope.list);
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
        $.get(MY_CONSTANT.url + '/api/admin/showCustomer/' + $cookieStore.get('obj1') + '/' + $cookieStore.get('obj') + '/' + 0 + '/' + 0, function (data) {
            completeList = data.data.customerDetails;
        });
    };
    getCustomers();

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
            $scope.getCustomerList();
            //location.reload();
        }
    };
    // Search for data
    $scope.$watch('search', function (value) {
        $scope.page_no = 1;
        searchArray = [];
        var index = 0;
        if(!value) value='1';
        value = value.toLowerCase();
        if (!completeList.length)
            getCustomers();
        else {
            completeList.forEach(function (column) {
                var found = column._id.toLowerCase().search(value) > -1 || column.firstName.toLowerCase().search(value) > -1;
                found = found || column.lastName.toLowerCase().search(value) > -1 || column.email.toLowerCase().search(value) > -1 || column.phoneNumber.search(value) > -1 || column.totalTrips <= parseInt(value);
                if (found)
                    putData(column, searchArray, ++index);
            });
            $scope.searchResults(0, $scope.page_length, $scope.page_no);
        }
    });

// Delete Dialog========================================================================================================
    $scope.deleteCustomer = function (userid) {
        $scope.dele_val = userid;
        // console.log(dele_val)
        $scope.value = true;
        $scope.addTeam = {};
        ngDialog.open({
            template: 'app/views/delete-dialog.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    $scope.delete = function () {
        $.ajax({
            type: 'PUT',
            url: MY_CONSTANT.url + '/api/admin/deleteUser',
            //headers: {'authorization': 'bearer' + " " + $cookieStore.get('accessToken')},
            data: {
                "adminId": $cookieStore.get('obj1'),
                "accessToken": $cookieStore.get('obj'),
                "userId": $scope.dele_val,
                "userType": "customer"
            },
            success: function (data) {
                //console.log('abc',details);
                //console.log('aaa', data.details);
                if (data.details.code == 200) {
                    alert('Data Updated')
                    $scope.$apply();
                    ngDialog.close(0);
                    $scope.getCustomerList(1);
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
        //console.log($scope.user_val);
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
            template: 'app/views/status-dialog.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };
    if ($scope.status == 1) {
        $scope.change = function (user_val) {
            //console.log("dfs");
            //console.log(user_val);
            var data = {
                "adminId": $cookieStore.get('obj1'),
                "accessToken": $cookieStore.get('obj'),
                "userId": user_val,
                "userType": "customer"
            };
            $.ajax({
                method: 'PUT',
                url: 'http://divine.clicklabs.in:8888/api/admin/blockUser',
                dataType: 'json',
                data: data,
                success: function (data) {
                    $window.location.reload();
                }


            });

        };
    }
    else {
        $scope.change = function (user_val) {
            //console.log("dfs");
            //console.log(user_val);
            var data = {
                "adminId": $cookieStore.get('obj1'),
                "accessToken": $cookieStore.get('obj'),
                "userId": user_val,
                "userType": "customer"
            };
            $.ajax({
                method: 'PUT',
                url: 'http://divine.clicklabs.in:8888/api/admin/unblockUser',
                dataType: 'json',
                data: data,
                success: function (data) {
                    $window.location.reload();
                }


            });

        };
    }
    // change status ends here==========================================================================================


    //.edit customer======================================================================================================
    $scope.editCustomer = {};
    $scope.Customer = function (json) {


        //console.log(json.cust_id);
        $scope.editCustomer.id_pop = json.cust_id;
        //$scope.editService.category = [{value: json.category}];
        // $scope.updateVal = json.category;
        $scope.editCustomer.firstName = json.first_name;
        $scope.editCustomer.lastName = json.last_name;
        $scope.editCustomer.phoneNumber = json.phone_no;
        $scope.editCustomer.email = json.email;
        $scope.editCustomer.registrationDate = json.reg_date;


        $scope.value = true;
        $scope.addTeam = {};
        ngDialog.open({
            template: 'app/views/edit-customer-popup.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };
});

App.controller('EditCustomerController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $state, ngDialog) {
    'use strict';

    $scope.successMsg = '';
    $scope.errorMsg = '';
    $scope.addService = {};
    // alert("dldk");ababdul.shamim@clicklabs.codul.shamim@clicklabs.co

    $scope.EditService = function (editCustomer) {
        //console.log(editCustomer.phoneNumber);
        var mobile = editCustomer.phoneNumber;
        if(mobile[mobile.indexOf('_')-1]=='-') {
            mobile = mobile.substr(0, mobile.indexOf('_') - 1);
        }
        if(mobile.search('_')>-1) {
            mobile = mobile.substr(0, mobile.search('_'));
        }
        //console.log(editCustomer.id_pop, editCustomer.email, editCustomer.phoneNumber);
        $.ajax({
            type: 'PUT',
            url: MY_CONSTANT.url + '/api/admin/editCustomerDetails',
            //headers: {'authorization': 'bearer' + " " + $cookieStore.get('accessToken')},
            data: {
                "adminId": $cookieStore.get('obj1'),
                "accessToken": $cookieStore.get('obj'),
                "userId": editCustomer.id_pop,
                "email": editCustomer.email,
                "phoneNumber": mobile,
                "firstName": editCustomer.firstName,
                "lastName": editCustomer.lastName,
                "carDetails": [
                    null
                ]

            },
            success: function (data) {
                //console.log(data);
                window.alert("Data Updated");
                $scope.$apply();
                ngDialog.close();
                $state.reload();
            }
        });
    };
//edit panel end===========================================================================================================================

});


//customer information=======================================================================================================================


App.controller('CustomerInfoController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, ngDialog, $stateParams, convertdatetime, getCategories) {
    'use strict';
    $scope.loading = true;
    $scope.loading_image = true;
    $scope.customer = {};
    var userId = $stateParams.id;
    var accessToken = $cookieStore.get('obj');
    //console.log(accessToken);
    var adminId = $cookieStore.get('obj1');
    // console.log(adminId);

    $.get(MY_CONSTANT.url + '/api/admin/userDetails?adminId=' + adminId + '&accessToken=' + accessToken + '&userId=' + userId + '&userType=customer').then
    (function (data) {
        var dataArray = [];
        //data = JSON.parse(data);
      console.log(data.data.orders);
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
        $scope.loading = false;
        $scope.loading_image = false;
        if(data.data.orders.length>0){

        //var customer_data = data.customerDetail[0];
        $scope.customer.image = data.data.baseUrl;
        $scope.customer.name = data.data.firstName;
        $scope.customer.email = data.data.email;
        $scope.customer.phone = data.data.phoneNumber;
        //$scope.i = 0;
        //console.log(data);
        //data.data.customerDetails.forEach(function (column) {
            var dataArray=[];
            var custorders=data.data.orders;
            custorders.forEach(function(column){
                var d = {};
                //d.OrderId = data.data.orders?data.data.orders[0].orderId:'';
                //d.orderCreatedTime = data.data.orders[0].orderCreatedTime;
                //d.carDetails = data.data.orders[0].carDetails.colourCode+" "+data.data.orders[0].carDetails.make+" "+data.data.orders[0].carDetails.model;
                //d.licensePlateNumber = data.data.orders[0].carDetails.licensePlateNumber;
                d.OrderId = column.orderId?column.orderId:'';
                d.orderCreatedTime = column.orderCreatedTime;
                d.carDetails = column.carDetails.colourCode+" "+column.carDetails.make+" "+column.carDetails.model;
                d.licensePlateNumber = column.carDetails.licensePlateNumber;
                dataArray.push(d);

            });
            $scope.list=dataArray;

        ////console.log(column);
        //for (i = 0; i <= rating.length; i++) {
        //    if (column.rating.length > 0) {
        //        d.OrderId = column.rating[i].orderId;
        //        d.date=column.rating[i].dateRated;
        //    }
        //    else {
        //        d.OrderId = 'null';
        //        d.date='null';
        //
        //    }
        //}
        //
        //d.carDetails = column.carDetails[0].colourCode + column.carDetails[0].colourCode + column.carDetails[0].model;
        //d.licensePlateNumber = column.carDetails[0].licensePlateNumber;
        //d.rating = column.rating;

        $scope.customer.image = "http://divineapp.s3.amazonaws.com/customerImages/" + data.data.userDetails.image;
        $scope.customer.name = data.data.userDetails.firstName + " " + data.data.userDetails.lastName;
        $scope.customer.email = data.data.userDetails.email;
        $scope.customer.phone = data.data.userDetails.phoneNumber;
        //console.log($scope.customer.image);


        dataArray.push(d);
        //console.log(d);

        //break ;}
        $scope.$apply(function () {
            $scope.list = dataArray;
            //console.log(dataArray);
            //$scope.loading_image = false;
    });
        //$scope.loading = false;
            }

    });

});
