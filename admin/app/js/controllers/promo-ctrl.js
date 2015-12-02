App.controller('ActivePromoController', function ($scope, $http, $route, $cookieStore, $timeout, $location, MY_CONSTANT, convertdatetime, $window, ngDialog) {

    var getPromo = function () {
        $.post(MY_CONSTANT.url + '/promotion_code_list', {
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
            data = data.active_codes;
            data.forEach(function (column) {

                var d = {
                    code_id: "",
                    user_id: "",
                    promo_code: "",
                    number_issued: "",
                    credits: "",
                    create_date: "",
                    start_date: "",
                    expiry_date: "",
                    number_redeemed: "",
                    redemption_value: ""
                };

                d.user_id = column.user_id;
                d.code_id = column.code_id;
                d.promo_code = column.code;
                d.number_issued = column.number_issued;
                d.credits = column.credits;
                var create_date = column.created_time.toString().split("T")[0];
                d.create_date = create_date;
                var start_date = column.start_date.toString().split("T")[0];
                d.start_date = start_date;
                var expiry_date = column.expiry_date.toString().split("T")[0];
                d.expiry_date = expiry_date;
                dataArray.push(d);
                d.number_issued= column.number_issued;
                d.number_redeemed= column.number_redeemed;
                d.redemption_value=column.redemption_value;

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

    getPromo();

    $scope.promo = {};
    $scope.checkDate = function () {
        if ($scope.promo.end_date < $scope.promo.start_date) {
            ngDialog.open({
                template: '<p class="del-dialog">End date must be greater than start date !!</p>',
                plain: true,
                className: 'ngdialog-theme-default'

            });
            return false;
        }
    }

    $scope.addPromo = function () {

        if ($scope.promo.promo_code == undefined) {
            ngDialog.open({
                template: '<p class="del-dialog">Please fill the promo code !!</p>',
                plain: true,
                className: 'ngdialog-theme-default'

            });
            return false;

        }
        else if ($scope.promo.number_issued == undefined) {
            ngDialog.open({
                template: '<p class="del-dialog">Please fill number of codes to be issued !!</p>',
                plain: true,
                className: 'ngdialog-theme-default'

            });
            return false;
        }


        else if ($scope.promo.start_date == undefined) {
            ngDialog.open({
                template: '<p class="del-dialog">Please select start date !!</p>',
                plain: true,
                className: 'ngdialog-theme-default'

            });
            return false;
        }
        else if ($scope.promo.end_date == undefined) {
            ngDialog.open({
                template: '<p class="del-dialog">Please select end date !!</p>',
                plain: true,
                className: 'ngdialog-theme-default'

            });
            return false;
        }


        if ($scope.promo.end_date < $scope.promo.start_date) {
            ngDialog.open({
                template: '<p class="del-dialog">End date must be greater than start date !!</p>',
                plain: true,
                className: 'ngdialog-theme-default'

            });
            return false;
        }
        else if ($scope.promo.credits == undefined) {
            ngDialog.open({
                template: '<p class="del-dialog">Please fill the credits !!</p>',
                plain: true,
                className: 'ngdialog-theme-default'

            });
            return false;
        }


        var start_date = convertdatetime.convertPromoDate($scope.promo.start_date);
        var to_date = convertdatetime.convertPromoDate($scope.promo.end_date);

        $.post(MY_CONSTANT.url + '/promotion_codes',
            {
                access_token: $cookieStore.get('obj').accesstoken,
                promo_code:$scope.promo.promo_code,
                credits: $scope.promo.credits,
                number_issued: $scope.promo.number_issued,
                start_date: start_date,
                expiry_date: to_date
            },
            function (data) {

                data = JSON.parse(data);
                console.log(data);
                if (data.log) {
                    $window.location.reload();
                }
                else {
                    ngDialog.open({
                        template: '<p class="del-dialog">' + data.error + '</p>',
                        plain: true,
                        className: 'ngdialog-theme-default'

                    });
                }
            });


    };

    // Delete Dialog
    $scope.deletePromo = function (userid) {
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

        $.post(MY_CONSTANT.url + '/delete_promotion_code',
            {
                access_token: $cookieStore.get('obj').accesstoken,
                code_id: $scope.dele_val
            },
            function (data) {
                $window.location.reload();

            });

    };

});

App.controller('ExpiredPromoController', function ($scope, $http, $route, $cookieStore, $timeout, $location, MY_CONSTANT, $window, ngDialog) {
    var getPromo = function () {
        $.post(MY_CONSTANT.url + '/promotion_code_list', {
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
            data = data.expired_codes;
            data.forEach(function (column) {

                var d = {
                    code_id: "",
                    user_id: "",
                    code: "",
                    credits: "",
                    create_date: "",
                    number_issued: "",
                    start_date: "",
                    expiry_date: "",
                    number_redeemed: "",
                    redemption_value: ""
                };

                d.user_id = column.user_id;
                d.code_id = column.code_id;
                d.code = column.code;
                d.credits = column.credits;
                d.number_redeemed = column.number_redeemed;
                d.redemption_value = column.redemption_value;
                var create_date = column.created_time.toString().split("T")[0];
                d.create_date = create_date;
                d.number_issued = column.number_issued;
                var start_date = column.start_date.toString().split("T")[0];
                d.start_date = start_date;
                var expiry_date = column.expiry_date.toString().split("T")[0];
                d.expiry_date = expiry_date;
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

    getPromo();

    // Delete Dialog
    $scope.deletePromo = function (userid) {
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

        $.post(MY_CONSTANT.url + '/delete_promotion_code',
            {
                access_token: $cookieStore.get('obj').accesstoken,
                code_id: $scope.dele_val
            },
            function (data) {
                $window.location.reload();

            });

    };

});

App.controller('SharedPromoController', function ($scope, $http, $route, $cookieStore, $timeout, $location, MY_CONSTANT, $window, ngDialog) {
    var getPromo = function () {
        $.post(MY_CONSTANT.url + '/referral_codes', {
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
            data = data.referral_codes;
            data.forEach(function (column) {

                var d = {
                    referral_code: "",

                    referred_user:"",
                    referring_user: "",
                    applied_at: ""
                };

                d.referral_code = column.referral_code;
                d.referred_user = column.referred_user;
                d.referring_user = column.referring_user;
                var create_date = column.applied_at.toString().split("T")[0];
                d.applied_at = create_date;
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

    getPromo();

    // Delete Dialog
    $scope.deletePromo = function (userid) {
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

        $.post(MY_CONSTANT.url + '/delete_promotion_code',
            {
                access_token: $cookieStore.get('obj').accesstoken,
                code_id: $scope.dele_val
            },
            function (data) {
                $window.location.reload();

            });

    };

});

App.controller('ItemController', ['$scope', function ($scope) {

    $scope.$parent.isopen = ($scope.$parent.default === $scope.item);

    $scope.$watch('isopen', function (newvalue, oldvalue, scope) {
        $scope.$parent.isopen = newvalue;
    });

}]);
