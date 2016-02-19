App.controller('LoginController', function ($scope, $http, $cookies, $cookieStore, MY_CONSTANT, $state) {
    //initially set those objects to null to avoid undefined error
    // place the message if something goes wrong
    $scope.account = {};
    $scope.authMsg = '';

    $scope.loginAdmin = function () {
        $scope.authMsg = '';

        $http
        ({
            url: MY_CONSTANT.url + '/api/admin/logIn',
            method: "POST",
            data: {
                "password": $scope.account.password,
                "email": $scope.account.email
            }
        }).success(function (response) {
            var someSessionObj = response.data.accessToken;
            console.log(response);
            $cookieStore.put('obj',response.data.accessToken);
           $cookieStore.put('obj1',response.data.adminId);
            console.log('accessToken:', someSessionObj);
            $state.go('app.dashboard-new');
        }).error(function (data) {
            {
                console.log(data);
                $scope.loading = false;
                $scope.authMsg = response.data.details.message;
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

