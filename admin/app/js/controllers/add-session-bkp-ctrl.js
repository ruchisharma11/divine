App.controller('Step1Controller', function ($scope, $rootScope, $cookies, $cookieStore, MY_CONSTANT) {

    $scope.addStep1 = {};
    $scope.register = function () {
        alert("Finally 1st Step completed !");
        //console.log($scope.addStep1);

        $.post(MY_CONSTANT.url + '/register_customer',
            {
                access_token: $cookieStore.get('obj').accesstoken,
                first_name: $scope.addStep1.first_name,
                last_name: $scope.addStep1.last_name,
                email: $scope.addStep1.email,
                mobile: $scope.addStep1.mobile,
                gender: $scope.addStep1.gender
            }, function (data) {
                data = JSON.parse(data);
                ////console.log(data);
                $rootScope.cards = data.cards;
                $scope.step = 1;
                $scope.$apply();
            });
    };
});

App.controller('Step2Controller', function ($scope, $rootScope, $cookies, $cookieStore, MY_CONSTANT) {

    //console.log($rootScope.cards);

    //$scope.payment = function () {
    //    alert("Finally 2nd Step completed !");
    //};
    $scope.account = {};
    $scope.stripeCallback = function (code, result) {
        //console.log("In Stripe Callback !");
        //console.log($scope.account);
        if (result.error) {
            window.alert('it failed! error: ' + result.error.message);
        } else {
            window.alert('success! token: ' + result.id);
        }
    };
});

App.controller('Step3Controller', function ($scope, $rootScope, $cookies, $cookieStore, MY_CONSTANT) {

    $scope.booking = function () {
        alert("Finally 3rd Step completed !");
    };
});