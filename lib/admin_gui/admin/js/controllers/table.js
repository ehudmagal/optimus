materialAdmin
    .controller('tableCtrl', function($filter, $sce, ngTableParams, tableService,$http,$scope,$rootScope,
                                      CenterOfCoordsService) {
        $scope.orders_url = '/orders.json?'
        $rootScope.orders = [];

        $scope.initMap = function() {
            $('#map').show();
            $('#orders_table').hide();
            $('#show_map_button').hide();
            $('#show_list_button').show();
            $http.get($scope.orders_url)
                .success(function (data, status, headers, config) {
                    $rootScope.orders = data;
                    $scope.map = new google.maps.Map(document.getElementById('map'), {
                        zoom: 4,
                        center: {lat: -25.363, lng: 131.044}
                    });
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
                cur_marker.line.setVisible(false);
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
                var line = new google.maps.Polyline({
                    path: [
                        this.position,
                        this.dest_marker.position
                    ],
                    strokeColor: "blue",
                    strokeOpacity: 1.0,
                    strokeWeight: 3,
                    map: $scope.map
                });
                this.line = line;
            }
            this.dest_marker.setVisible(true);
            this.line.setVisible(true);

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
            $('#show_list_button').hide();
            $('#show_map_button').show();
        }
        $scope.initMap();
    })

