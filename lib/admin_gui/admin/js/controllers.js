
var app = angular.module('main', ['ngTable', 'ngRoute', 'ngCookies', 'ngResource']);


app.controller('MainCtrl', function ($scope, $rootScope, $filter, $http, ngTableParams, breadcrumbs, $location,
                                     $cookies, GetObjectByIdFactory, GetObjectByUrlPaginationFactory, GetManyToOneArrayFactory,
                                     GetObjectFromCacheFactory,GetObjectByAttributeFactory) {
    $scope.breadcrumbs = breadcrumbs;
    $scope.location = $location;

    $scope.isViewLoading = false;



    $scope.orders_page = function(){
        window.location.assign("#/");
    }
    $scope.companies_page = function(){
        window.location.assign("#/companies");
    }
    $scope.new_order = function (companyId) {
        var url = "#/new_order";
        if(companyId){
            url += '/'+companyId;
        }
        window.location.assign(url);
    };
    $rootScope.getDateString = function(date_string){
        return (new Date(date_string)).toDateString();
    }
    $rootScope.batch_name = function(type_id){
        var res = '';
        var batch = GetObjectByAttributeFactory.getObjectByAttribute('id',type_id,$rootScope.batch_types);
        if(batch){
            res = batch.name;
        }
        return res;
    }

    $rootScope.new_batch = function (orderId) {
        window.location.assign('#/orders/'+orderId+'/new_batch');
    };
    $rootScope.batch_types = [{id:1,name: 'וילונות רומאיים חפים מוכנים'}, {id:2, name:'וילונות זברה ופליי זברה'},
        {id:3, name: 'וילונות מודפסים' } ,{id: 4, name: 'וילונות גלילה'},
        {id:5,name: 'וילונות זברה'},{id:6,name:'תריסים ונציאנים' }, {id:7,name:'וילונות תפורים'}];



});

app.controller('OrdersCtrl', function ($scope, $rootScope, $filter, $http, ngTableParams, breadcrumbs, $location,
                                       $cookies, GetObjectByIdFactory, GetObjectByUrlPaginationFactory,
                                       GetManyToOneArrayFactory, GetObjectFromCacheFactory,GetObjectByAttributeFactory) {
    $scope.breadcrumbs = breadcrumbs;
    $scope.location = $location;
    $scope.show_unlocked_users = true;
    $scope.isViewLoading = false;
    $scope.orders_url = server_string + '/admin/orders.json?'
    $scope.per_page = 20;
    $scope.page = 1;
    $scope.name_query = '';
    $scope.id_query = '';
    $scope.first_load = true;


    $scope.searchCompanyName = function () {
        if ($scope.company_name_query) {
            if ($scope.company_name_query.length) {
                for(var i = 0 ; i < $scope.companies.length ; i++){
                    var company = $scope.companies[i];
                    if(company.name.indexOf($scope.company_name_query) != -1){
                        $scope.company_id_query = company.id;
                        break;
                    }
                }
                $scope.orders = $scope.get_orders();
            }
        }
    }

    $scope.searchId = function () {
        if ($scope.id_query) {
            $scope.orders = $scope.get_orders();
        }
    }

    $scope.changePageSize = function () {
        $scope.orders = $scope.get_orders();
    }

    $scope.options = [
        {label: '5', value: 5},
        {label: '10', value: 10},
        {label: '20', value: 20},
        {label: '50', value: 50}
    ];
    $scope.page_size = $scope.options[2];
    $scope.reset = function () {
        $scope.page = 1;
        $scope.id_query = '';
        $scope.company_name_query = '';
        $scope.company_id_query = undefined;
        $scope.page_size = $scope.options[2];
        $scope.orders = $scope.get_orders();
    }
    $scope.nextPage = function () {
        $scope.page++;
        $scope.orders = $scope.get_orders();
    }
    $scope.prevPage = function () {
        if ($scope.page > 0) {
            $scope.page--;
        }
        $scope.orders = $scope.get_orders();
    }





    $scope.get_orders = function () {
        if (!$scope.first_load) {
            Pace.restart();
        } else {
            $scope.first_load = false;
        }
        var paging = '&per_page=' + $scope.page_size.value + '&page=' + $scope.page;
        var params = 'utf8=%E2%9C%93&order=id_asc' + paging;
        if ($scope.company_id_query) {
            params = params + '&q%5Bcompany_id_equals%5D=' + $scope.company_id_query
        }

        if ($scope.id_query) {
            if ($scope.id_query != '') {
                params = params + '&q%5Bid_equals%5D=' + $scope.id_query;
            }
        }

        var url = $scope.orders_url + params;
        var res = null
        $.ajax({
            async: false,
            dataType: "json",
            url: url,
            success: function (result) {
                res = result;
            },
            error: function (result) {
                console.log(result);
            }
        });
        return res;
    }

    $http.get(server_string + '/admin/companies.json', {
        timeout: 30000,
        cache: false
    }).success(function (data) {
        $scope.companies = data;
    });
    $scope.orders = $scope.get_orders();


});



