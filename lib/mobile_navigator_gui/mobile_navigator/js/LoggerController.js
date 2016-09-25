app.controller('LoggerController', function ($rootScope, $scope, $http, $filter, $compile, $location, $resource,
                                             GetCookieFactory, SetCookieFactory, CenterOfCoordsFactory,
                                             ConvertCoordsFactory, GetObjectByAttributeFactory, PatchObjectFactory,
                                             IsNumberFactory,GetObjectByAttributesFactory) {

    $("#set_location_button").hide();
    $(".map" ).hide();
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#camera')    // Or '#yourElement' (optional)
        },
        decoder: {
            readers: [
                'code_39_reader'
            ]
        }
    }, function (err) {
        if (err) {
            console.log(err);
            return
        }
        console.log("Initialization finished. Ready to start");
        Quagga.start();
    });


    Quagga.onDetected(function (data) {
        $scope.logger_id = data.codeResult.code;
        var crd = $scope.cur_pos.coords;
        var accuracy = crd.accuracy;
        alert('logger found: ' + $scope.logger_id + '. accuracy = ' + accuracy.toFixed(2) + ' meters');
        Quagga.stop();

    });


    $scope.get_location = function () {
        var options = {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        };
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition($scope.check_logger_availability, $rootScope.current_position_error, options);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }

    }
    $scope.set_location_pushed = function () {
        var url = '/installation_api/remote_loggers/' + $scope.logger_id + '/install_request'
        var post_data = {
            activated: true,
            latitude: $scope.cur_pos.coords.latitude,
            longitude: $scope.cur_pos.coords.longitude
        }
        var point = new google.maps.LatLng(post_data.latitude, post_data.longitude);
        var polygon = $rootScope.get_polygon_by_latLng(point,$rootScope.polygons);
        if(polygon){
            post_data.project_id = polygon.project.id;
        }
        var msg = 'Logger ' + $scope.logger_id + ' installed successfully';
        var csrf_token = $.cookie("CSRF-TOKEN");
        post_data['authenticity_token'] = csrf_token;
        var content_type = "application/json; charset=UTF-8";
        $http.defaults.headers.post["Content-Type"] = content_type;
        var defaults = $http.defaults.headers;
        defaults.post = defaults.post || {}
        defaults.post['Content-Type'] = 'application/json';
        var src = $resource(url,
            {timeout: 5000}, //parameters default
            {
                Post: {method: "POST"}
            });
        $rootScope.loading = true;
        src.Post(post_data).$promise.then(
            //success
            function (value) {
                $("#set_location_button").hide();
                $rootScope.loading = false;
                alert(msg);
                location.replace("/mobile_navigator/#/");
            },
            //error
            function (error, status) {
                $rootScope.loading = false;
                if(error.status == 0 ){
                    alert('No internet. Saving installation locally and trying again later.')
                }
                $scope.handle_failed_logger($scope.logger_id, post_data);
            }
        );
    }
    $scope.handle_failed_logger = function (logger_id, post_data) {
        var failed_installations_arr =  $rootScope.load_failed_loggers_from_cookie('failed_installations');
        var logger_to_push = {
            id: parseInt(logger_id),
            latitude: post_data.latitude,
            longitude: post_data.longitude,
            type: 'install'
        };
        if(post_data.project_id){
            logger_to_push.project_id = post_data.project_id;
        }
        if(logger_to_push.id) {
            var existing_failed_logger = GetObjectByAttributesFactory.getObjectByAttributes(['id','type'],
            [logger_to_push.id,logger_to_push.type],failed_installations_arr);
            if(!existing_failed_logger){
                failed_installations_arr.push(logger_to_push);
                var failed_installations_str_to_save = JSON.stringify(failed_installations_arr);
                SetCookieFactory.setCookie('failed_installations', failed_installations_str_to_save, 180);
            }

        }
    }
    $scope.check_logger_availability = function (pos) {
        var crd = pos.coords;
        $scope.cur_pos = pos;
        var valid_request = $scope.valid_installation_request($scope.logger_id, crd);
        if (valid_request) {
            $scope.location_found = true;
            $("#camera_zone").hide();
            var msg = $scope.logger_id.toString() + '. accuracy: ' + crd.accuracy.toFixed(2);
            $("#logger_span").text(msg);
            $("#set_location_button").show();
        } else {
            if ($scope.logger_id && $rootScope.loggers) {
                console.log('we are sorry but something went wrong');
            }
        }


    };

    $scope.submit_logger_id = function (manual_logger_id) {
        $scope.logger_id = manual_logger_id;
        $scope.get_location();

    }

    $scope.valid_installation_request = function (logger_id, crd) {
        var res = false;
        if (IsNumberFactory.isNumber($scope.logger_id) ) {
            res = true;
        }
        return res;
    }

    $rootScope.location_timer = setInterval(function () {
        $scope.get_location();
    }, 2000);
});
