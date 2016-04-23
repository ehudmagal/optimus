////////////////////filters/////////////////////
myapp.filter('searchFor', function(){

    // All filters must return a function. The first parameter
    // is the data that is to be filtered, and the second is an
    // argument that may be passed with a colon (searchFor:searchString)

    return function(arr, searchString){

        if(!searchString){
            return arr;
        }

        var result = [];

        searchString = searchString.toLowerCase();

        // Using the forEach helper method to loop through the array
        angular.forEach(arr, function(item){

            if(item.id.toString().toLowerCase().indexOf(searchString) !== -1){
                result.push(item);
            }

        });

        return result;
    };

});

myapp.filter('searchForName', function(){

    // All filters must return a function. The first parameter
    // is the data that is to be filtered, and the second is an
    // argument that may be passed with a colon (searchFor:searchString)

    return function(arr, searchString){

        if(!searchString){
            return arr;
        }

        var result = [];

        searchString = searchString.toLowerCase();

        // Using the forEach helper method to loop through the array
        angular.forEach(arr, function(item){

            if(item.name.toString().toLowerCase().indexOf(searchString) !== -1){
                result.push(item);
            }

        });

        return result;
    };

});

myapp.filter('offset', function() {
    return function(arr, start) {
        if(arr && arr != undefined){
            start = parseInt(start, 10);
            return arr.slice(start);
        }
        return [];
    };
});












///////////////////////
myapp.filter('searchDSId', function(){

    // All filters must return a function. The first parameter
    // is the data that is to be filtered, and the second is an
    // argument that may be passed with a colon (searchFor:searchString)

    return function(arr, searchString){

        if(!searchString){
            return arr;
        }

        var result = [];

        searchString = searchString.toLowerCase();

        // Using the forEach helper method to loop through the array
        angular.forEach(arr, function(item){

            if(item[1].toString().toLowerCase().indexOf(searchString) !== -1){
                result.push(item);
            }

        });

        return result;
    };

});

myapp.filter('searchDSName', function(){

    // All filters must return a function. The first parameter
    // is the data that is to be filtered, and the second is an
    // argument that may be passed with a colon (searchFor:searchString)

    return function(arr, searchString){

        if(!searchString){
            return arr;
        }

        var result = [];

        searchString = searchString.toLowerCase();

        // Using the forEach helper method to loop through the array
        angular.forEach(arr, function(item){

            if(item.title.toString().toLowerCase().indexOf(searchString) !== -1){
                result.push(item);
            }

        });

        return result;
    };

});


myapp.filter('searchFirstName', function(){

    // All filters must return a function. The first parameter
    // is the data that is to be filtered, and the second is an
    // argument that may be passed with a colon (searchFor:searchString)

    return function(arr, searchString){

        if(!searchString){
            return arr;
        }

        var result = [];

        searchString = searchString.toLowerCase();

        // Using the forEach helper method to loop through the array
        angular.forEach(arr, function(item){

            if(item.first_name.toLowerCase().indexOf(searchString) !== -1){
                result.push(item);
            }

        });

        return result;
    };

});

myapp.filter('searchByGroup', function(){

    // All filters must return a function. The first parameter
    // is the data that is to be filtered, and the second is an
    // argument that may be passed with a colon (searchFor:searchString)

    return function(arr, users ,searchString){

        if(!searchString){
            return arr;
        }

        var result = [];

        searchString = searchString.toLowerCase();

        // Using the forEach helper method to loop through the array
        angular.forEach(arr, function(item){
            var group_id = item.group_id;
            var group_name = null;
            for(var i = 0 ; i < users.length ; i++){
                var id = users[i].id;
                if(group_id == id){
                    group_name =  users[i].first_name;
                    if(group_name.toLowerCase().indexOf(searchString) !== -1){
                        result.push(item);
                    }
                }
            }


        });

        return result;
    };

});