app.controller('batchConfigurationCtrl', ['$scope', '$routeParams', '$http', '$cookies', 'loggerRepository', 'UserLoggersRepository',
    'ChangeLoggerOwnerFactory', 'SubmitJsonFactory', 'GetDateTimeFormatForAngularFactory', 'GetDateTimeFormatForRubbyFactory', 'breadcrumbs', '$location',
    '$filter', 'GetObjectByIdFactory', 'GetObjectByUrlFactory', 'UpdateUserFactory', 'GetObjectByUrlPaginationFactory', 'GetDifferentFieldsFactory', '$rootScope', 'GetObjectFromCacheFactory', 'GetManyToOneArrayFactory', 'GetObjectByUrlIdsFactory', 'GetObjectByUrlSynchFactory',
    'PatchObjectFactory',
    function ($scope, $routeParams, $http, $cookies, loggerRepository, UserLoggersRepository, ChangeLoggerOwnerFactory,
              SubmitJsonFactory, GetDateTimeFormatForAngularFactory, GetDateTimeFormatForRubbyFactory, breadcrumbs,
              $location, $filter, GetObjectByIdFactory, GetObjectByUrlFactory, UpdateUserFactory, GetObjectByUrlPaginationFactory,
              GetDifferentFieldsFactory, $rootScope, GetObjectFromCacheFactory, GetManyToOneArrayFactory,
              GetObjectByUrlIdsFactory, GetObjectByUrlSynchFactory,PatchObjectFactory) {


        $scope.location = $location;
        $scope.breadcrumbs = breadcrumbs;
        $scope.batchId = $routeParams.batchId;
        $scope.orderId = $routeParams.orderId;




        $scope.load_data = function(){
            if($scope.batchId) {
                $http.get(server_string + '/admin/batches/' + $scope.batchId + '.json', {
                    timeout: 30000,
                    cache: false
                }).success(function (data) {
                    $scope.batch = data;
                    for (var i = 0; i < $scope.batch_types.length; i++) {
                        var type = $scope.batch_types[i];
                        if (type == $scope.batch.batch_type) {
                            $scope.batch.batch_type = $scope.batch_types[i];
                        }
                    }
                });
            }else{
                $scope.batch = {order_id: $scope.orderId};
            }
        }




        $scope.edit_batch = function (batch) {
            var url = server_string + '/admin/batches/'+batch.id+'.json';
            var method = 'patch';
            var post_data = {};
            var csrf_token = $cookies['CSRF-TOKEN'];
            post_data['authenticity_token'] = csrf_token;
            post_data['_method'] = 'patch';
            post_data['commit'] = 'Update Batch';
            post_data['utf8'] = '%E2%9C%93';
            post_data['batch'] = batch;
            var callback = function(){alert("data updated successfuly")};
            if(!$scope.batchId){
                delete  post_data['_method']
                method = 'post'
                url = server_string + '/admin/batches.json';
                callback =  $scope.goto_batch_page;
            }
            PatchObjectFactory.patchObject(url,post_data,method,callback);
        }




        $scope.goto_batch_page = function(data){
            window.location.assign("#/orders/"+$scope.orderId+'/batches/' + data.id);
        }


     $scope.load_data();



    }]);

