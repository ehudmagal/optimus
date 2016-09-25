app.controller('LoggersController', function ($rootScope, $scope, $http, $filter, $compile, $location,
                                              GetCookieFactory, SetCookieFactory, CenterOfCoordsFactory,
                                              ConvertCoordsFactory, GetObjectByAttributeFactory, FilterPolygonsFactory) {


    $scope.load_map_components = function () {
        $("#map").show();
        if ($rootScope.projects) {
            $rootScope.resetMarkers();
            for (var i = 0; i < $rootScope.polygons.length; i++) {
                var polygon = $rootScope.polygons[i];
                $scope.setPolygonEvents(polygon);
            }
        }
        $scope.draw_markers($rootScope.loggers, '/mobile_navigator/img/green-dot.png');
        $scope.draw_markers($rootScope.pending_loggers);
    }
    $scope.$watch('project_name', function () {
        FilterPolygonsFactory.filterPolygons($scope.map, $scope.polygons, $scope.project_name, CenterOfCoordsFactory,
            $rootScope.loggers);
    });

    $scope.setPolygonEvents = function (polygon) {
        google.maps.event.clearListeners(polygon, 'click');
        var project = polygon.project;
        if ((project.coordinates) && (project.coordinates.length) &&
            (project.status != "archived")) {
            polygon.addListener("click", function (event) {
                var polygon_loggers = $rootScope.get_polygon_loggers(this, $rootScope.loggers);
                var pending_polygon_loggers = $rootScope.get_polygon_loggers(this, $rootScope.pending_loggers);
                if (pending_polygon_loggers.length + polygon_loggers.length == 1) {
                    for (var i = 0; i < $rootScope.markers.length; i++) {
                        var marker = $rootScope.markers[i];
                        if (polygon_loggers.length && polygon_loggers[0].id == marker.logger.id) {
                            google.maps.event.trigger(marker, 'click');
                            break;
                        } else {
                            if (pending_polygon_loggers.length && polygon_loggers[0].id == marker.logger.id) {
                                google.maps.event.trigger(marker, 'click');
                                break;
                            }
                        }
                    }
                    google.maps.event.trigger(marker, 'click');
                }
            });
            
        }

    }

    $scope.logger_picked = function (logger) {
        var picked_str = GetCookieFactory.getCookie('logger_' + logger.id);
        var picked = (picked_str === 'true');
        return picked;
    }
    $scope.draw_markers = function (loggers, icon_path) {
        if (!icon_path) {
            icon_path = null;
        }


        if (loggers) {
            for (var i = 0; i < loggers.length; i++) {
                var logger = loggers[i];

                var myLatLng = {lat: parseFloat(logger.latitude), lng: parseFloat(logger.longitude)};
                var marker = new google.maps.Marker({
                    position: myLatLng,
                    map: $scope.map,
                    title: logger.id.toString(),
                    logger: logger,
                    icon: icon_path
                });
                var picked = $scope.logger_picked(logger);
                if (picked) {
                    marker.setIcon('/mobile_navigator/img/purple-dot.png');
                } else {
                    marker.setIcon('/mobile_navigator/img/green-dot.png');
                }
                $scope['logger_' + logger.id] = {picked: picked};
                var infowindow = new google.maps.InfoWindow({
                    content: ''
                });
                marker.infowindow = infowindow;
                marker.addListener('click', function () {
                    var polygon = $rootScope.get_logger_polygon(this.logger, $scope.polygons);
                    if (polygon) {
                        var project = polygon.project;
                    }
                    var content = '<div>';
                    if (project) {
                        content += '<p style="padding-left: 50px;">Project :' + project.name + '</p><br>';
                    }
                    content += '<p>Logger Id:' + this.logger.id + '</p><br>';
                    content += 'Picked Logger: <input type="checkbox" ng-model="logger_' + this.logger.id + '.picked" ng-change="mark_logger(' + this.logger.id + ')">' +
                        '<br><br><button ng-click="navigate_with_google_maps(' + this.logger.id + ')">Navigate with google maps</button></div>';
                    var compiled = $compile(content)($scope);
                    this.infowindow.setContent(compiled[0]);
                    this.infowindow.open($scope.map, this);
                });
                if (!$rootScope.markers) {
                    $rootScope.markers = [];
                }
                $rootScope.markers.push(marker);
            }
        }
    }
    $scope.mark_logger = function (logger_id) {
        var logger = GetObjectByAttributeFactory.getObjectByAttribute('id', logger_id, $rootScope.loggers);
        var picked = $scope['logger_' + logger_id].picked;
        var logger_marker = null;
        for (var i = 0; i < $rootScope.markers.length; i++) {
            var marker = $rootScope.markers[i];
            if (marker.logger.id == logger.id) {
                logger_marker = marker;
                break;
            }
        }
        if (logger_marker) {
            switch (picked) {
                case true:
                    SetCookieFactory.setCookie('logger_' + logger_id, 'true', 180);
                    break;
                case false:
                    SetCookieFactory.setCookie('logger_' + logger_id, 'false', 180);
                    break;
                default:
                    break;
            }
            for (var i = 0; i < $rootScope.markers.length; i++) {
                var marker = $rootScope.markers[i];
                marker.setMap(null);
            }
            $rootScope.markers = [];
            $scope.draw_markers($rootScope.pending_loggers, '/mobile_navigator/img/green-dot.png');
            $scope.draw_markers($rootScope.loggers, '/mobile_navigator/img/green-dot.png');

        }
    }

    $scope.navigate_with_google_maps = function (logger_id) {
        var arr = $rootScope.loggers;
        $scope.logger_to_nav = GetObjectByAttributeFactory.getObjectByAttribute('id', logger_id, arr);
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
                url += '&daddr=' + $scope.logger_to_nav.latitude + ',' + $scope.logger_to_nav.longitude
                location.replace(url);
            }, $rootScope.current_position_error, options);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }


    $rootScope.$watch('projects', function () {
        $scope.load_map_components();
    });

    $rootScope.location_timer = setInterval(function () {
        $rootScope.get_location();
    }, 2000);

});
