materialAdmin
.controller('newOrderCtrl', function($filter, $sce, ngTableParams, tableService,$http,$scope,$rootScope,
                                     PatchObjectFactory){

    //Status

    $scope.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: {lat: -25.363, lng: 131.044}
    });
    $scope.markers = [];
    $scope.order = {
        work_type:{
            pallet :{},
            bulk:{},
            other:{}
        }
    };
    $scope.submit_order = function () {
        var url =   '/orders.json';
        var post_data = {};
        var order_for_post = jQuery.extend(true, {}, $scope.order);
        post_data['order'] = order_for_post;
        PatchObjectFactory.patchObject(url, post_data, 'post', $scope.goto_personal_zone);

    }
    $scope.goto_personal_zone = function(){
        window.location.assign("#/private_zone");
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
    $scope.fillInSrcAddress = function(){
        var place = $scope.autocomplete.getPlace();
        var source = {};
        source.lat = place.geometry.location.lat();
        source.lng = place.geometry.location.lng();
        source.place_id = place.id;
        source.address = place.formatted_address;
        $scope.order.source = source;
        $scope.drawMarker(source);
    }
    $scope.fillInDstAddress = function(){
        var place = $scope.autocomplete1.getPlace();
        var destination = {};
        destination.lat = place.geometry.location.lat();
        destination.lng = place.geometry.location.lng();
        destination.place_id = place.id;
        destination.address = place.formatted_address;
        $scope.order.destination = destination;
        $scope.drawMarker(destination);
    }
    $scope.drawMarker = function (place) {
        var marker = new google.maps.Marker({
            position: {lat: place.lat, lng: place.lng},
            map: $scope.map,
            title: place.address
        });
        $scope.markers.push(marker)

    }
    $scope.initAutocomplete();

})