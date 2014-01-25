'use strict';

var project = require('../project.json');

angular.module( project.name, [
  'templates-app',
  'angular-ui-router',
  'angulartics',
  'angularLocalStorage',
  'ezfb',
  'ui.bootstrap',
  'ngCookies',
  'ngSanitize',
  'xeditable',
  require('./account').name,
  require('./home').name
])

.config( function myAppConfig ($urlRouteProvider, $locationProvider) {
  $urlRouterProvider.otherwise( '/home' );
  $locationProvider.hashPrefix('!');
})

.run(function () {

})

.controller( 'AppCtrl', function AppCtrl () {

})
.constant('version', require('../package.json').version);