angular.module( 'sosickboot', [
  'templates-app',
  'ui.router',
  'ui.select2',
  'ui.bootstrap',
  'ngCookies',
  'ngSanitize',
  'angulartics',
  'angulartics.google.analytics',
  'ezfb',
  'xeditable',
  'angularLocalStorage'
])

.config( function myAppConfig () {


})

.run(function ( $rootScope, $state, editableOptions ) {
  // commentConfig
  //   .setForumName('robertotravenbjj')
  //   .setProvider('disqus');

  editableOptions.theme = 'bs3';

  $rootScope.$on('$stateChangeError', function ( event, toState, toParams, fromState, fromParams, error ) {
    if (error === 'USER_NOT_FOUND' || error.status === 401) {
      $state.go('signin');
    } else {
      console.log(error);
    }
  });
})

.controller( 'AppCtrl', function AppCtrl ( $scope, user, $rootScope, $location, $FB, $state ) {

  $scope.user = user;

})

;