app.controller('orderConfigurationCtrl', ['$scope', '$routeParams', '$http', '$cookies', 'loggerRepository', 'UserLoggersRepository',
    'ChangeLoggerOwnerFactory', 'SubmitJsonFactory', 'GetDateTimeFormatForAngularFactory', 'GetDateTimeFormatForRubbyFactory', 'breadcrumbs', '$location',
    '$filter', 'GetObjectByIdFactory', 'GetObjectByUrlFactory', 'UpdateUserFactory', 'GetObjectByUrlPaginationFactory', 'GetDifferentFieldsFactory', '$rootScope', 'GetObjectFromCacheFactory', 'GetManyToOneArrayFactory', 'GetObjectByUrlIdsFactory', 'GetObjectByUrlSynchFactory',
    'PatchObjectFactory','CenterOfCoordsService','BoundsOfCoordsService',
    function ($scope, $routeParams, $http, $cookies, loggerRepository, UserLoggersRepository, ChangeLoggerOwnerFactory,
              SubmitJsonFactory, GetDateTimeFormatForAngularFactory, GetDateTimeFormatForRubbyFactory, breadcrumbs,
              $location, $filter, GetObjectByIdFactory, GetObjectByUrlFactory, UpdateUserFactory, GetObjectByUrlPaginationFactory,
              GetDifferentFieldsFactory, $rootScope, GetObjectFromCacheFactory, GetManyToOneArrayFactory,
              GetObjectByUrlIdsFactory, GetObjectByUrlSynchFactory,PatchObjectFactory,CenterOfCoordsService,
              BoundsOfCoordsService) {


        $scope.location = $location;
        $scope.breadcrumbs = breadcrumbs;
        $scope.orderId = $routeParams.orderId;

        $scope.initMap = function () {
            $scope.markers = [];
            var mapOptions = {
                center: {lat: -33.8688, lng: 151.2195},
                zoom: 13
            };
            $scope.map = new google.maps.Map(document.getElementById('map'),
                mapOptions);

            var input = /** @type {HTMLInputElement} */(
                document.getElementById('address'));

            // Create the autocomplete helper, and associate it with
            // an HTML text input box.
            $scope.autocomplete = new google.maps.places.Autocomplete(input);
            $scope.autocomplete.bindTo('bounds', $scope.map);

            $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);


            // Get the full place details when the user selects a place from the
            // list of suggestions.
            google.maps.event.addListener($scope.autocomplete, 'place_changed', $scope.setSourceDest);
            if(!$scope.orderId){
                $scope.order = {};
            }

        }
        $scope.setSourceDest = function () {
            if ($scope.markers.length < 2) {
                var place = $scope.autocomplete.getPlace();
                if (!place.geometry) {
                    return;
                }

                if (place.geometry.viewport) {
                    $scope.map.fitBounds(place.geometry.viewport);
                } else {
                    $scope.map.setCenter(place.geometry.location);
                    $scope.map.setZoom(17);
                }


                var json_address = {
                    place_id: place.id,
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                    address: place.formatted_address
                };
                var marker = new google.maps.Marker({
                    position: place.geometry.location,
                    map: $scope.map,
                    title: place.formatted_address,
                });
                if (!$scope.order.source) {
                    $scope.order.source = json_address;
                    $("#address").attr("placeholder", "Destination address");
                } else {
                    $scope.order.destination = json_address;
                    marker.setOptions({icon: '/admin/img/darkgreen_MarkerO.png'});
                    //open modal form here
                    $('#over_map').show();
                }
                $("#address").val('');
                $scope.markers.push(marker);
                $scope.setCenter($scope.markers);
            }
        }
        $scope.setCenter = function (markers) {
            var coords = [];
            for (var i = 0; i < markers.length; i++) {
                var marker = markers[i];
                var latLng = marker.getPosition();
                coords.push(latLng);
            }
            var center = CenterOfCoordsService.centerOfCoords(coords);
            var bounds = BoundsOfCoordsService.boundsOfCoords(coords);
            $scope.map.setCenter(center);
            $scope.map.fitBounds(bounds);

        }





        $scope.edit_order = function () {
            var url = server_string + '/orders.json?';
            var post_data = {};
            var csrf_token = $cookies['CSRF-TOKEN'];
            post_data['authenticity_token'] = csrf_token;
            post_data['utf8'] = '%E2%9C%93';
            post_data['order'] = $scope.order;
            var method = 'patch';
            if(!$scope.orderId){
                method = 'post';
            }else{
                post_data['_method'] = 'patch';
                url = server_string + '/admin/orders/'+$scope.orderId+'.json?';
            }
            PatchObjectFactory.patchObject(url,post_data,method, $scope.goto_index_page);

        }

        $scope.goto_order_page = function(data){
            window.location.assign("#/orders/" + data.id);
        }
        $scope.goto_index_page = function(data){
            window.location.assign("#/');
        }


        $scope.initMap();










    }]);


