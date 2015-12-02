App.controller('LooksController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $route, ngDialog, $window, getCategories) {
    'use strict';
    $scope.loading = true;

    var getLooksList = function () {
        $.post(MY_CONSTANT.url + '/looks', {
            access_token: $cookieStore.get('obj').accesstoken

        }, function (data) {
            var dataArray = [];
            data = JSON.parse(data);
            console.log(data);
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

                var d = {};

                //var category = getCategories.service_category(column.category);
                d.service_id = column.service_id;
                d.look_id=column.look_id;
                //d.category = category;
                d.service_name = column.service_name;
                d.image = column.image;
                d.image_android = column.image_android;
                d.look_name = column.look_name;
                d.active_status = column.active_status;
                //d.heading = column.heading;
                //d.description = column.description;
                //d.instructions = column.instructions;
                d.duration = column.duration;
                d.price = column.price;
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

    getLooksList();

    // Delete Dialog
    $scope.deleteLooks = function (userid) {
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

        $.post(MY_CONSTANT.url + '/delete_look',
            {
                access_token: $cookieStore.get('obj').accesstoken,
                service_id: $scope.dele_val
            },
            function (data) {
                $window.location.reload();

            });

    };


$scope.changeStatus = function (status, look_id) {
        $scope.look_id = look_id;
        if (status == 0) {
            $scope.stat = "lock";
            $scope.stat_btn = "Lock";
            $scope.active_status = 0;
        }
        else {
            $scope.stat = "unblock";
            $scope.stat_btn = "Unblock";
            $scope.active_status = 1;
        }
        $scope.value = true;
        $scope.addTeam = {};
        ngDialog.open({
            template: 'app/views/status-dialog.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    $scope.change = function () {

        $.post(MY_CONSTANT.url + '/block_unblock_looks',
            {


                access_token: $cookieStore.get('obj').accesstoken,
                look_id: $scope.look_id,
                active_status: $scope.active_status
            },
            function (data) {
                //console.log(data);
                $window.location.reload();

            });
    };

    // Add Driver Dialog
    $scope.addLooksDialog = function () {
        $scope.value = true;
        $scope.content = '';
        $scope.addTeam = {};
        $scope.addLooks = {};
        $scope.addLooks.desc_title = 'b.';
        ngDialog.open({
            template: 'app/views/add-looks-dialog.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    // Edit Driver Dialog
    $scope.editLooks = {};
    $scope.editLooksDialog = function (json) {

        $scope.options = [
            //{
            //    name: MY_CONSTANT.CATEGORY1,
            //    value: 1
            //},
            //{
            //    name: MY_CONSTANT.CATEGORY2,
            //    value: 2
            //},
            //{
            //    name: MY_CONSTANT.CATEGORY3,
            //    value: 3
            //},
            //{
            //    name: MY_CONSTANT.CATEGORY4,
            //    value: 4
            //},
            {
                name: MY_CONSTANT.CATEGORY5,
                value: 5
            },
            {
                name: MY_CONSTANT.CATEGORY6,
                value: 6
            },
            {
                name: MY_CONSTANT.CATEGORY7,
                value: 7
            },
            {
                name: MY_CONSTANT.CATEGORY8,
                value: 8
            },
            {
                name: MY_CONSTANT.CATEGORY9,
                value: 9
            }
        ];

        console.log(json);
        //return false;
        $scope.editLooks.id_pop = json.service_id;
        $scope.updateVal = $scope.editLooks.id_pop;
        $scope.editLooks.service_name = json.service_name;
        $scope.editLooks.look_name = json.look_name;
        $scope.editLooks.look_id = json.look_id;
        $scope.editLooks.image_android = json.image_android;
        $scope.editLooks.image = json.image;

        //$scope.editService.desc_title = json.heading;
        //$scope.editService.description = json.description;
        $scope.editLooks.price = json.price;
        $scope.editLooks.serviceduration = json.duration;
       // $scope.content = json.instructions;

        $scope.value = true;
        $scope.addTeam = {};
        ngDialog.open({
            template: 'app/views/edit-looks-dialog.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

});

//App.controller('AddLooksController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $window) {
    App.controller('AddLooksController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $window) {
        'use strict';


        /*======================================================================
         *==================function to upload image =======================
         =====================================================================*/
        $scope.file_to_upload = function (files,flag) {
            console.log(files);
            if(flag==0){
                $scope.androidImg = files[0];
                var file = files[0];
                var img = document.getElementById("androidimg");
                img.file = file;
                var reader = new FileReader();
                reader.onload = (function (aImg) {
                    return function (e) {
                        aImg.src = e.target.result;
                    };
                })(img);
                reader.readAsDataURL(file);

            }
            else{
                $scope.iosImg = files[0];
                var file = files[0];
                var img = document.getElementById("iosimg");
                img.file = file;
                var reader = new FileReader();
                reader.onload = (function (aImg) {
                    return function (e) {
                        aImg.src = e.target.result;
                    };
                })(img);
                reader.readAsDataURL(file);

            }



        }

        $scope.options = [
            //{
            //    name: MY_CONSTANT.CATEGORY1,
            //    value: 1
            //},
            //{
            //    name: MY_CONSTANT.CATEGORY2,
            //    value: 2
            //},
            //{
            //    name: MY_CONSTANT.CATEGORY3,
            //    value: 3
            //},
            //{
            //    name: MY_CONSTANT.CATEGORY4,
            //    value: 4
            //},
            {
                name: MY_CONSTANT.CATEGORY5,
                value: 5
            },
            {
                name: MY_CONSTANT.CATEGORY6,
                value: 6
            },
            {
                name: MY_CONSTANT.CATEGORY7,
                value: 7
            },
            {
                name: MY_CONSTANT.CATEGORY8,
                value: 8
            },
            {
                name: MY_CONSTANT.CATEGORY9,
                value: 9
            }
        ];

        $scope.successMsg = '';
        $scope.errorMsg = '';
        $scope.AddLooks = function () {
            console.log($scope.addLooks.category);
            //if($scope.cropper.croppedImage){
            //
            //    $scope.croppedimg =  window.dataURLtoBlob($scope.cropper.croppedImage);
            //}
            //console.log($scope.croppedimg);
            var formData = new FormData();
            formData.append('access_token', $cookieStore.get('obj').accesstoken);
            //formData.append('category', $scope.addLooks.category.value);
            formData.append('service_id', $scope.addLooks.category.value);
            //formData.append('name', $scope.addLooks.servicename);
            //formData.append('duration',$scope.addLooks.serviceduration);
            //formData.append('look_id',$scope.addLooks.look_id);
            formData.append('look_name',$scope.addLooks.look_name);
            formData.append('ios_look_image',$scope.iosImg);
            formData.append('android_look_image',$scope.androidImg);

            //formData.append('price', $scope.addLooks.price);
            //formData.append('heading', $scope.addService.desc_title);
            //formData.append('description', $scope.addService.description);
            // formData.append('instructions', $scope.content);
            //formData.append('image', $scope.croppedimg);
            $.ajax({
                type: 'POST',
                url: MY_CONSTANT.url + '/add_looks',
                dataType: "json",
                data: formData,
                async: false,
                processData: false,
                contentType: false,
                success: function (data) {
                    console.log(data);
                    if (typeof data == "string"){
                        data = JSON.parse(data);
                    }


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

                }
            });
            //
            //$.post(MY_CONSTANT.url + '/add_new_service',
            //    {
            //
            //        access_token: $cookieStore.get('obj').accesstoken,
            //        category: $scope.addService.category.value,
            //        service_name: $scope.addService.servicename,
            //        time: $scope.addService.servicetime,
            //        cost: $scope.addService.cost,
            //        heading: $scope.addService.desc_title,
            //        description: $scope.addService.description,
            //        instructions: $scope.content,
            //        image:$scope.croppedimg
            //    }
            //    ,
            //
            //    function (data) {
            //        data = JSON.parse(data);
            //
            //        if (data.log) {
            //            $scope.successMsg = data.log;
            //        }
            //        else {
            //            $scope.errorMsg = data.error;
            //        }
            //        $scope.$apply();
            //        if (data.log) {
            //            $scope.closeThisDialog(0);
            //            $window.location.reload();
            //        }
            //
            //    });
        }
    });

App.controller('EditLooksController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $window) {
    'use strict';

    $scope.successMsg = '';
    $scope.errorMsg = '';
    $scope.addService = {};
    $scope.android_img_sent = 0;
    $scope.ios_img_sent = 0;

    /*======================================================================
     *==================function to upload image =======================
     =====================================================================*/
    $scope.file_to_upload = function (files,flag) {
        console.log(files);
        if(flag==0){
            $scope.androidImg = files[0];
            $scope.android_img_sent = 1;
            var file = files[0];
            var img = document.getElementById("androidimg");
            img.file = file;
            var reader = new FileReader();
            reader.onload = (function (aImg) {
                return function (e) {
                    aImg.src = e.target.result;
                };
            })(img);
            reader.readAsDataURL(file);

        }
        else{
            $scope.iosImg = files[0];
            $scope.ios_img_sent = 1;
            var file = files[0];
            var img = document.getElementById("iosimg");
            img.file = file;
            var reader = new FileReader();
            reader.onload = (function (aImg) {
                return function (e) {
                    aImg.src = e.target.result;
                };
            })(img);
            reader.readAsDataURL(file);

        }



    }


    $scope.EditLooks = function (val) {
        //console.log(val);
        var formData = new FormData();
        formData.append('access_token', $cookieStore.get('obj').accesstoken);
        formData.append('service_id', $scope.editLooks.id_pop);
        formData.append('look_id', $scope.editLooks.look_id);
        formData.append('look_name', $scope.editLooks.look_name);
        formData.append('ios_image_sent', $scope.ios_img_sent);
        formData.append('android_image_sent',$scope.android_img_sent);
        formData.append('android_look_image',$scope.androidImg);
        formData.append('ios_look_image', $scope.iosImg);
        //formData.append('android_look_image',$scope.androidImg);
        console.log($scope.android_img_sent);
        console.log($scope.ios_img_sent);
//return false;
        $.ajax({
            type: 'POST',
            url: MY_CONSTANT.url + '/edit_looks',
            dataType: "json",
            data: formData,
            async: false,
            processData: false,
            contentType: false,
            success: function (data) {
                console.log(data);
                if (typeof data == "string"){
                    data = JSON.parse(data);
                }


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

            }
        });
        //
        //$.post(MY_CONSTANT.url + '/edit_looks',
        //    {
        //
        //        access_token: $cookieStore.get('obj').accesstoken,
        //        service_id: $scope.editLooks.id_pop,
        //        look_id: val,
        //        look_name: val,
        //        ios_image_sent: $scope.ios_img_sent,
        //        android_image_sent: $scope.android_img_sent,
        //        ios_look_image: $scope.iosImg,
        //        android_look_image: $scope.androidImg
        //
        //
        //
        //        // heading: $scope.editService.desc_title,
        //      //  description: $scope.editService.description,
        //        //instructions: $scope.content
        //    }
        //    ,
        //
        //    function (data) {
        //        data = JSON.parse(data);
        //
        //        if (data.log) {
        //            $scope.successMsg = data.log;
        //            $scope.closeThisDialog(0);
        //            $window.location.reload();
        //        }
        //        else {
        //            $scope.errorMsg = data.error;
        //        }
        //        $scope.$apply();
        //
        //    });
    }
});/**
 * Created by clicklabs08 on 8/5/15.
 */
