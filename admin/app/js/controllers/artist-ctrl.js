App.controller('NewRequestedController', function ($scope,ngDialog, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $window,$state) {
    'use strict';
$scope.addService={};
    $scope.options = '';
    $scope.successMsg = '';
    $scope.errorMsg = '';
    $scope.formats = ['yyyy-MM-dd', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[2];
    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.minDate=new Date();

        $scope.opened = true;
    };
    $scope.AddService = function ()
    {
        $scope.addService.licenseExpiryDate = $scope.changeDateFormat($scope.addService.licenseExpiryDate);
        console.log($scope.addService.licenseExpiryDate);
    $scope.new_requested = {
        "adminId": $cookieStore.get('obj1'),
        "accessToken":$cookieStore.get('obj'),
        "firstName": $scope.addService.firstName,
        "lastName":$scope.addService.lastName,
        "email": $scope.addService.email,
        "phoneNumber": $scope.addService.phoneNumber,
        "isValet": true,
        "isDesignatedDriver": false,
        "isChauffeur": false,
        "address": $scope.addService.address,
        "licenseNo":$scope.addService.licenseNumber,
        "licenseExpiryDate": $scope.addService.licenseExpiryDate
    };




            $scope.add="";
            $scope.add=$scope.new_requested;
            console.log($scope.add);

        if($scope.add.firstName==undefined)
            {
                ngDialog.open({
                    template: '<p class="del-dialog">Please Enter First Name</p>',
                    plain: true,
                    className: 'ngdialog-theme-default'
                });
                return false;
            }
            if($scope.add.lastName==undefined)
            {
                ngDialog.open({
                    template: '<p class="del-dialog">Please Enter Last Name</p>',
                    plain: true,
                    className: 'ngdialog-theme-default'
                });
                return false;
            }
        if($scope.add.email==undefined)
        {
            ngDialog.open({
                template: '<p class="del-dialog">Please Enter Email </p>',
                plain: true,
                className: 'ngdialog-theme-default'
            });
            return false;
        }
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if (!filter.test($scope.add.email)) {
            ngDialog.open({
                template: '<p class="del-dialog">Please Enter Valid Email </p>',
                plain: true,
                className: 'ngdialog-theme-default'
            });
          //  email.focus;
            return false;
        }
        // if($scope.add.email!=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
        //{
        //    ngDialog.open({
        //        template: '<p class="del-dialog">Please Enter Valid Email </p>',
        //        plain: true,
        //        className: 'ngdialog-theme-default'
        //    });
        //    return false;
        //}


        if($scope.add.phoneNumber==undefined)
        {
            ngDialog.open({
                template: '<p class="del-dialog">Enter Phone No.</p>',
                plain: true,
                className: 'ngdialog-theme-default'
            });
            return false;
        }

        var filter1=/(^[0-9]+[-]*[0-9]+[-]*[0-9]+$)/;
        if(!filter1.test($scope.add.phoneNumber)){
            ngDialog.open({
                template: '<p class="del-dialog">Please Enter Phone No in (123-456-7890) Format</p>',
                plain: true,
                className: 'ngdialog-theme-default'
            });
            return false;
        }

        if($scope.addService.licenseNumber==undefined)
        {
            ngDialog.open({
                template: '<p class="del-dialog">Enter License No.</p>',
                plain: true,
                className: 'ngdialog-theme-default'
            });
            return false;
        }
        if($scope.addService.address==undefined)
        {
            ngDialog.open({
                template: '<p class="del-dialog">Enter Address</p>',
                plain: true,
                className: 'ngdialog-theme-default'
            });
            return false;
        }
        if($scope.addService.licenseExpiryDate==undefined)
        {
            ngDialog.open({
                template: '<p class="del-dialog">Enter License Expiry Date</p>',
                plain: true,
                className: 'ngdialog-theme-default'
            });
            return false;
        }
            //if(isNaN($scope.add.licenseExpiryDate))
            //{
            //    console.log('string');
            //    ngDialog.open({
            //        template: '<p class="del-dialog">enter valid license expiry date</p>',
            //        plain: true,
            //        className: 'ngdialog-theme-default'
            //    });
            //    return false;
            //}

        $http({
            url: MY_CONSTANT.url + '/api/admin/registerServiceProvider',
            method: "POST",
            data: $scope.add
        }).success(function (data) {
            // console.log(data);
            //data = JSON.parse(data);
window.alert(" Successfully Updated");
            console.log("done");
            //$scope.$apply()
            $state.reload();
        }).error(function (data,statusCode)
        {
            if (statusCode==409  )
            {alert( "Email Already Exists ")}
            if (statusCode==400  )
            {alert( "PhoneNumber Already Exists ")}
            console.log(data);
        })

    };
    $scope.changeDateFormat = function(date){
        if(date) {
            var date = new Date(date);
            var date_appointment = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
            return date_appointment;
        }

    }
    $scope.reset_fields = function() {
        console.log('remove');
        //$scope.add.firstName = undefined;
        $scope.addService.firstName = $scope.addService.lastName = $scope.addService.email = $scope.addService.phoneNumber =" ";
        $scope.addService.licenseNumber = $scope.addService.address = $scope.addService.licenseExpiryDate = " ";
    };
});


