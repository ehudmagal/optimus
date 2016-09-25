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

app.factory('GetObjectByAttributeFactory', function () {
    return {
        getObjectByAttribute: function (attribute, attribute_value, arr) {
            var res = null;
            if (arr) {
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

app.factory('GetObjectByAttributesFactory', function () {
    return {
        getObjectByAttributes: function (attributes, attribute_values, arr) {
            var res = null;
            if (arr) {
                for (var i = 0; i < arr.length; i++) {
                    var item = arr[i];
                    var attributes_counter = 0;
                    for(var j = 0 ; j < attributes.length ; j++){
                        var attribute = attributes[j];
                        var attribute_value = attribute_values[j];
                        if (item[attribute] == attribute_value) {
                            attributes_counter++;
                        }
                        if(attributes_counter == attributes.length){
                            res = item;
                            break;
                        }
                    }
                  
                }
            }
            return res
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
            for (var i = 0; i < arr.length; i++) {
                var obj = arr[i];
                if (obj.id == id) {
                    res = obj;
                    break;
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
        patchObject: function (url, post_data,success_callback) {
            var csrf_token = $.cookie("CSRF-TOKEN");
            post_data['authenticity_token'] = csrf_token;
            var content_type = "application/json; charset=UTF-8";
            $http.defaults.headers.post["Content-Type"] = content_type;
            var defaults = $http.defaults.headers;
            defaults.patch = defaults.patch || {}
            defaults.patch['Content-Type'] = 'application/json';
            var src = $resource(url,
                {}, //parameters default
                {
                    Update: {method: "PATCH"}
                });
            src.Update(post_data).$promise.then(
                //success
                function (value) {
                    success_callback();
                },
                //error
                function (error) {
                    alert('error accured :' + JSON.stringify(error))
                }
            );
        }
    };
});

app.factory('SoilDepthIsSetFactory', function () {
    return {
        soilDepthIsSet: function (remote_logger) {
            var res = true;
            if (remote_logger.datasets) {
                for (var i = 0; i < remote_logger.datasets.length; i++) {
                    var ds = remote_logger.datasets[i];
                    if (ds.type_id == app.SOIL_MOISTURE_FORMAT_DS_TYPE_ID) {
                        if (!ds.display_settings) {
                            res = false;
                            break;
                        }
                        if (!ds.display_settings.depth_value) {
                            res = false;
                            break;
                        }
                    }
                }
            }
            return res;
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

app.factory('SetCookieFactory', function () {
    return {
        setCookie: function (cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + "; " + expires;
        }
    };
});

app.factory('GetCookieFactory', function () {
    return {
        getCookie: function (cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1);
                if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
            }
            return "";
        }
    };
});

app.factory('DeleteCookieFactory', function () {
    return {
        deleteCookie: function (cname) {
            document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
    };
});

app.factory('GetProjectByLatLngFactory', function () {
    return {
        getProjectByLatLng: function (latLng, projects) {
            var res = null;
            for (var i = 0; i < projects.length; i++) {
                var project = projects[i];
                if (project.coordinates && project.coordinates.length) {
                    var polygon = new google.maps.Polygon({paths: project.coordinates});
                    if (google.maps.geometry.poly.containsLocation(latLng, polygon)) {
                        res = project;
                        break;
                    }
                }
            }
            return res;
        }
    };
});

app.factory('SaveToFailedLoggersFactory', function () {
    return {
        saveToFailedLoggers: function (logger, GetCookieFactory, SetCookieFactory) {
            var failed_loggers = GetCookieFactory.getCookie('failed_loggers');
            if (failed_loggers != '' && failed_loggers) {
                failed_loggers = JSON.parse(failed_loggers);
            } else {
                failed_loggers = [];
            }
            if (failed_loggers.indexOf(logger.id) == -1) {
                failed_loggers.push(logger.id);
            }
            SetCookieFactory.setCookie('failed_loggers', JSON.stringify(failed_loggers), 3650);
        }
    };
});

app.factory('RemoveFromFailedLoggersFactory', function () {
    return {
        removeFromFailedLoggers: function (logger, GetCookieFactory, SetCookieFactory) {
            var failed_loggers = GetCookieFactory.getCookie('failed_loggers');
            if (failed_loggers != '' && failed_loggers) {
                failed_loggers = JSON.parse(failed_loggers);
            } else {
                failed_loggers = [];
            }
            var index = failed_loggers.indexOf(logger.id);
            if (index != -1) {
                failed_loggers.splice(index, 1);
            }
            SetCookieFactory.setCookie('failed_loggers', JSON.stringify(failed_loggers), 3650);
        }
    };
});

app.factory('ActivateLoggerFactory', function ($http, $cookies) {
    return {
        activateLogger: function (logger) {
            var url = server_string + '/activeadmin/remote_loggers/' + logger.id + '/activate.json';
            var csrf_token = $cookies['CSRF-TOKEN'];
            var post_data = {};
            post_data.authenticity_token = csrf_token;
            post_data._method = 'put';
            post_data['remote_logger'] = {};
            var urlEncodedObj = $.param(post_data);
            $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
            $http.post(url, urlEncodedObj).success(function (data) {
                logger.activated = true;
                alert('logger has been activated successfully');
            }).error(function (data, status, headers, config) {
                alert('error accured :' + JSON.stringify(data));
            });

        }
    };
});

app.factory('DeactivateLoggerFactory', function ($http, $cookies) {
    return {
        deactivateLogger: function (logger) {
            var url = server_string + '/activeadmin/remote_loggers/' + logger.id + '/deactivate.json';
            var csrf_token = $cookies['CSRF-TOKEN'];
            var post_data = {};
            post_data.authenticity_token = csrf_token;
            post_data._method = 'post';
            post_data['remote_logger'] = {};
            var urlEncodedObj = $.param(post_data);
            $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
            $http.post(url, urlEncodedObj).success(function (data) {
                logger.activated = false;
                alert('logger has been deactivated successfully');
            }).error(function (data, status, headers, config) {
                alert('error accured :' + JSON.stringify(data));
            });


        }
    };
});

app.factory('CenterOfCoordsFactory', function () {
    return {
        centerOfCoords: function (coords) {
            var res = null;
            var bound = new google.maps.LatLngBounds();
            for (var i = 0; i < coords.length; i++) {
                var latLng = coords[i];
                bound.extend(new google.maps.LatLng(latLng.lat(), latLng.lng()));
            }
            res = bound.getCenter();
            return res;
        }
    };
});


app.factory('ConvertCoordsFactory', function () {
    return {
        convertCoords: function (loggers) {
            var coords = [];
            if(loggers) {
                for (var i = 0; i < loggers.length; i++) {
                    var logger = loggers[i];
                    if (logger.latitude && logger.longitude) {
                        coords.push({lat: logger.latitude, lng: logger.longitude});
                    }
                }
            }
            return coords;
        }
    };
});

app.factory('IsNumberFactory', function () {
    return {
        isNumber: function (obj) {
            return !isNaN(parseFloat(obj))
        }
    };
});

app.factory('FilterPolygonsFactory', function () {
    return {
        filterPolygons: function (map,polygons,project_name,CenterOfCoordsFactory,loggers) {
            if(polygons && loggers) {
                var coords = [];
                if (project_name && project_name != '') {
                    for (var i = 0; i < polygons.length; i++) {
                        var poly = polygons[i];
                        var proj = poly.project;
                        if (proj.name.indexOf(project_name) == -1) {
                            poly.setMap(null);
                        }else{
                            poly.setMap(map);
                            if(proj.latitude && proj.longitude) {
                                coords.push({lat: proj.latitude, lng: proj.longitude})
                            }
                        }
                    }
                } else {
                    for (var i = 0; i < polygons.length; i++) {
                        var poly = polygons[i];
                        poly.setMap(map);
                        proj = poly.project;
                        if(proj.latitude && proj.longitude) {
                            coords.push({lat: proj.latitude, lng: proj.longitude})
                        }
                    }
                }
                var center = null;
                if(coords.length) {
                    center = CenterOfCoordsFactory.centerOfCoords(coords);
                }else{
                    for (var i = 0; i < projects.length; i++) {
                        var project = projects[i];
                        if(project.latitude && project.longitude) {
                            coords.push({lat: project.latitude, lng: project.longitude})
                        }
                    }
                    center = CenterOfCoordsFactory.centerOfCoords(coords);
                }
                if(center) {
                    map.setCenter(center);
                    map.setZoom(14);
                }
            }
        }
    };
});






