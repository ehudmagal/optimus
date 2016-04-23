var app = angular.module('app', ['ngCookies']);


app.controller('ordersCtrl', function ($scope, $rootScope, $filter, $http, breadcrumbs, $location,
                                       $cookies, GetObjectByIdFactory, GetObjectByUrlPaginationFactory,
                                       GetManyToOneArrayFactory, GetObjectFromCacheFactory,GetObjectByAttributeFactory,
                                       CenterOfCoordsService) {
  $scope.breadcrumbs = breadcrumbs;
  $scope.location = $location;

  $scope.isViewLoading = false;
  $scope.orders_url = server_string + '/orders.json?'
  $scope.curPage = 0;
  $scope.pageSize = 5;
  $rootScope.orders = [];
  $scope.numberOfPages = function () {
    return Math.ceil($rootScope.orders.length / $scope.pageSize);
  };

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
  $scope.initMap();

});



app.filter('searchFor', function () {

    // All filters must return a function. The first parameter
    // is the data that is to be filtered, and the second is an
    // argument that may be passed with a colon (searchFor:searchString)

    return function (arr, searchString) {

        if (!searchString) {
            return arr;
        }

        var result = [];

        searchString = searchString.toLowerCase();

        // Using the forEach helper method to loop through the array
        angular.forEach(arr, function (item) {

            if (item.id.toString().toLowerCase().indexOf(searchString) !== -1) {
                result.push(item);
            }

        });

        return result;
    };

});

app.filter('searchForName', function () {

    // All filters must return a function. The first parameter
    // is the data that is to be filtered, and the second is an
    // argument that may be passed with a colon (searchFor:searchString)

    return function (arr, searchString) {

        if (!searchString) {
            return arr;
        }

        var result = [];

        searchString = searchString.toLowerCase();

        // Using the forEach helper method to loop through the array
        angular.forEach(arr, function (item) {

            if (item.name.toString().toLowerCase().indexOf(searchString) !== -1) {
                result.push(item);
            }

        });

        return result;
    };

});


app.filter('searchIdentity', function () {

    // All filters must return a function. The first parameter
    // is the data that is to be filtered, and the second is an
    // argument that may be passed with a colon (searchFor:searchString)

    return function (arr, searchString) {

        if (!searchString) {
            return arr;
        }

        var result = [];

        searchString = searchString.toLowerCase();

        // Using the forEach helper method to loop through the array
        angular.forEach(arr, function (item) {

            if (item.toString().toLowerCase().indexOf(searchString) !== -1) {
                result.push(item);
            }

        });

        return result;
    };

});
app.filter('offset', function () {
    return function (arr, start) {
        if (arr && arr != undefined) {
            start = parseInt(start, 10);
            return arr.slice(start);
        }
        return [];
    };
});


///////////////////////
app.filter('searchDSId', function () {

    // All filters must return a function. The first parameter
    // is the data that is to be filtered, and the second is an
    // argument that may be passed with a colon (searchFor:searchString)

    return function (arr, searchString) {

        if (!searchString) {
            return arr;
        }

        var result = [];

        searchString = searchString.toLowerCase();

        // Using the forEach helper method to loop through the array
        angular.forEach(arr, function (item) {

            if (item[1].toString().toLowerCase().indexOf(searchString) !== -1) {
                result.push(item);
            }

        });

        return result;
    };

});

app.filter('searchDSName', function () {

    // All filters must return a function. The first parameter
    // is the data that is to be filtered, and the second is an
    // argument that may be passed with a colon (searchFor:searchString)

    return function (arr, searchString) {

        if (!searchString) {
            return arr;
        }

        var result = [];

        searchString = searchString.toLowerCase();

        // Using the forEach helper method to loop through the array
        angular.forEach(arr, function (item) {

            if (item.title.toString().toLowerCase().indexOf(searchString) !== -1) {
                result.push(item);
            }

        });

        return result;
    };

});


app.filter('searchFirstName', function () {

    // All filters must return a function. The first parameter
    // is the data that is to be filtered, and the second is an
    // argument that may be passed with a colon (searchFor:searchString)

    return function (arr, searchString) {

        if (!searchString) {
            return arr;
        }

        var result = [];

        searchString = searchString.toLowerCase();

        // Using the forEach helper method to loop through the array
        angular.forEach(arr, function (item) {

            if (item.first_name.toLowerCase().indexOf(searchString) !== -1) {
                result.push(item);
            }

        });

        return result;
    };

});

app.filter('searchByGroup', function () {

    // All filters must return a function. The first parameter
    // is the data that is to be filtered, and the second is an
    // argument that may be passed with a colon (searchFor:searchString)

    return function (arr, users, searchString) {

        if (!searchString) {
            return arr;
        }

        var result = [];

        searchString = searchString.toLowerCase();

        // Using the forEach helper method to loop through the array
        angular.forEach(arr, function (item) {
            var group_id = item.group_id;
            var group_name = null;
            for (var i = 0; i < users.length; i++) {
                var id = users[i].id;
                if (group_id == id) {
                    group_name = users[i].first_name;
                    if (group_name.toLowerCase().indexOf(searchString) !== -1) {
                        result.push(item);
                    }
                }
            }


        });

        return result;
    };

});

app.filter('searchTitle', function () {

    // All filters must return a function. The first parameter
    // is the data that is to be filtered, and the second is an
    // argument that may be passed with a colon (searchFor:searchString)

    return function (arr, searchString) {

        if (!searchString) {
            return arr;
        }

        var result = [];

        searchString = searchString.toLowerCase();

        // Using the forEach helper method to loop through the array
        angular.forEach(arr, function (item) {

            if (item.title.toLowerCase().indexOf(searchString) !== -1) {
                result.push(item);
            }

        });

        return result;
    };

});
//We already have a limitTo filter built-in to angular,
//let's make a startFrom filter
app.filter('startFrom', function () {
    return function (input, start) {
        start = +start; //parse to int
        var res = input;
        try {
            res = input.slice(start);
        } catch (e) {

        }
        return res;
    }
});


