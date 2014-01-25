'use strict';

var project = require('../../project.json');

module.exports = angular.module(project.name + '.admin', [
  'angular-ui-router'
])
.config(function config( $stateProvider ) {
  $stateProvider.state( 'admin', {
    url: '/admin',
    controller: 'AdminCtrl',
    templateUrl: 'admin/admin.tpl.html'
  });
})
.controller('AdminCtrl', require('./controller.admin.js'));