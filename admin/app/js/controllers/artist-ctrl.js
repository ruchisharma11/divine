App.controller('VerifiedController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $window, ngDialog, getCategories) {
    'use strict';
    $scope.loading = true;

    //$scope.loading = true;
    $scope.loading_image = true;
    $scope.customer = {};
    //var userId = $stateParams.id;
    var accessToken=$cookieStore.get('obj');
    //console.log(accessToken);
    var  adminId= $cookieStore.get('obj1');

        $.get(MY_CONSTANT.url + '/api/admin/showServiceProvider/'+adminId+'/'+accessToken+'/'+0+'/'+0).then(
        function (data) {
            console.log(data);
            console.log(data.data.serviceProviderDetails[0].firstName);
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
            data.data.serviceProviderDetails.forEach(function (column) {
                //console.log(column);

                var d = {
                    id: "",
                    first_name: "",
                    last_name: "",
                    email: "",
                    phone_no:"",
                    //gender: "",
                  //  summary: "",
                  //  rating: "",
                 //   category: "",
                   // categories: "",
                    reg_date: "",
                    total_trips:"",
                   // city: "",
                    is_block: "",
                    is_deleted:"",
                    is_edited:""
                   // document_1:"",
                   // document_2:"",
                  //  document_3:""
                };
               // var category = getCategories.service_category(column.technician_type);
                d.id = column._id;
             //   d.name = column.first_name + " " + column.last_name;
                d.firstName = column.firstName;
                d.lastName = column.lastName;
             //   d.image = column.image;
                d.email = column.email;
                d.phoneNumber = column.phoneNumber;
                //d.qualification = column.qualification;
               // d.experience = column.experience;
                //d.document_1 = column.document_1;
                //d.document_2 = column.document_2;
                //d.document_3 = column.document_3;
                //d.gender = column.gender;
               // d.summary = column.summary;
               /* if ( column.document_1 == null || column.document_1 == "" ) {
                    d.document_1 = '--';
                }
                else {
                    d.document_1 = column.document_1;
                }
                if ( column.document_2 == null || column.document_2 == "" ) {
                    d.document_2 = '--';
                }
                else {
                    d.document_2 = column.document_2;
                }
                if ( column.document_3 == null || column.document_3 == "" ) {
                    d.document_3 = '--';
                }
                else {
                    d.document_3 = column.document_3;
                }
                if (column.rating == "" || column.rating == null) {
                    d.rating = 0;
                }
                else {
                    d.rating = column.rating;
                }
                d.category = category;
                d.categories = column.technician_type.split(",");*/

                d.registrationDate = column.registrationDate.toString().split("T")[0];
                d.totalTrips =column.totalTrips;
             //   d.city = column.city;
                if(column.isBlocked==true)
                {d.is_block=1;}

                if(column.isBlocked==false)
                {d.is_block=1;}


                //d.is_Blocked = column.is_Blocked;
                d.isDeleted = column.isDeleted;
                d.isEdited = column.isEdited;
                dataArray.push(d);

            });

            $scope.$apply(function () {
                $scope.list = dataArray;


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


    //getArtistList();
    $scope.deleteArtist1 = function (userid) {
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

    // Delete Dialog
    $scope.deleteArtist = function (userid) {
        $scope.dele_val = userid;
        $scope.value = true;
        $scope.addTeam = {};
        ngDialog.open({
            template: 'app/views/delete-dialog.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    // Edit Dialog
    $scope.editArtist = function (json) {
        $scope.json = json;
        //console.log(json);
        $scope.value = true;
        $scope.addTeam = {};
        ngDialog.open({
            template: 'app/views/edit-artist-dialog.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
        $scope.options_exp = [{
            name: '0-1 years',
            value: '0-1 years'
        }, {
            name: '1-3 years',
            value: '1-3 years'
        }, {
            name: '3-7 years',
            value: '3-7 years'
        }, {
            name: '7 above',
            value: '7 above'
        }];
        //$scope.options_cat = [{
        //    name: 'Blow Dry',
        //    value: '1'
        //}, {
        //    name: 'Makeup',
        //    value: '2'
        //}, {
        //    name: 'Manicure',
        //    value: '3'
        //}, {
        //    name: 'Packages',
        //    value: '4'
        //}];
    };

    $scope.delete = function () {

        $.post(MY_CONSTANT.url + '/delete_artist',
            {
                access_token: $cookieStore.get('obj').accesstoken,
                artist_id: $scope.dele_val
            },
            function (data) {
                $window.location.reload();

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

    $scope.change = function () {

        $.post(MY_CONSTANT.url + '/block_unblock_artist',
            {


                access_token: $cookieStore.get('obj').accesstoken,
                artist_id: $scope.user_val,
                new_block_status: $scope.status
            },
            function (data) {
                //console.log(data);
                $window.location.reload();

            });
    };

});

/*App.controller('NewRequestedController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $window, ngDialog) {
    'use strict';
    $scope.loading = true;

    var getArtistList = function () {
        $.post(MY_CONSTANT.url + '/new_requests', {
            access_token: $cookieStore.get('obj').accesstoken

        }, function (data) {
            var dataArray = [];
            data = JSON.parse(data);
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
            data.forEach(function (column) {

                var d = {
                    id: "",
                    name: "",
                    email: "",
                    phone_no: "",
                   // qualification: "",
                   // experience: "",
                    //gender: "",
                   // summary: "",
                    reg_date: "",
                    total_trips:"",
                   // city: "",
                    is_block: "",
                   // document_1:"",
                   // document_2:"",
                   // document_3:""
                };

                d._id = column._id;
                d.firstName = column.firstName;
                d.lastName =column.lastName;
                d.phoneNumber = column.phoneNumber;
                d.email = column.email;
               // d.qualification = column.qualification;
               // d.experience = column.experience;
                //d.gender = column.gender;
              //  d.summary = column.summary;
                d.registrationDate = column.registrationDatetime.toString().split("T")[0];
                d.totalTrips =column.totalTrips;

               // d.city = column.city;
                d.is_block = column.is_block;
                if ( column.document_1 == null || column.document_1 == "" ) {
                    d.document_1 = '--';
                }
                else {
                    d.document_1 = column.document_1;
                }
                if ( column.document_2 == null || column.document_2 == "" ) {
                    d.document_2 = '--';
                }
                else {
                    d.document_2 = column.document_2;
                }
                if ( column.document_3 == null || column.document_3 == "" ) {
                    d.document_3 = '--';
                }
                else {
                    d.document_3 = column.document_3;
                }
                //d.document_1 = column.document_1;
                //d.document_2 = column.document_2;
                //d.document_3 = column.document_3;

                dataArray.push(d);

            });

            $scope.$apply(function () {
                $scope.list = dataArray;


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

    getArtistList();

    $scope.doVerify = function (userId) {

        $.post(MY_CONSTANT.url + '/verify_new_artist', {


                access_token: $cookieStore.get('obj').accesstoken,
                user_id: userId
            },

            function (data) {

                ////console.log(data);
                $window.location.reload();

            });


    };

    // Delete Dialog
    $scope.deleteArtist = function (userid) {
        $scope.dele_val = userid;
        $scope.value = true;
        $scope.addTeam = {};
        ngDialog.open({
            template: 'app/views/delete-dialog.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    $scope.delete = function () {

        $.post(MY_CONSTANT.url + '/delete_artist',
            {
                access_token: $cookieStore.get('obj').accesstoken,
                artist_id: $scope.dele_val
            },
            function (data) {
                $window.location.reload();

            });

    };

});*/

App.controller('ArtistInfoController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, ngDialog, $timeout, $stateParams, getCategories, convertdatetime) {
    'use strict';
    $scope.loading = true;
    $scope.loading_image = true;
    $scope.artist = {};
    var userId = $stateParams.id;
    $.post(MY_CONSTANT.url + '/artist_details', {
        access_token: $cookieStore.get('obj').accesstoken,
        user_id: userId

    }, function (data) {
        var dataArray = [];
        data = JSON.parse(data);
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

        var artist_data = data.artist_detail[0];

        $scope.artist.image = artist_data.image_url;
        $scope.artist.name = artist_data.name;
        $scope.artist.email = artist_data.email;
        $scope.artist.phone = artist_data.mobile;
        $scope.loading_image = false;

        data = data.services;
        data.forEach(function (column) {

            var d = {
                id: "",
                booking_id: "",
                service_id: "",
                address: "",
                customer_name: "",
                service_date: "",
                start_time: "",
                end_time: "",
                status: "",
                user_rating: "",
                user_rating_text: "",
                tech_rating: "",
                rating_text: "",
                cost: "",
                tip:"",
                category: "",
                reject_reason: "",
                service_name: ""
            };

            var date = column.service_date.toString().split("T")[0];
            var start_time = convertdatetime.convertTime(column.start_time);
            var end_time = convertdatetime.convertTime(column.end_time);
            var service_list = getCategories.category(column.treatments);

            d.id = column.id;
            d.booking_id = column.booking_id;
            d.service_id = column.service_id;
            d.status = column.status;
            d.customer_name = column.customer_name;
            d.start_time = start_time;
            d.end_time = end_time;
            d.address = column.address;
            d.service_date = date;
            d.user_rating = column.user_rating;
            d.user_rating_text = column.user_rating_text;
            d.tech_rating = column.tech_rating;
            d.rating_text = column.rating_text;
            d.cost = column.cost;
            d.tip=column.tip;
            d.reject_reason=column.reject_reason;
            d.category = column.category;
            d.service_name = service_list;
            dataArray.push(d);
        });

        $scope.$apply(function () {
            $scope.list = dataArray;


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