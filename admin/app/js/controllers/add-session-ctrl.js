App.controller('Step1Controller', function ($scope, $rootScope, $cookies, $cookieStore, MY_CONSTANT) {

    $scope.addStep1 = {};
    //$scope.addStep1.first_name="Mannu";
    $scope.register = function () {
        $.post(MY_CONSTANT.url + '/register_customer',
            {
                access_token: $cookieStore.get('obj').accesstoken,
                first_name: $scope.addStep1.first_name,
                last_name: $scope.addStep1.last_name,
                email: $scope.addStep1.email,
                mobile: $scope.addStep1.mobile
                //gender: $scope.addStep1.gender
            }, function (data) {
                data = JSON.parse(data);
                console.log(data);
                $rootScope.user_id = data.user_id;
                $rootScope.email = $scope.addStep1.email;
                $rootScope.cards = data.cards;
                $scope.step = 1;
                console.log($scope.addStep1.mobile);
                $scope.$apply();
            });
    };
});


//$scope.checkInput = function () {
//
//    if ($scope.addStep1.email == undefined) {
//        ngDialog.open({
//            template: '<p class="del-dialog">Please fill the E Mail ID !!</p>',
//            plain: true,
//            className: 'ngdialog-theme-default'
//
//        });
//        return false;
//
//    }
//    else if ($scope.addStep1.first_name == undefined) {
//        ngDialog.open({
//            template: '<p class="del-dialog">Please fill the first name !!</p>',
//            plain: true,
//            className: 'ngdialog-theme-default'
//
//        });
//        return false;
//    }
//
//
//    else if ($scope.addStep1.last_name == undefined) {
//        ngDialog.open({
//            template: '<p class="del-dialog">Please select last name !!</p>',
//            plain: true,
//            className: 'ngdialog-theme-default'
//
//        });
//        return false;
//    }
//    else if ($scope.addStep1.mobile == undefined) {
//        ngDialog.open({
//            template: '<p class="del-dialog">Please select mobile number !!</p>',
//            plain: true,
//            className: 'ngdialog-theme-default'
//
//        });
//        return false;
//    }
//
//
//    }
App.controller('Step2Controller', function ($scope, $rootScope, $cookies, $cookieStore, MY_CONSTANT, ngDialog) {

    $scope.card_used = {};
    $scope.is_card_selected = false;
    
    $scope.$watch('card_used.card_select', function(value) {
        if(value) {
            $scope.is_card_selected = true;
        }
    });
    
    $scope.reset_card = function() {
        $scope.card_used.card_select = false;
        $scope.is_card_selected = false;
        $scope.$apply;
    };
    $scope.checkCard = function () {
        if (!$scope.number) {

            if ($scope.card_used.card_select) {
                var card_detail = JSON.parse($scope.card_used.card_select);
                $rootScope.card_id = card_detail.card_id;
                $scope.steps.step3 = true;
            } else {
                ngDialog.open({
                    template: '<p>No card found !</p>',
                    className: 'ngdialog-theme-default',
                    plain: true,
                    showClose: true,
                    closeByDocument: true,
                    closeByEscape: true
                });
            }
        } else {

        }

    };

    $scope.stripeCallback = function (code, result)

    {
        console.log(result);
        if (result.error) {
            ngDialog.open({
                template: '<p>Sorry we could not add your card ! Please re-enter your card details !! </p>',
                className: 'ngdialog-theme-default',
                plain: true,
                showClose: true,
                closeByDocument: true,
                closeByEscape: true
            });
        } else {

            $.post(MY_CONSTANT.url + '/add_credit_card',
                {
                    access_token: $cookieStore.get('obj').accesstoken,
                    email: $rootScope.email,
                    stripe_token: result.id,
                    card_type: $scope.card_type
                }, function (data) {
                    data = JSON.parse(data);
                    console.log(data);
                    if (data.error) {
                        ngDialog.open({
                            template: '<p>' + data.error + '</p>',
                            className: 'ngdialog-theme-default',
                            plain: true,
                            showClose: true,
                            closeByDocument: true,
                            closeByEscape: true
                        });
                    } else {
                        console.log(" IN STRIPE FUNCTION_ ");
                        $rootScope.card_id = data.card_id;
                        $scope.steps.step3 = true;
                        $rootScope.card_id = data.card_id;
                        ngDialog.open({
                            template: '<p>Card added successfully !</p>',
                            className: 'ngdialog-theme-default',
                            plain: true,
                            showClose: true,
                            closeByDocument: true,
                            closeByEscape: true
                        });
                        $scope.steps.step3=true;
                    }
                });
        }
    };
});

