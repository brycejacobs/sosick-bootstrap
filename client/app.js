'use strict';

var project = require('../project.json');



angular.module( project.name, [
  'ui.router'
      // angulartics,
  // 'angularLocalStorage',
  // 'ezfb',
  // 'ui.bootstrap',
  // 'ngCookies',
  // 'ngSanitize',
  // 'xeditable',
  // require('./account').name,
  // require('./home').name
])

.config( function myAppConfig () {
  // $urlRouterProvider.otherwise( '/home' );
  // $locationProvider.hashPrefix('!');
})

.run(function () {

})

.controller( 'AppCtrl', function AppCtrl () {
  console.log(window);
})
.constant('version', require('../package.json').version);