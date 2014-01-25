/*
  This is the bootstrapped middleware, if you are adding middleware
  that is project specific, that should go in the AttachMiddleware
  method located in server/app.js
 */

'use strict';
var path = require('path');

var _ = require('lodash'),
    compress = require('koa-compress'),
    csrf = require('koa-csrf'),
    favicon = require('koa-favi'),
    livereload = require('koa-livereload'),
    logger = require('koa-log4js'),
    router = require('koa-router'),
    session = require('koa-session'),
    serve = require('koa-static');


var server = null;
exports.attachMiddleware = function (app) {
  server = app.servers.koa.getServer();

  server.use(router(server));
  server.use(favicon(path.join(app.dir, '..', app.project.path.client, 'favicon.ico')));
  server.use(compress());
  csrf(server);
  if (_.isObject(app.config.cookie) && _.isString(app.config.cookie.secret)) {
   server.keys = [app.config.cookie.secret];
  }
  server.use(session());
  if (_.isFunction(app.attachMiddleware)) {
    console.log('Attaching Project Specific Middleware');
    app.attachMiddleware();
  }


  server.use(function *(next){
    if ('POST' != this.method) {
      return yield next;
    }

    var body = yield parse(this, { limit: '1kb' });
    if (!body.name) {
      this.throw(400, '.name required');
    }
    this.body = { name: body.name.toUpperCase() };
  });


  if(process.env.NODE_ENV === 'development') {
    server.use(serve(
      path.join(app.dir, '..', app.project.path.dist)
    ));
    server.use(logger());

    // app.servers.koa.getServer().use(livereload({
    //   port : 35729
    // }));
  }

  if (process.env.NODE_ENV === 'heroku' || process.env.NODE_ENV === 'production') {
    var maxAge = 1000 * 60 * 60 * 24 * 30;  // 1 month
    server.use(serve(
      path.join(app.dir, '..', app.project.path.dist),
      { maxAge: maxAge }
    ));

    server.on('error', function *(err) {
      console.log(err.stack);
      this.response.status = 500;
      this.response.body = 'Sorry we have encountered an error.';
    });
  }



}
