app.controller('CompaniesCtrl', function ($scope, $rootScope, $filter, $http, ngTableParams, breadcrumbs, $location,
                                       $cookies, GetObjectByIdFactory, GetObjectByUrlPaginationFactory,
                                       GetManyToOneArrayFactory, GetObjectFromCacheFactory,GetObjectByAttributeFactory) {
    $scope.breadcrumbs = breadcrumbs;
    $scope.location = $location;
    $scope.show_unlocked_users = true;
    $scope.isViewLoading = false;
    $scope.companies_url = server_string + '/admin/companies.json?'
    $scope.per_page = 20;
    $scope.page = 1;
    $scope.name_query = '';
    $scope.id_query = '';
    $scope.first_load = true;


    $scope.searchName = function () {
        if ($scope.name_query) {
            if ($scope.name_query.length) {
                $scope.companies = $scope.get_companies();
            }
        }
    }

    $scope.searchId = function () {
        if ($scope.id_query) {
            if ($scope.id_query.length) {
                $scope.companies = $scope.get_companies();
            }
        }
    }
    $scope.searchEmail = function () {
        if ($scope.email_query) {
            if ($scope.email_query.length) {
                $scope.companies = $scope.get_companies();
            }
        }
    }
    $scope.searchLastName = function () {
        if ($scope.last_name_query) {
            if ($scope.last_name_query.length) {
                $scope.companies = $scope.get_companies();
            }
        }
    }
    $scope.changePageSize = function () {
        $scope.companies = $scope.get_companies();
    }

    $scope.options = [
        {label: '5', value: 5},
        {label: '10', value: 10},
        {label: '20', value: 20},
        {label: '50', value: 50}
    ];
    $scope.page_size = $scope.options[2];
    $scope.reset = function () {
        $scope.page = 1;
        $scope.name_query = '';
        $scope.id_query = '';
        $scope.email_query = '';
        $scope.last_name_query = '';
        $scope.page_size = $scope.options[2];
        $scope.companies = $scope.get_companies();
    }
    $scope.nextPage = function () {
        $scope.page++;
        $scope.users = $scope.get_users();
    }
    $scope.prevPage = function () {
        if ($scope.page > 0) {
            $scope.page--;
        }
        $scope.companies = $scope.get_companies();
    }





    $scope.get_companies = function () {
        if (!$scope.first_load) {
            Pace.restart();
        } else {
            $scope.first_load = false;
        }
        var paging = '&per_page=' + $scope.page_size.value + '&page=' + $scope.page;
        var params = 'utf8=%E2%9C%93&order=id_asc' + paging;
        if ($scope.name_query) {
            if ($scope.name_query.length) {
                params = params + '&q%5Bfirst_name_contains%5D=' + $scope.name_query
            }
        }
        if ($scope.see_only_groups) {
            params = params + '&q%5Btype_equals%5D=Group';
        }
        if ($scope.id_query) {
            if ($scope.id_query != '') {
                params = params + '&q%5Bid_equals%5D=' + $scope.id_query;
            }
        }
        if ($scope.email_query) {
            if ($scope.email_query != '') {
                params = params + '&q%5Bemail_contains%5D=' + $scope.email_query;
            }
        }
        if ($scope.last_name_query) {
            if ($scope.last_name_query != '') {
                params = params + '&q%5Blast_name_contains%5D=' + $scope.last_name_query;
            }
        }
        var url = $scope.companies_url + params;
        var res = null
        $.ajax({
            async: false,
            dataType: "json",
            url: url,
            success: function (result) {
                res = result;
            },
            error: function (result) {
                console.log(result);
            }
        });
        return res;
    }
    $scope.new_company = function(){
        window.location.assign("#/companies/new_company");
    }
    $scope.companies = $scope.get_companies();


});


