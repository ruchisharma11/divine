App.controller('CustomersController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $window, ngDialog) {
    'use strict';
    $scope.loading = true;

    var getCustomerList = function () {
       // alert('wooo');
       var accessToken=$cookieStore.get('obj');
        //console.log(accessToken);
      var  adminId= $cookieStore.get('obj1');
       // console.log(adminId);
        $.get(MY_CONSTANT.url + '/api/admin/showCustomer/'+adminId+'/'+accessToken+'/'+0+'/'+0).then(

         function (data) {
            //console.log(data);
            // console.log(data.data.customerDetails[1].firstName);
            var dataArray = [];
            //data = JSON.parse(data);
            //console.log(data);
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

            data.data.customerDetails.forEach(function (column) {

                var d = {
                    cust_id: "",
                    image:"",
                    first_name: "",
                    last_name: "",
                    phone_no: "",
                    email: "",
                    total_trips:"",

                    //gender: "",
                    reg_date: "",
                    is_block: "",
                    is_delete:"",
                    is_edit:""
                };

                d.cust_id = column._id;
                d.image="http://divineapp.s3.amazonaws.com/customerImages/"+column.image;
                d.first_name = column.firstName;
                d.last_name = column.lastName;
                d.phone_no = column.phoneNumber;
                d.email = column.email;
                d.total_trips= column.totalTrips;
                //d.gender = column.gender;
                d.reg_date = column.registrationDate;
                if(column.isBlocked==false)
                {
                    d.is_block = 0;
                }
                else if(column.isBlocked==true)
                {
                    d.is_block = 1;
                }
                //d.is_block = column.isBlocked;
                if(column.isDeleted==false)
                {
                    d.is_deleted = 0;
                }
                else if(column.isDeleted==true)
                {
                    d.is_deleted= 1;
                }
               // d.is_delete=column.isDeleted;
                d.is_edit=column.isEdited;

                dataArray.push(d);
             //console.log(d);
            });

            $scope.$apply(function () {
                $scope.list = dataArray;

                    //console.log(dataArray);
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
                            sLengthMenu: '_MENU_ records per page',
                            sSearch: 'Search all columns:',
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

    getCustomerList();

    // Delete Dialog
    $scope.deleteCustomer = function (userid) {
        $scope.dele_val = userid;
        $scope.value = true;
        $scope.addTeam = {};
        ngDialog.open({
            template: 'app/views/delete-dialog.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    $scope.delete = function (_id,isDeleted) {

        $.ajax({
            type: 'PUT',
            url: MY_CONSTANT.url + '/api/admin/deleteUser' ,
            //headers: {'authorization': 'bearer' + " " + $cookieStore.get('accessToken')},
            data:
            {
                "adminId": "$cookieStore.get('obj1')",
                "accessToken": "$cookieStore.get('obj')",
                "userId": "_id",
                "userType": "customer"
            },
            success: function (data) {
                //console.log(data);
                if (data.message=='Success') {
                    $scope.$apply();
                    $state.reload();
                }
                else
                    alert("Error");
            }
        });

    };

    // Change Status Dialog
    $scope.changeStatus = function (status, userid) {
        $scope.user_val = userid;
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

    $scope.change = function (user_val) {
    console.log("dfs");
        console.log(user_val);
        var data = {
            "adminId": $cookieStore.get('obj1'),
            "accessToken": $cookieStore.get('obj'),
            "userId": user_val,
            "userType":"customer"
        };
        $.ajax({
            method: 'PUT',
            url:'http://52.6.32.171:8888/api/admin/blockUser',
            dataType: 'json',
            data: data,
            success: function(data){
                $window.location.reload();
            }



        });

    };
    //..........................................edit customer
    $scope.editCustomer = {};
    $scope.Customer = function (json) {


           console.log(json.cust_id);
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


App.controller('EditCustomerController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $window) {
    'use strict';

    $scope.successMsg = '';
    $scope.errorMsg = '';
    $scope.addService = {};
   // alert("dldk");ababdul.shamim@clicklabs.codul.shamim@clicklabs.co

    $scope.EditService = function (editCustomer) {


 console.log(editCustomer.id_pop,editCustomer.email,editCustomer.phoneNumber);
        $.ajax({
            type: 'PUT',
            url: MY_CONSTANT.url + '/api/admin/editCustomerDetails' ,
            //headers: {'authorization': 'bearer' + " " + $cookieStore.get('accessToken')},
            data:
            {
                "adminId": $cookieStore.get('obj1'),
                "accessToken": $cookieStore.get('obj'),
                "userId": editCustomer.id_pop,
                "email": editCustomer.email,
                "phoneNumber": editCustomer.phoneNumber,
                "firstName": editCustomer.firstName,
                "lastName": editCustomer.lastName,
                "carDetails": [
                    null
                ]

            },
            success: function (data) {
               console.log(data);
                alert(data.details.message);
                if (data.message=='Success') {
                    $scope.$apply();
                    $state.reload();
                }

            }
        });
    }
});

/*------------Edit Customer Info Section Starts---------------*/
    $scope.pop = {};
    $scope.editData = function () {
        console.log("yes");
        ngDialog.openConfirm({
            template: 'modalDialogId',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
        $scope.pop.callUs=$scope.callUs;
        $scope.pop.emailUs=$scope.emailUs;
        $scope.pop.website=$scope.website;
        $scope.pop.facebookLink=$scope.facebookLink;
        $scope.pop.twitterLink=$scope.twitterLink;
    };    $scope.editCustomer = function(){
        var data={
            callUs: $scope.pop.callUs,
            emailUs: $scope.pop.emailUs,
            website: $scope.pop.website,
            facebookLink: $scope.pop.facebookLink,
            twitterLink: $scope.pop.twitterLink
        };
        $.ajax({
            type: 'PUT',
            url: MY_CONSTANT.url + '/api/admin/editCustomerDetails' ,
            //headers: {'authorization': 'bearer' + " " + $cookieStore.get('accessToken')},
            data:
            {
                "adminId": "$cookieStore.get('obj1')",
                "accessToken": "$cookieStore.get('obj')",
                "userId": "_id",
                "email": "email",
                "phoneNumber": "phoneNumber",
                "firstName": "firstName",
                "lastName": "lastName",
                "carDetails": [
                    null
                ]

            },
            success: function (data) {
                //console.log(data);
                if (data.message=='Success') {
                    $scope.$apply();
                    $state.reload();
                }
                else
                    alert("Error");
            }
        });

    };



});

App.controller('CustomerInfoController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, ngDialog, $stateParams, convertdatetime, getCategories) {
    'use strict';
    $scope.loading = true;
    $scope.loading_image = true;
    $scope.customer = {};
    var userId = $stateParams.id;
    var accessToken=$cookieStore.get('obj');
    //console.log(accessToken);
    var  adminId= $cookieStore.get('obj1');
    // console.log(adminId);
    $.get(MY_CONSTANT.url + '/api/admin/showCustomer/'+adminId+'/'+accessToken+'/'+0+'/'+0).then
    ( function (data) {
        var dataArray = [];
       //data = JSON.parse(data);

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
      //var customer_data = data.customerDetail[0];
        $scope.customer.image = data.data.baseUrl;
        $scope.customer.name = data.data.firstName;
        $scope.customer.email = data.data.email;
        $scope.customer.phone = data.data.phoneNumber;
        //console.log(data);
        data.data.customerDetails.forEach(function (column) {

            var d = {

                Sno : "",
               OrderId: "",
                spId: "",
               colourCode: "",
                make: "",
               model: "",
               licensePlateNumber: "",
               rating: ""

            };
            if(column._id==$stateParams.id)
            { console.log(column);
           // d.Sno = column.Sno;
            d.OrderId = column.rating[0].orderId;
            d.spId = column.rating[0].spId;
            d.colourCode = column.carDetails[0].colourCode;
            d.make = column.carDetails[0].make;
            d.model = column.carDetails[0].model;
            d.licensePlateNumber = column.carDetails[0].licensePlateNumber;
            d.rating = column.rating;
                $scope.customer.image += column.image;
                $scope.customer.name = column.firstName+" "+column.lastName;
                $scope.customer.email = column.email;
                $scope.customer.phone = column.phoneNumber;
                console.log($scope.customer.image);


            dataArray.push(d);
            console.log(d);
            }
            //break ;}
        });

        $scope.$apply(function () {
            $scope.list = dataArray;
            console.log(dataArray);
            $scope.loading_image = false;


            // Define global instance we'll use to destroy later
            var dtInstance;
            $scope.loading = false;
            $timeout(function () {
                if (!$.fn.dataTable) return;
                dtInstance = $('#datatable2').dataTable({
                    'paging': true,  // Table pagination
                    'ordering': true,  // Column ordering
                    'info': true,  // Bottom left status text
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
});