app.filter('hasProjects', function () {
    return function (input, _hasProjects) {
        var res = []
        if (!_hasProjects && input) {
            var res = input;
        }
        else if (input) {
            // Using the forEach helper method to loop through the array
            try {
                angular.forEach(input, function (item) {
                    if (item.owned_project_ids.length) {
                        res.push(item);
                    }

                })
            } catch (e) {
                console.log(e);
            }
            ;
        }
        return res;
    }
});

app.filter('unlocked_users', function () {
    return function (input, show_unlocked_users) {
        if (!show_unlocked_users)
            var res = input;
        else {
            var res = [];
            // Using the forEach helper method to loop through the array
            angular.forEach(input, function (item) {
                if (!item['access_locked?']) { //insert to arry only unlocked users
                    res.push(item);
                }

            });
        }
        return res;
    }
});

app.filter('ngTablePaging', function () {
    return function (input, tableParams) {
        var res = null;
        try {
            res = input.slice((tableParams.page() - 1) * tableParams.count(), tableParams.page() * tableParams.count())
        } catch (e) {
            console.log(e);
        }
        return res;
    }
})


app.filter('getDataSetsByCalcType', function () {
    return function (input, calc_type, selected_dataset) {
        var res = [];
        // Using the forEach helper method to loop through the array
        angular.forEach(input, function (item) {
            try {
                if (item.calc_type.toLowerCase() == calc_type.toLowerCase()) {
                    res.push(item);
                }
            } catch (e) {

            }

        });
        return res;
    }
});

app.filter('showOnlyUsers', function () {
    return function (input, showUsers) {
        var res = []
        if (!showUsers && input) {
            res = input;
        }
        else if (input) {
            // Using the forEach helper method to loop through the array
            try {
                angular.forEach(input, function (item) {
                    if (item.type != 'Group') {
                        res.push(item);
                    }

                })
            } catch (e) {
                console.log(e);
            }
            ;
        }
        return res;
    }
});


app.filter('getDisconnectedLoggers', function () {
    return function (input) {
        var res = [];
        // Using the forEach helper method to loop through the array

        angular.forEach(input, function (item) {
            try {
                //bug
                var timezone = item.timezone;
                if (timezone === 'Israel Standard Time') {
                    timezone = 'Asia/Jerusalem';
                }
                var last_time_transmited = new timezoneJS.Date(item.state_update_time, timezone);
                //var last_time_transmited_offset = last_time_transmited.getTimezoneOffset() * 60;
                var now = new Date();
                //var now_offset = now.getTimezoneOffset() * 60;
                var timeDiff = Math.abs(now.getTime() - last_time_transmited.getTime());
                var diffHours = Math.ceil(timeDiff / (3600 * 1000));
                if (diffHours > 24) {
                    res.push(item);
                }
            } catch (e) {
                console.log(e);
            }

        });

        return res;
    }
});


app.filter('getDyingProjects', function () {
    return function (input) {
        var res = [];
        // Using the forEach helper method to loop through the array

        angular.forEach(input, function (item) {
            try {
                var deactivation_date = new timezoneJS.Date(item.deactivation_date);
                //var last_time_transmited_offset = last_time_transmited.getTimezoneOffset() * 60;
                var now = new Date();
                var timeDiff = deactivation_date.getTime() - now.getTime();
                var diffDays = Math.ceil(timeDiff / (3600 * 24 * 1000));
                if (diffDays <= 7 && diffDays >= 0) {
                    res.push(item);
                }
            } catch (e) {
                console.log(e);
            }

        });

        return res;
    }
});

app.filter('searchForNameById', function () {

    // All filters must return a function. The first parameter
    // is the data that is to be filtered, and the second is an
    // argument that may be passed with a colon (searchFor:searchString)

    return function (loggers, users, searchString) {

        if (!searchString || !loggers || !users) {
            return loggers;
        }

        var result = [];

        searchString = searchString.toLowerCase();

        // Using the forEach helper method to loop through the array
        angular.forEach(loggers, function (logger) {
            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                if (user.id === logger.owner_id) {
                    var first_name = user.first_name;
                    break;
                }
            }
            if (first_name) {
                if (first_name.toLowerCase().indexOf(searchString) !== -1) {
                    result.push(logger);
                }
            }

        });

        return result;
    };

});


app.filter('searchAnything', function () {

    // All filters must return a function. The first parameter
    // is the data that is to be filtered, and the second is an
    // argument that may be passed with a colon (searchFor:searchString)

    return function (arr, searchString, searchCriterias) {

        if (!searchString) {
            return arr;
        }

        var result = [];

        searchString = searchString.toLowerCase();

        // Using the forEach helper method to loop through the array
        angular.forEach(arr, function (item) {

            for (var i = 0; i < searchCriterias.length; i++) {
                var searchCriteria = searchCriterias[i];
                if (item[searchCriteria]) {
                    if (item[searchCriteria].toString().toLowerCase().indexOf(searchString) !== -1 && result.indexOf(item) === -1) {
                        result.push(item);
                    }
                }

            }


        });

        return result;
    };

});


app.filter('searchAnythingWhenTriggered', function () {

    // All filters must return a function. The first parameter
    // is the data that is to be filtered, and the second is an
    // argument that may be passed with a colon (searchFor:searchString)

    return function (arr, searchString, searchCriterias, trigger) {

        if (!searchString || !trigger) {
            return arr;
        }

        var result = [];

        searchString = searchString.toLowerCase();

        // Using the forEach helper method to loop through the array
        angular.forEach(arr, function (item) {

            for (var i = 0; i < searchCriterias.length; i++) {
                var searchCriteria = searchCriterias[i];
                if (item[searchCriteria].toString().toLowerCase().indexOf(searchString) !== -1 && result.indexOf(item) === -1) {
                    result.push(item);
                }

            }


        });

        return result;
    };

});

