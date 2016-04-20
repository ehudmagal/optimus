app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/admin_gui/partials/orders_page.html',
        controller: 'OrdersCtrl'
      }).
    when('/companies', {
        templateUrl: '/admin_gui/partials/companies_page.html',
        controller: 'CompaniesCtrl'
    }).
    when('/companies/new_company', {
        templateUrl: '/admin_gui/partials/edit_company.html',
        controller: 'companyConfigurationCtrl'
    }).
    when('/companies/:companyId', {
        templateUrl: '/admin_gui/partials/edit_company.html',
        controller: 'companyConfigurationCtrl'
    }).
    when('/orders/:orderId/batches/:batchId', {
        templateUrl: '/admin_gui/partials/edit_batch.html',
        controller: 'batchConfigurationCtrl'
    }).
    when('/orders/:orderId/new_batch', {
        templateUrl: '/admin_gui/partials/edit_batch.html',
        controller: 'batchConfigurationCtrl'
    }).
    when('/new_order', {
        templateUrl: '/admin_gui/partials/edit_order.html',
        controller: 'orderConfigurationCtrl'
    }).
    when('/new_order/:companyId', {
        templateUrl: '/admin_gui/partials/edit_order.html',
        controller: 'orderConfigurationCtrl'
    }).
    when('/orders/:orderId', {
        templateUrl: '/admin_gui/partials/edit_order.html',
        controller: 'orderConfigurationCtrl'
    }).
    otherwise({
        redirectTo: '/'
      });
  }]).run(function($rootScope) {
    $rootScope.$on('$routeChangeStart', function() {
        Pace.restart();
        $("#dialog").dialog( "destroy" );
    });
});
  //#/users/6/edit_project/21/new_dataset