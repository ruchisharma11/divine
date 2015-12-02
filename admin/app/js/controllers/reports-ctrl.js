App.controller('ReportsController', function ($scope, $http, $route, $cookieStore, $timeout, $location, MY_CONSTANT, convertdatetime, ngDialog) {
    $scope.add = {};
    $scope.add.report_type = "1";
    $scope.table_no = "1";




        $scope.getReport = function (table_no) {
            console.log(table_no);
            $scope.table_no = table_no;
            console.log($scope.table_no);
        };


    $scope.getReport1 = function () {


                if (!$scope.add.from_date) {
                    ngDialog.open({
                        template: '<p class="del-dialog">Please select start date first !!</p>',
                        plain: true,
                        className: 'ngdialog-theme-default'

                    });
                    return false;
                }
                else if (!$scope.add.to_date) {
                    ngDialog.open({
                        template: '<p class="del-dialog">Please select end date first !!</p>',
                        plain: true,
                        className: 'ngdialog-theme-default'

                    });
                    return false;
                }
                if ($scope.add.to_date < $scope.add.from_date) {
                    ngDialog.open({
                        template: '<p class="del-dialog">End date must be greater than start date !!</p>',
                        plain: true,
                        className: 'ngdialog-theme-default'

                    });
                    return false;
                }

                var from_date = convertdatetime.convertPromoDate($scope.add.from_date);
        console.log($scope.add.from_date);
        return false;
                var to_date = convertdatetime.convertPromoDate($scope.add.to_date);
                console.log("table_no");
                console.log(parseInt($scope.table_no));
                switch (parseInt($scope.table_no))
                {

                    case 1:
                        $.post(MY_CONSTANT.url + '/executive_summary',
                            {
                                access_token: $cookieStore.get('obj').accesstoken,
                                report_of: $scope.add.report_type,
                                from_date: from_date,
                                to_date: to_date
                            }
                            ,
                            function (data) {
                                var data1 = {};
                                var data2 = {};
                                data1 = data.staff_info;
                                //data2 =  data.total_nfo;
                                console.log(data2);
                                //return false;
                                var dataArray1 = [];
                                //var dataArray2 = [];
                                var dataArray3 = [];
                                //var list = data;
                                data1.forEach(function (column) {
                                    var d = {};

                                    d.Staff_Name = column.name;
                                    d.Total_Customer = column.total_customer;
                                    d.Total_New_Customers = column.total_new_customer;
                                    d.Total_Bookings = column.total_booked;
                                    //d.last_name = column.last_name;
                                    d.Service_Booked = column.service_booked;
                                    d.Total_Discount_Applied = column.total_discount;
                                    d.Total_Invoice = column.total_invoice;
                                    d.Total_Commission = column.total_commission;
                                    //d.technician_id = column.technician_id;
                                    dataArray1.push(d);
                                });


                                //data2.forEach(function (column) {
                                //    var d = {};
                                //
                                //    d.all_service_booked = column.all_service_booked;
                                //    d.all_total_booked = column.all_total_booked;
                                //    d.all_total_commission = column.all_total_commission;
                                //    d.all_total_customer = column.all_total_customer;
                                //    d.all_total_discount = column.all_total_discount;
                                //    d.all_total_invoice = column.all_total_invoice;
                                //    d.all_total_new_customer =column.all_total_new_customer;
                                //    dataArray2.push(d);
                                //
                                //});

                                //dataArray3=[dataArray1,dataArray2];
                                //var opts = [{sheetid:'One',header:true},{sheetid:'Two',header:false}];
                                //var res = alasql('SELECT INTO XLSX("executive_summary.xlsx",?) FROM ?',
                                //    [opts,[dataArray1,dataArray2]]);
                                $scope.excelList = dataArray1;
                                console.log ($scope.excelList);
                                var filename = 'executive_summary';
                                var my_filename = filename+'-'+from_date+'to'+to_date+'.xlsx' ;
                                var date = '' + from_date + ' to ' + to_date;
                                alasql('SELECT * INTO XLSX("' + my_filename + '",{headers:true}) FROM ?', [$scope.excelList]);
                            });
                        return true;

                    case 2:

                        $.post(MY_CONSTANT.url + '/customer_overview',
                            {
                                access_token: $cookieStore.get('obj').accesstoken,
                                report_of: $scope.add.report_type,
                                from_date: from_date,
                                to_date: to_date
                            }
                            ,
                            function (data) {

                                var data1 = {};
                                var data2 = {};
                                data1 = data.customer_info;
                                data2 =  data.total_nfo;

                                var dataArray1 = [];
                                var dataArray2 = [];
                                //var list = data;
                                data1.forEach(function (column) {
                                    var d = {};
                                    d.Ref = column.customer_id;
                                    d.Customer_Name = column.name;
                                    d.Email = column.email;
                                    d.Telephone = column.phone;
                                    d.Customer_Skin_Type = column.skin_type;
                                    d.Customer_Hair_Type = column.hair_type;
                                    d.Average_Rating = column.average_rating;
                                    d.Registration_Date = column.registration_date;
                                    d.First_Booking_Date = column.first_booking_date;
                                    d.Last_Booking_Date = column.last_booking_date;
                                    d.Last_Stylist_Booked = column.last_stylist_name;
                                    d.Total_Number_of_Bookings = column.total_number_of_booking;
                                    d.Number_of_Service = column.number_of_service;
                                    d.Booking_Value = column.booking_value;
                                    d.Total_Discounts_Given = column.total_discount;
                                    d.Total_Invoiced_Service_Value = column.total_invoice;

                                    dataArray1.push(d);
                                });

                                data2.forEach(function (column) {
                                    var d = {};
                                    d.Total_Number_of_Customers = column.total_number_of_customer;
                                    d.Total_Number_of_Service = column.total_number_of_service;
                                    d.Average_Service_per_Customer = column.average_service_per_customer;
                                    d.No_of_Customer_Who_Have_Had_More_Than_Two_Services = column.no_of_customer_who_have_more_than_one_service;

                                    dataArray2.push(d);
                                });

                                var filename = 'customer_overview';
                                var my_filename = filename+'-'+from_date+'to'+to_date+'.xlsx' ; 
                                var opts = [{sheetid:'One',header:true},{sheetid:'Two',header:false}];
                                var res = alasql('SELECT INTO XLSX("' + my_filename + '",?) FROM ?',
                                    [opts,[dataArray1,dataArray2]]);
                                //JSONToCSVConvertor(data, "Report", true);
                            });
                        return true;

                    case 3:

                        $.post(MY_CONSTANT.url + '/staff_summary',
                            {
                                access_token: $cookieStore.get('obj').accesstoken,
                                report_of: $scope.add.report_type,
                                from_date: from_date,
                                to_date: to_date
                            }
                            ,
                            function (data) {
                                var data1 = {};
                                var data2 = {};
                                data1 = data.customer_info;
                                data2 =  data.total_nfo;

                                var dataArray1 = [];
                                var dataArray2 = [];
                                //var list = data;
                                data1.forEach(function (column) {
                                    var d = {};
                                    d.Staff_Member = column.name;
                                    d.Skill = column.technician_skills;
                                    d.Total_Customer = column.total_customer;
                                    d.New_customer = column.total_new_customer;
                                    d.Forward_Availability_this_week = column.availability_of_this_week;
                                    d.Forward_Availability_next_week = column.availability_of_next_week;
                                    d.Historic_Availability = column.availability_of_history;
                                    d.Total_Bookings = column.total_booking_service;
                                    d.Total_Services_completed = column.total_completed_services;
                                    d.Upcoming_Services_current_week = column.this_week_up_coming_service;
                                    d.Upcoming_Services_next_week = column.next_week_up_coming_service;
                                    d.Number_of_Rejected_Services = column.total_rejected_services;
                                    d.Invoiced_Total = column.invoiced_to;
                                    d.Twelve_Week_Average_Ratings = column.average_rating_in_twelfth_week;
                                    d.Last_Rating = column.last_rating;
                                    d.Commission_Earned = column.commission_earned;

                                    dataArray1.push(d);
                                });
                                data2.forEach(function (column) {
                                    var d = {};
                                    d.Total_Forward_Availability_of_this_week = column.total_availability_of_this_week;
                                    d.Total_Forward_Availability_of_next_week = column.total_availability_of_next_week;
                                    d.Total_Upcoming_services_this_week = column.total_this_week_up_coming_service;
                                    d.Total_Upcoming_services_next_week = column.total_next_week_up_coming_service;

                                    dataArray2.push(d);
                                });

                                var filename = 'staff_summary';
                                var my_filename = filename+'-'+from_date+'to'+to_date+'.xlsx' ;
                                var opts = [{sheetid:'One',header:true},{sheetid:'Two',header:false}];
                                var res = alasql('SELECT INTO XLSX("' + my_filename + '",?) FROM ?',
                                    [opts,[dataArray1,dataArray2]]);
                            });
                        return true;


                    case 4:

                        $.post(MY_CONSTANT.url + '/staff_roster_overview',
                            {
                                access_token: $cookieStore.get('obj').accesstoken,
                                report_of: $scope.add.report_type,
                                from_date: from_date,
                                to_date: to_date
                            }
                            ,
                            function (data) {

                                var dataArray = [];
                                var list = data;
                                list.forEach(function (column) {
                                    var d = {};
                                    d.Staff_Member = column.name;
                                    d.Service_Type = column.technician_skills;
                                    d.Availability_Date = column.availability_date;
                                    d.Open_time = column.opening_time;
                                    d.Close_time = column.closing_time;
                                    d.Total_hours_available = column.total_hours_available;

                                    dataArray.push(d);
                                });
                                $scope.excelList = dataArray;
                                console.log ($scope.excelList);
                                 var filename = 'staff_roster';
                                var my_filename = filename+'-'+from_date+'to'+to_date+'.xlsx' ;
                                alasql('SELECT * INTO XLSX("' + my_filename + '",{headers:true}) FROM ?', [$scope.excelList]);

                                //JSONToCSVConvertor(data, "Report", true);
                            });
                        return true;
                    case 5 :
                        $.post(MY_CONSTANT.url + '/appointment_summary',
                            {
                                access_token: $cookieStore.get('obj').accesstoken,
                                report_of: $scope.add.report_type,
                                from_date: from_date,
                                to_date: to_date
                            }
                            ,
                            function (data) {

                                var dataArray = [];
                                var list = data;
                                list.forEach(function (column) {
                                    var d = {};
                                    d.Date_Created = column.created_at;
                                    d.Date_of_Booking = column.booking_date;
                                    d.Start_Time = column.start_time;
                                    d.End_Time = column.end_time;
                                    d.Status = column.status;
                                    d.Staff_Member = column.technician_name;
                                    d.Service_Booked = column.service_type;
                                    d.Customer = column.user_name;
                                    d.Location = column.address;
                                    d.Postcode = column.post_code;
                                    d.Email = column.user_email;
                                    d.Telephone = column.user_mobile;
                                    d.Invoiced_value = column.invoice_price;
                                    d.Service_Rating = column.service_rating;
                                    //d.booking_id = column.booking_id;
                                    //d.service_price = column.service_price;
                                    dataArray.push(d);
                                    //JSONToCSVConvertor(data, "Report", true);
                                });
                                $scope.excelList = dataArray;
                                console.log($scope.excelList);
                                 var filename = 'appointment_summary';
                                var my_filename = filename+'-'+from_date+'to'+to_date+'.xlsx' ;
                                alasql('SELECT * INTO XLSX("' + my_filename + '",{headers:true}) FROM ?', [$scope.excelList]);
                            });
                        return true;
                    case 6 :
                        $.post(MY_CONSTANT.url + '/canceled_appointment',
                            {
                                access_token: $cookieStore.get('obj').accesstoken,
                                report_of: $scope.add.report_type,
                                from_date: from_date,
                                to_date: to_date
                            }
                            ,
                            function (data) {
                                var dataArray = [];
                                var list = data;
                                list.forEach(function (column) {
                                    var d = {};
                                    d.Date_Created = column.created_at;
                                    d.Date_of_Booking = column.booking_date;
                                    d.Start_Time = column.start_time;
                                    d.End_Time = column.end_time;
                                    d.Date_Cancelled = column.canceled_date;
                                    d.Staff_Member = column.technician_name;
                                    d.Service_Booked = column.service_name;
                                    d.Payment = column.service_price;
                                    d.Location = column.address;
                                    d.Customer = column.user_name;
                                    d.Email = column.user_email;
                                    d.Telephone = column.user_mobile;
                                    dataArray.push(d);
                                    //JSONToCSVConvertor(data, "Report", true);
                                });
                                $scope.excelList = dataArray;
                                console.log($scope.excelList);
                                 var filename = 'cancelled_appointment_summary';
                                var my_filename = filename+'-'+from_date+'to'+to_date+'.xlsx' ;
                                alasql('SELECT * INTO XLSX("' + my_filename + '",{headers:true}) FROM ?', [$scope.excelList]);
                            });


                                //JSONToCSVConvertor(data, "Report", true);
                        return true;
                    case 7 :
                        $.post(MY_CONSTANT.url + '/service_details',
                            {
                                access_token: $cookieStore.get('obj').accesstoken,
                                report_of: $scope.add.report_type,
                                from_date: from_date,
                                to_date: to_date
                            }
                            ,
                                function (data) {
                                    var dataArray = [];
                                    var list = data;
                                    list.forEach(function (column) {
                                        var d = {};
                                        d.Service_Name = column.service_name;
                                        d.Number_booked = column.no_of_booking;
                                        d.Percentage_of_Total = column.percentage_of_booking;
                                        d.Booking_Value = column.booking_value;
                                        d.Discounts_Applied = column.discount_applied;
                                        d.Total_Invoiced_Amount = column.invoiced_amount;
                                        d.Average_Service_Value = column.average_service_value;
                                        dataArray.push(d);
                                        //JSONToCSVConvertor(data, "Report", true);
                                    });
                                    $scope.excelList = dataArray;
                                    console.log($scope.excelList);
                                     var filename = 'service_detail_summary';
                                var my_filename = filename+'-'+from_date+'to'+to_date+'.xlsx' ;
                                    alasql('SELECT * INTO XLSX("' + my_filename + '",{headers:true}) FROM ?', [$scope.excelList]);
                                });
                        return true;
                    case 8 :
                        $.post(MY_CONSTANT.url + '/promo_code_details',
                            {
                                access_token: $cookieStore.get('obj').accesstoken,
                                report_of: $scope.add.report_type,
                                from_date: from_date,
                                to_date: to_date
                            }
                            ,
                            function (data) {
                                var dataArray = [];
                                var list = data;
                                list.forEach(function (column) {
                                    var d = {};
                                    d.Customer_Name = column.customer_name;
                                    d.Coupon_Code = column.coupon_code;
                                    d.Coupon_Code_Status = column.coupon_code_status;
                                    d.Credits = column.credits;
                                    d.Date_Applied = column.applied_date;
                                    dataArray.push(d);
                                    //JSONToCSVConvertor(data, "Report", true);
                                });
                                $scope.excelList = dataArray;
                                console.log($scope.excelList);
                                 var filename = 'coupon_code_detail';
                                var my_filename = filename+'-'+from_date+'to'+to_date+'.xlsx' ;
                                alasql('SELECT * INTO XLSX("' + my_filename + '",{headers:true}) FROM ?', [$scope.excelList]);
                            });
                        return true;
                    case 9 :
                        $.post(MY_CONSTANT.url + '/refer_friend',
                            {
                                access_token: $cookieStore.get('obj').accesstoken,
                                report_of: $scope.add.report_type,
                                from_date: from_date,
                                to_date: to_date
                            }
                            ,
                            function (data) {
                                var dataArray = [];
                                var list = data;
                                list.forEach(function (column) {
                                    var d = {};
                                    d.Ref = column.refer_id;
                                    d.Customer_Name = column.customer_name;
                                    d.Credit_Earned = column.earned_value;

                                    dataArray.push(d);
                                    //JSONToCSVConvertor(data, "Report", true);
                                });
                                $scope.excelList = dataArray;
                                console.log($scope.excelList);
                                 var filename = 'refer_a_friend';
                                var my_filename = filename+'-'+from_date+'to'+to_date+'.xlsx' ;
                                alasql('SELECT * INTO XLSX("' + my_filename + '",{headers:true}) FROM ?', [$scope.excelList]);
                            });
                        return true;
                }

        };


    var JSONToCSVConvertor = function (JSONData, ReportTitle, ShowLabel) {
        //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
        var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
        //var arrData = JSON.parse(JSONData);
        //
        //{ arrData = arrData.data;}
       //arrData = arrData.data;

console.log("I am called");
        console.log(arrData[0]);
        /*for(var i=0;i<arrData.length;i++){
            console.log(arrData);
        }*/
        console.log(ShowLabel);
        var CSV = '';
        //Set Report title in first row or line

        CSV += ReportTitle + '\r\n\n';

        //This condition will generate the Label/Header
        if (ShowLabel) {
            var row = "";

            //This loop will extract the label from 1st index of on array
            for (var index in arrData[0]) {

                //Now convert each value to string and comma-seprated
                row += index + ',';
            }

            row = row.slice(0, -1);

            //append Label row with line break
            CSV += row + '\r\n';
        }

        //1st loop is to extract each row
        for (var i = 0; i < arrData.length; i++) {
            var row = "";

            //2nd loop will extract each column and convert it in string comma-seprated
            for (var index in arrData[i]) {
                row += '"' + arrData[i][index] + '",';
            }

            row.slice(0, row.length - 1);

            //add a line break after each row
            CSV += row + '\r\n';

        }

        if (CSV == '') {
            alert("Invalid data");
            return;
        }

        //Generate a file name
        var fileName = "BlowLtd_";
        //this will remove the blank-spaces from the title and replace it with an underscore
        fileName += ReportTitle.replace(/ /g, "_");

        //Initialize file format you want csv or xls
        var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

        // Now the little tricky part.
        // you can use either>> window.open(uri);
        // but this will not work in some browsers
        // or you will not get the correct file extension

        //this trick will generate a temp <a /> tag
        var link = document.createElement("a");
        link.href = uri;

        //set the visibility hidden so it will not effect on your web-layout
        link.style = "visibility:hidden";
        link.download = fileName + ".csv";

        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

});


