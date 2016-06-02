materialAdmin
    .config(function ($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise("/home");


        $stateProvider

        //------------------------------
        // HOME
        //------------------------------

            .state ('home', {
                url: '/home',
                templateUrl: '/admin/views/home.html',
                resolve: {
                    loadPlugin: function($ocLazyLoad) {
                        return $ocLazyLoad.load ([
                            {
                                name: 'css',
                                insertBefore: '#app-level',
                                files: [
                                    '/admin/vendors/bower_components/fullcalendar/dist/fullcalendar.min.css',
                                ]
                            },
                            {
                                name: 'vendors',
                                insertBefore: '#app-level-js',
                                files: [
                                    '/admin/vendors/sparklines/jquery.sparkline.min.js',
                                    '/admin/vendors/bower_components/jquery.easy-pie-chart/dist/jquery.easypiechart.min.js',
                                    '/admin/vendors/bower_components/simpleWeather/jquery.simpleWeather.min.js'
                                ]
                            }
                        ])
                    }
                }
            })


            //------------------------------
            // HEADERS
            //------------------------------
            .state ('headers', {
                url: '/headers',
                templateUrl: '/admin/views/common-2.html'
            })

            .state('headers.textual-menu', {
                url: '/textual-menu',
                templateUrl: '/admin/views/textual-menu.html'
            })

            .state('headers.image-logo', {
                url: '/image-logo',
                templateUrl: '/admin/views/image-logo.html'
            })

            .state('headers.mainmenu-on-top', {
                url: '/mainmenu-on-top',
                templateUrl: '/admin/views/mainmenu-on-top.html'
            })


            //------------------------------
            // TYPOGRAPHY
            //------------------------------

            .state ('typography', {
                url: '/typography',
                templateUrl: '/admin/views/typography.html'
            })


            //------------------------------
            // WIDGETS
            //------------------------------

            .state ('widgets', {
                url: '/widgets',
                templateUrl: '/admin/views/common.html'
            })

            .state ('widgets.widgets', {
                url: '/widgets',
                templateUrl: '/admin/views/widgets.html',
                resolve: {
                    loadPlugin: function($ocLazyLoad) {
                        return $ocLazyLoad.load ([
                            {
                                name: 'css',
                                insertBefore: '#app-level',
                                files: [
                                    '/admin/vendors/bower_components/mediaelement/build/mediaelementplayer.css',
                                ]
                            },
                            {
                                name: 'vendors',
                                files: [
                                    '/admin/vendors/bower_components/mediaelement/build/mediaelement-and-player.js',
                                    '/admin/vendors/bower_components/autosize/dist/autosize.min.js'
                                ]
                            }
                        ])
                    }
                }
            })

            .state ('widgets.widget-templates', {
                url: '/widget-templates',
                templateUrl: '/admin/views/widget-templates.html',
            })


            //------------------------------
            // TABLES
            //------------------------------

            .state ('tables', {
                url: '/tables',
                templateUrl: '/admin/views/common.html'
            })

            .state ('tables.tables', {
                url: '/tables',
                templateUrl: '/admin/views/tables.html'
            })

            .state ('tables.data-table', {
                url: '/data-table',
                templateUrl: '/admin/views/data-table.html'
            })


            //------------------------------
            // FORMS
            //------------------------------
            .state ('form', {
                url: '/form',
                templateUrl: '/admin/views/common.html'
            })

            .state ('form.basic-form-elements', {
                url: '/basic-form-elements',
                templateUrl: '/admin/views/form-elements.html',
                resolve: {
                    loadPlugin: function($ocLazyLoad) {
                        return $ocLazyLoad.load ([
                            {
                                name: 'vendors',
                                files: [
                                    '/admin/vendors/bower_components/autosize/dist/autosize.min.js'
                                ]
                            }
                        ])
                    }
                }
            })

            .state ('form.form-components', {
                url: '/form-components',
                templateUrl: '/admin/views/form-components.html',
                resolve: {
                    loadPlugin: function($ocLazyLoad) {
                        return $ocLazyLoad.load ([
                            {
                                name: 'css',
                                insertBefore: '#app-level',
                                files: [
                                    '/admin/vendors/bower_components/nouislider/jquery.nouislider.css',
                                    '/admin/vendors/farbtastic/farbtastic.css',
                                    '/admin/vendors/bower_components/summernote/dist/summernote.css',
                                    '/admin/vendors/bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
                                    '/admin/vendors/bower_components/chosen/chosen.min.css'
                                ]
                            },
                            {
                                name: 'vendors',
                                files: [
                                    '/admin/vendors/input-mask/input-mask.min.js',
                                    '/admin/vendors/bower_components/nouislider/jquery.nouislider.min.js',
                                    '/admin/vendors/bower_components/moment/min/moment.min.js',
                                    '/admin/vendors/bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
                                    '/admin/vendors/bower_components/summernote/dist/summernote.min.js',
                                    '/admin/vendors/fileinput/fileinput.min.js',
                                    '/admin/vendors/bower_components/chosen/chosen.jquery.js',
                                    '/admin/vendors/bower_components/angular-chosen-localytics/chosen.js',
                                    '/admin/vendors/bower_components/angular-farbtastic/angular-farbtastic.js'
                                ]
                            }
                        ])
                    }
                }
            })

            .state ('form.form-examples', {
                url: '/form-examples',
                templateUrl: '/admin/views/form-examples.html'
            })

            .state ('form.form-validations', {
                url: '/form-validations',
                templateUrl: '/admin/views/form-validations.html'
            })


            //------------------------------
            // USER INTERFACE
            //------------------------------

            .state ('user-interface', {
                url: '/user-interface',
                templateUrl: '/admin/views/common.html'
            })

            .state ('user-interface.ui-bootstrap', {
                url: '/ui-bootstrap',
                templateUrl: '/admin/views/ui-bootstrap.html'
            })

            .state ('user-interface.colors', {
                url: '/colors',
                templateUrl: '/admin/views/colors.html'
            })

            .state ('user-interface.animations', {
                url: '/animations',
                templateUrl: '/admin/views/animations.html'
            })

            .state ('user-interface.box-shadow', {
                url: '/box-shadow',
                templateUrl: '/admin/views/box-shadow.html'
            })

            .state ('user-interface.buttons', {
                url: '/buttons',
                templateUrl: '/admin/views/buttons.html'
            })

            .state ('user-interface.icons', {
                url: '/icons',
                templateUrl: '/admin/views/icons.html'
            })

            .state ('user-interface.alerts', {
                url: '/alerts',
                templateUrl: '/admin/views/alerts.html'
            })

            .state ('user-interface.preloaders', {
                url: '/preloaders',
                templateUrl: '/admin/views/preloaders.html'
            })

            .state ('user-interface.notifications-dialogs', {
                url: '/notifications-dialogs',
                templateUrl: '/admin/views/notification-dialog.html'
            })

            .state ('user-interface.media', {
                url: '/media',
                templateUrl: '/admin/views/media.html',
                resolve: {
                    loadPlugin: function($ocLazyLoad) {
                        return $ocLazyLoad.load ([
                            {
                                name: 'css',
                                insertBefore: '#app-level',
                                files: [
                                    '/admin/vendors/bower_components/mediaelement/build/mediaelementplayer.css',
                                    '/admin/vendors/bower_components/lightgallery/light-gallery/css/lightGallery.css'
                                ]
                            },
                            {
                                name: 'vendors',
                                files: [
                                    '/admin/vendors/bower_components/mediaelement/build/mediaelement-and-player.js',
                                    '/admin/vendors/bower_components/lightgallery/light-gallery/js/lightGallery.min.js'
                                ]
                            }
                        ])
                    }
                }
            })

            .state ('user-interface.other-components', {
                url: '/other-components',
                templateUrl: '/admin/views/other-components.html'
            })


            //------------------------------
            // CHARTS
            //------------------------------

            .state ('charts', {
                url: '/charts',
                templateUrl: '/admin/views/common.html'
            })

            .state ('charts.flot-charts', {
                url: '/flot-charts',
                templateUrl: '/admin/views/flot-charts.html',
            })

            .state ('charts.other-charts', {
                url: '/other-charts',
                templateUrl: '/admin/views/other-charts.html',
                resolve: {
                    loadPlugin: function($ocLazyLoad) {
                        return $ocLazyLoad.load ([
                            {
                                name: 'vendors',
                                files: [
                                    '/admin/vendors/sparklines/jquery.sparkline.min.js',
                                    '/admin/vendors/bower_components/jquery.easy-pie-chart/dist/jquery.easypiechart.min.js',
                                ]
                            }
                        ])
                    }
                }
            })


            //------------------------------
            // CALENDAR
            //------------------------------

            .state ('calendar', {
                url: '/calendar',
                templateUrl: '/admin/views/calendar.html',
                resolve: {
                    loadPlugin: function($ocLazyLoad) {
                        return $ocLazyLoad.load ([
                            {
                                name: 'css',
                                insertBefore: '#app-level',
                                files: [
                                    '/admin/vendors/bower_components/fullcalendar/dist/fullcalendar.min.css',
                                ]
                            },
                            {
                                name: 'vendors',
                                files: [
                                    '/admin/vendors/bower_components/moment/min/moment.min.js',
                                    '/admin/vendors/bower_components/fullcalendar/dist/fullcalendar.min.js'
                                ]
                            }
                        ])
                    }
                }
            })


            //------------------------------
            // PHOTO GALLERY
            //------------------------------

            .state ('photo-gallery', {
                url: '/photo-gallery',
                templateUrl: '/admin/views/common.html',
                resolve: {
                    loadPlugin: function($ocLazyLoad) {
                        return $ocLazyLoad.load ([
                            {
                                name: 'css',
                                insertBefore: '#app-level',
                                files: [
                                    '/admin/vendors/bower_components/lightgallery/light-gallery/css/lightGallery.css'
                                ]
                            },
                            {
                                name: 'vendors',
                                files: [
                                    '/admin/vendors/bower_components/lightgallery/light-gallery/js/lightGallery.min.js'
                                ]
                            }
                        ])
                    }
                }
            })

            //Default

            .state ('photo-gallery.photos', {
                url: '/photos',
                templateUrl: '/admin/views/photos.html'
            })

            //Timeline

            .state ('photo-gallery.timeline', {
                url: '/timeline',
                templateUrl: '/admin/views/photo-timeline.html'
            })


            //------------------------------
            // GENERIC CLASSES
            //------------------------------

            .state ('generic-classes', {
                url: '/generic-classes',
                templateUrl: '/admin/views/generic-classes.html'
            })


            //------------------------------
            // PAGES
            //------------------------------

            .state ('pages', {
                url: '/pages',
                templateUrl: '/admin/views/common.html'
            })


            //Profile

            .state ('pages.profile', {
                url: '/profile',
                templateUrl: '/admin/views/profile.html'
            })

            .state ('pages.profile.profile-about', {
                url: '/profile-about',
                templateUrl: '/admin/views/profile-about.html'
            })

            .state ('pages.profile.profile-timeline', {
                url: '/profile-timeline',
                templateUrl: '/admin/views/profile-timeline.html',
                resolve: {
                    loadPlugin: function($ocLazyLoad) {
                        return $ocLazyLoad.load ([
                            {
                                name: 'css',
                                insertBefore: '#app-level',
                                files: [
                                    '/admin/vendors/bower_components/lightgallery/light-gallery/css/lightGallery.css'
                                ]
                            },
                            {
                                name: 'vendors',
                                files: [
                                    '/admin/vendors/bower_components/lightgallery/light-gallery/js/lightGallery.min.js'
                                ]
                            }
                        ])
                    }
                }
            })

            .state ('pages.profile.profile-photos', {
                url: '/profile-photos',
                templateUrl: '/admin/views/profile-photos.html',
                resolve: {
                    loadPlugin: function($ocLazyLoad) {
                        return $ocLazyLoad.load ([
                            {
                                name: 'css',
                                insertBefore: '#app-level',
                                files: [
                                    '/admin/vendors/bower_components/lightgallery/light-gallery/css/lightGallery.css'
                                ]
                            },
                            {
                                name: 'vendors',
                                files: [
                                    '/admin/vendors/bower_components/lightgallery/light-gallery/js/lightGallery.min.js'
                                ]
                            }
                        ])
                    }
                }
            })

            .state ('pages.profile.profile-connections', {
                url: '/profile-connections',
                templateUrl: '/admin/views/profile-connections.html'
            })


            //-------------------------------

            .state ('pages.listview', {
                url: '/listview',
                templateUrl: '/admin/views/list-view.html'
            })

            .state ('pages.messages', {
                url: '/messages',
                templateUrl: '/admin/views/messages.html'
            })

            .state ('pages.pricing-table', {
                url: '/pricing-table',
                templateUrl: '/admin/views/pricing-table.html'
            })

            .state ('pages.contacts', {
                url: '/contacts',
                templateUrl: '/admin/views/contacts.html'
            })

            .state ('pages.invoice', {
                url: '/invoice',
                templateUrl: '/admin/views/invoice.html'
            })

            .state ('pages.wall', {
                url: '/wall',
                templateUrl: '/admin/views/wall.html',
                resolve: {
                    loadPlugin: function($ocLazyLoad) {
                        return $ocLazyLoad.load ([
                            {
                                name: 'vendors',
                                insertBefore: '#app-level',
                                files: [
                                    '/admin/vendors/bower_components/autosize/dist/autosize.min.js',
                                    '/admin/vendors/bower_components/lightgallery/light-gallery/css/lightGallery.css'
                                ]
                            },
                            {
                                name: 'vendors',
                                files: [
                                    '/admin/vendors/bower_components/mediaelement/build/mediaelement-and-player.js',
                                    '/admin/vendors/bower_components/lightgallery/light-gallery/js/lightGallery.min.js'
                                ]
                            }
                        ])
                    }
                }
            })

            //------------------------------
            // BREADCRUMB DEMO
            //------------------------------
            .state ('breadcrumb-demo', {
                url: '/breadcrumb-demo',
                templateUrl: '/admin/views/breadcrumb-demo.html'
            })
    });
