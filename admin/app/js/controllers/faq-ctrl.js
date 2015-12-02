App.controller('FAQController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $window, ngDialog) {
    'use strict';
    /* Update faq Content */
    $scope.addAboutContent = function () {
        $.post(MY_CONSTANT.url + '/update_faq', {
            access_token: $cookieStore.get('obj').accesstoken,
            faq_1: $scope.faq1,
            faq_2: $scope.faq2,
            faq_3: $scope.faq3
        }, function (data) {
            //data = JSON.parse(data);
            ////console.log(data);
            data = data.data;
            if (data.log) {
                ngDialog.open({
                    template: '<p>FAQ successfully updated !</p>',
                    className: 'ngdialog-theme-default',
                    plain: true,
                    showClose: false,
                    closeByDocument: true,
                    closeByEscape: true
                });
                setTimeout(function () {
                    ngDialog.closeAll();
                }, 1500);
            }

        });
    };

    /* Get Menu and Banner Content */
    $.post(MY_CONSTANT.url + '/show_faq', {
        access_token: $cookieStore.get('obj').accesstoken
    }, function (data) {
        data = JSON.parse(data);
        //console.log(data);
        $scope.$apply(function () {
            $scope.faq1 = data.faq[0].faq_1;
            $scope.faq2 = data.faq[0].faq_2;
            $scope.faq3 = data.faq[0].faq_3;
        });

    });
});