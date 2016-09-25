app.config(function($routeProvider) {
    $routeProvider.when('/',              {templateUrl: '/mobile_navigator/partials/loggers.html', reloadOnSearch: false,controller:'SuggestedLocationsController'});
    $routeProvider.when('/logout',              {templateUrl: '/mobile_navigator/partials/loggers.html', reloadOnSearch: false,controller:'SuggestedLocationsController'});
    $routeProvider.when('/active_loggers',              {templateUrl: '/mobile_navigator/partials/loggers.html', reloadOnSearch: false,controller:'LoggersController'});
    $routeProvider.when('/logger',              {templateUrl: '/mobile_navigator/partials/logger.html', reloadOnSearch: false,controller:'LoggerController'});
    $routeProvider.when('/scroll',        {templateUrl: '/mobile_navigator/partials/scroll.html', reloadOnSearch: false});
    $routeProvider.when('/toggle',        {templateUrl: '/mobile_navigator/partials/toggle.html', reloadOnSearch: false});
    $routeProvider.when('/tabs',          {templateUrl: '/mobile_navigator/partials/tabs.html', reloadOnSearch: false});
    $routeProvider.when('/accordion',     {templateUrl: '/mobile_navigator/partials/accordion.html', reloadOnSearch: false});
    $routeProvider.when('/overlay',       {templateUrl: '/mobile_navigator/partials/overlay.html', reloadOnSearch: false});
    $routeProvider.when('/forms',         {templateUrl: '/mobile_navigator/partials/edit_soil_moisture.html', reloadOnSearch: false});
    $routeProvider.when('/dropdown',      {templateUrl: '/mobile_navigator/partials/dropdown.html', reloadOnSearch: false});
    $routeProvider.when('/drag',          {templateUrl: '/mobile_navigator/partials/drag.html', reloadOnSearch: false});
    $routeProvider.when('/carousel',      {templateUrl: '/mobile_navigator/partials//carousel.html', reloadOnSearch: false});
    $routeProvider.when('/loggers',        {templateUrl: '/mobile_navigator/partials/loggers.html', reloadOnSearch: false,controller:'LoggersController'});
    $routeProvider.when('/failed_loggers', {templateUrl: '/mobile_navigator/partials/failed_loggers.html', reloadOnSearch: false,controller:'FailedLoggersController'});
    $routeProvider.when('/logger',{templateUrl: '/mobile_navigator/partials/logger.html', reloadOnSearch: false,controller:'LoggerController'});
   /* $routeProvider.when('/edit_soil_moisture/:logger_id',{templateUrl: '/mobile_admin/partials/edit_soil_moisture.html', reloadOnSearch: false,controller:'EditSoilMoistureController'});*/
});
