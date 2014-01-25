'use strict';

var project = require('../../project.json');

module.exports = angular.module(project.name + '.home', [
  'angular-ui-router'
])
.config(function config( $stateProvider ) {
  $stateProvider.state( 'home', {
    url: '/home',
    controller: 'HomeCtrl',
    templateUrl: 'home/home.tpl.html'
  });
})
.controller('HomeCtrl', require('./controller.home.js'));