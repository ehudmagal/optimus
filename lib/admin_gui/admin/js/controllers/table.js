materialAdmin
    .controller('tableCtrl', function ($filter, $sce, ngTableParams, tableService, $http, $scope, $rootScope, $compile,
                                       CenterOfCoordsService, urlParamService, FixedPriceService, DistanceService,
                                       PatchObjectFactory) {
        $scope.orders_url = '/orders.json?'
        if (window.location.href.indexOf("private_zone") > -1) {
            $scope.orders_url = '/orders.json/user_index?';
            $rootScope.private_zone = true;
        }
        $rootScope.orders = [];
        
       
        $scope.show_bids = function (order) {
            return false;
        }
        $scope.initMap = function () {
            $('#map').show();
            $('#orders_table').hide();
            $('#show_map_button').hide();
            $('#show_list_button').show();

            $http.get($scope.orders_url)
                .success(function (data, status, headers, config) {
                    $rootScope.orders = data;
                    $scope.map = new google.maps.Map(document.getElementById('map'), {
                        zoom: 8,
                        center: {lat: 32.933052, lng: 35.08267799999999}
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

                        var marker = new google.maps.Marker({
                            position: {lat: lat, lng: lng},
                            map: $scope.map,
                            title: order.source.address
                        });
                        marker.order = order;
                        marker.addListener('click', $scope.marker_cliked_event);
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
            $scope.directionsDisplay.setDirections({routes: []});
            $scope.current_marker = null;
        }
        $scope.marker_cliked_event = function () {
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
            $scope.current_marker = this;
            $scope.directionsService.route({
                origin: this.position,
                destination: this.dest_marker.position,
                travelMode: google.maps.TravelMode.DRIVING
            }, function (response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    $scope.directionsDisplay.setDirections(response);
                    if (!$scope.current_marker.infowindow) {

                        var content_string = '<div>user: ' + $scope.current_marker.order.user.email + '<br>';
                        content_string += 'source address: ' + $scope.current_marker.order.source.address + '<br>';
                        content_string += 'destination address: ' + $scope.current_marker.order.destination.address + '<br>';
                        $scope.routes = response.routes;
                        var distance = DistanceService.distance(response.routes[0]);
                        var offered_price = FixedPriceService.fixedPrice($scope.routes[0], $scope.current_marker.order,
                            DistanceService);
                        offered_price = Math.round(offered_price).toFixed(2);
                        content_string += 'fixed price: ' + offered_price + ' NIS<br>'
                        content_string += 'distance: ' + distance + ' km<br>';
                        var duration = $scope.get_route_duration(response.routes[0]);
                        content_string += 'duration: ' + duration + ' <br>';
                        if ($rootScope.user.role == 'supplier') {
                            content_string += '<input type="number" ng-model="bid_price">'
                            content_string += '<button ng-click="place_bid()" >Place Bid</button>'
                        }
                        content_string += '</div>'
                        var compiled = $compile(content_string)($scope)
                        var infowindow = new google.maps.InfoWindow({
                            content: compiled[0],
                            width: 200,
                            height: 400
                        });
                        $scope.current_marker.infowindow = infowindow;
                        google.maps.event.addListener(infowindow, 'closeclick', $scope.info_window_close_event);
                    }
                    $scope.current_marker.infowindow.open($scope.map, $scope.current_marker);
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });

        }
        $scope.place_bid = function (order) {
            var price = null;
            if (typeof order === 'undefined') {
                order = $scope.current_marker.order;
                price = parseFloat($scope.bid_price);
            }else{
                price = order.current_bid_price;
            }
            var post_data = {
                price: price,
                order_id: order.id
            }
            var url = "/bids.json";
            PatchObjectFactory.patchObject(url, post_data, "post", function () {
                alert("Bid placed successfully");
            });
        }


        $scope.get_route_duration = function (route) {
            var minutes = 0;
            if (route.legs) {
                for (var i = 0; i < route.legs.length; i++) {
                    var leg = route.legs[i];
                    minutes += leg.duration.value / 60;
                }
            }
            var hours = parseInt(minutes / 60);
            var minutes = parseInt(minutes) - hours * 60;
            var res = hours + ' hours and ' + minutes + ' minutes';
            return res;
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




