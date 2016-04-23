'use strict';




myapp.factory('GetNthElementFromURLFactory', function() {
    return {
        getNthElementFromURL: function(n) {
            var res = null;
            var pathElements = location.href.split('/');
            try{
                res = pathElements[n];
            }catch(e){
                console.log(e);
                res = null;
            }
            return res;
        }
    };
});


myapp.factory('GetElementByIdFactory', function() {
    return {
        getElementById: function(id,arr) {
            var res = null;
            if(arr) {
                for (var i = 0; i < arr.length; i++) {
                    var el = arr[i];
                    if (el.id == id) {
                        res = el;
                        break;
                    }
                }
            }
            return res
        }
    };
});

myapp.factory('GetElementByAttributeFactory', function() {
    return {
        getElementByAttribute: function(attribute_val,attribute_name,arr) {
            var res = null;
            if(arr) {
                for (var i = 0; i < arr.length; i++) {
                    var el = arr[i];
                    if (el[attribute_name] == attribute_val) {
                        res = el;
                        break;
                    }
                }
            }
            return res
        }
    };
});

myapp.factory('GetElementByNameFactory', function() {
    return {
        getElementByName: function(name,arr) {
            var res = null;
            for(var i = 0 ; i < arr.length ; i++){
                var el = arr[i];
                if(el.name == name){
                    res = el;
                    break;
                }
            }
            return res
        }
    };
});

myapp.factory('GetCookieFactory', function (){
    return {
        getCookie: function (cname){
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1);
                if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
            }
            return "";
        }
    };
});

myapp.factory('GetObjectByUrlSynchFactory', function ($http, $q){
    return {
        getObjectByUrlSynch: function (_url){
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

myapp.factory('GetTxtObjectByUrlSynchFactory', function ($http, $q){
    return {
        getTxtObjectByUrlSynch: function (_url){
            var data = [];
            $.ajax({
                async: false,
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

myapp.factory('GetManyToOneArrayFactory',function(){
    return {
        getManyToOneArray: function(key,key_name,entities){
            /*this function gets key, fk name, array of entities. it return all entities where entity[key_name] == key*/
            var res = [];
            for(var i = 0 ; i < entities.length ; i++){
                var entity = entities[i];
                if(entity[key_name] == key){
                    res.push(entity);
                }
            }
            return res;
        }
    }
});

myapp.factory('GetObjectByAttributeFactory', function () {
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