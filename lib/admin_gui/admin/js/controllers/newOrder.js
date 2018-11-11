materialAdmin
    .controller('newOrderCtrl', function ($filter, $sce, ngTableParams, tableService, $http, $scope, $rootScope,
                                          PatchObjectFactory, CenterOfCoordsService, IsEmptyObjService, FixedPriceService,
                                          DistanceService) {

        //Status

        $scope.map = new google.maps.Map(document.getElementById('map1'), {
            zoom: 8,
            center: {lat: 32.933052, lng: 35.08267799999999},
            fullscreenControl: false
        });
        $scope.directionsService = new google.maps.DirectionsService;
        $scope.directionsDisplay = new google.maps.DirectionsRenderer;
        $scope.directionsDisplay.setMap($scope.map);
        $scope.markers = [null, null];
        $scope.order = {
            work_type: {
                pallet: {},
                bulk: {},
                other: {}
            },
            box_types: [],
            pallet_types: [],
            pickup_time: new Date(),
            delivery_time: new Date(),
            payment_method: {fixedPrice: true, bid: false},
            credit: false
        };
        $scope.init_time_pickers = function () {
            $('#pickup_time').timepicker();
            $('#delivery_time').timepicker();
        }


        $scope.submit_order = function () {
            var url = '/orders.json';
            var post_data = {};
            $scope.order.pickup_time = $scope.prepare_time($scope.order.pickup_time, $scope.order.pickup_hour);
            $scope.order.delivery_time = $scope.prepare_time($scope.order.delivery_time, $scope.order.delivery_hour);
            var order_for_post = jQuery.extend(true, {}, $scope.order);
            delete order_for_post.routes
            post_data['order'] = order_for_post;
            PatchObjectFactory.patchObject(url, post_data, 'post', $scope.goto_personal_zone);

        }

        $scope.prepare_time = function (date, time) {
            var hour = $scope.getTimeByStr(time);
            var res = new Date(date.setHours(0, 0, 0, 0) + hour);
            return res;
        }

        $scope.getTimeByStr = function (str) {
            var hour = parseInt(str.split(':')[0]);
            if(str.toLowerCase().indexOf('pm') != -1){
                hour+=12;
            }
            var minute = parseInt(str.split(':')[1].substring(0, 2));
            var res = hour * 60 * 60 * 1000 + minute * 60 * 1000;
            return res;
        }

        $scope.goto_personal_zone = function () {
            alert('Order Dispatched Successfully');
            window.location.assign("#/");
        }
        $scope.geolocate = function (type) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var geolocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    var circle = new google.maps.Circle({
                        center: geolocation,
                        radius: position.coords.accuracy
                    });
                    if (type == 'source') {
                        $scope.autocomplete.setBounds(circle.getBounds());
                    } else {
                        $scope.autocomplete1.setBounds(circle.getBounds());
                    }

                });
            }
        }

        $scope.initAutocomplete = function () {
            // Create the autocomplete object, restricting the search to geographical
            // location types.
            $scope.autocomplete = new google.maps.places.Autocomplete(
                /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
                {types: ['geocode']});
            $scope.autocomplete1 = new google.maps.places.Autocomplete(
                /** @type {!HTMLInputElement} */(document.getElementById('autocomplete1')),
                {types: ['geocode']});

            // When the user selects an address from the dropdown, populate the address
            // fields in the form.
            $scope.autocomplete.addListener('place_changed', $scope.fillInSrcAddress);
            $scope.autocomplete1.addListener('place_changed', $scope.fillInDstAddress);

        }
        $scope.getTruckLoadClass = function () {
            var res = 'fg-line';
            if ($scope.truck_load) {
                res += ' fg-toggled';
            }
            return res;
        }
        $scope.truckLoadMessage = function () {
            var res = $scope.translate('Remarks');
            if ($scope.truck_load) {
                res = $scope.translate('TruckLoad Details');
            }
            return res;
        }
        $scope.fillInSrcAddress = function () {
            var place = $scope.autocomplete.getPlace();
            var source = {};
            source.lat = place.geometry.location.lat();
            source.lng = place.geometry.location.lng();
            source.place_id = place.id;
            source.address = place.formatted_address;
            $scope.order.source = source;
            var marker = $scope.drawMarker(source);
            if ($scope.markers[0]) {
                $scope.markers[0].setMap(null);
            }
            $scope.markers[0] = marker;
            $scope.center_map();
        }
        $scope.fillInDstAddress = function () {
            var place = $scope.autocomplete1.getPlace();
            var destination = {};
            destination.lat = place.geometry.location.lat();
            destination.lng = place.geometry.location.lng();
            destination.place_id = place.id;
            destination.address = place.formatted_address;
            $scope.order.destination = destination;
            var marker = $scope.drawMarker(destination);
            if ($scope.markers[1]) {
                $scope.markers[1].setMap(null);
            }
            $scope.markers[1] = marker;
            $scope.center_map();
            if ($scope.markers[0] && $scope.markers[1]) {
                $scope.directionsService.route({
                    origin: $scope.markers[0].position,
                    destination: $scope.markers[1].position,
                    travelMode: google.maps.TravelMode.DRIVING
                }, function (response, status) {
                    if (status === google.maps.DirectionsStatus.OK) {
                        $scope.directionsDisplay.setDirections(response);
                        $scope.order.routes = response.routes;
                        var distance = DistanceService.distance(response.routes[0]);
                        $scope.order.distance = distance;
                    } else {
                        window.alert('Directions request failed due to ' + status);
                    }
                });
            }

        }
        $scope.drawMarker = function (place) {
            var marker = new google.maps.Marker({
                position: {lat: place.lat, lng: place.lng},
                map: $scope.map,
                title: place.address
            });
            return marker;
        }
        $scope.center_map = function () {
            if ($scope.markers.length) {
                var coords = [];
                for (var i = 0; i < $scope.markers.length; i++) {
                    var marker = $scope.markers[i];
                    if (marker) {
                        coords.push(marker.position);
                    }
                }
                var center = CenterOfCoordsService.centerOfCoords(coords);
                $scope.map.setCenter(center);
            }
        }
        $scope.formDirection = function () {
            var res = '';
            $scope.map.setOptions({
                zoomControlOptions: {position: google.maps.ControlPosition.RIGHT_BOTTOM},
                streetViewControlOptions: {position: google.maps.ControlPosition.RIGHT_BOTTOM},
                mapTypeControlOptions: {
                    position: google.maps.ControlPosition.RIGHT
                }
            });
            if ($scope.lang && $scope.lang != 'en') {
                res = 'float: right;position: absolute; right:10px;';
                $scope.map.setOptions({
                    zoomControlOptions: {position: google.maps.ControlPosition.LEFT_BOTTOM},
                    streetViewControlOptions: {position: google.maps.ControlPosition.LEFT_BOTTOM},
                    mapTypeControlOptions: {
                        position: google.maps.ControlPosition.LEFT_TOP
                    }
                });
            }
            return res;
        }

        $scope.addItemToArr = function (arr) {
            if (arr.length < 3) {
                arr.push({});
            }
        }

        $scope.remove_obj_from_arr = function (obj, arr) {
            var index = arr.indexOf(obj);
            if (index != -1) {
                arr.splice(index, 1);
            }
        }

        $scope.mapHeight = function () {
            var height = $("#form_container").height();
            if (!height) {
                height = 1500;
            }
            return height;
        }

        $scope.paymentMethod = function (method) {
            switch (method) {
                case 'fixedPrice':
                    $scope.order.payment_method.fixedPrice = true;
                    $scope.order.payment_method.bid = false;
                    break;
                case 'bid':
                    $scope.order.payment_method.fixedPrice = false;
                    $scope.order.payment_method.bid = true;
                    break;
                default:
                    break;
            }
        }


        $scope.paymaentMethodStyle = function (methodName) {
            var res = {};
            if (methodName == 'bid' && $scope.order.payment_method.fixedPrice) {
                res = {'background-color': '#ccc'};
            } else if (methodName == 'fixedPrice' && $scope.order.payment_method.bid) {
                res = {'background-color': '#ccc'};
            }
            return res;
        }

        $scope.setCredit = function (credit) {
            $scope.order.credit = credit;
        }


        $scope.mapStyle = {"height": $scope.mapHeight() + "px"}

        $scope.initAutocomplete();
        $scope.init_time_pickers();

    })