myapp.filter('searchTitle', function(){

    // All filters must return a function. The first parameter
    // is the data that is to be filtered, and the second is an
    // argument that may be passed with a colon (searchFor:searchString)

    return function(arr, searchString){

        if(!searchString){
            return arr;
        }

        var result = [];

        searchString = searchString.toLowerCase();

        // Using the forEach helper method to loop through the array
        angular.forEach(arr, function(item){

            if(item.title.toLowerCase().indexOf(searchString) !== -1){
                result.push(item);
            }

        });

        return result;
    };

});
//We already have a limitTo filter built-in to angular,
//let's make a startFrom filter
myapp.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        var res =input;
        try{
            res = input.slice(start);
        }catch(e){

        }
        return res;
    }
});


myapp.filter('hasProjects', function() {
    return function(input, _hasProjects) {
        var res = []
        if(!_hasProjects && input) {
            var res = input;
        }
        else if(input){
            // Using the forEach helper method to loop through the array
            try {
                angular.forEach(input, function (item) {
                    if (item.owned_project_ids.length) {
                        res.push(item);
                    }

                })
            }catch(e){
                console.log(e);
            };
        }
        return res;
    }
});

myapp.filter('unlocked_users', function() {
    return function(input, show_unlocked_users) {
        if(!show_unlocked_users)
            var res =input;
        else{
            var res = [];
            // Using the forEach helper method to loop through the array
            angular.forEach(input, function(item){
                if(!item['access_locked?']){ //insert to arry only unlocked users
                    res.push(item);
                }

            });
        }
        return res;
    }
});

myapp.filter('ngTablePaging',function(){
    return function(input,tableParams){
        var res = null;
        try {
            res = input.slice((tableParams.page() - 1) * tableParams.count(), tableParams.page() * tableParams.count())
        }catch(e){
            console.log(e);
        }
        return res;
    }
})


myapp.filter('getDataSetsByCalcType', function() {
    return function(input, calc_type, selected_dataset ) {
        var res = [];
        // Using the forEach helper method to loop through the array
        angular.forEach(input, function(item){
            try {
                if (item.calc_type.toLowerCase().indexOf(calc_type.toLowerCase()) != -1) {
                    res.push(item);
                }
            }catch(e){

            }

        });
        return res;
    }
});

myapp.filter('showOnlyUsers', function() {
    return function(input, showUsers) {
        var res = []
        if(!showUsers && input) {
            res = input;
        }
        else if(input){
            // Using the forEach helper method to loop through the array
            try {
                angular.forEach(input, function (item) {
                    if (item.type != 'Group') {
                        res.push(item);
                    }

                })
            }catch(e){
                console.log(e);
            };
        }
        return res;
    }
});


