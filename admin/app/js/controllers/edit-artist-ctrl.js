App.controller('EditArtistController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, ngDialog, getCategories, $timeout, $window) {
    'use strict';
    var catArrFinal = [];
    var cityArrFinal = [];
    var catArr = $scope.json.categories;
    var categories = [
        {
            'name': 'Blow Dry',
            'value': '1'
        },
        {
            'name': 'Makeup',
            'value': '2'
        },
        {
            'name': 'Manicure',
            'value': '3'
        },
        {
            'name': 'All',
            'value': '4'
        }
    ];
    //console.log($scope.json);
    //console.log(catArr);
    catArr.forEach(function (column) {

        if (column == 1) {
            var name = 'Blow Dry';
        } else if (column == 2) {
            name = 'Makeup';
        } else if (column == 3) {
            name = 'Manicure';
        } else if (column == 4) {
            name = 'All';
        }
        //console.log(column);
        //console.log(name);

        var cat_param = {
            name: "",
            value: ""
        };
        cat_param.name = name;
        cat_param.value = column;
        catArrFinal.push(cat_param);
    });
    console.log('cat Array');
    console.log(catArrFinal);
    var city = $scope.json.city;
    var cityArr = city.split(",");
    cityArr.forEach(function (column) {
        var cat_param = {
            name: "",
            value: ""
        };
        cat_param.name = column;
        cat_param.value = column;
        cityArrFinal.push(cat_param);
    });
    
    var new_categories = [];
    var update_categories = function(catArrFinal, categories) {
        for(var item in categories) {
            var flag = false;
            for(var data in catArrFinal) {
                if(categories[item].name == catArrFinal[data].name) {
                    flag = true;
                    break;
                }
            }
            if(!flag)
                new_categories.push(categories[item]);
        }
    };
    update_categories(catArrFinal, categories);
    console.log("updated");
    console.log(new_categories);
//console.log(cityArrFinal);
    //console.log($scope.json);
    $scope.editArtist = {
        tech_id: $scope.json.artist_id,
        first_name: $scope.json.first_name,
        last_name: $scope.json.last_name,
        phone: $scope.json.phone_no,
      //  gender: $scope.json.gender,
        experience: $scope.json.experience,
        qualification: $scope.json.qualification,
        categories: catArrFinal,
        city: $scope.json.city,
        summary: $scope.json.summary
        //imgSrc: $scope.json.image

    };
    var str = $scope.editArtist.phone;
    $scope.editArtist.phone = str.replace(/[^0-9]+/ig,"");
    $scope.imgSrc = $scope.json.image;
    //console.log($scope.json.image);
    //console.log("yoda");
    //an array of files selected
    $scope.files = [];

    //listen for the file selected event
    $scope.$on("fileSelected", function (event, args) {
        $scope.$apply(function () {
            //add the file object to the scope's files collection
            $scope.files.push(args.file);
        });
    });

    /* Get to be uploading file and set it into a variable and read to show it on view */
    $scope.file_to_upload = function (File) {
        $scope.FileUploaded = File[0];
        //console.log(File[0]);

        var file = File[0];
        var imageType = /image.*/;
        if (!file.type.match(imageType)) {

        }
        var img = document.getElementById("thumbnil");
        img.file = file;
        var reader = new FileReader();
        reader.onload = (function (aImg) {
            return function (e) {
                aImg.src = e.target.result;
            };
        })(img);
        reader.readAsDataURL(file);
    };

    /* Upload Doc files */
    var doc1Arr = [];
    var doc2Arr = [];
    var doc3Arr = [];
    $scope.doc_to_upload = function (File, type) {

        if (type == 1) {
            doc1Arr = [];
            doc1Arr.push(File[0]);
        }
        if (type == 2) {
            doc2Arr = [];
            doc2Arr.push(File[0]);
        }
        if (type == 3) {
            doc3Arr = [];
            doc3Arr.push(File[0]);
        }
        $scope.doc_1_list = doc1Arr[0];
        $scope.doc_2_list = doc2Arr[0];
        $scope.doc_3_list = doc3Arr[0];

        if ($scope.doc_1_list == undefined) {
            $scope.doc_1_list = "";
        }
        if ($scope.doc_2_list == undefined) {
            $scope.doc_2_list = "";
        }
        if ($scope.doc_3_list == undefined) {
            $scope.doc_3_list = "";
        }
    };

    var getCitiesList = function () {
        $http({
            method: "post",
            url: MY_CONSTANT.url + '/get_service_area_codes',
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            data: $.param({access_token: $cookieStore.get('obj').accesstoken})
        }).success(function (data) {
            data = data.service_codes;
            //console.log(data);
            $scope.options_city = data;
            /*$scope.options_cat = ['Blow Dry','Makeup','Manicure','All'];*/
            $scope.options_cat = new_categories;
        });

    };
    getCitiesList();
    $scope.add_item = function(item, model) {
        new_categories.splice(item.val-1,0,item);
        //console.log('adding:');
        //console.log(new_categories);
    };

    $scope.successMsg = '';
    $scope.errorMsg = '';
    $scope.editArtist.city="London";
    $scope.EditArtist = function () {

        //console.log($scope.editArtist);
        //console.log($scope.editArtist.categories);

        //$scope.city_val = getCategories.getCategoryListForEditArtist($scope.editArtist.city);
        $scope.city_val = $scope.editArtist.city;
        $scope.category_val1 = getCategories.getCategoryListForEditArtist($scope.editArtist.categories);

        console.log($scope.editArtist.categories);
        //console.log($scope.category_val);
        var cat_len = $scope.editArtist.categories.length;
        var str = $scope.category_val1;
        console.log(str);
        if(str.search(4)== -1 && cat_len<3)
        {
            console.log("hello");
            $scope.category_val=$scope.category_val1;
        }

        else if(cat_len ==3 || cat_len ==4 || cat_len >4 )
        {
            $scope.category_val = 4;
        }

        else
        {
            $scope.category_val =  4;
        }
        console.log($scope.category_val);
     //return false;



        //return false;
        //console.log($scope.category_val);
        //console.log("I am here");
        var str = $scope.editArtist.phone;
        var res1 = str.substring(0, 5);
        var res2 = str.substring(5,8);
        var res3 = str.substring(8,11);
        $scope.editArtist.phone = "("+res1+")"+" "+res2+"-"+res3;
        console.log( $scope.editArtist.phone);

        var formData = new FormData();
        formData.append("access_token", $cookieStore.get('obj').accesstoken);
        formData.append("tech_id", $scope.editArtist.tech_id);
        formData.append("first_name", $scope.editArtist.first_name);
        formData.append("last_name", $scope.editArtist.last_name);
        formData.append("mobile", $scope.editArtist.phone);
        //formData.append("city", $scope.city_val);
        formData.append("city", $scope.editArtist.city);
        formData.append("city_flag", "1");
        formData.append("experience", $scope.editArtist.experience);
        formData.append("summary", $scope.editArtist.summary);
       // formData.append("gender", $scope.editArtist.gender);
        formData.append("profile_pic", $scope.FileUploaded);
        formData.append("qualifications", $scope.editArtist.qualification);
        formData.append("tech_type", $scope.category_val);
        formData.append("document_1", $scope.doc_1_list);
        formData.append("document_2", $scope.doc_2_list);
        formData.append("document_3", $scope.doc_3_list);
        //console.log($scope.city_val);
        //return false;
        $.ajax({
            type: "POST",
            url: MY_CONSTANT.url + '/edit_tech_profile',
            dataType: "json",
            data: formData,
            async: false,
            processData: false,
            contentType: false,
            success: function (data) {
                console.log(data);
                if (data.error) {
                    alert(data.error);
                    ngDialog.open({
                        template: '<p>' + data.error + '</p>',
                        className: 'ngdialog-theme-default',
                        plain: true,
                        showClose: false,
                        closeByDocument: true,
                        closeByEscape: true
                    });
                } else {
                    ngDialog.open({
                        template: '<p>' + data.message + '</p>',
                        className: 'ngdialog-theme-default',
                        plain: true,
                        showClose: false,
                        closeByDocument: false,
                        closeByEscape: false
                    });
                    $timeout($window.location.reload(), 1000);
                }
            }

        });
    }
});