app.filter('getLatestAlerts', function () {
    return function (input) {
        var res = [];
        //getting an array of alerts. create group alerts by sensor id. get latest alert out of each group
        var alerts_map = {}; //object of key value. key is sensor id, value is alert.
        angular.forEach(input, function (item) {
            if (!alerts_map[item.sensor_id]) {
                alerts_map[item.sensor_id] = item;
            } else {
                var item2 = alerts_map[item.sensor_id];
                var date1 = new Date(item.utc);
                var date2 = new Date(item2.utc);
                if (date1.getTime() >= date2.getTime()) {
                    //item time is later
                    alerts_map[item.sensor_id] = item;
                }
            }

        });
        for (var k in alerts_map) {
            res.push(alerts_map[k]);
        }
        return res;
    }
});


app.filter('getAlertsWithPositiveValue', function () {
    return function (input) {
        var res = [];

        angular.forEach(input, function (item) {
            if (item.value > 0) {
                res.push(item);
            }
        });

        return res;
    }
});

app.filter('getAgronomists', function () {
    return function (users) {
        var res = [];

        for (var i = 0; i < users.length; i++) {
            var user = users[i];
            if (user.role == 'agronomist' || user.role == 'technician') {
                res.push(user);
            }
        }

        return res;
    }
});

app.filter('getUsersByRole', function () {
    return function (users, role) {
        var res = [];

        for (var i = 0; i < users.length; i++) {
            var user = users[i];
            if (user.role == role) {
                res.push(user);
            }
        }

        return res;
    }
});


app.filter('showAlertsByLogger', function () {
    return function (agronomists, query) {

        /*first iteration, turn everything off*/
        for (var i = 0; i < agronomists.length; i++) {
            var agronomist = agronomists[i];
            agronomist.show_by_logger = false;
            if (agronomist.users) {
                for (var j = 0; j < agronomist.users.length; j++) {
                    var user = agronomist.users[j];
                    user.show_by_logger = false;
                    if (user.projects) {
                        for (var k = 0; k < user.projects.length; k++) {
                            var project = user.projects[k];
                            project.show_by_logger = false;
                            if (project.loggers) {
                                for (var q = 0; q < project.loggers.length; q++) {
                                    var logger = project.loggers[q];
                                    logger.show_by_logger = false;
                                }
                            }
                        }
                    }
                }
            }
        }
        if (!query) {
            return agronomists;
        }
        //2nd iteration. turn on every substirng match
        for (var i = 0; i < agronomists.length; i++) {
            var agronomist = agronomists[i];
            if (agronomist.users) {
                for (var j = 0; j < agronomist.users.length; j++) {
                    var user = agronomist.users[j];
                    if (user.projects) {
                        for (var k = 0; k < user.projects.length; k++) {
                            var project = user.projects[k];
                            if (project.loggers) {
                                for (var q = 0; q < project.loggers.length; q++) {
                                    var logger = project.loggers[q];
                                    if (logger.id.toString().indexOf(query) != -1 && query != "") {
                                        logger.show_by_logger = true;
                                        user.show_by_logger = true;
                                        agronomist.show_by_logger = true;
                                        project.show_by_logger = true;
                                    }

                                }
                            }


                        }
                    }
                }
            }
        }
        return agronomists;
    }
});


app.filter('showAlertsByUser', function () {
    return function (agronomists, query) {

        /*first iteration, turn everything off*/
        for (var i = 0; i < agronomists.length; i++) {
            var agronomist = agronomists[i];
            agronomist.show_by_user = false;
            if (agronomist.users) {
                for (var j = 0; j < agronomist.users.length; j++) {
                    var user = agronomist.users[j];
                    user.show_by_user = false;
                    if (user.projects) {
                        for (var k = 0; k < user.projects.length; k++) {
                            var project = user.projects[k];
                            project.show_by_user = false;
                            if (project.loggers) {
                                for (var q = 0; q < project.loggers.length; q++) {
                                    var logger = project.loggers[q];
                                    logger.show_by_user = false;
                                }
                            }
                        }
                    }
                }
            }
        }
        if (!query) {
            return agronomists;
        }
        //2nd iteration. turn on every substirng match
        for (var i = 0; i < agronomists.length; i++) {
            var agronomist = agronomists[i];
            if (agronomist.users) {
                for (var j = 0; j < agronomist.users.length; j++) {
                    var user = agronomist.users[j];
                    if (user.projects) {
                        for (var k = 0; k < user.projects.length; k++) {
                            var project = user.projects[k];
                            if (project.loggers) {
                                for (var q = 0; q < project.loggers.length; q++) {
                                    var logger = project.loggers[q];
                                    if (user.first_name.toLowerCase().indexOf(query.toLowerCase()) != -1 && query != "") {
                                        logger.show_by_user = true;
                                        user.show_by_user = true;
                                        agronomist.show_by_user = true;
                                        project.show_by_user = true;
                                    }
                                }
                            }

                        }
                    }
                }
            }
        }
        return agronomists;
    }
});

app.filter('getItemsWithAlerts', function () {
    return function (input) {
        var res = [];
        //getting an array of alerts. create group alerts by sensor id. get latest alert out of each group
        angular.forEach(input, function (item) {
            if (item.has_alerts) {
                res.push(item);
            }
        });

        return res;
    }
});

app.filter('getItemsToShow', function () {
    return function (input) {
        var res = [];
        //getting an array of alerts. create group alerts by sensor id. get latest alert out of each group
        angular.forEach(input, function (item) {
            if ((item.show_by_logger || item.show_by_user || item.show_by_click) &&
                item.has_alerts) {
                res.push(item);
            }
        });

        return res;
    }
});


app.filter('getAgronomistsToShow', function () {
    return function (input) {
        var res = [];
        //getting an array of alerts. create group alerts by sensor id. get latest alert out of each group
        angular.forEach(input, function (item) {
            if (item.has_alerts) {
                res.push(item);
            }
        });

        return res;
    }
});


app.filter('searchUserByLoggerId', function () {

    // All filters must return a function. The first parameter
    // is the data that is to be filtered, and the second is an
    // argument that may be passed with a colon (searchFor:searchString)

    return function (users, loggers, logger_id, search_logger) {

        if (!logger_id || !search_logger) {
            return users;
        }

        var result = [];
        // Using the forEach helper method to loop through the array
        var logger_found = null;
        for (var i = 0; i < loggers.length; i++) {
            var logger = loggers[i];
            if (logger.id.toString() == logger_id.toString()) {
                logger_found = logger;
                break;
            }
        }
        if (logger_found) {
            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                if (user.id.toString() == logger_found.owner_id.toString()) {
                    result.push(user);
                    break;
                }
            }
        }

        return result;
    };

});


