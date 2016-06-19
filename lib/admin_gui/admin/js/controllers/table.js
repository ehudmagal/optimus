materialAdmin
    .controller('tableCtrl', function($filter, $sce, ngTableParams, tableService,$http,$scope,$rootScope,
                                      CenterOfCoordsService,urlParamService) {
        $scope.orders_url = '/orders.json?'
        $rootScope.orders = [];
        $scope.personal_zone = urlParamService.urlParam('personal');
        if(window.location.href.indexOf("private_zone") > -1
            && $rootScope.devise_user_name != 'Guest') {
            $scope.orders_url = '/orders/user_index.json';
        }
        $scope.initMap = function() {
            $('#map').show();
            $('#orders_table').hide();
            $('#show_map_button').hide();
            $('#show_list_button').show();

            $http.get($scope.orders_url)
                .success(function (data, status, headers, config) {
                    $rootScope.orders = data;
                    $scope.tableFilter = new ngTableParams({
                        page: 1,            // show first page
                        count: 10
                    }, {
                        total:  $rootScope.orders.length, // length of data
                        getData: function($defer, params) {
                            // use build-in angular filter
                            var orderedData = params.filter() ? $filter('filter')( $rootScope.orders, params.filter()) : data;
                            this.id = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                            this.user = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                            this.source = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                            this.destination = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                            this.goods_type = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                            this.work_type = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                            this.transport_type = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                            this.start_date = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                            this.end_date = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                            this.start_date = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                            this.deal_type = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                            params.total(orderedData.length); // set total for recalc pagination
                            $defer.resolve(this.id, this.name, this.email, this.username, this.contact);
                        }
                    })
                    $scope.map = new google.maps.Map(document.getElementById('map'), {
                        zoom: 4,
                        center: {lat: -25.363, lng: 131.044}
                    });
                    $scope.directionsService = new google.maps.DirectionsService;
                    $scope.directionsDisplay = new google.maps.DirectionsRenderer;
                    $scope.directionsDisplay.setMap($scope.map);
                    $scope.markers = [];
                    var coords = [];
                    for (var i = 0; i < $rootScope.orders.length; i++) {
                        var order = $rootScope.orders[i];
                        var lat = order.source.lat;
                        var lng = order.source.lng;
                        var content_string = 'user: ' + order.user.email + '<br>';
                        content_string += 'source address: ' + order.source.address + '<br>';
                        content_string += 'destination address: ' + order.destination.address + '<br>';
                        var infowindow = new google.maps.InfoWindow({
                            content: content_string
                        });
                        var marker = new google.maps.Marker({
                            position: {lat: lat, lng: lng},
                            map: $scope.map,
                            title: order.source.address
                        });
                        marker.order = order;
                        marker.infowindow = infowindow;
                        marker.addListener('click', $scope.marker_cliked_event);
                        google.maps.event.addListener(infowindow, 'closeclick', $scope.info_window_close_event);
                        coords.push(marker.position);
                        $scope.markers.push(marker);
                    }
                    var center = CenterOfCoordsService.centerOfCoords(coords);
                    $scope.map.setCenter(center);

                });
        }
        $scope.info_window_close_event = function () {
            var cur_marker = null;
            for (var i = 0; i < $scope.markers.length; i++) {
                var marker = $scope.markers[i];
                if (marker.infowindow == this) {
                    cur_marker = marker;
                    break;
                }
            }
            if (cur_marker) {
                cur_marker.dest_marker.setVisible(false);
            }
        }
        $scope.marker_cliked_event = function () {
            this.infowindow.open($scope.map, this);
            var order = this.order;
            if (!this.dest_marker) {
                var lat = order.destination.lat;
                var lng = order.destination.lng;
                this.dest_marker = new google.maps.Marker({
                    position: {lat: lat, lng: lng},
                    map: $scope.map,
                    title: order.destination.address,
                    icon: '/admin/img/darkgreen_MarkerO.png'
                });

            }
            this.dest_marker.setVisible(true);
            $scope.directionsService.route({
                origin: this.position,
                destination:  this.dest_marker.position,
                travelMode: google.maps.TravelMode.DRIVING
            }, function(response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    $scope.directionsDisplay.setDirections(response);
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });

        }
        $scope.listView = function () {
            $('#map').hide();
            $('#orders_table').show();
            $('#show_list_button').hide();
            $('#show_map_button').show();
        }
        $scope.mapView = function () {
            $('#map').show();
            $('#orders_table').hide();
            $('#show_list_button').show();
            $('#show_map_button').hide();
        }
        $scope.initMap();
    })

