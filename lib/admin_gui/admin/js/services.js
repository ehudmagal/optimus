materialAdmin

// =========================================================================
// Header Messages and Notifications list Data
// =========================================================================

    .service('messageService', ['$resource', function ($resource) {
        this.getMessage = function (img, user, text) {
            var gmList = $resource("data/messages-notifications.json");

            return gmList.get({
                img: img,
                user: user,
                text: text
            });
        }
    }])


    // =========================================================================
    // Best Selling Widget Data (Home Page)
    // =========================================================================

    .service('bestsellingService', ['$resource', function ($resource) {
        this.getBestselling = function (img, name, range) {
            var gbList = $resource("data/best-selling.json");

            return gbList.get({
                img: img,
                name: name,
                range: range,
            });
        }
    }])


    // =========================================================================
    // Todo List Widget Data
    // =========================================================================

    .service('todoService', ['$resource', function ($resource) {
        this.getTodo = function (todo) {
            var todoList = $resource("data/todo.json");

            return todoList.get({
                todo: todo
            });
        }
    }])


    // =========================================================================
    // Recent Items Widget Data
    // =========================================================================

    .service('recentitemService', ['$resource', function ($resource) {
        this.getRecentitem = function (id, name, price) {
            var recentitemList = $resource("data/recent-items.json");

            return recentitemList.get({
                id: id,
                name: name,
                price: price
            })
        }
    }])


    // =========================================================================
    // Recent Posts Widget Data
    // =========================================================================

    .service('recentpostService', ['$resource', function ($resource) {
        this.getRecentpost = function (img, user, text) {
            var recentpostList = $resource("data/messages-notifications.json");

            return recentpostList.get({
                img: img,
                user: user,
                text: text
            })
        }
    }])

    // =========================================================================
    // Data Table
    // =========================================================================

    .service('tableService', [function () {
        this.data = [
            {
                "id": 10238,
                "name": "Marc Barnes",
                "email": "marc.barnes54@example.com",
                "username": "MarcBarnes",
                "contact": "(382)-122-5003"
            },
            {
                "id": 10243,
                "name": "Glen Curtis",
                "email": "glen.curtis11@example.com",
                "username": "GlenCurtis",
                "contact": "(477)-981-4948"
            },
            {
                "id": 10248,
                "name": "Beverly Gonzalez",
                "email": "beverly.gonzalez54@example.com",
                "username": "BeverlyGonzalez",
                "contact": "(832)-255-5161"
            },
            {
                "id": 10253,
                "name": "Yvonne Chavez",
                "email": "yvonne.chavez@example.com",
                "username": "YvonneChavez",
                "contact": "(477)-446-3715"
            },
            {
                "id": 10234,
                "name": "Melinda Mitchelle",
                "email": "melinda@example.com",
                "username": "MelindaMitchelle",
                "contact": "(813)-716-4996"

            },
            {
                "id": 10239,
                "name": "Shannon Bradley",
                "email": "shannon.bradley42@example.com",
                "username": "ShannonBradley",
                "contact": "(774)-291-9928"
            },
            {
                "id": 10244,
                "name": "Virgil Kim",
                "email": "virgil.kim81@example.com",
                "username": "VirgilKim",
                "contact": "(219)-181-7898"
            },
            {
                "id": 10249,
                "name": "Letitia Robertson",
                "email": "letitia.rober@example.com",
                "username": "Letitia Robertson",
                "contact": "(647)-209-4589"
            },
            {
                "id": 10237,
                "name": "Claude King",
                "email": "claude.king22@example.com",
                "username": "ClaudeKing",
                "contact": "(657)-988-8701"
            },
            {
                "id": 10242,
                "name": "Roland Craig",
                "email": "roland.craig47@example.com",
                "username": "RolandCraig",
                "contact": "(932)-935-9471"
            },
            {
                "id": 10247,
                "name": "Colleen Parker",
                "email": "colleen.parker38@example.com",
                "username": "ColleenParker",
                "contact": "(857)-459-2792"
            },
            {
                "id": 10252,
                "name": "Leah Jensen",
                "email": "leah.jensen27@example.com",
                "username": "LeahJensen",
                "contact": "(861)-275-4686"
            },
            {
                "id": 10236,
                "name": "Harold Martinez",
                "email": "martinez67@example.com",
                "username": "HaroldMartinez",
                "contact": "(836)-634-9133"
            },
            {
                "id": 10241,
                "name": "Keith Lowe",
                "email": "keith.lowe96@example.com",
                "username": "KeithLowe",
                "contact": "(778)-787-3100"
            },
            {
                "id": 10246,
                "name": "Charles Walker",
                "email": "charles.walker90@example.com",
                "username": "CharlesWalker",
                "contact": "(486)-440-4716"
            },
            {
                "id": 10251,
                "name": "Lillie Curtis",
                "email": "lillie.curtis12@example.com",
                "username": "LillieCurtis",
                "contact": "(342)-510-2258"
            },
            {
                "id": 10235,
                "name": "Genesis Reynolds",
                "email": "genesis@example.com",
                "username": "GenesisReynolds",
                "contact": "(339)-375-1858"
            },
            {
                "id": 10240,
                "name": "Oscar Palmer",
                "email": "oscar.palmer24@example.com",
                "username": "OscarPalmer",
                "contact": "(544)-270-9912"
            },
            {
                "id": 10245,
                "name": "Lena Bishop",
                "email": "Lena Bishop",
                "username": "LenaBishop",
                "contact": "(177)-521-1556"
            },
            {
                "id": 10250,
                "name": "Kent Nguyen",
                "email": "kent.nguyen34@example.com",
                "username": "KentNguyen",
                "contact": "(506)-533-6801"
            }
        ];
    }])


    // =========================================================================
    // Malihu Scroll - Custom Scroll bars
    // =========================================================================
    .service('scrollService', function () {
        var ss = {};
        ss.malihuScroll = function scrollBar(selector, theme, mousewheelaxis) {
            $(selector).mCustomScrollbar({
                theme: theme,
                scrollInertia: 100,
                axis: 'yx',
                mouseWheel: {
                    enable: true,
                    axis: mousewheelaxis,
                    preventDefault: true
                }
            });
        }

        return ss;
    })


    //==============================================
    // BOOTSTRAP GROWL
    //==============================================

    .service('growlService', function () {
        var gs = {};
        gs.growl = function (message, type) {
            $.growl({
                message: message
            }, {
                type: type,
                allow_dismiss: false,
                label: 'Cancel',
                className: 'btn-xs btn-inverse',
                placement: {
                    from: 'top',
                    align: 'right'
                },
                delay: 2500,
                animate: {
                    enter: 'animated bounceIn',
                    exit: 'animated bounceOut'
                },
                offset: {
                    x: 20,
                    y: 85
                }
            });
        }

        return gs;
    })

    .service('CenterOfCoordsService', function () {
        var cs = {};
        cs.centerOfCoords = function (coords) {
            var res = {lat: 32.933052, lng: 35.08267799999999};
            var bound = new google.maps.LatLngBounds();
            if (coords.length) {
                for (var i = 0; i < coords.length; i++) {
                    var latLng = coords[i];
                    bound.extend(latLng);
                }
                res = bound.getCenter();
            }
            return res;
        }

        return cs;
    })


    .service('PatchObjectFactory', function ($http, $q, $resource, SetUserService) {
        var po = {}
        po.patchObject = function (url, post_data, method, success_callback) {
            var content_type = "application/json; charset=UTF-8";
            $http.defaults.headers.post["Content-Type"] = content_type;
            var csrf_token = $.cookie("CSRF-TOKEN");
            post_data['authenticity_token'] = csrf_token;
            var defaults = $http.defaults.headers
            defaults.patch = defaults.patch || {}
            defaults.patch['Content-Type'] = 'application/json';
            var src = $resource(url,
                {}, //parameters default
                {
                    Update: {method: "PATCH"},
                    Post: {method: "POST"},
                    Get: {method: "GET"},
                    Delete: {method: 'DELETE'}
                });
            switch (method) {
                case 'post':
                    src.Post(post_data).$promise.then(
                        //success
                        function (value) {
                            SetUserService.setUser();
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
                            SetUserService.setUser();
                            success_callback(value);
                        },
                        //error
                        function (error) {
                            alert('error accured :' + JSON.stringify(error))
                        }
                    );
                    break;
                case 'get':
                    src.Get(post_data).$promise.then(
                        //success
                        function (value) {
                            SetUserService.setUser();
                            success_callback(value);
                        },
                        //error
                        function (error) {
                            alert('error accured :' + JSON.stringify(error))
                        }
                    );
                    break;
                case 'delete':
                    src.Delete(post_data).$promise.then(
                        //success
                        function (value) {
                            SetUserService.setUser();
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
                            SetUserService.setUser();
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
        return po;

    })

    .service('SetUserService', function ($rootScope) {
        var su = {};
        su.setUser = function () {
            $rootScope.user = {
                name: 'Guest'
            }
            var devise_user_name = $.cookie("user_name");
            $rootScope.user = {
                name: $.cookie("user_name"),
                email: $.cookie("user_email"),
                type: $.cookie("user_type"),
                id: $.cookie("user_id")
            }

        }

        return su;
    })


    .service('urlParamService', function () {
        var up = {};
        up.urlParam = function (name) {
            var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
            var res = null;
            if (results) {
                res = results[1] || 0;
            }
            return res;
        }

        return up;
    })

    .service('IsEmptyObjService', function () {
        var ie = {};
        ie.isEmpty = function (obj) {
            return JSON.stringify(obj) === '{}';
        }

        return ie;
    })

    .service('FixedPriceService', function () {
        var fp = {};
        fp.fixedPrice = function (route, order, DistanceService) {
            var distance = DistanceService.distance(route);
            var total_tons = order.weight / 1000;
            var firstKmTonPrice = 6.5;
            var kmTonPrice = 0.45;
            if (distance > 13) {
                firstKmTonPrice = 3;
            }
            var res = total_tons * firstKmTonPrice + (distance - 1) * total_tons * kmTonPrice;
            return res;
        }

        return fp;
    })

    .service('DistanceService', function () {
        var d = {};
        d.distance = function (route) {
            var res = 0;
            if (route.legs) {
                for (var i = 0; i < route.legs.length; i++) {
                    var leg = route.legs[i];
                    res += leg.distance.value / 1000;
                }
            }
            return parseInt(res);
        }

        return d;
    })
    .service('BidColorService', function () {
        var b = {};
        b.color = function (bid) {
            var res = 'yellow';
            switch(bid.status){
                case 'selected':
                    res = 'green';
                    break;
                case 'over':
                    res = 'yellow';
                    break;
                case 'pending':
                    res = 'grey';
                    break;
                default:
                    break;
            }
            return res;
        }
        return b;
    })
    .service('BidFontStyleService', function () {
        var b = {};
        b.style = function (bid) {
            var res =  'color: black';
            switch(bid.status){
                case 'selected':
                    res = 'color: white';
                    break;
                case 'over':
                    res = 'color: black';
                    break;
                case 'pending':
                    res = 'color: white';
                    break;
                default:
                    break;
            }

            return res;
        }

        return b;
    })

materialAdmin.factory('GetObjectByAttributeFactory', function () {
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

materialAdmin.factory('GetDateStringFactory', function () {
    return {
        getDateString: function (iso) {
            var date = new Date(iso);
            var datetime = date.getDate() + "/"
                + (date.getMonth() + 1) + "/"
                + date.getFullYear() + " time: "
                + date.getHours() + ":";
            var minutes = date.getMinutes();
            if(minutes < 10){
                minutes = '0'+minutes;
            }
            datetime += minutes;
            return datetime;
        }
    };
});


materialAdmin.factory('DaysBetweenFactory', function () {
    return {
        daysBetween: function (first,second) {
            var one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
            var two = new Date(second.getFullYear(), second.getMonth(), second.getDate());

            // Do the math.
            var millisecondsPerDay = 1000 * 60 * 60 * 24;
            var millisBetween = two.getTime() - one.getTime();
            var days = millisBetween / millisecondsPerDay;

            // Round down.
            return Math.floor(days);
        }
    };
});