app.filter('searchProjectByLoggerId', function () {

    // All filters must return a function. The first parameter
    // is the data that is to be filtered, and the second is an
    // argument that may be passed with a colon (searchFor:searchString)

    return function (projects, loggers, logger_id, search_logger) {

        if (!logger_id || !search_logger) {
            return projects;
        }

        var result = [];
        var logger_found = null;
        for (var i = 0; i < loggers.length; i++) {
            var logger = loggers[i];
            if (logger.id.toString() == logger_id.toString()) {
                logger_found = logger;
                break;
            }
        }
        if (logger_found) {
            for (var i = 0; i < projects.length; i++) {
                var project = projects[i];
                for (var j = 0; j < logger_found.project_ids; j++) {
                    var project_id = logger_found.project_ids[j];
                    if (project.id == project_id) {
                        result.push(project);
                    }
                }

            }
        }

        return result;
    };

});

app.filter('getCalcTypesNotDefinedInProject', function () {

    // All filters must return a function. The first parameter
    // is the data that is to be filtered, and the second is an
    // argument that may be passed with a colon (searchFor:searchString)

    return function (available_calc_types, editable_datasets) {


        var result = [];
        // Using the forEach helper method to loop through the array
        if (available_calc_types && editable_datasets) {
            for (var i = 0; i < available_calc_types.length; i++) {
                var available_calc_type = available_calc_types[i];
                var dataset_exist_in_project = false;
                for (var j = 0; j < editable_datasets.length; j++) {
                    var dataset = editable_datasets[j];
                    if (dataset.type_id == available_calc_type.dataset_type_id) {
                        dataset_exist_in_project = true;
                    }
                }
                if (!dataset_exist_in_project) {
                    result.push(available_calc_type);
                }
            }
        }

        return result;
    };

});

app.filter('getTestedLoggers', function () {

    // All filters must return a function. The first parameter
    // is the data that is to be filtered, and the second is an
    // argument that may be passed with a colon (searchFor:searchString)

    return function (arr) {


        var result = [];


        // Using the forEach helper method to loop through the array
        angular.forEach(arr, function (item) {

            if (item.tested) {
                result.push(item);
            }

        });

        return result;
    };

});

app.filter('getActivatedLoggers', function () {

    // All filters must return a function. The first parameter
    // is the data that is to be filtered, and the second is an
    // argument that may be passed with a colon (searchFor:searchString)

    return function (arr) {


        var result = [];


        // Using the forEach helper method to loop through the array
        angular.forEach(arr, function (item) {

            if (item.activated) {
                result.push(item);
            }

        });

        return result;
    };

});

app.filter('getLoggerTasks', function () {


    return function (arr, logger_id) {


        var result = [];


        // Using the forEach helper method to loop through the array
        angular.forEach(arr, function (item) {

            if (item.remote_logger_id == logger_id) {
                result.push(item);
            }

        });

        return result;
    };

});

app.filter('getRealLoggers', function () {


    return function (arr) {


        var result = [];


        // Using the forEach helper method to loop through the array
        angular.forEach(arr, function (item) {

            if (item.id < 2000000 && !item.sensor_id) {
                result.push(item);
            }

        });

        return result;
    };

});

app.filter('getRealLoggerIds', function () {


    return function (arr) {


        var result = [];


        // Using the forEach helper method to loop through the array
        angular.forEach(arr, function (id) {

            if (id < 2000000 ) {
                result.push(id);
            }

        });

        return result;
    };

});

app.filter('templateProject', function () {
    return function (projects) {
        var res = [];
        if (projects) {
            for (var i = 0; i < projects.length; i++) {
                var project = projects[i];
                if (project.owner_id == 1 && project.name.indexOf('template') != -1) {
                    res.push(project);
                }
            }
        }
        return res;
    }
});

app.filter('getDailyDsType', function () {
    return function (dsTypes) {
        var res = [];
        if (dsTypes) {
            for (var i = 0; i < dsTypes.length; i++) {
                var dsType = dsTypes[i];
                if (dsType.daily) {
                    res.push(dsType);
                }
            }
        }
        return res;
    }
});

app.filter('getProjectsByLoggerId', function () {


    return function (arr, logger_id) {

        var result = [];
        if(!logger_id || logger_id.toString() == ''){
            return arr;
        }
        // Using the forEach helper method to loop through the array
        angular.forEach(arr, function (project) {

            if (project.remote_logger_ids) {
                for(var i = 0 ; i < project.remote_logger_ids.length ; i++){
                    var project_logger_id = project.remote_logger_ids[i]
                    if(project_logger_id.toString().indexOf(logger_id.toString()) != -1){
                        result.push(project);
                    }
                }
            }

        });

        return result;
    };

});

app.filter('pagination', function () {
    return function(input, start)
    {
        var res = [];
        start = +start;
        if(input){
            res =  input.slice(start);
        }
        return res;
    };
});

app.filter('searchAnythingExact', function () {

    // All filters must return a function. The first parameter
    // is the data that is to be filtered, and the second is an
    // argument that may be passed with a colon (searchFor:searchString)

    return function (arr, searchString, searchCriterias) {

        if (!searchString) {
            return arr;
        }

        var result = [];

        searchString = searchString.toLowerCase();

        // Using the forEach helper method to loop through the array
        angular.forEach(arr, function (item) {

            for (var i = 0; i < searchCriterias.length; i++) {
                var searchCriteria = searchCriterias[i];
                if (item[searchCriteria]) {
                    if (item[searchCriteria].toString() == searchString && result.indexOf(item) === -1) {
                        result.push(item);
                    }
                }

            }


        });

        return result;
    };

});

