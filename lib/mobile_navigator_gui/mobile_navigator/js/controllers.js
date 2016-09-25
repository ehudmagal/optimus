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





    $scope.load_map_components = function () {
        $http.get('/orders.json?')
            .success(function (data, status, headers, config) {
                $rootScope.orders = data;
                $rootScope.map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 8,
                    center: {lat: 32.933052, lng: 35.08267799999999}
                });
                $rootScope.directionsService = new google.maps.DirectionsService;
                $rootScope.directionsDisplay = new google.maps.DirectionsRenderer;
                $rootScope.directionsDisplay.setMap($scope.map);
                $rootScope.markers = [];
                var coords = [];
                for (var i = 0; i < $rootScope.orders.length; i++) {
                    var order = $rootScope.orders[i];
                    var lat = order.source.lat;
                    var lng = order.source.lng;

                    var marker = new google.maps.Marker({
                        position: {lat: lat, lng: lng},
                        map: $rootScope.map,
                        title: order.source.address
                    });
                    marker.order = order;
                    marker.order_id = order.id;
                    marker.addListener('click', $scope.marker_cliked_event);
                    coords.push(marker.position);
                    $rootScope.markers.push(marker);
                }
                var center = CenterOfCoordsFactory.centerOfCoords(coords);
                $rootScope.map.setCenter(center);
                $rootScope.map_loaded = true;
                if (!$rootScope.location_timer) {
                    $rootScope.location_timer = setInterval(function () {
                        $rootScope.get_location();
                    }, 2000);
                }
            });

    }






    $scope.refresh = function () {
        location.reload();
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

    $scope.load_map_components();



});









