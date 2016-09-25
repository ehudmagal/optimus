// 
// Here is how to define your module 
// has dependent on mobile-angular-ui
// 
var app = angular.module('MobileAngularUiExamples', [
    'ngRoute',
    'ngCookies',
    'mobile-angular-ui',

    // touch/drag feature: this is from 'mobile-angular-ui.gestures.js'
    // it is at a very beginning stage, so please be careful if you like to use
    // in production. This is intended to provide a flexible, integrated and and
    // easy to use alternative to other 3rd party libs like hammer.js, with the
    // final pourpose to integrate gestures into default ui interactions like
    // opening sidebars, turning switches on/off ..
    'mobile-angular-ui.gestures',
    'ngResource',


]);
app.OP_SENSORS_MAX_ID = 200000000;
app.SOIL_MOISTURE_FORMAT_DS_TYPE_ID = 125
// 
// You can configure ngRoute as always, but to take advantage of SharedState location
// feature (i.e. close sidebar on backbutton) you should setup 'reloadOnSearch: false' 
// in order to avoid unwanted routing.
// 

//
// `$drag` example: drag to dismiss
//


//
// For this trivial demo we have just a unique MainController 
// for everything
//
app.controller('MainController', function ($rootScope, $scope, $http, $filter, GetCookieFactory, SetCookieFactory,
                                           $resource, DeleteCookieFactory, GetObjectByAttributeFactory,
                                           GetObjectByAttributesFactory, ConvertCoordsFactory, CenterOfCoordsFactory) {
    if (!$rootScope.location_timer) {
        $rootScope.location_timer = setInterval(function () {
            $rootScope.get_location();
        }, 2000);
    }
    $scope.url_prefix = url_prefix;
    // User agent displayed in home page
    $scope.userAgent = navigator.userAgent;

    // Needed for the loading screen
    $rootScope.$on('$routeChangeStart', function () {
        $rootScope.loading = true;
    });

    $rootScope.$on('$routeChangeSuccess', function () {
        $rootScope.loading = false;
    });

    $scope.gotoUrl = function (url) {
        window.location = url;
    }
    $rootScope.resetMarkers = function () {
        if (!$rootScope.markers) {
            $rootScope.markers = [];
        }
        for (var i = 0; i < $rootScope.markers.length; i++) {
            var marker = $rootScope.markers[i];
            marker.setMap(null);
        }
        $rootScope.markers = [];
    }

    $scope.logout = function () {
        var r = confirm("Are You Sure?");
        if (r == true) {
            var url = '/users/sign_out.json';
            var content_type = "application/json; charset=UTF-8";
            var csrf_token = $.cookie('CSRF-TOKEN');
            var config = {
                headers: {
                    "Content-Type": content_type,
                    "X-CSRF-Token": csrf_token
                },
                user: $rootScope.user
            };

            return $http.delete(url, config).success(function (data) {
                alert("logout successfull");
                window.location = '/';
            }).error(function (data) {
                alert('error accured :' + JSON.stringify(data));
            });
        }
    }

    $rootScope.load_failed_loggers_from_cookie = function (key) {
        var failed_installations_str = GetCookieFactory.getCookie(key);
        if (!failed_installations_str || failed_installations_str == '') {
            failed_installations_str = '[]';
        }
        return JSON.parse(failed_installations_str);
    }

    $scope.handle_installation_errors = function () {
        $rootScope.failed_installations = $rootScope.load_failed_loggers_from_cookie('failed_installations');
        if (!$rootScope.finish_loading) {
            var url = server_string + '/installation_api/remote_loggers/approved';
            $http.get(url).success(function (data) {
                $rootScope.loggers = $filter('getRealLoggers')(data);
                $rootScope.loggers = $filter('uniqueArrByAttribute')($rootScope.loggers, 'id', GetObjectByAttributeFactory);
                var url = ' /installation_api/remote_loggers/pending';
                $http.get(url).success(function (data) {
                    $rootScope.pending_loggers = $filter('getRealLoggers')(data);
                    $rootScope.pending_loggers = $filter('uniqueArrByAttribute')($rootScope.pending_loggers, 'id', GetObjectByAttributeFactory);
                    for(var i = 0 ; i < $rootScope.pending_loggers.length ; i++){
                        var logger =  $rootScope.pending_loggers[i];
                        logger.pending = true;
                        $rootScope.loggers.push(logger);
                    }
                    var url = server_string + '/installation_api/projects';
                    $http.get(url).success(function (data) {
                        $rootScope.projects = data;
                        $("#map").hide();
                        $rootScope.finish_loading = true;
                        $scope.load_map_components();
                        $scope.posts_counter = 0;
                        $scope.successfull_installations = [];
                        for (var i = 0; i < $rootScope.failed_installations.length; i++) {
                            $scope.failed_installation = $rootScope.failed_installations[i];
                            var post_data = {};
                            var url = ' /installation_api/remote_loggers/' + post_data.id + '/install_request ';
                            var msg = 'Logger ' + post_data.id + ' installed successfully';
                            switch ($scope.failed_installation.type) {
                                case 'approve':
                                    url = '/installation_api/projects/' + $scope.failed_installation.project_id
                                        + '/suggested_installation_locations/' + $scope.failed_installation.id + '/approve';
                                    break;
                                case 'reject':
                                    url = '/installation_api/projects/' + $scope.failed_installation.project_id
                                        + '/suggested_installation_locations/' + $scope.failed_installation.id + '/reject';
                                    break;
                                case 'row_number':
                                    url = '/installation_api/projects/' + $scope.failed_installation.project_id
                                        + '/suggested_installation_locations/' + $scope.failed_installation.id + '/approve?'
                                        + $scope.failed_installation.row_number;
                                    break;
                                case 'install':
                                    post_data = jQuery.extend(true, {}, $scope.failed_installation);
                                    url = '/installation_api/remote_loggers/' + $scope.failed_installation.id +
                                        '/install_request';
                                    break;
                                default:
                                    break;
                            }
                            msg = 'Success True';


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
                                    $rootScope.loading = false;
                                    console.log(msg);
                                    $scope.posts_counter++;
                                    var successfull_installation = GetObjectByAttributesFactory.getObjectByAttributes(
                                        ['id', 'type'], [$scope.failed_installation.id,
                                            $scope.failed_installation.type], $rootScope.failed_installations);
                                    if (successfull_installation) {
                                        $scope.successfull_installations.push(successfull_installation);
                                        if ($scope.posts_counter == $rootScope.failed_installations.length) {
                                            $scope.handle_installation_errors_end($scope.successfull_installations);
                                        }
                                    }
                                },
                                //error
                                function (error, status) {
                                    $rootScope.loading = false;
                                    if (status == 401) {
                                        location.replace('/');
                                    }
                                    $scope.posts_counter++;
                                    if ($scope.posts_counter == $rootScope.failed_installations.length) {
                                        $scope.handle_installation_errors_end($scope.successfull_installations);
                                    }
                                }
                            );

                        }

                    });
                });
            });
        }
    }

    $scope.load_map_components = function () {
        $rootScope.init_map();
        for (var i = 0; i < $rootScope.projects.length; i++) {
            var project = $rootScope.projects[i];
            var center = CenterOfCoordsFactory.centerOfCoords(project.coordinates);
            if (center) {
                project.latitude = center.lat();
                project.longitude = center.lng();
            }

        }
        var coords = ConvertCoordsFactory.convertCoords($rootScope.projects);
        var center = CenterOfCoordsFactory.centerOfCoords(coords);
        $rootScope.map.setCenter(center);
        $rootScope.map.setZoom(12);
        for (var i = 0; i < $rootScope.projects.length; i++) {
            var project = $rootScope.projects[i];
            $rootScope.draw_project_polygon(project);
        }


    }

    $rootScope.init_map = function () {
        if (!$rootScope.map) {
            var center = {lat: -34.397, lng: 150.644};
            $rootScope.map = new google.maps.Map(document.getElementById('map'), {
                center: center,
                zoom: 8,
                mapTypeId: google.maps.MapTypeId.SATELLITE
            });
        }
    }

    $scope.handle_installation_errors_end = function (successfull_installations) {
        for (var i = 0; i < successfull_installations.length; i++) {
            var successfull_installation = successfull_installations[i];
            var failed_installation = GetObjectByAttributesFactory.getObjectByAttributes(['id', 'type'],
                [successfull_installation.id, successfull_installation.type], $rootScope.failed_installations);
            var index = $rootScope.failed_installations.indexOf(failed_installation);
            if (index > -1) {
                $rootScope.failed_installations.splice(index, 1);
            }
        }
        var key = 'failed_installations';
        var failed_installations_str_to_save = JSON.stringify($rootScope.failed_installations);
        SetCookieFactory.setCookie(key, failed_installations_str_to_save, 180);
    }


    $scope.set_role = function () {
        $rootScope.role = GetCookieFactory.getCookie('role');
    }
    $scope.refresh = function () {
        location.reload();
    }
    $rootScope.getPolygonColor = function (polygon) {
        var project = polygon.project;
        switch (project.suggested_location_status) {
            case 'rejected':
                res = 'black';
                break;
            case 'approved':
                res = 'yellow';
                break;
            case 'pending':
                res = 'red';
                break;
            default:
                var res = 'yellow';
                break;
        }
        if (project.installation_approved) {
            res = 'green';
        }
        var pending_loggers =  $rootScope.get_polygon_loggers(polygon,$rootScope.pending_loggers);
        var installed_loggers = $rootScope.get_polygon_loggers(polygon,$rootScope.loggers);
        if (pending_loggers.length || installed_loggers.length) {
            res = 'green';
        }
        return res;
    }

    $rootScope.get_polygon_loggers = function (polygon, loggers) {
        var res = [];
        if (loggers) {
            for (var i = 0; i < loggers.length; i++) {
                var logger = loggers[i];
                var point = new google.maps.LatLng(logger.latitude, logger.longitude);
                var pointIn = google.maps.geometry.poly.containsLocation(point, polygon);
                var point_exist = GetObjectByAttributesFactory.getObjectByAttributes(['latitude', 'longitude'],
                    [logger.latitude, logger.longitude], res);
                if (pointIn && !point_exist) {
                    res.push(logger)
                }
                if (logger.project_ids) {
                    for (var j = 0; j < logger.project_ids.length; j++) {
                        var proj_id = logger.project_ids[j];
                        if (proj_id == polygon.project.id) {
                            var loggerExist = GetObjectByAttributeFactory.getObjectByAttribute('id', logger.id, res);
                            if (!loggerExist) {
                                res.push(logger);
                            }
                        }
                    }
                }
            }
        }
        return res;
    }
    $rootScope.get_logger_polygon = function (logger, polygons) {
        var res = null;
        if (polygons) {
            for (var i = 0; i < polygons.length; i++) {
                var polygon = polygons[i];
                var point = new google.maps.LatLng(logger.latitude, logger.longitude);
                var pointIn = google.maps.geometry.poly.containsLocation(point, polygon);
                if (pointIn) {
                    res = polygon;
                    break;
                }
            }
        }
        return res;
    }
    $rootScope.get_polygon_by_latLng = function (point, polygons) {
        var res = null;
        if (polygons) {
            for (var i = 0; i < polygons.length; i++) {
                var polygon = polygons[i];
                var pointIn = google.maps.geometry.poly.containsLocation(point, polygon);
                if (pointIn) {
                    res = polygon;
                    break;
                }
            }
        }
        return res;
    }
    $rootScope.getProjectPolygon = function (project, polygons) {
        var res = null;
        for (var i = 0; i < polygons.length; i++) {
            var poly = polygons[i];
            if (poly.project.id == project.id) {
                res = poly;
                break;
            }
        }
        return res;
    }
    $rootScope.approved_suggested_installation = function (suggested_location) {
        var res = 'unset';
        if (suggested_location) {
            if (suggested_location.approved) {
                var approved_date = new Date(suggested_location.approved);
            }
            if (suggested_location.rejected) {
                var rejected_date = new Date(suggested_location.rejected);
            }
            if (approved_date && rejected_date) {
                if (approved_date > rejected_date) {
                    res = 'approved';
                } else {
                    res = 'rejected';
                }
            } else {
                if (approved_date) {
                    res = 'approved';
                } else {
                    if (rejected_date) {
                        res = 'rejected';
                    }
                }
            }
        }
        return res;

    }
    $rootScope.navigate_with_google_maps = function (lat, lng) {
        var found_location = null;
        for (var i = 0; i < $rootScope.markers.length; i++) {
            var marker = $rootScope.markers[i];
            if (marker.location.latitude == lat && marker.location.longitude == lng) {
                found_location = marker.location;
                break;
            }
        }
        if (found_location) {
            $scope.found_location_to_nav = found_location;
            var options = {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            };
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (pos) {
                    var crd = pos.coords;
                    var url = 'http://maps.google.com/?saddr=';
                    url += crd.latitude + ',' + crd.longitude;
                    url += '&daddr=' + $scope.found_location_to_nav.latitude + ',' + $scope.found_location_to_nav.longitude
                    location.replace(url);
                }, $rootScope.current_position_error, options);
            } else {
                console.log("Geolocation is not supported by this browser.");
            }
        }
    }
    $rootScope.current_position_error = function (err) {
        console.log('ERROR(' + err.code + '): ' + err.message);
    };
    $rootScope.get_location = function () {
        var options = {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        };
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition($rootScope.draw_current_position, $rootScope.current_position_error, options);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }

    }
    $rootScope.draw_current_position = function (pos) {
        var crd = pos.coords;
        $rootScope.init_map();
        var marker_position = {lat: crd.latitude, lng: crd.longitude}
        if ($scope.curPosMarker) {
            $scope.curPosMarker.setPosition(marker_position);
        } else {
            $scope.curPosMarker = new google.maps.Marker({
                position: marker_position,
                map: $scope.map,
                title: 'My Position',
                icon: server_string + '/mobile_navigator/img/blue_car.gif'
            });
        }

    };
    $rootScope.draw_project_polygon = function (project) {
        if ((project.coordinates) && (project.coordinates.length) &&
            (project.status != "archived")) {
            var coords = project.coordinates;

            var polygon = new google.maps.Polygon({
                coords: coords,
                paths: coords,
                strokeColor: 'green',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: 'green',
                fillOpacity: 0.35,
                project: project,
                zIndex: google.maps.Marker.MAX_ZINDEX
            });


            polygon.setMap($rootScope.map);
            var color = $rootScope.getPolygonColor(polygon);
            polygon.setOptions({
                fillColor: color,
                strokeColor: color
            });
            if (!$rootScope.polygons) {
                $rootScope.polygons = [];
            }
            $rootScope.polygons.push(polygon);

        }

    }

    $scope.set_role();
    $scope.handle_installation_errors();

});


app.controller('FailedLoggersController', function ($rootScope, $scope, $http, $filter) {
    $rootScope.resetMarkers();
    $("#map").hide();
});