app.filter('searchMultiple', function () {

    // All filters must return a function. The first parameter
    // is the data that is to be filtered, and the second is an
    // argument that may be passed with a colon (searchFor:searchString)

    return function (arr, array_of_things_to_search, searchCriteria) {

        if (!array_of_things_to_search || !array_of_things_to_search.length) {
            return arr;
        }

        var result = [];


        // Using the forEach helper method to loop through the array
        angular.forEach(arr, function (item) {

            for (var i = 0; i < array_of_things_to_search.length; i++) {
                var thing_to_search = array_of_things_to_search[i];
                if (item[searchCriteria]) {
                    if (item[searchCriteria].toString() == thing_to_search.toString() && result.indexOf(item) === -1) {
                        result.push(item);
                    }
                }

            }


        });

        return result;
    };

});


'use strict';

function padNumWithZero(num) {
    var res = num.toString();
    if (res.length == 1) {
        res = '0' + res;
    }
    return res;
}
/* Services */

app.factory('loggerRepository', function ($http) {
    return {
        getLogger: function (logger_id) {
            var url = server_string + '/activeadmin/remote_loggers/' + logger_id + '.json';
            return $http.get(url);
        }
    };
});

app.factory('UserLoggersRepository', function ($http) {
    return {
        getUserLoggers: function (user_id) {
            var url = server_string + '/activeadmin/remote_loggers.json?utf8=%E2%9C%93&q%5Bowner_id_eq%5D=' + user_id + '&commit=Filter&order=id_asc&per_page=10000';
            return $http.get(url);
        }
    };
});

app.factory('ChangeLoggerOwnerFactory', function ($http, $cookies) {
    return {
        changeLoggerOwner: function (logger, user_id) {
            $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
            var csrf_token = $cookies['CSRF-TOKEN']
            var post_data = {};
            post_data['authenticity_token'] = csrf_token;
            post_data['_method'] = 'put';
            logger['owner_id'] = user_id;
            post_data['remote_logger'] = logger;
            post_data = $.param(post_data);
            return $http.post(server_string + '/activeadmin/remote_loggers/' + logger.id + '.json', post_data)
        }
    };
});

app.factory('SubmitJsonFactory', function ($http, $cookies) {
    return {
        submitJson: function (url, json_obj, json_obj_name, content_type) {
            content_type = content_type || "application/x-www-form-urlencoded";
            $http.defaults.headers.post["Content-Type"] = content_type;
            var csrf_token = $cookies['CSRF-TOKEN'];
            $http.defaults.headers.post["X-CSRF-Token"] = csrf_token;
            var post_data = {};
            post_data['authenticity_token'] = csrf_token;
            post_data['_method'] = 'patch';
            post_data[json_obj_name] = json_obj;
            return $http.post(url, post_data)
        }
    };
});

app.factory('SubmitPostFactory', function ($http, $cookies) {
    return {
        submitPost: function (url) {
            $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
            var csrf_token = $cookies['CSRF-TOKEN']
            var post_data = {};
            post_data['authenticity_token'] = csrf_token;
            post_data = $.param(post_data);
            return $http.post(url, post_data);
        }
    };
});

app.factory('GetDateTimeFormatForAngularFactory', function () {
    return {
        getDateTimeFormatForAngular: function (str) {
            return str.substring(0, str.indexOf('.'));
        }
    };
});

app.factory('GetDateTimeFormatForRubbyFactory', function () {
    return {
        getDateTimeFormatForRubby: function (str) {
            return str + '.000Z';
        }
    };
});

app.factory('GetObjectByUrlFactory', function ($http) {
    return {
        getObjectByUrl: function (url) {
            return $http.get(url, {timeout: 30000, cache: false});
        }
    };
});


app.factory('GetObjectByUrlPaginationFactory', function ($http, $q) {
    return {
        getObjectByUrl: function (_url) {
            var data = [];
            var output_length = 0;
            var items_per_page = 1000;
            var page_num = 1;
            var page_limit = 50;
            do {
                var url_tail = '&page=' + page_num + '&per_page=' + items_per_page;
                var new_url = _url + url_tail;
                $.ajax({
                    async: false,
                    dataType: "json",
                    url: new_url,
                    success: function (result) {
                        output_length = result.length;
                        data = data.concat(result);
                    },
                    error: function (result) {
                        output_length = 0;
                        console.log(result);
                    }
                });
                page_num++;
            } while (output_length >= items_per_page && page_num < page_limit);
            return data;
        }
    };
});

app.factory('GetObjectByUrlIdsFactory', function ($http, $q) {
    return {
        getObjectByUrlIds: function (_url, ids) {
            var data = [];
            var items_per_request = 20;
            var request_num = 1;
            var request_limit = 100;
            var begin_index = 0;
            var end_index = ids.length;
            if (ids.length) {
                if (end_index > items_per_request) {
                    end_index = items_per_request;
                }
                do {
                    var ids_sliced = ids.slice(begin_index, end_index);
                    var delimeter = '&q%5Bid_in%5D%5B%5D=';
                    var ids_for_get = delimeter + ids_sliced.join(delimeter);
                    $.ajax({
                        async: false,
                        dataType: "json",
                        url: _url + ids_for_get,
                        success: function (result) {
                            data = data.concat(result);
                            begin_index = end_index;
                            if (end_index + items_per_request > ids.length) {
                                end_index = ids.length;
                            } else {
                                end_index = end_index + items_per_request;
                            }
                        },
                        error: function (result) {
                            console.log(result);
                        }
                    });
                    request_num++;
                } while (begin_index < ids.length && request_num < request_limit);
            }
            return data;
        }
    };
});

app.factory('GetObjectFromCacheFactory', function ($http, $q, $rootScope) {
    return {
        getObjectFromCache: function (_url, data_name, GetObjectByUrlPaginationFactory) {
            var res = null;
            if ($rootScope[data_name]) {
                res = $rootScope[data_name];
            } else {
                $rootScope[data_name] = GetObjectByUrlPaginationFactory.getObjectByUrl(_url);
                res = $rootScope[data_name];
            }
            return res;
        }
    };
});
app.factory('GetObjectByUrlSynchFactory', function ($http, $q) {
    return {
        getObjectByUrlSynch: function (_url) {
            var data = [];
            $.ajax({
                async: false,
                dataType: "json",
                url: _url,
                success: function (result) {
                    data = result;
                },
                error: function (result) {
                    console.log(result);
                }
            });
            return data;
        }
    };
});
app.factory('GetObjectByIdFactory', function () {
    return {
        getObjectById: function (id, arr) {
            var res = null;
            if(arr) {
                for (var i = 0; i < arr.length; i++) {
                    var obj = arr[i];
                    if (obj.id == id) {
                        res = obj;
                        break;
                    }
                }
            }
            return res;
        }
    };
});


