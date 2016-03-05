var route_module = angular.module('route', ['ui.router']);

route_module.config(function($stateProvider, $urlRouterProvider){

    $urlRouterProvider.otherwise('page1');

    $stateProvider
        .state('page1', {
            url: '/page1',
            templateUrl: "page1.html",
        }).state('page2', {
            url: '/page2',
            templateUrl: "page2.html",
        }).state('page3', {
            url: '/page3',
            templateUrl: "page3.html",
        });
});

route_module.config(function($locationProvider) {
  $locationProvider.html5Mode(true);
});

route_module.run( ['$rootScope', '$state', '$stateParams',
  function ($rootScope,   $state,   $stateParams) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
  }
]);
