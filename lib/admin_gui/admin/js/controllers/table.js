materialAdmin
    .controller('tableCtrl', function ($filter, $sce, ngTableParams, tableService, $http, $scope, $rootScope, $compile,
                                       $location, $compile, $rootScope,CenterOfCoordsService, urlParamService, FixedPriceService,
                                       DistanceService, BidColorService, BidFontStyleService, PatchObjectFactory,
                                       GetDateStringFactory, GetObjectByAttributeFactory, DaysBetweenFactory) {

        // pagination
        $scope.curPage = 0;
        $scope.pageSize = 20;
        $scope.page_sizes = [5, 10, 20, 50];
        $scope.ORDER_STATUSES = ORDER_STATUSES;
        $scope.numberOfPages = function () {
            var res = 0;
            if ($rootScope.orders) {
                res = Math.ceil($rootScope.orders.length / $scope.pageSize);
            }
            return res;
        };
        $scope.GetDateStringFactory = GetDateStringFactory;
        $scope.DaysBetweenFactory = DaysBetweenFactory;
        $scope.orders_url = SERVER_STRING+'/orders.json?'
        if ($rootScope.user && $rootScope.user.type == 'Customer') {
            $scope.orders_url = SERVER_STRING+'/orders/user_index.json?';
            $rootScope.private_zone = true;
        }

        $scope.order_lowest_price = function (order) {
            var res = order.fixed_price;
            if (order.bids) {
                for (var i = 0; i < order.bids.length; i++) {
                    var bid = order.bids[i];
                    if (res > bid.price) {
                        res = bid.price;
                    }
                    if (bid.id == order.selected_bid_id) {
                        res = bid.price;
                        break;
                    }
                }
            }
            return res;
        }
        $rootScope.orders = [];


        $scope.show_bids = function (order) {
            return false;
        }
        $scope.initMap = function () {
            $scope.BidColorService = BidColorService;
            $scope.BidFontStyleService = BidFontStyleService;
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
                        var marker = $scope.draw_marker(order);
                        coords.push(marker.position);
                    }
                    var center = CenterOfCoordsService.centerOfCoords(coords);
                    $scope.map.setCenter(center);

                });
        }

        $scope.draw_marker = function (order) {
            var lat = order.source.lat;
            var lng = order.source.lng;

            var marker = new google.maps.Marker({
                position: {lat: lat, lng: lng},
                map: $scope.map,
                title: order.source.address
            });
            marker.order = order;
            marker.order_id = order.id;
            marker.addListener('click', $scope.marker_cliked_event);
            if (!$scope.markers) {
                $scope.markers = [];
            }
            $scope.markers.push(marker);
            return marker;
        }
        $scope.info_window_close_event = function () {
            var cur_marker = null;
            for (var i = 0; i < $scope.markers.length; i++) {
                var marker = $scope.markers[i];
                marker.setIcon(null);
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
                    icon: '/img/darkgreen_MarkerO.png'
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
                        if ($rootScope.user.type == 'Driver') {
                            content_string += '<input type="number" ng-model="bid_price">'
                            content_string += '<button ng-click="place_bid()" >Place Bid</button><br>';
                            content_string += '<button ng-click="find_order_back()" >Look for Orders ' +
                                'on your way back</button><br>';
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
            } else {
                price = order.current_bid_price;
            }
            var post_data = {
                price: price,
                order_id: order.id
            }
            var url = "/bids.json";
            PatchObjectFactory.patchObject(url, post_data, "post", function () {
                $scope.change_order_status(order, ORDER_STATUSES.bidded);
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

        $scope.get_list_heading = function (order) {
            var content = 'Shipper: ' + order.user.email + ' , From: ' + order.source.address + ' , To:'
                + order.destination.address + ' , Start Date: ' + order.start_date;
            return content;
        }
        $scope.order_clicked = function (order) {
            $scope.order_to_show = order;
            order.expended = !order.expended;
            for (var i = 0; i < order.bids.length; i++) {
                var bid = order.bids[i];
                $scope.load_bid_times_user_worked_with(bid);
            }
        }
        $scope.getOrderClass = function (order) {
            var res = 'btn bgm-indigo btn-primary btn-xs waves-effect';
            if (order.status == 'approved') {
                res = 'btn bgm-green btn-primary btn-xs waves-effect';
            }
            return res;
        }
        $scope.load_bid_times_user_worked_with = function (bid) {
            if (bid.times_user_worked_with == undefined) {
                var url = SERVER_STRING + '/users/num_of_closed_bids_with_user.json?user_id=' + bid.user.id;
                $http.get(url)
                    .success(function (data, status, headers, config) {
                        bid.times_user_worked_with = data;
                    })
            }
        }
        $scope.accept_bid = function (bid, order) {
            order.selected_bid_id = bid.id;
            order.status = ORDER_STATUSES.approved;
            var url = '/orders/' + order.id + '.json';
            var post_data = {};
            var order_for_post = jQuery.extend(true, {}, order);
            delete order_for_post.bids;
            post_data['order'] = order_for_post;
            PatchObjectFactory.patchObject(url, post_data, 'patch', function () {
                for (var i = 0; i < order.bids.length; i++) {
                    var _bid = order.bids[i];
                    if (_bid.id == bid.id) {
                        _bid.status = BID_STATUSES.selected;
                    } else {
                        _bid.status = BID_STATUSES.over;
                    }
                }
                order.status = ORDER_STATUSES.approved
                alert('success');
                if (order.options.credit == true) {
                    $scope.order = order;
                    $scope.handle_credit();
                }
            });
        }
        $scope.handle_credit = function () {
            $scope.show_dialog($scope.order, 'credit_dialog');
            $scope.load_brain_tree_token();
        }

        $scope.cancel_bid = function (bid) {
            var url = '/bids/' + bid.id + '.json';
            var post_data = {
                bid: {
                    status: BID_STATUSES.cancelled
                }
            }
            PatchObjectFactory.patchObject(url, post_data, "patch", function () {
                bid.status = BID_STATUSES.cancelled;
                alert("Bid cancelled successfully");
            });
        }
        $scope.get_bid_status = function (bid) {
            var res = bid.status;
            switch (bid.status) {
                case 'selected':
                    res = 'approved';
                    break;
                default:
                    res = bid.status;
                    break;
            }
            return res;
        }

        $scope.change_order_status = function (order, status) {
            order.status = status;
            var url = '/orders/' + order.id + '.json';
            var post_data = {};
            var order_for_post = jQuery.extend(true, {}, order);
            post_data['order'] = order_for_post;
            PatchObjectFactory.patchObject(url, post_data, 'patch', function () {
                alert('success');
            });

        }

        $scope.submitPayment = function () {
            var post_data = {
                order_id: $scope.order.id,
                card_number : $scope.card_number
            }
            var url = "/payments.json";
            PatchObjectFactory.patchObject(url, post_data, "post", function () {
                $scope.close_order_dialog();
                alert("Payment placed successfully");
            });
        }
        $scope.show_bid_accept = function (bid) {
            var res = false;
            if ($scope.user.type == 'Customer') {
                switch (bid.status) {
                    case BID_STATUSES.selected:
                        res = false;
                        break;
                    case BID_STATUSES.over:
                        res = false;
                        break;
                    case BID_STATUSES.cancelled:
                        res = false;
                        break;
                    case BID_STATUSES.pending:
                        res = true;
                        break;
                    default:
                        break;
                }
            }
            return res;
        }

        $scope.show_bid_cancel = function (bid) {
            var res = false;
            if ($scope.user.type == 'Driver') {
                switch (bid.status) {
                    case BID_STATUSES.selected:
                        res = false;
                        break;
                    case BID_STATUSES.over:
                        res = true;
                        break;
                    case BID_STATUSES.pending:
                        res = true;
                        break;
                    default:
                        break;
                }
            }
            return res;
        }

        $scope.show_dialog = function (order, form_id) {
            $scope.order_to_show = order;
            order.expended = false;
            $scope.order_clicked(order);
            $.blockUI({
                message: $('#' + form_id), css: {
                    top: '10px',
                    width: '500px'
                },
                onOverlayClick: $scope.close_order_dialog
            });
        }


        $scope.close_order_dialog = function () {
            $.unblockUI();
        }

        $scope.show_progress_buttons_driver = function (order) {
            var res = false;
            if (order && $rootScope.user.type == 'Driver' &&
                order.status != ORDER_STATUSES.booked) {
                res = true;
            }
            return res;
        }
        $scope.show_progress_buttons_customer = function (order) {
            var res = false;
            if (order && $rootScope.user.type == 'Customer' &&
                order.status != ORDER_STATUSES.booked) {
                res = true;
            }
            return res;
        }

        $scope.progress_button_class = function (order, status) {
            var res = 'btn bgm-indigo waves-effect';
            if (order) {
                if (order.status == status) {
                    res = 'btn bgm-amber waves-effect';
                }
            }
            return res;
        }
        $scope.disabled_progress_buttons = function (order, next_status) {
            var res = true;
            if (order) {
                switch (order.status) {
                    case ORDER_STATUSES.approved:
                        if (next_status == ORDER_STATUSES.before_pickup) {
                            res = false;
                        }
                        break;
                    case ORDER_STATUSES.before_pickup:
                        if (next_status == ORDER_STATUSES.picked_up) {
                            res = false;
                        }
                        break;
                    case ORDER_STATUSES.picked_up:
                        if (next_status == ORDER_STATUSES.delivered) {
                            res = false;
                        }
                        break;
                    default:
                        break;

                }
            }
            return res;
        }

        $scope.searchOrdersOnMap = function () {
            var orders = $filter('searchAnything')($scope.orders, $scope.order_id, ['id']);
            orders = $filter('searchDate')(orders, $scope.pickup_time, 'pickup_time', DaysBetweenFactory);
            orders = $filter('searchAnything')(orders, $scope.source_address, ['source.address']);
            orders = $filter('searchAnything')(orders, $scope.destination_address, ['destination.address']);
            orders = $filter('searchAnything')(orders, $scope.status_query, ['status']);
            orders = $filter('searchAnything')(orders, $scope.order_description, ['description']);
            if (orders.length == $rootScope.orders.length) {
                for (var i = 0; i < $scope.markers.length; i++) {
                    var marker = $scope.markers[i];
                    marker.setVisible(true);
                }
            } else {
                for (var i = 0; i < $scope.markers.length; i++) {
                    var marker = $scope.markers[i];
                    marker.setVisible(false);
                }
                var coords = [];
                for (var i = 0; i < orders.length; i++) {
                    var order = orders[i];
                    var marker = GetObjectByAttributeFactory.getObjectByAttribute('order_id', order.id, $scope.markers);
                    if (marker) {
                        coords.push(marker.getPosition());
                        marker.setVisible(true);
                    }
                }
                var center = CenterOfCoordsService.centerOfCoords(coords);
                $scope.map.setCenter(center);
            }
        }


        $scope.live_pole = function () {
            $http.defaults.useXDomain = true;
            $http.get($scope.orders_url, {
                ignoreLoadingBar: true
            })
                .success(function (data, status, headers, config) {
                    for (var i = 0; i < data.length; i++) {
                        var order = data[i];
                        var existing_order = GetObjectByAttributeFactory.getObjectByAttribute(
                            'id', order.id, $scope.orders);
                        if (existing_order) {
                            existing_order.bids = order.bids;
                            existing_order.status = order.status;
                        } else {
                            $rootScope.orders.push(data[i]);
                            $scope.draw_marker(data[i]);
                        }

                    }
                });


        }

        $scope.mark_travel_back = function (order) {
            return function (response, status) {
                if (status === 'OK') {
                    var distance = DistanceService.distance(response.routes[0]);
                    if (distance < 50) {
                        var marker = GetObjectByAttributeFactory.getObjectByAttribute('order_id', order.id, $scope.markers);
                        marker.setIcon('/img/darkgreen_MarkerO.png')
                    }

                } else {
                    console.log('Could not display directions due to: ' + status);
                }
            }
        }

        $scope.find_order_back = function (order) {
            if (typeof order === 'undefined') {
                order = $scope.current_marker.order;
            }
            var directionsService = new google.maps.DirectionsService;
            for (var i = 0; i < $scope.orders.length; i++) {
                var _order = $scope.orders[i];
                if (order.id != _order.id &&
                    (_order.status == ORDER_STATUSES.booked || _order.status == ORDER_STATUSES.bidded)) {
                    var start = new google.maps.LatLng(order.destination.lat, _order.destination.lng);
                    var end = new google.maps.LatLng(_order.source.lat, _order.source.lng);
                    /*directionsService.route({
                     origin: start,
                     destination: end,
                     travelMode: 'DRIVING',
                     }, $scope.mark_travel_back(order))*/
                    var distance = google.maps.geometry.spherical.computeDistanceBetween(start, end);
                    distance /= 1000
                    if (distance < 50) {
                        var marker = GetObjectByAttributeFactory.getObjectByAttribute('order_id', _order.id, $scope.markers);
                        marker.setIcon('/img/darkgreen_MarkerO.png')
                    }
                }
            }

        }

        $scope.confirm_cancel = function (order) {
            switch (order.status) {
                case  ORDER_STATUSES.approved:
                    if (confirm('You are about to cancel an approved order. Are you sure?')) {
                        $scope.change_order_status(order, ORDER_STATUSES.cancelled);
                        $scope.cancel_bids(order);
                    }
                    break;
                case ORDER_STATUSES.bidded:
                    $scope.change_order_status(order, ORDER_STATUSES.cancelled);
                    $scope.cancel_bids(order);
                    break;
                case ORDER_STATUSES.booked:
                    $scope.change_order_status(order, ORDER_STATUSES.cancelled);
                    $scope.cancel_bids(order);
                    break;
                case ORDER_STATUSES.cancelled:
                    break;
                default:
                    break;
            }

        }

        $scope.cancel_bids = function (order) {
            if (order.bids) {
                for (var i = 0; i < order.bids.length; i++) {
                    var bid = order.bids[i];
                    $scope.cancel_bid(bid);
                }
            }
        }

        $scope.load_brain_tree_token = function () {
            var url = SERVER_STRING + '/payments/braintree_client_token'
            $http.get(url)
                .success(function (data, status, headers, config) {
                    $scope.braintree_token_from_server = data.token;
                    var button = document.querySelector('#submit-button');

                    braintree.dropin.create({
                        authorization:   $scope.braintree_token_from_server,
                        container: '#dropin-container'
                    }, function (createErr, instance) {
                        button.addEventListener('click', function () {
                            instance.requestPaymentMethod(function (err, payload) {
                                // Submit payload.nonce to your server
                            });
                        });
                    });
                })
        }
        setInterval(function () {
            $scope.live_pole();
        }, 20000);
        $scope.initMap();
    })
