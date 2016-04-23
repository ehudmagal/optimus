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