myapp.filter('getDisconnectedLoggers',function(){
    return function(input) {
        var res = [];
        // Using the forEach helper method to loop through the array

        angular.forEach(input, function (item) {
            try {
                //bug
                var timezone = item.timezone;
                if(timezone === 'Israel Standard Time'){
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
            }catch(e){
                console.log(e);
            }

        });

        return res;
    }
});



myapp.filter('getDyingProjects',function(){
    return function(input) {
        var res = [];
        // Using the forEach helper method to loop through the array

        angular.forEach(input, function (item) {
            try {
                var deactivation_date = new timezoneJS.Date(item.deactivation_date);
                //var last_time_transmited_offset = last_time_transmited.getTimezoneOffset() * 60;
                var now = new Date();
                var timeDiff =  deactivation_date.getTime() - now.getTime();
                var diffDays = Math.ceil(timeDiff / (3600 *24 * 1000));
                if (diffDays <= 7 && diffDays >= 0) {
                    res.push(item);
                }
            }catch(e){
                console.log(e);
            }

        });

        return res;
    }
});

myapp.filter('searchForNameById', function(){

    // All filters must return a function. The first parameter
    // is the data that is to be filtered, and the second is an
    // argument that may be passed with a colon (searchFor:searchString)

    return function(loggers,users, searchString){

        if(!searchString || !loggers || !users){
            return loggers;
        }

        var result = [];

        searchString = searchString.toLowerCase();

        // Using the forEach helper method to loop through the array
        angular.forEach(loggers, function(logger){
            for(var i = 0 ; i < users.length ; i++){
                var user = users[i];
                if(user.id === logger.owner_id){
                    var first_name = user.first_name;
                    break;
                }
            }
            if(first_name){
                if(first_name.toLowerCase().indexOf(searchString) !== -1) {
                    result.push(logger);
                }
            }

        });

        return result;
    };

});



myapp.filter('searchAnything', function(){

    // All filters must return a function. The first parameter
    // is the data that is to be filtered, and the second is an
    // argument that may be passed with a colon (searchFor:searchString)

    return function(arr, searchString,searchCriterias){

        if(!searchString){
            return arr;
        }

        var result = [];

        searchString = searchString.toLowerCase();

        // Using the forEach helper method to loop through the array
        angular.forEach(arr, function(item){

            for(var i = 0 ; i < searchCriterias.length ; i++){
                var searchCriteria = searchCriterias[i];
                if(item[searchCriteria].toString().toLowerCase().indexOf(searchString) !== -1 && result.indexOf(item) === -1){
                    result.push(item);
                }

            }


        });

        return result;
    };

});












myapp.filter('getUserProjects', function(){

    // All filters must return a function. The first parameter
    // is the data that is to be filtered, and the second is an
    // argument that may be passed with a colon (searchFor:searchString)

    return function(projects,user){

        var result = [];


        // Using the forEach helper method to loop through the array
        angular.forEach(projects, function(project){
                    if(user) {
                        if (project.owner_id == user.id) {
                            result.push(project);
                        } else if( user.viewable_project_ids) {
                              if (user.viewable_project_ids.indexOf(project.id != -1) &&
                                result.indexOf(project) == -1) {
                                result.push(project);
                            }
                        }
                    }

        });

        return result;
    };

});

myapp.filter('getArchivedProjects', function(){

    // All filters must return a function. The first parameter
    // is the data that is to be filtered, and the second is an
    // argument that may be passed with a colon (searchFor:searchString)

    return function(projects,show_archived){

        var result = [];


        // Using the forEach helper method to loop through the array
        angular.forEach(projects, function(project){
           if(show_archived){
               result.push(project);
           }else{
               if(project.status != "archived"){
                   result.push(project);
               }
           }

        });

        return result;
    };

});

myapp.filter('sortProjectsByIndicators', function(){

    // All filters must return a function. The first parameter
    // is the data that is to be filtered, and the second is an
    // argument that may be passed with a colon (searchFor:searchString)

    return function(projects){

        var result = [];
        var red = [];
        var yellow = [];
        var green = [];
        var blank = [];
        // Using the forEach helper method to loop through the array
        angular.forEach(projects, function(project){
         var indicator = project.current_indicator;
            if (indicator) {
                switch (severity) {
                    case 0:
                        green.push(project);
                        break;
                    case 1:
                        yellow.push(project);
                        break;
                    case 2:
                        red.push(project);
                        break;
                    default :
                        green.push(project);
                        break;
                }
                //for (var j = 0; j < indicators.length; j++) {
                //    var indicator = indicators[j];
                //    var plant_status = indicator['plant_status'];
                //    if (plant_status) {
                //        var severity = plant_status.severity;
                //
                //        break;//no need to continue searching for plant_status after we rhave found it
                //    }
                //}
            }else{
                blank.push(project);
            }
        });
        result = red.concat(yellow,green,blank);
        return result;
    };

});

myapp.filter('limit_filter', function() {
    return function(arr, start,end) {
       var res = [];
        if(arr && start != undefined && end != undefined) {
            for (var i = start; i < end; i++) {
                res.push(arr[i]);
            }
        }
        return res;
    };
});