'use strict';

var project = require('../project.json');

angular.module( project.name, [
  project.name + '-templates',
  'ui.router',
  'angulartics',
  'ezfb',
  'ui.bootstrap',
  'ngCookies',
  'ngSanitize',
  require('./account').name,
  require('./home').name,
  // 'angularLocalStorage'
])

.config( function myAppConfig ($urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise( '/home' );
  $locationProvider.hashPrefix('!');
})

.run(function () {

})

.controller( 'AppCtrl', function AppCtrl () {

})
.constant('version', require('../package.json').version);