app.controller('companyConfigurationCtrl', ['$scope', '$routeParams', '$http', '$cookies', 'loggerRepository', 'UserLoggersRepository',
    'ChangeLoggerOwnerFactory', 'SubmitJsonFactory', 'GetDateTimeFormatForAngularFactory', 'GetDateTimeFormatForRubbyFactory', 'breadcrumbs', '$location',
    '$filter', 'GetObjectByIdFactory', 'GetObjectByUrlFactory', 'UpdateUserFactory', 'GetObjectByUrlPaginationFactory', 'GetDifferentFieldsFactory', '$rootScope', 'GetObjectFromCacheFactory', 'GetManyToOneArrayFactory', 'GetObjectByUrlIdsFactory', 'GetObjectByUrlSynchFactory',
    'PatchObjectFactory',
    function ($scope, $routeParams, $http, $cookies, loggerRepository, UserLoggersRepository, ChangeLoggerOwnerFactory,
              SubmitJsonFactory, GetDateTimeFormatForAngularFactory, GetDateTimeFormatForRubbyFactory, breadcrumbs,
              $location, $filter, GetObjectByIdFactory, GetObjectByUrlFactory, UpdateUserFactory, GetObjectByUrlPaginationFactory,
              GetDifferentFieldsFactory, $rootScope, GetObjectFromCacheFactory, GetManyToOneArrayFactory,
              GetObjectByUrlIdsFactory, GetObjectByUrlSynchFactory,PatchObjectFactory) {


        $scope.location = $location;
        $scope.breadcrumbs = breadcrumbs;
        $scope.companyId = $routeParams.companyId;



        $scope.load_data = function(){
            if($scope.companyId){
                $http.get(server_string + '/admin/companies/' + $scope.companyId + '.json', {
                    timeout: 30000,
                    cache: false
                }).success(function (data) {
                    $scope.company = data;
                    $http.get(server_string + '/admin/orders.json?utf8=✓&q%5Bcompany_id_equals%5D='+$scope.companyId+
                        '&per_page=1000', {
                        timeout: 30000,
                        cache: false
                    }).success(function (data) {
                        $scope.company.orders = data;
                    });

                });
            }else{
                $scope.company = {};
            }



        }






        $scope.submit_company = function () {
            var url = server_string + '/admin/companies.json?';
            var post_data = {};
            var csrf_token = $cookies['CSRF-TOKEN'];
            post_data['authenticity_token'] = csrf_token;
            post_data['utf8'] = '%E2%9C%93';
            post_data['company'] = $scope.company;
            var method = 'patch';
            if(!$scope.orderId){
                post_data['commit'] = 'Create Company';
                method = 'post';
            }else{
                post_data['_method'] = 'patch';
                url = server_string + '/admin/companies/'+$scope.companyId+'.json?';
            }
            PatchObjectFactory.patchObject(url,post_data,method, $scope.goto_company_page);

        }

        $scope.goto_company_page = function(data){
            window.location.assign("#/companies/" + data.id);
        }
        $scope.new_company = function(data){
            window.location.assign("#/companies/new_company");
        }



        $scope.load_data();










    }]);