app.factory('GetObjectByTitleFactory', function () {
    return {
        getObjectByTitle: function (title, arr) {
            var res = null;
            for (var i = 0; i < arr.length; i++) {
                var obj = arr[i];
                if (obj.title == title) {
                    res = obj;
                    break;
                }
            }
            return res;
        }
    };
});
app.factory('breadcrumbs', ['$rootScope', '$location', function ($rootScope, $location) {

    var breadcrumbs = [];
    var breadcrumbsService = {};

    //we want to update breadcrumbs only when a route is actually changed
    //as $location.path() will get updated imediatelly (even if route change fails!)
    $rootScope.$on('$routeChangeSuccess', function (event, current) {

        var pathElements = $location.path().split('/'), result = [], i;
        var breadcrumbPath = function (index) {
            //var rootpath = '/app/index.html#'
            //var rootpath = '/admin/#';
            return rootpath + '/' + (pathElements.slice(0, index + 1)).join('/');
        };

        pathElements.shift();
        for (i = 0; i < pathElements.length; i++) {
            result.push({name: pathElements[i], path: breadcrumbPath(i)});
        }

        breadcrumbs = result;
    });

    breadcrumbsService.getAll = function () {
        return breadcrumbs;
    };

    breadcrumbsService.getFirst = function () {
        return breadcrumbs[0] || {};
    };

    return breadcrumbsService;
}]);

