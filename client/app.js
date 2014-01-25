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

.config( function myAppConfig () {


})

.run(function () {
})

.controller( 'AppCtrl', function AppCtrl () {

  $scope.user = user;

})
.constant('version', require('../package.json').version);