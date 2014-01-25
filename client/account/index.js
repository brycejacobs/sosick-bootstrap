'use strict';

var project = require('../../project.json');

module.exports = angular.module(project.name + '.account', [
  'ui.router'
])
.config(function config( $stateProvider ) {
  $stateProvider.state( 'account', {
    url: '/account',
    controller: 'AccountCtrl',
    templateUrl: 'account/account.tpl.html'
  });
})
.controller('AccountCtrl', require('./controller.account.js'));