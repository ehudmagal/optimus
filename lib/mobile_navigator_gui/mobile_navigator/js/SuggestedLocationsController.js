app.controller('SuggestedLocationsController', function ($rootScope, $scope, $http, $filter, $compile, $location,
                                                         $resource, GetCookieFactory, SetCookieFactory, CenterOfCoordsFactory,
                                                         ConvertCoordsFactory, GetObjectByAttributeFactory,
                                                         FilterPolygonsFactory, PatchObjectFactory, GetObjectByAttributesFactory) {


    $scope.$watch('project_name', function () {
        FilterPolygonsFactory.filterPolygons($scope.map, $scope.polygons, $scope.project_name,
            CenterOfCoordsFactory, $rootScope.loggers);
    });

    $scope.load_map_components = function () {
        if ($rootScope.projects) {
            $("#map").show();
            $rootScope.resetMarkers();
            for (var i = 0; i < $rootScope.polygons.length; i++) {
                var polygon = $rootScope.polygons[i];
                $scope.setPolygonEvents(polygon);
            }
        }
    }

    $scope.setPolygonEvents = function (polygon) {
        google.maps.event.clearListeners(polygon, 'click');
        var project = polygon.project;
        if ((project.coordinates) && (project.coordinates.length) &&
            (project.status != "archived")) {
            polygon.addListener("click", function (event) {
                $scope.pull_suggested_locations(this);
            });
        }

    }

    $scope.pull_suggested_locations = function (polygon) {
        if (!polygon.suggested_locations) {
            var project = polygon.project;
            var url = ' /installation_api/projects/' + project.id + '/suggested_installation_locations ';
            $http.get(url).success(function (data) {
                polygon.suggested_locations = data;
                for (var i = 0; i < polygon.suggested_locations.length; i++) {
                    var location = polygon.suggested_locations[i];
                    var open_window = false;
                    if (polygon.suggested_locations.length == 1) {
                        open_window = true;
                    }
                    $scope.draw_location(location, null, open_window);
                }

            })
        }

    }

    $scope.draw_location = function (location, icon_path, open_window) {
        if (!icon_path) {
            icon_path = null;
        }
        var myLatLng = {lat: parseFloat(location.latitude), lng: parseFloat(location.longitude)};
        var marker = new google.maps.Marker({
            position: myLatLng,
            map: $scope.map,
            location: location,
            icon: icon_path
        });

        var infowindow = new google.maps.InfoWindow({
            content: ''
        });
        marker.infowindow = infowindow;
        marker.addListener('click', function () {
            var project = $scope.get_location_project(this.location.id);
            var content = '<div > <p style="padding-left: 50px;">Project';
            if (this.location.id) {
                content += ' ' + project.name;
                var status = $rootScope.approved_suggested_installation(this.location);
                content += '<br>Status: ' + status;
            }
            content += '</p>';
            content += '<br><button ng-click="navigate_with_google_maps(' + this.location.latitude + ',' +
                this.location.longitude + ')">Navigate with google maps</button>';
            content += '<br><br><button ng-click="approve_location(' + this.location.id + ',\'approve\')">Approve</button>';
            content += '<br><br><button ng-click="approve_location(' + this.location.id + ',\'reject\')">Reject</button>';
            if (this.location.row_number && this.location.row_number != '') {
                content += '<br> Row Number: ' + this.location.row_number;
            }
            content += '<br><br><input type="number" ng-model="row_number_' + location.id + '" placeholder="Row Number"> '
            content += '<br><br><button ng-click="approve_location(' + this.location.id + ',\'row_number\')">Submit Row Number</button>';
            content += '</div>';
            var compiled = $compile(content)($scope);
            this.infowindow.setContent(compiled[0]);
            this.infowindow.open($scope.map, this);
        });
        if (open_window) {
            google.maps.event.trigger(marker, 'click');
        }
        $rootScope.markers.push(marker);

    }


    $scope.approve_location = function (location_id, type) {
        var project = $scope.get_location_project(location_id);
        var polygon = $rootScope.getProjectPolygon(project, $scope.polygons);
        if (project) {
            var url = '/installation_api/projects/' + project.id + '/suggested_installation_locations/' + location_id;
            switch (type) {
                case 'reject':
                    url += '/reject';
                    break;
                case 'approve':
                    url += '/approve';
                    break;
                case 'row_number':
                    url = '/installation_api/projects/' + project.id + '/suggested_installation_locations/' + location_id +
                        '/approve?row_number=' + $scope['row_number_' + location_id];
                    var location = GetObjectByAttributeFactory.getObjectByAttribute('id', location_id, polygon.suggested_locations);
                    if (location) {
                        location.row_number = $scope['row_number_' + location_id];
                    }
                    break;
                default:
                    break;

            }

            var post_data = {}
            var msg = 'success';
            var csrf_token = $.cookie("CSRF-TOKEN");
            post_data['authenticity_token'] = csrf_token;
            var content_type = "application/json; charset=UTF-8";
            $http.defaults.headers.post["Content-Type"] = content_type;
            var defaults = $http.defaults.headers;
            defaults.post = defaults.post || {}
            defaults.post['Content-Type'] = 'application/json';
            $rootScope.loading = true;
            var src = $resource(url,
                {timeout: 5000}, //parameters default
                {
                    Post: {method: "POST"}
                });
            src.Post(post_data).$promise.then(
                //success
                function (value) {
                    $rootScope.loading = false;
                    var project = $scope.get_location_project(value.location_id);
                    var polygon = $rootScope.getProjectPolygon(project, $scope.polygons);
                    switch (type) {
                        case 'approve':
                            project.suggested_location_status = 'approved';
                            break;
                        case 'row_number':
                            project.suggested_location_status = 'approved';
                            break;
                        case 'reject':
                            project.suggested_location_status = 'rejected';
                            break;
                        default:
                            break;
                    }
                   
                    var color = $rootScope.getPolygonColor(polygon);
                    polygon.setOptions({
                        fillColor: color,
                        strokeColor: color
                    });
                    alert(msg);
                },
                //error
                function (error, status) {
                    $rootScope.loading = false;
                    if (error.status == 0) {
                        alert('No internet. Saving suggested installation locally and trying again later.')
                    }
                    switch (type) {
                        case 'row_number':
                            $scope.handle_failed_suggested_installation(location_id, project.id, type, $scope['row_number_' + location_id]);
                            break;
                        default:
                            $scope.handle_failed_suggested_installation(location_id, project.id, type);
                            break;
                    }

                }
            );

        }

    }
    $scope.handle_failed_suggested_installation = function (location_id, project_id, type, row_number) {
        var failed_installations_arr = $rootScope.load_failed_loggers_from_cookie('failed_installations');
        var suggested_installation_to_push = {
            id: parseInt(location_id),
            project_id: project_id,
            type: type
        };
        switch (type) {
            case 'approve':
                suggested_installation_to_push.approve = true;
                break;
            case 'reject':
                suggested_installation_to_push.approve = false;
                break;
            case 'row_number':
                suggested_installation_to_push.row_number = row_number;
                break;
        }
        if (suggested_installation_to_push.id) {
            var existing_failed_logger = GetObjectByAttributesFactory.getObjectByAttributes(['id', 'type'],
                [suggested_installation_to_push.id, suggested_installation_to_push.type], failed_installations_arr);
            if (!existing_failed_logger) {
                failed_installations_arr.push(suggested_installation_to_push);
                var failed_installations_arr_str_to_save = JSON.stringify(failed_installations_arr);
                SetCookieFactory.setCookie('failed_installations', failed_installations_arr_str_to_save, 180);
            }
        }

    }
    $scope.get_location_project = function (location_id) {
        var res = null;
        for (var i = 0; i < $scope.polygons.length; i++) {
            var polygon = $scope.polygons[i];
            var location = GetObjectByAttributeFactory.getObjectByAttribute('id', location_id, polygon.suggested_locations);
            if (location) {
                res = polygon.project;
                break;
            }
        }
        return res;
    }


    $rootScope.$watch('projects', function () {
        $scope.load_map_components();
    });


});