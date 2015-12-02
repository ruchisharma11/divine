App.controller('LoginController', function ($scope, $http, $cookies, $cookieStore, MY_CONSTANT, $state) {
    //initially set those objects to null to avoid undefined error
    // place the message if something goes wrong
    $scope.account = {};
    $scope.authMsg = '';

    $scope.loginAdmin = function () {
        $scope.authMsg = '';
        $.post(MY_CONSTANT.url + '/api/admin/logIn',
            {
                "password": $scope.account.password,
                "email": $scope.account.email,

            }).then(
            function (data) {

                if (data.error) {
                    $scope.authMsg = data.error;
                    $scope.$apply();
                } else {

                    $cookieStore.put('obj',data.data.accessToken);
                    $cookieStore.put('obj1',data.data.adminId);
                    $state.go('app.dashboard-new');
                }
            });
    };

    $scope.recover = function () {

        $.post(MY_CONSTANT.url + '/forgot_password',
            {
                email: $scope.account.email
            }).then(
            function (data) {
                data = JSON.parse(data);
                if (data.status == 200) {
                    $scope.successMsg = data.message.toString();
                } else {
                    $scope.errorMsg = data.message.toString();

                }
                $scope.$apply();
            })
    };

    $scope.logout = function () {
        $cookieStore.remove('obj');
        $state.go('page.login');
    }
});

