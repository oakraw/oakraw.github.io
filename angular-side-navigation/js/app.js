var app = angular.module('admin', ['ngMaterial', 'route']);
var menu = [
  {
    title : "Page1",
    path : "page1"
  },
  {
    title : "Page2",
    path : "page2"
  },
  {
    title : "Page3",
    path : "page3"
  }
];

app.controller('AdminController', function($scope, $http, $mdSidenav) {
  // $mdThemingProvider.theme('default')
  //         .primaryPalette('#d32f2f')
  //         .accentPalette('red');

  $scope.menu = menu;
  $scope.toggleList = function() {
    $mdSidenav('left').toggle();
  }
});
