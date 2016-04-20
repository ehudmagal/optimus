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