App.controller('Step3Controller', function ($scope, $rootScope, $http, $cookies, $cookieStore, MY_CONSTANT, getCategories, convertdatetime, ngDialog, $timeout, $window) {

    $scope.addStep3 = {};

    var start = new Date();

    var min = start.getMinutes();
    if(min < 29){
        start.setMinutes(30);
        start = new Date(start);
    }
    else if(min > 30 && min < 60){
        start.setMinutes(60);
        start = new Date(start);
    }

    start.setHours(start.getHours() + 2);
    start = new Date(start);


    jQuery('#datetimepicker').datetimepicker({
        step: 30,
        startDate: start
    });


    $scope.options = [];

    Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

    var getServiceList = function () {

        $http({
            method: 'POST',
            url: MY_CONSTANT.url + "/services",
            data: "access_token=" + $cookieStore.get('obj').accesstoken,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
            .success(function (response) {
                console.log(response);
                Object.size = function(obj) {
                    var size = 0, key;
                    for (key in obj) {
                        if (obj.hasOwnProperty(key)) size++;
                    }
                    return size;
                };

// Get the size of an object
                var size = Object.size(response);
                var dataArray =[];
                console.log(size);
                var e = {}
             //   console.log()
                var servicedTypeArray=[];
                var servicedArray=[];
                for(var i = 1;i<=size;i++){
                    switch(i){
                     case 1:
                     e.name = 'BLOW DRY'
                     break;
                     case 2:
                     e.name = 'MAKE UP'
                     break;
                     case 3:
                     e.name = 'MANICURE'
                     break;
                     case 4:
                     e.name = 'ALL'
                     break;

                     }
                    servicedArray.push({"id": i,"name":e.name})
                    for(var j=0;j<response[i].length;j++){
                        servicedTypeArray.push({
                            "id":response[i][j].service_id,
                            "name":response[i][j].name,
                            "service_id":i,
                            "cost": response[i][j].cost,
                            "time": response[i][j].time,
                            "category": response[i][j].category
                        })

                    }
                    /*var st="'"+i+1+"'"
                    e.category =  (i+1);
                    console.log("e.category");
                    console.log(e.category);*/



                }
                $scope.getSubArray = function(id){
                    var sendArray=[];
                    for(var i=0;i<servicedTypeArray.length;i++){
                        if(id==servicedTypeArray[i].service_id){
                            sendArray.push({
                                "service_id":servicedTypeArray[i].id,
                                "name":servicedTypeArray[i].name,
                                "category":servicedTypeArray[i].category,
                                "time":servicedTypeArray[i].time,
                                "cost":servicedTypeArray[i].cost
                            })

                        }
                    }
                    $scope.serviceCategory=sendArray;
                    console.log(sendArray);
                }

                console.log("dataArray");
                console.log(servicedTypeArray);
                $scope.options = servicedArray;


                //console.log(response['1'][0]);
                //var dataArray = [];
                //if (response.error) {
                //    ngDialog.open({
                //        template: '<p>Something went wrong !</p>',
                //        className: 'ngdialog-theme-default',
                //        plain: true,
                //        showClose: false,
                //        closeByDocument: false,
                //        closeByEscape: false
                //    });
                //    return false;
                //}
                //var d = {};
                //response.forEach(function (column) {
                //    d.id = column.service_id;
                //    d.name = column.name;
                //    d.category = column.category;
                //    d.time = column.time;
                //    d.cost = column.cost;
                //    dataArray.push(d);
                //
                //});
                //
                //$scope.options = dataArray;
            });
    };
    getServiceList();

    var idArr = [];
    var timeArr = [];
    var costArr = [];
    var categoryArr = [];
 //var varia1= $scope.addStep3.service_type;

    $scope.service_type1 = function (val) {
        console.log(val)

        varia1= {};
        varia1 = val;
        var serviceParse = JSON.parse(varia1);
        $scope.cost1 = serviceParse.cost;
        $scope.time1= serviceParse.time;
    }


    $scope.booking = function () {

        console.log($scope.addStep3.service_type);
        console.log("$scope.addStep3.service_list");
        console.log($scope.addStep3.service_list);

        var booking_date = convertdatetime.convertCalendarDate($scope.addStep3.booking_date);

        var Services = $scope.addStep3.service_type;

        console.log("fhgfhfghfghf");
        console.log(Services);

        var serviceParse = JSON.parse(Services);
        $scope.id_final = serviceParse.service_id;
        $scope.time_final = serviceParse.time;
        $scope.cost_final = serviceParse.cost;
        $scope.category_final = serviceParse.category;
        $scope.addStep3.city = "London";
        //alert( "Time:  " +$scope.time_final + "   " + "Cost:   " +$scope.cost_final );
        console.log(serviceParse.time);
        console.log("timecost ");
        console.log(serviceParse.cost);

        var mydata = {
            access_token: $cookieStore.get('obj').accesstoken,
            email: $rootScope.email,
            user_id: $rootScope.user_id,
            service_id: $scope.id_final,
            card_id: $rootScope.card_id,
            booking_date: booking_date,
            house_no: $scope.addStep3.house_no,
            address: $scope.addStep3.address,
            city: $scope.addStep3.city,
            postcode: $scope.addStep3.post_code,
            offset: convertdatetime.localOffset(),
            service_price: $scope.cost_final,
            service_type: $scope.category_final,
            service_time: $scope.time_final,
            promo_code: $scope.addStep3.promoCode,
            instructions: $scope.addStep3.instructions
            
        };
        console.log("mydata");
        console.log(mydata);


        $.post(MY_CONSTANT.url + '/normal_booking',
            {
                access_token: $cookieStore.get('obj').accesstoken,
                email: $rootScope.email,
                user_id: $rootScope.user_id,
                service_id: $scope.id_final,
                card_id: $rootScope.card_id,
                booking_date: booking_date,
                house_no: $scope.addStep3.house_no,
                address: $scope.addStep3.address,
                city: $scope.addStep3.city,
                postcode: $scope.addStep3.post_code,
                offset: convertdatetime.localOffset(),
                service_price: $scope.cost_final,
                service_type: $scope.category_final,
                service_time: $scope.time_final,
                promo_code: $scope.addStep3.promoCode,
                instructions: $scope.addStep3.instructions
                

            }, function (data) {
                console.log(data);
                console.log('user_access_token');
                //return false;
                //data = JSON.parse(data);
                if (!data.error) {
                    $scope.steps.percent = 100;
                    ngDialog.open({
                        template: '<p>Booking created successfully !</p>',
                        className: 'ngdialog-theme-default',
                        plain: true,
                        showClose: true,
                        closeByDocument: true,
                        closeByEscape: true
                    });
                    $timeout($window.location.reload(), 2500);

                } else {
                    ngDialog.open({
                        template: '<p>' + data.error + '</p>',
                        className: 'ngdialog-theme-default',
                        plain: true,
                        showClose: true,
                        closeByDocument: true,
                        closeByEscape: true
                    });
                }
            });
    };
});