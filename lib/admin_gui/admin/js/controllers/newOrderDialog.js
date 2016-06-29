materialAdmin
    .controller('newOrderDialogCtrl', function ($filter, $sce, ngTableParams, tableService, $http, $scope, $rootScope,
                                                PatchObjectFactory, CenterOfCoordsService) {

        //Status
        $scope.global_fields_counter = 0;
        $scope.wizard_length = 10;
        $scope.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 4,
            center: {lat: -25.363, lng: 131.044}
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
            }
        };
        $scope.submit_order = function () {
            var url = '/orders.json';
            var post_data = {};
            var order_for_post = jQuery.extend(true, {}, $scope.order);
            post_data['order'] = order_for_post;
            PatchObjectFactory.patchObject(url, post_data, 'post', $scope.goto_personal_zone);

        }
        $scope.goto_personal_zone = function () {
            window.location.assign("#/private_zone");
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
        $scope.showField = function (num) {
            var res = false;
            if (num == $scope.global_fields_counter) {
                res = true;
            }
            return res;
        }
        $scope.moveWizard = function (direction) {
            switch(direction){
                case 'minus':
                    if($scope.global_fields_counter > 0){
                        $scope.global_fields_counter--;
                    }
                    break;
                case 'plus':
                    if($scope.global_fields_counter < $scope.wizard_length){
                        $scope.global_fields_counter++;
                    }
                    break;
                default:
                    break;
            }
            $scope.show_form_fields();
        }
        $scope.show_form_fields = function(){
            for(var i = 0 ; i < $scope.wizard_length ; i++){
                if(i != $scope.global_fields_counter){
                    $('#form_'+i).hide();
                }else{
                    $('#form_'+i).show();
                }
            }
        }
        $scope.show_form_fields();
        $scope.initAutocomplete();


    })