app.factory('GetDateForDatePickerFactory', function () {
    return {
        getDateForDatePicker: function (d) {
            var year = d.getFullYear();
            var month = d.getMonth() + 1;
            if (month < 10) {
                month = "0" + month;
            }
            ;
            var day = d.getDate();
            var res = year + "-" + month + "-" + day;
            return res;
        }
    };
});
app.factory('GetDateTimeForDatePickerFactory', function () {
    return {
        getDateTimeForDatePicker: function (d) {
            var year = d.getFullYear();
            var month = d.getMonth() + 1;
            if (month < 10) {
                month = "0" + month;
            }
            ;
            var day = d.getDate();
            //padding all numbers with zero, for formating reason.
            var hours = d.getHours();
            var hours_str = padNumWithZero(hours);
            var minutes = d.getMinutes();
            var minutes_str = padNumWithZero(minutes);
            var seconds = d.getSeconds();
            var seconds_str = padNumWithZero(seconds);
            var res = year + "-" + month + "-" + day + "T" + hours_str + ":" + minutes_str + ":" + seconds_str;
            return res;
        }
    };
});
app.factory('TransformJsonToUrlFactory', function () {
    return {
        transformJsonToUrl: function (obj) {
            var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

            for (name in obj) {
                value = obj[name];

                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if (value !== undefined && value !== null)
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        }
    };
});


app.factory('UpdateUserFactory', function ($http, $cookies) {
    return {
        updateUser: function (user) {
            var url = server_string + '/activeadmin/users/' + user.id + '.json';
            var content_type = "application/x-www-form-urlencoded";
            $http.defaults.headers.post["Content-Type"] = content_type;
            var csrf_token = $cookies['CSRF-TOKEN'];
            $http.defaults.headers.post["X-CSRF-Token"] = csrf_token;
            var post_data = {};
            post_data['authenticity_token'] = csrf_token;
            post_data['_method'] = 'patch';
            post_data['user'] = user;
            var parsed_post_data = $.param(post_data);
            return $http.post(url, parsed_post_data).success(function (data) {
                alert("user form has been posted successfully");
            }).error(function (data) {
                alert('error accured :' + JSON.stringify(data));
            });
        }
    }
});


app.factory('GetLocalTimeObjFactory', function () {
    return {
        getLocalTimeObj: function () {
            var timezone = jstz.determine().name();
            var date = new Date();
            var now = new timezoneJS.Date(date.getTime(), timezone);
            return now;
        }
    }
});

app.factory('GetIsoStringFactory', function () {
    return {
        getIsoString: function (date) {//date.toIsoString is 3 hours earlier then it shoul be. bug...
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            if (month.length == 1) {
                month = '0' + month;
            }
            var day = date.getDate();
            if (day.length == 1) {
                day = '0' + day;
            }
            var hour = date.getHours();
            if (hour.length == 1) {
                hour = '0' + hour;
            }
            var minutes = date.getMinutes();
            if (minutes.length == 1) {
                minutes = '0' + minutes;
            }
            var seconds = date.getSeconds();
            if (seconds.length == 1) {
                seconds = '0' + seconds;
            }
            var milliseconds = date.getMilliseconds();
            var res = year + '-' + month + '-' + day + 'T' + hour + ':' + minutes + ':' + seconds + '.' + '000Z';
            return res;
        }
    }
});

app.factory('GetDifferentFieldsFactory', function () {
    return {
        getDifferentFields: function (obj1, obj2) {
            //this function gets 2 objects a,b, compares each field in them , puts in new object c
            //key,value from be, if they are different from a.
            var res = {};
            for (var k in obj1) {
                var val1 = obj1[k];
                var val2 = obj2[k];
                if (JSON.stringify(val1) != JSON.stringify(val2) ||
                    k == 'lock_version') {
                    res[k] = val2
                }
            }
            return res;
        }
    }
});

app.factory('ConvertMapToArrayFactory', function () {
    return {
        convertMapToArray: function (map) {
            //this function gets 2 objects a,b, compares each field in them , puts in new object c
            //key,value from be, if they are different from a.
            var res = [];
            for (var k in map) {
                res.push(map[k])
            }
            return res;
        }
    }
});

app.factory('GetManyToOneArrayFactory', function () {
    return {
        getManyToOneArray: function (key, key_name, entities) {
            /*this function gets key, fk name, array of entities. it return all entities where entity[key_name] == key*/
            var res = [];
            for (var i = 0; i < entities.length; i++) {
                var entity = entities[i];
                if (entity[key_name] == key) {
                    res.push(entity);
                }
            }
            return res;
        }
    }
})

app.factory('GetKeyByValueFactory', function () {
    return {
        getKeyByValue: function (value, dict) {
            var res = null;
            for (var key in dict) {
                if (dict[key] == value) {
                    res = key;
                    break;
                }
            }
            return res;
        }
    };
});
app.factory('PatchObjectFactory', function ($http, $q, $resource) {
    return {
        patchObject: function (url, post_data,method,success_callback) {
            var content_type = "application/json; charset=UTF-8";
            $http.defaults.headers.post["Content-Type"] = content_type;
            var defaults = $http.defaults.headers
            defaults.patch = defaults.patch || {}
            defaults.patch['Content-Type'] = 'application/json';
            var src = $resource(url,
                {}, //parameters default
                {
                    Update: { method: "PATCH" },
                    Post: { method: "POST" }
                });
            switch(method){
                case 'post':
                    src.Post(post_data).$promise.then(
                        //success
                        function (value) {
                            success_callback(value);
                        },
                        //error
                        function (error) {
                            alert('error accured :' + JSON.stringify(error))
                        }
                    );
                    break;
                case 'patch':
                    src.Update(post_data).$promise.then(
                        //success
                        function (value) {
                            success_callback(value);
                        },
                        //error
                        function (error) {
                            alert('error accured :' + JSON.stringify(error))
                        }
                    );
                    break;
                default:
                    src.Update(post_data).$promise.then(
                        //success
                        function (value) {
                            success_callback(value);
                        },
                        //error
                        function (error) {
                            alert('error accured :' + JSON.stringify(error))
                        }
                    );
                    break;

            }

        }
    };
});

app.factory('ConvertDateTimeToDateFactory', function () {
    return {
        convertDateTimeToDate: function (str) {
            return str.substring(0, str.indexOf('T'));
        }
    };
});




app.factory('GetDataByJsonFactory', function ($http, $q) {
    return {
        getDataByJson: function (_url, obj,datatype) {
            var data = null;
            var parsed_obj = JSON.stringify(obj);
            $.ajax({
                url: _url,
                async: false,
                dataType:datatype,
                type: 'GET',
                data: { data: parsed_obj },
                success: function(result) {
                    // process the results
                    data = result;
                }
            });
            return data;
        }
    };
});
app.factory('GetIndexByKeyFactory', function () {
    return {
        getIndexByKey: function (key,keyValue,arr) {
            var res = -1;
            for(var i = 0 ; i < arr.length ; i++){
                var item = arr[i];
                if(item[key] == keyValue){
                    res = i;
                    break;
                }
            }
            return res;
        }
    };
});


app.factory('CloneArrayOfObjectsFactory', function () {
    return {
        cloneArrayOfObjects: function (arr) {
            var res = [];
            for(var i = 0 ; i < arr.length ; i++){
                var obj = arr[i];
                var cloned_obj = jQuery.extend(true, {}, obj);
                res.push(cloned_obj)
            }
            return res;
        }
    };
});

app.factory('RemoveObjFromArrFactory', function () {
    return {
        removeObjFromArr: function (obj,arr) {
            var index = arr.indexOf(obj);
            if(index != -1){
                arr.splice(index,1);
            }
        }
    };
});

app.factory('GetObjectByAttributeFactory', function () {
    return {
        getObjectByAttribute: function (attribute,attribute_value, arr) {
            var res = null;
            if(arr) {
                for (var i = 0; i < arr.length; i++) {
                    var item = arr[i];
                    if (item[attribute] == attribute_value) {
                        res = item;
                        break;
                    }
                }
            }
            return res
        }
    };
});

app.factory('IsNumberFactory', function () {
    return {
        isNumber: function (obj) {
            var res = !isNaN(parseFloat(obj))
            return res
        }
    };
});

app.factory('UniqueArrFactory', function () {
    return {
        uniqueArr: function (arr) {
            var res =[]
            for(var i = 0 ; i < arr.length ; i++){
                var obj = arr[i];
                if(res.indexOf(obj) == -1){
                    res.push(obj);
                }
            }
            return res
        }
    };
});

app.factory('ArrMinusArrFactory', function () {
    return {
        arrMinusArr: function (arr1,arr2) {
            var res =[]
            for(var i = 0 ; i < arr1.length ; i++){
                var obj = arr1[i];
                if(arr2.indexOf(obj) == -1){
                    res.push(obj);
                }
            }
            return res
        }
    };
});

app.factory('GetSoilDataSetsFactory', function () {
    return {
        getSoilDataSets: function (remote_logger) {
            var res = [];
            if (remote_logger.datasets) {
                for (var i = 0; i < remote_logger.datasets.length; i++) {
                    var ds = remote_logger.datasets[i];
                    if (ds.type_id == app.SOIL_MOISTURE_FORMAT_DS_TYPE_ID) {
                        res.push(ds);
                    }
                }
            }
            return res;
        }
    };
});


app.factory('myHttpInterceptor', function($rootScope, $q) {
    return {
        'requestError': function(config) {
            $rootScope.status = 'HTTP REQUEST ERROR ' + config;
            return config || $q.when(config);
        },
        'responseError': function(rejection) {
            $rootScope.status = 'HTTP RESPONSE ERROR ' + rejection.status + '\n' +
                rejection.data;
            return $q.reject(rejection);
        },
    };
});

app.factory('transitService', function($rootScope, $http, $q, $log) {
    $rootScope.status = 'Retrieving data...';
    var deferred = $q.defer();
    $http.get('rest/query')
        .success(function(data, status, headers, config) {
            $rootScope.transits = data;
            deferred.resolve();
            $rootScope.status = '';
        });
    return deferred.promise;
});

app.factory('CenterOfCoordsService', function($rootScope, $http, $q, $log) {
    return {
        centerOfCoords: function (coords) {
            var res = null;
            var bound = new google.maps.LatLngBounds();
            for (var i = 0; i < coords.length; i++) {
                var latLng = coords[i];
                bound.extend(latLng);
            }
            res = bound.getCenter();
            return res;
        }
    };
});

app.factory('BoundsOfCoordsService', function($rootScope, $http, $q, $log) {
    return {
        boundsOfCoords: function (coords) {
            var res = null;
            var bound = new google.maps.LatLngBounds();
            for (var i = 0; i < coords.length; i++) {
                var latLng = coords[i];
                bound.extend(latLng);
            }
            res = bound;
            return res;
        }
    };
});

app.factory('breadcrumbs', ['$rootScope', '$location', function ($rootScope, $location) {

    var breadcrumbs = [];
    var breadcrumbsService = {};

    //we want to update breadcrumbs only when a route is actually changed
    //as $location.path() will get updated imediatelly (even if route change fails!)
    $rootScope.$on('$routeChangeSuccess', function (event, current) {

        var pathElements = $location.path().split('/'), result = [], i;
        var breadcrumbPath = function (index) {
            //var rootpath = '/app/index.html#'
            //var rootpath = '/admin/#';
            return '/' + (pathElements.slice(0, index + 1)).join('/');
        };

        pathElements.shift();
        for (i = 0; i < pathElements.length; i++) {
            result.push({name: pathElements[i], path: breadcrumbPath(i)});
        }

        breadcrumbs = result;
    });

    breadcrumbsService.getAll = function () {
        return breadcrumbs;
    };

    breadcrumbsService.getFirst = function () {
        return breadcrumbs[0] || {};
    };

    return breadcrumbsService;
}]);

app.factory('ResizeMapService', function($rootScope, $http, $q, $log) {
    return {
        resizeMap: function () {
            var bread_crumbs_div = $('#breadcrumbs');
            var width = bread_crumbs_div.width();
            $("#map").width(width);
        }
    };
});
'use strict';

/* Directives */

//add drggable directive to app
app.directive('draggable', function() {
  return function(scope, element) {
    // this gives us the native JS object
    var el = element[0];

    el.draggable = true;

    el.addEventListener(
        'dragstart',
        function(e) {
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('Text', this.id);
          this.classList.add('drag');
          return false;
        },
        false
    );

    el.addEventListener(
        'dragend',
        function(e) {
          this.classList.remove('drag');
          return false;
        },
        false
    );
  }
});

var INTEGER_REGEXP =  /^\-?\d+((\.|\,)\d+)?$/;
app.directive('integer', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        if (INTEGER_REGEXP.test(viewValue)) {
          // it is valid
          ctrl.$setValidity('integer', true);
          return viewValue;
        } else {
          // it is invalid, return undefined (no model update)
          ctrl.$setValidity('integer', false);
          return undefined;
        }
      });
    }
  };
});


