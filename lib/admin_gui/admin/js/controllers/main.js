materialAdmin
// =========================================================================
// Base controller for common functions
// =========================================================================

    .controller('materialadminCtrl', function ($timeout, $state, $scope, $rootScope, growlService, SetUserService) {
        //Welcome Message
        //growlService.growl('Welcome back Mallinda!', 'inverse')


        // Detact Mobile Browser
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            angular.element('html').addClass('ismobile');
        }

        // By default Sidbars are hidden in boxed layout and in wide layout only the right sidebar is hidden.
        this.sidebarToggle = {
            left: false,
            right: false
        }

        // By default template has a boxed layout
        this.layoutType = localStorage.getItem('ma-layout-status');

        // For Mainmenu Active Class
        this.$state = $state;

        //Close sidebar on click
        this.sidebarStat = function (event) {
            if (!angular.element(event.target).parent().hasClass('active')) {
                this.sidebarToggle.left = false;
            }
        }

        //Listview Search (Check listview pages)
        this.listviewSearchStat = false;

        this.lvSearch = function () {
            this.listviewSearchStat = true;
        }

        //Listview menu toggle in small screens
        this.lvMenuStat = false;

        //Blog
        this.wallCommenting = [];

        this.wallImage = false;
        this.wallVideo = false;
        this.wallLink = false;

        //Skin Switch
        this.currentSkin = 'blue';

        this.skinList = [
            'lightblue',
            'bluegray',
            'cyan',
            'teal',
            'green',
            'orange',
            'blue',
            'purple'
        ]

        this.skinSwitch = function (color) {
            this.currentSkin = color;
        }
        SetUserService.setUser();
        $scope.goto = function (url) {
            window.location = url;
        }
        $scope.lang = 'heb';

        $scope.changeLang = function (code) {
            $scope.lang = code;
        }
        $scope.getLang = function (code) {
            var res = 'English';
            switch (code) {
                case 'arab':
                    res = 'عربيه';
                    break;
                case 'heb':
                    res = 'עברית';
                    break;
                default:
                    break;
            }
            return res;
        }
        $scope.translate = function (word) {
            var arabic = {
                'home': 'الرئيسية',
                'find shipments': ' جد رزم',
                'welcome': ' اهلاً وسهلاً',
                'about us': ' نبذة عنا',
                'login': 'تسجيل الدخول',
                'signup': 'تسجيل',
                'sign out': 'تسجيل الخروج',
                'logout': 'تسجيل الخروج',
                'new shipment': 'شحنة جديدة',
                'order number': 'رقم الشحنة',
                'description': 'وصغ',
                'pickup location': 'مكان الشحن',
                'pickup time': 'موعد الشحن',
                'lowest price': 'السعر الادنى',
                'status': 'وضع الطلبيّة',
                'details': 'تفاصيل',
                'drop off location': 'مكان التسليم',
                'drop off time': 'موعد تسليم الرزمة',
                'show order details': 'اظهار تفاصيل الطلبيّة',
                'bids': 'عروض',
                'user': 'مستخدم',
                'rating': 'تقيّم',
                'times worked with him': 'عدد مرات العمل معه',
                'cancel': 'الغاء',
                'accept': 'موافق',
                'cancel bid': 'الغاء العرض',
                'prev': 'صغحة البيت',
                'next': 'الصفحة القادمة',
                'page size': 'حجم الصفحة',
                'distance in km': 'البعد بالكيلومترات',
                'follow shipment': ' تتبع الشحنه',
                'place bid': 'اضف عرض سعر',
                'total weight in kg': ' الوزن الكلي بالكيلوغرام',
                'order details': ' تفاصيل الطلبيّة'
            }


            var hebrew = {
                'user role': 'סוג משתמש',
                'home': 'בית',
                'find shipments': 'מצא משלוחים',
                'welcome': 'ברוך הבא',
                'about us': 'אודותינו',
                'login': 'כניסה',
                'signup': 'הרשמה',
                'sign out': 'יציאה',
                'logout': 'יציאה',
                'new shipment': 'משלוח חדש',
                'order number': 'מספר הזמנה',
                'description': 'תיאור',
                'pickup location': 'מקום איסוף',
                'pickup time': 'זמן איסוף',
                'lowest price': 'המחיר הזול ביותר',
                'status': 'מצב הזמנה',
                'details': 'פרטים',
                'drop off location': 'מקום פריקה',
                'drop off time': 'זמן פריקה',
                'show order details': 'הראה פרטי הזמנה',
                'bids': 'הצעות',
                'user': 'משתמש',
                'rating': 'דירוג',
                'times worked with him': 'מספר הפעמים שעבדתי איתו',
                'cancel': 'ביטול',
                'accept': 'קבל',
                'cancel bid': 'בטל הצעה',
                'prev': 'דף קודם',
                'next': 'דף הבא',
                'page size': 'גודל דף',
                'distance in km': 'מרחק בקילומטרים',
                'follow shipment': 'עקוב אחרי משלוח',
                'place bid': 'תן הצעת מחיר',
                'total weight in kg': 'משקל כולל בקילוגרמים',
                'order details': 'פרטי הזמנה',
                'route': 'נתיב',
                'source Address': 'כתובת מקור',
                'new order form': 'טופס הזמנה חדשה',
                'destination address': 'כתובת יעד',
                'type of goods': 'סוג הסחורה',
                'Work type': 'סוג העבודה',
                'pallets': 'משטחים',
                'enter source address': 'הכנס כתובת מקור',
                'enter destination address': 'הכנס כתובת יעד',
                'contact info': 'פרטי איש קשר',
                'load details': 'פרטי מטען',
                'boxes': 'קופסאות',
                'weight in kg': 'משקל בקילוגרם',
                'l cm': 'אורך סנטימטר',
                'w cm': 'רוחב סנטימטר',
                'h cm': 'גובה סנטימטר',
                'scheduling': 'לוחות זמנים',
                'pickup': 'העמסה',
                'pickup Day': 'יום העמסה',
                'ready time': 'תחילת שעת מוכנות',
                'cutoff time': 'סוף שעת מוכנות',
                'delivery': 'פריקה',
                'deliver time': 'פריקה לאחר',
                'submit shipment': 'הגש הזמנה',
                'number of pallets': 'מספר משטחים',
                'weight': 'משקל',
                'length': 'אורך',
                'width': 'רוחב',
                'Height': 'גובה',
                'number of boxes': 'מספר קופסאות',
                'approved': 'אושר',
                'booked': 'ממתין להצעה',
                'bidded': 'הצעה הוגשה',
                'before_pickup': 'ממתין להעמסה',
                'picked_up': 'הועמס',
                'delivered': 'נמסר',
                'cancel order': 'בטל הזמנה',
                'truckload': 'תפזורת/\אחר',
                'remarks': 'הערות',
                'truckload details': 'הכנס פרטי תפזורת/\ אחר',
                'Pick Up Time': 'שעת העמסה',
                'Delivery Time': 'שעת פריקה',
                'Fixed Price': 'מחיר פיקס',
                'bid': 'מכרז',
                'Payment Method': 'שיטת תשלום',
                'Contact Info': 'פרטי איש קשר',
                'credit card': 'כרטיס אשראי',
                'pay directly to carrier':'התחשבנות מול המוביל'
            }
            var res = word;
            switch ($scope.lang) {
                case 'heb':
                    if (hebrew[word.toLowerCase()]) {
                        res = hebrew[word.toLowerCase()];
                    }
                    if (hebrew[word]) {
                        res = hebrew[word];
                    }
                    break;
                case 'arab':
                    if (arabic[word.toLowerCase()]) {
                        res = arabic[word.toLowerCase()];
                    }
                    break;
                case 'en':
                    res = word;
                    break;
                default:
                    res = word
                    break;
            }
            return res;

        }
        $scope.getDirection = function () {
            var res = 'direction: ltr';
            if ($scope.lang && $scope.lang != 'en') {
                res = 'direction: rtl';
            }
            return res;
        }

        $rootScope.getTextDirection = function () {
            var res = 'text-align: left';
            if ($scope.lang && $scope.lang != 'en') {
                res = 'text-align: right';
            }
            return res;
        }


    })


    // =========================================================================
    // Header
    // =========================================================================
    .controller('headerCtrl', function (SetUserService, $scope) {

        SetUserService.setUser();
        // Top Search
        this.openSearch = function () {
            angular.element('#header').addClass('search-toggled');
            angular.element('#top-search-wrap').find('input').focus();
        }

        $scope.getUserName = function (user) {
            var content = $scope.translate('Welcome') + ' ';
            if (user.type == '' || !user.type) {
                content += 'Guest ';
            } else {
                content += ' ' + user.name;
            }

            content += ', ' + $scope.translate('User Role') + ' : ' + user.type;

            return content;
        }


        //Fullscreen View
        this.fullScreen = function () {
            //Launch
            function launchIntoFullscreen(element) {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen();
                } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                }
            }

            //Exit
            function exitFullscreen() {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }

            if (exitFullscreen()) {
                launchIntoFullscreen(document.documentElement);
            }
            else {
                launchIntoFullscreen(document.documentElement);
            }
        }

    })



    // =========================================================================
    // Best Selling Widget
    // =========================================================================

    .controller('bestsellingCtrl', function (bestsellingService) {
        // Get Best Selling widget Data
        this.img = bestsellingService.img;
        this.name = bestsellingService.name;
        this.range = bestsellingService.range;

        this.bsResult = bestsellingService.getBestselling(this.img, this.name, this.range);
    })


    // =========================================================================
    // Todo List Widget
    // =========================================================================

    .controller('todoCtrl', function (todoService) {

        //Get Todo List Widget Data
        this.todo = todoService.todo;

        this.tdResult = todoService.getTodo(this.todo);

        //Add new Item (closed by default)
        this.addTodoStat = false;
    })


    // =========================================================================
    // Recent Items Widget
    // =========================================================================

    .controller('recentitemCtrl', function (recentitemService) {

        //Get Recent Items Widget Data
        this.id = recentitemService.id;
        this.name = recentitemService.name;
        this.parseInt = recentitemService.price;

        this.riResult = recentitemService.getRecentitem(this.id, this.name, this.price);
    })


    // =========================================================================
    // Recent Posts Widget
    // =========================================================================

    .controller('recentpostCtrl', function (recentpostService) {

        //Get Recent Posts Widget Items
        this.img = recentpostService.img;
        this.user = recentpostService.user;
        this.text = recentpostService.text;

        this.rpResult = recentpostService.getRecentpost(this.img, this.user, this.text);
    })


    //=================================================
    // Profile
    //=================================================

    .controller('profileCtrl', function (growlService) {

        //Get Profile Information from profileService Service

        //User
        this.profileSummary = "Sed eu est vulputate, fringilla ligula ac, maximus arcu. Donec sed felis vel magna mattis ornare ut non turpis. Sed id arcu elit. Sed nec sagittis tortor. Mauris ante urna, ornare sit amet mollis eu, aliquet ac ligula. Nullam dolor metus, suscipit ac imperdiet nec, consectetur sed ex. Sed cursus porttitor leo.";

        this.fullName = "Mallinda Hollaway";
        this.gender = "female";
        this.birthDay = "23/06/1988";
        this.martialStatus = "Single";
        this.mobileNumber = "00971123456789";
        this.emailAddress = "malinda.h@gmail.com";
        this.twitter = "@malinda";
        this.twitterUrl = "twitter.com/malinda";
        this.skype = "malinda.hollaway";
        this.addressSuite = "44-46 Morningside Road";
        this.addressCity = "Edinburgh";
        this.addressCountry = "Scotland";

        //Edit
        this.editSummary = 0;
        this.editInfo = 0;
        this.editContact = 0;


        this.submit = function (item, message) {
            if (item === 'profileSummary') {
                this.editSummary = 0;
            }

            if (item === 'profileInfo') {
                this.editInfo = 0;
            }

            if (item === 'profileContact') {
                this.editContact = 0;
            }

            //growlService.growl(message+' has updated Successfully!', 'inverse');
        }

    })



    //=================================================
    // LOGIN
    //=================================================
    .controller('InfoForShippersCtrl', function ($filter, $sce, ngTableParams, tableService, $http, $scope, $rootScope,
                                                 PatchObjectFactory) {


    })
    .controller('loginCtrl', function ($filter, $sce, ngTableParams, tableService, $http, $scope, $rootScope,
                                       PatchObjectFactory) {

        //Status

        this.login = 1;
        this.register = 0;
        this.forgot = 0;
        $scope.user = {};
        $scope.login_user = function () {
            var url = '/users/sign_in.json';
            var post_data = {};
            var user_for_post = jQuery.extend(true, {}, $scope.user);
            user_for_post.remember_me = 0;
            if (user_for_post.remember_me == true) {
                user_for_post.remember_me = 1;
            }
            post_data['user'] = user_for_post;
            PatchObjectFactory.patchObject(url, post_data, 'post', $scope.goto_personal_zone);

        }
        $scope.goto_personal_zone = function () {
            window.location.assign("#/");
        }
    })
    .controller('signUpCtrl', function ($filter, $sce, ngTableParams, tableService, $http, $scope, $rootScope,
                                        PatchObjectFactory) {

        //Status

        $scope.types = ['Customer', 'Driver'];
        $scope.user = {};
        $scope.sign_up_user = function () {
            var url = '/users.json';
            var post_data = {};
            var user_for_post = jQuery.extend(true, {}, $scope.user);
            post_data['user'] = user_for_post;
            PatchObjectFactory.patchObject(url, post_data, 'post', $scope.goto_personal_zone);

        }
        $scope.goto_personal_zone = function () {
            window.location.assign("#/");
        }
    })

    .controller('sidebrCtrl', function ($filter, $sce, ngTableParams, tableService, $http, $scope, $rootScope,
                                        PatchObjectFactory) {

        //Status


        $scope.signout = function () {
            var url = '/users/sign_out.json';
            var post_data = {};
            PatchObjectFactory.patchObject(url, post_data, 'delete', $scope.goto_personal_zone);

        }
        $scope.goto_personal_zone = function () {
            window.location.assign("#/");
        }
    })


    //=================================================
    // CALENDAR
    //=================================================

    .controller('calendarCtrl', function ($modal) {

        //Create and add Action button with dropdown in Calendar header. 
        this.month = 'month';

        this.actionMenu = '<ul class="actions actions-alt" id="fc-actions">' +
            '<li class="dropdown" dropdown>' +
            '<a href="" dropdown-toggle><i class="zmdi zmdi-more-vert"></i></a>' +
            '<ul class="dropdown-menu dropdown-menu-right">' +
            '<li class="active">' +
            '<a data-calendar-view="month" href="">Month View</a>' +
            '</li>' +
            '<li>' +
            '<a data-calendar-view="basicWeek" href="">Week View</a>' +
            '</li>' +
            '<li>' +
            '<a data-calendar-view="agendaWeek" href="">Agenda Week View</a>' +
            '</li>' +
            '<li>' +
            '<a data-calendar-view="basicDay" href="">Day View</a>' +
            '</li>' +
            '<li>' +
            '<a data-calendar-view="agendaDay" href="">Agenda Day View</a>' +
            '</li>' +
            '</ul>' +
            '</div>' +
            '</li>';


        //Open new event modal on selecting a day
        this.onSelect = function (argStart, argEnd) {
            var modalInstance = $modal.open({
                templateUrl: 'addEvent.html',
                controller: 'addeventCtrl',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    calendarData: function () {
                        var x = [argStart, argEnd];
                        return x;
                    }
                }
            });
        }
    })

    //Add event Controller (Modal Instance)
    .controller('addeventCtrl', function ($scope, $modalInstance, calendarData) {

        //Calendar Event Data
        $scope.calendarData = {
            eventStartDate: calendarData[0],
            eventEndDate: calendarData[1]
        };

        //Tags
        $scope.tags = [
            'bgm-teal',
            'bgm-red',
            'bgm-pink',
            'bgm-blue',
            'bgm-lime',
            'bgm-green',
            'bgm-cyan',
            'bgm-orange',
            'bgm-purple',
            'bgm-gray',
            'bgm-black',
        ]

        //Select Tag
        $scope.currentTag = '';

        $scope.onTagClick = function (tag, $index) {
            $scope.activeState = $index;
            $scope.activeTagColor = tag;
        }

        //Add new event
        $scope.addEvent = function () {
            if ($scope.calendarData.eventName) {

                //Render Event
                $('#calendar').fullCalendar('renderEvent', {
                    title: $scope.calendarData.eventName,
                    start: $scope.calendarData.eventStartDate,
                    end: $scope.calendarData.eventEndDate,
                    allDay: true,
                    className: $scope.activeTagColor

                }, true); //Stick the event

                $scope.activeState = -1;
                $scope.calendarData.eventName = '';
                $modalInstance.close();
            }
        }

        //Dismiss 
        $scope.eventDismiss = function () {
            $modalInstance.dismiss();
        }
    })

    // =========================================================================
    // COMMON FORMS
    // =========================================================================

    .controller('formCtrl', function () {

        //Input Slider
        this.nouisliderValue = 4;
        this.nouisliderFrom = 25;
        this.nouisliderTo = 80;
        this.nouisliderRed = 35;
        this.nouisliderBlue = 90;
        this.nouisliderCyan = 20;
        this.nouisliderAmber = 60;
        this.nouisliderGreen = 75;

        //Color Picker
        this.color = '#03A9F4';
        this.color2 = '#8BC34A';
        this.color3 = '#F44336';
        this.color4 = '#FFC107';
    })


    // =========================================================================
    // PHOTO GALLERY
    // =========================================================================

    .controller('photoCtrl', function () {

        //Default grid size (2)
        this.photoColumn = 'col-md-2';
        this.photoColumnSize = 2;

        this.photoOptions = [
            {value: 2, column: 6},
            {value: 3, column: 4},
            {value: 4, column: 3},
            {value: 1, column: 12},
        ]

        //Change grid
        this.photoGrid = function (size) {
            this.photoColumn = 'col-md-' + size;
            this.photoColumnSize = size;
        }

    })


    // =========================================================================
    // ANIMATIONS DEMO
    // =========================================================================
    .controller('animCtrl', function ($timeout) {

        //Animation List
        this.attentionSeekers = [
            {animation: 'bounce', target: 'attentionSeeker'},
            {animation: 'flash', target: 'attentionSeeker'},
            {animation: 'pulse', target: 'attentionSeeker'},
            {animation: 'rubberBand', target: 'attentionSeeker'},
            {animation: 'shake', target: 'attentionSeeker'},
            {animation: 'swing', target: 'attentionSeeker'},
            {animation: 'tada', target: 'attentionSeeker'},
            {animation: 'wobble', target: 'attentionSeeker'}
        ]
        this.flippers = [
            {animation: 'flip', target: 'flippers'},
            {animation: 'flipInX', target: 'flippers'},
            {animation: 'flipInY', target: 'flippers'},
            {animation: 'flipOutX', target: 'flippers'},
            {animation: 'flipOutY', target: 'flippers'}
        ]
        this.lightSpeed = [
            {animation: 'lightSpeedIn', target: 'lightSpeed'},
            {animation: 'lightSpeedOut', target: 'lightSpeed'}
        ]
        this.special = [
            {animation: 'hinge', target: 'special'},
            {animation: 'rollIn', target: 'special'},
            {animation: 'rollOut', target: 'special'}
        ]
        this.bouncingEntrance = [
            {animation: 'bounceIn', target: 'bouncingEntrance'},
            {animation: 'bounceInDown', target: 'bouncingEntrance'},
            {animation: 'bounceInLeft', target: 'bouncingEntrance'},
            {animation: 'bounceInRight', target: 'bouncingEntrance'},
            {animation: 'bounceInUp', target: 'bouncingEntrance'}
        ]
        this.bouncingExits = [
            {animation: 'bounceOut', target: 'bouncingExits'},
            {animation: 'bounceOutDown', target: 'bouncingExits'},
            {animation: 'bounceOutLeft', target: 'bouncingExits'},
            {animation: 'bounceOutRight', target: 'bouncingExits'},
            {animation: 'bounceOutUp', target: 'bouncingExits'}
        ]
        this.rotatingEntrances = [
            {animation: 'rotateIn', target: 'rotatingEntrances'},
            {animation: 'rotateInDownLeft', target: 'rotatingEntrances'},
            {animation: 'rotateInDownRight', target: 'rotatingEntrances'},
            {animation: 'rotateInUpLeft', target: 'rotatingEntrances'},
            {animation: 'rotateInUpRight', target: 'rotatingEntrances'}
        ]
        this.rotatingExits = [
            {animation: 'rotateOut', target: 'rotatingExits'},
            {animation: 'rotateOutDownLeft', target: 'rotatingExits'},
            {animation: 'rotateOutDownRight', target: 'rotatingExits'},
            {animation: 'rotateOutUpLeft', target: 'rotatingExits'},
            {animation: 'rotateOutUpRight', target: 'rotatingExits'}
        ]
        this.fadeingEntrances = [
            {animation: 'fadeIn', target: 'fadeingEntrances'},
            {animation: 'fadeInDown', target: 'fadeingEntrances'},
            {animation: 'fadeInDownBig', target: 'fadeingEntrances'},
            {animation: 'fadeInLeft', target: 'fadeingEntrances'},
            {animation: 'fadeInLeftBig', target: 'fadeingEntrances'},
            {animation: 'fadeInRight', target: 'fadeingEntrances'},
            {animation: 'fadeInRightBig', target: 'fadeingEntrances'},
            {animation: 'fadeInUp', target: 'fadeingEntrances'},
            {animation: 'fadeInBig', target: 'fadeingEntrances'}
        ]
        this.fadeingExits = [
            {animation: 'fadeOut', target: 'fadeingExits'},
            {animation: 'fadeOutDown', target: 'fadeingExits'},
            {animation: 'fadeOutDownBig', target: 'fadeingExits'},
            {animation: 'fadeOutLeft', target: 'fadeingExits'},
            {animation: 'fadeOutLeftBig', target: 'fadeingExits'},
            {animation: 'fadeOutRight', target: 'fadeingExits'},
            {animation: 'fadeOutRightBig', target: 'fadeingExits'},
            {animation: 'fadeOutUp', target: 'fadeingExits'},
            {animation: 'fadeOutUpBig', target: 'fadeingExits'}
        ]
        this.zoomEntrances = [
            {animation: 'zoomIn', target: 'zoomEntrances'},
            {animation: 'zoomInDown', target: 'zoomEntrances'},
            {animation: 'zoomInLeft', target: 'zoomEntrances'},
            {animation: 'zoomInRight', target: 'zoomEntrances'},
            {animation: 'zoomInUp', target: 'zoomEntrances'}
        ]
        this.zoomExits = [
            {animation: 'zoomOut', target: 'zoomExits'},
            {animation: 'zoomOutDown', target: 'zoomExits'},
            {animation: 'zoomOutLeft', target: 'zoomExits'},
            {animation: 'zoomOutRight', target: 'zoomExits'},
            {animation: 'zoomOutUp', target: 'zoomExits'}
        ]

        //Animate    
        this.ca = '';

        this.setAnimation = function (animation, target) {
            if (animation === "hinge") {
                animationDuration = 2100;
            }
            else {
                animationDuration = 1200;
            }

            angular.element('#' + target).addClass(animation);

            $timeout(function () {
                angular.element('#' + target).removeClass(animation);
            }, animationDuration);
        }

    })

