materialAdmin
.controller('newOrderCtrl', function($filter, $sce, ngTableParams, tableService,$http,$scope,$rootScope,
                                     PatchObjectFactory,CenterOfCoordsService,IsEmptyObjService,FixedPriceService,
                                     DistanceService){

    //Status

    $scope.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: {lat: 32.933052, lng: 35.08267799999999}
    });
    $scope.directionsService = new google.maps.DirectionsService;
    $scope.directionsDisplay = new google.maps.DirectionsRenderer;
    $scope.directionsDisplay.setMap($scope.map);
    $scope.markers = [null,null];
    $scope.order = {
        work_type:{
            pallet :{},
            bulk:{},
            other:{}
        }
    };
    $scope.init_combojs_components = function () {
        $('#time').combodate({
            firstItem: 'name', //show 'hour' and 'minute' string at first item of dropdown
            minuteStep: 30
        });
        $('#cutoff_time').combodate({
            firstItem: 'name', //show 'hour' and 'minute' string at first item of dropdown
            minuteStep: 30
        });
        $('#delivery_after_time').combodate({
            firstItem: 'name', //show 'hour' and 'minute' string at first item of dropdown
            minuteStep: 30
        });
        $('#delivery_cutoff_time').combodate({
            firstItem: 'name', //show 'hour' and 'minute' string at first item of dropdown
            minuteStep: 30
        });
    }

    $scope.submit_order = function () {
        var url =   '/orders.json';
        var post_data = {};
        $scope.order.fixed_price = FixedPriceService.fixedPrice($scope.order.routes[0],$scope.order,DistanceService);
        var pickup_cutoff_hour =  $scope.get_milliseconds_by_time($scope.order.pickup_cutoff_hour);
        $scope.order.pickup_cutoff_time = new Date($scope.order.pickup_time.getTime() + pickup_cutoff_hour);
        var pickup_hour = $scope.get_milliseconds_by_time($scope.order.pickup_hour);
        $scope.order.pickup_time = new Date($scope.order.pickup_time.getTime() + pickup_hour);
        var delivery_cutoff_hour =  $scope.get_milliseconds_by_time($scope.order.delivery_cutoff_hour);
        $scope.order.delivery_cutoff_time = new Date($scope.order.delivery_time.getTime() + delivery_cutoff_hour);
        var delivery_hour = $scope.get_milliseconds_by_time($scope.order.delivery_hour);
        $scope.order.delivery_time = new Date($scope.order.delivery_time.getTime() + delivery_hour);
        var order_for_post = jQuery.extend(true, {}, $scope.order);
        post_data['order'] = order_for_post;
        PatchObjectFactory.patchObject(url, post_data, 'post', $scope.goto_personal_zone);

    }
    $scope.get_milliseconds_by_time = function (hour_str) {
        var a = hour_str.split(':'); // split it at the colons
        var hours = parseInt(a[0]);
        var minutes =  parseInt(a[1]);
        var res = (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);
        return res;
    }
    $scope.goto_personal_zone = function(){
        alert('success');
        window.location.assign("#/");
    }
    $scope.geolocate = function(type) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var geolocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                var circle = new google.maps.Circle({
                    center: geolocation,
                    radius: position.coords.accuracy
                });
                if(type == 'source'){
                    $scope.autocomplete.setBounds(circle.getBounds());
                }else{
                    $scope.autocomplete1.setBounds(circle.getBounds());
                }

            });
        }
    }

    $scope.initAutocomplete = function() {
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
    $scope.clear_order_loads = function () {
        if($scope.order){
            $scope.order.pallets_count = 0;
            $scope.order.boxes_count = 0;
            $scope.show_pallets = false;
            $scope.show_boxes = false;
        }
    }
    $scope.fillInSrcAddress = function(){
        var place = $scope.autocomplete.getPlace();
        var source = {};
        source.lat = place.geometry.location.lat();
        source.lng = place.geometry.location.lng();
        source.place_id = place.id;
        source.address = place.formatted_address;
        $scope.order.source = source;
        var marker = $scope.drawMarker(source);
        if($scope.markers[0]){
            $scope.markers[0].setMap(null);
        }
        $scope.markers[0] = marker;
        $scope.center_map();
    }
    $scope.fillInDstAddress = function(){
        var place = $scope.autocomplete1.getPlace();
        var destination = {};
        destination.lat = place.geometry.location.lat();
        destination.lng = place.geometry.location.lng();
        destination.place_id = place.id;
        destination.address = place.formatted_address;
        $scope.order.destination = destination;
        var marker = $scope.drawMarker(destination);
        if($scope.markers[1]){
            $scope.markers[1].setMap(null);
        }
        $scope.markers[1] = marker;
        $scope.center_map();
        if($scope.markers[0] && $scope.markers[1]) {
            $scope.directionsService.route({
                origin: $scope.markers[0].position,
                destination: $scope.markers[1].position,
                travelMode: google.maps.TravelMode.DRIVING
            }, function (response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    $scope.directionsDisplay.setDirections(response);
                    $scope.order.routes =   response.routes;
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
    $scope.center_map = function(){
        if($scope.markers.length){
            var coords = [];
            for(var i = 0 ; i < $scope.markers.length ; i++){
                var marker = $scope.markers[i];
                if(marker) {
                    coords.push(marker.position);
                }
            }
            var center = CenterOfCoordsService.centerOfCoords(coords);
            $scope.map.setCenter(center);
        }
    }
    $scope.initAutocomplete();
    $scope.init_combojs_components();

})