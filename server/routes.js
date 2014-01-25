/*
 * server/routes.js
 */

'use strict';

exports.registerRoutes = function (app) {

  var c = app.controllers,
      s = app.servers.koa.getServer();


  s.resource('users', c.users.api);

  // Auth
  // s.post('/api/login', c.auth.loginPOST);
  // s.post('/api/logout', c.auth.logoutPOST);
  // s.post('/api/lost-password', c.auth.lostPasswordPOST);
  // s.post('/api/register', c.auth.registerPOST);

  //Social Networking (TODO when passport is updated)
  // s.get('/auth/facebook', c.auth.facebook);
  // s.get('/auth/facebook/callback', c.auth.facebookCallback);
  // s.get('/auth/facebook/success', c.auth.facebookSuccess);
  // s.get('/auth/google', c.auth.google);
  // s.get('/auth/google/callback', c.auth.googleCallback);
  // s.get('/auth/google/success', c.auth.googleSuccess);
  // s.get('/auth/twitter', c.auth.twitter);
  // s.get('/auth/twitter/callback', c.auth.twitterCallback);
  // s.get('/auth/twitter/success', c.auth.twitterSuccess);

  // Blacklist (404.html)
  // s.get(/^\/api(?:[\/#?].*)?$/, c.home.error404);
};