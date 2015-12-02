App.controller('ServiceController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $route, ngDialog, $window, getCategories) {
    'use strict';
    $scope.loading = true;

    var getServiceList = function () {
        $.post(MY_CONSTANT.url + '/service_list', {
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
                    service_id: "",
                    category: "",
                    name: "",
                    category_val:"",
                    //image_url: "",
                   // heading: "",
                    description: "",
                   // instructions: "",
                    time: "",
                    cost: ""
                };

                var category = getCategories.service_category(column.category);

                d.service_id = column.service_id;
                d.category = category;
                d.category_val = column.category;
                d.name = column.name;
              //  d.image_url = column.image_url;
              //  d.heading = column.heading;
                d.description = column.description;
              //  d.instructions = column.instructions;
                d.time = column.time;
                d.cost = column.cost;
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

    getServiceList();

    // Delete Dialog
    $scope.deleteService = function (userid) {
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

        $.post(MY_CONSTANT.url + '/delete_service',
            {
                access_token: $cookieStore.get('obj').accesstoken,
                service_id: $scope.dele_val
            },
            function (data) {
                $window.location.reload();

            });

    };


    // Add SERVICE Dialog
    $scope.addServiceDialog = function () {
        $scope.value = true;
        $scope.content = '';
        $scope.addTeam = {};
        $scope.addService = {};
        $scope.addService.desc_title = 'b.';
        ngDialog.open({
            template: 'app/views/add-service-dialog.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    // Edit Driver Dialog
    $scope.editService = {};
    $scope.editServiceDialog = function (json) {

        $scope.options = [
            {
                name: MY_CONSTANT.CATEGORY1,
                value: 1
            },
            {
                name: MY_CONSTANT.CATEGORY2,
                value: 2
            },
            {
                name: MY_CONSTANT.CATEGORY3,
                value: 3
            },
            {
                name: MY_CONSTANT.CATEGORY4,
                value: 4
            }
            //},
            //{
            //    name: MY_CONSTANT.CATEGORY5,
            //    value: 5
            //},
            //{
            //    name: MY_CONSTANT.CATEGORY6,
            //    value: 6
            //},
            //{
            //    name: MY_CONSTANT.CATEGORY7,
            //    value: 7
            //},
            //{
            //    name: MY_CONSTANT.CATEGORY8,
            //    value: 8
            //},
            //{
            //    name: MY_CONSTANT.CATEGORY9,
            //    value: 9
            //}
        ];


        $scope.editService.id_pop = json.service_id;
        $scope.updateVal = json.category_val;
        $scope.editService.servicename = json.name;
        $scope.editService.desc_title = json.heading;
        $scope.editService.description = json.description;
        $scope.editService.cost = json.cost;
        $scope.editService.servicetime = json.time;
      //  $scope.content = json.instructions;

        $scope.value = true;
        $scope.addTeam = {};
        ngDialog.open({
            template: 'app/views/edit-service-dialog.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

});

App.controller('AddServiceController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $window) {
    'use strict';

    $scope.options = [
        {
            name: MY_CONSTANT.CATEGORY1,
            value: 1
        },
        {
            name: MY_CONSTANT.CATEGORY2,
            value: 2
        },
        {
            name: MY_CONSTANT.CATEGORY3,
            value: 3
        },
        {
            name: MY_CONSTANT.CATEGORY4,
            value: 4
        }
        //{
        //    name: MY_CONSTANT.CATEGORY5,
        //    value: 5
        //},
        //{
        //    name: MY_CONSTANT.CATEGORY6,
        //    value: 6
        //},
        //{
        //    name: MY_CONSTANT.CATEGORY7,
        //    value: 7
        //},
        //{
        //    name: MY_CONSTANT.CATEGORY8,
        //    value: 8
        //},
        //{
        //    name: MY_CONSTANT.CATEGORY9,
        //    value: 9
        //}
    ];

    $scope.successMsg = '';
    $scope.errorMsg = '';
    $scope.AddService = function () {

        $.post(MY_CONSTANT.url + '/add_new_service',
            {

                access_token: $cookieStore.get('obj').accesstoken,
                category: $scope.addService.category.value,
                service_name: $scope.addService.servicename,
                time: $scope.addService.servicetime,
                cost: $scope.addService.cost,
                //heading: $scope.addService.desc_title,
                description: $scope.addService.description
               // instructions: $scope.content
            }
            ,

            function (data) {
               // console.log(data);
                data = JSON.parse(data);

                if (data.log) {
                    $scope.successMsg = data.log;
                }
                else {
                    $scope.errorMsg = data.error;
                }
                $scope.$apply();
                if (data.log) {
                    $scope.closeThisDialog(0);
                    $window.location.reload();
                }

            });
    }
});

App.controller('EditServiceController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $window) {
    'use strict';

    $scope.successMsg = '';
    $scope.errorMsg = '';
    $scope.addService = {};
    $scope.EditService = function (val) {
        //console.log(val);
        $.post(MY_CONSTANT.url + '/edit_service',
            {

                access_token: $cookieStore.get('obj').accesstoken,
                service_id: $scope.editService.id_pop,
                category: val,
                service_name: $scope.editService.servicename,
                time: $scope.editService.servicetime,
                cost: $scope.editService.cost,
                //heading: $scope.editService.desc_title,
                description: $scope.editService.description
                //instructions: $scope.content
            }
            ,

            function (data) {
                console.log(data);
                data = JSON.parse(data);

                if (data.log) {
                    $scope.successMsg = data.log;
                    $scope.closeThisDialog(0);
                    $window.location.reload();
                }
                else {
                    $scope.errorMsg = data.error;
                }
                $scope.$apply();

            });
    }
});