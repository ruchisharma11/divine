App.controller('SchedulerController', ['$scope', '$http', 'MY_CONSTANT', '$cookieStore', function ($scope, $http, MY_CONSTANT, $cookieStore) {

    var dateToday = new Date();
    var date_appointmentToday = dateToday.getFullYear() + '/' + (dateToday.getMonth() + 1) + '/' + dateToday.getDate();
    $scope.schedule_date = date_appointmentToday;
    $scope.loadSchedules = function () {
        var date = new Date($scope.schedule_date);
        var date_appointment = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
        $.post(MY_CONSTANT.url + '/technicians_schedule', {
            access_token: $cookieStore.get('obj').accesstoken,
            schedule_date: date_appointment
        }, function (res) {
            $scope.schedules = res;
            $scope.$apply();
        });
    }

    $scope.$watch('schedule_date', function (oldVal, newVal) {
        if (oldVal != newVal) {
            $scope.loadSchedules();
        }
    }, true);


    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.initDate = new Date('2016-15-20');
    $scope.formats = ['yyyy-MM-dd', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[2];
    $scope.loadSchedules();
}]);


App.filter('showColor', function ($filter) {
    return function (status, appointmentInfo, time) {
        var returnedData;
        if(appointmentInfo.length==0){
            if (status == 1) {
                returnedData = '<div class="availableUser"></div>';
            }
            else {
                returnedData = '<div class="notAvailableUser"></div>';
            }
        }
        for (var i = 0; i < appointmentInfo.length; i++) {
            if (appointmentInfo[i].time == time) {
                if (status == 1) {
                    return '<div class="availableUserData">' + appointmentInfo[i].user_name + ', ' + appointmentInfo[i].service_name + '</div>';
                }
                else {
                    returnedData = '<div class="notAvailableUser"></div>';
                }
            }
            else {
                if (status == 1) {
                    returnedData = '<div class="availableUser"></div>';
                }
                else {
                    returnedData = '<div class="notAvailableUser"></div>';
                }
            }
        }
        return returnedData;
    }
})