app.directive('droppable', function() {
  return {
    link: function(scope, element) {
      // again we need the native object
      var el = element[0];
      el.scope = scope//this is for using scope inside event listeners
      el.addEventListener(
          'dragover',
          function(e) {
            e.dataTransfer.dropEffect = 'move';
            // allows us to drop
            if (e.preventDefault) e.preventDefault();
            this.classList.add('over');
            return false;
          },
          false
      );
      el.addEventListener(
          'dragenter',
          function(e) {
            this.classList.add('over');
            return false;
          },
          false
      );

      el.addEventListener(
          'dragleave',
          function(e) {
            this.classList.remove('over');
            return false;
          },
          false
      );

      el.addEventListener(
          'drop',
          function(e) {
            // Stops some browsers from redirecting.
            if (e.stopPropagation) e.stopPropagation();
            this.classList.remove('over');
            var item = document.getElementById(e.dataTransfer.getData('Text'));
            var logger_id = item.id;
            var project_id = e.target.id;
            var target = e.target;
            while(project_id == ''){//going to parent until we find project. ugly.
              target = target.parentNode;
              project_id = target.id;
            }
            //check if project have been dragged to project
            if(logger_id.indexOf("project") != -1 && project_id.indexOf("logger") != -1){//swap
              var temp = logger_id;
              logger_id = project_id;
              project_id = temp;
            }else if(logger_id.indexOf("logger") != -1 && project_id.indexOf("logger") != -1){//same objects, exit
              return false;
            }
            else if(logger_id.indexOf("project") != -1 && project_id.indexOf("project") != -1){//same objects, exit
              return false;
            }
            logger_id = parseInt(logger_id.replace("logger_",""));
            project_id = parseInt(project_id.replace("project_",""));
            scope.addPair(project_id,logger_id);
            scope.$apply();
            return false;
          },
          false
      );

    }
  }
});



app.directive('notdroppable', function() {
  return {
    link: function(scope, element) {
      // again we need the native object
      var el = element[0];
      el.scope = scope//this is for using scope inside event listeners
      el.removeEventListener(
          'dragover',
          function(e) {
            return false;
          },
          false
      );
      el.removeEventListener(
          'dragenter',
          function(e) {
            return false;
          },
          false
      );

      el.removeEventListener(
          'dragleave',
          function(e) {
            return false;
          },
          false
      );

      el.removeEventListener(
          'drop',
          function(e) {
            return false;
          },
          false
      );

    }
  }
});




app.directive('notdraggable', function() {
  return function(scope, element) {
    // this gives us the native JS object
    var el = element[0];

    el.draggable = false;

    el.removeEventListener(
        'dragstart',
        function(e) {
          return false;
        },
        false
    );

    el.removeEventListener(
        'dragend',
        function(e) {
          return false;
        },
        false
    );
  }
});

app.directive('cutledder', function() {
  return function(scope, element) {
    // this gives us the native JS object
    var el = element[0];
    var a=0;
  }
});

var FLOAT_REGEXP = /^\-?\d+((\.|\,)\d+)?$/;
app.directive('smartFloat', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        if (FLOAT_REGEXP.test(viewValue)) {
          ctrl.$setValidity('float', true);
          return parseFloat(viewValue.replace(',', '.'));
        } else {
          ctrl.$setValidity('float', false);
          return undefined;
        }
      });
    }
  };
});






