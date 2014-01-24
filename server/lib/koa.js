/*
 * ultimate.server.express
 */

'use strict';

var crypto = require('crypto'),
    path = require('path');

var _ = require('lodash'),
    koa = require('koa'),
    serve = require('koa-static'),
    favicon = require('koa-favi'),
    logger = require('koa-log4js'),
    compress = require('koa-compress'),
    session = require('koa-session'),
    csrf = require('koa-csrf'),
    router = require('koa-router');



var _app = null,
    _server = null;

function _configure() {

  _server.use(router(_server));
  _server.use(favicon(path.join(_app.dir, '..', _app.project.path.client, 'favicon.ico')));
  _server.use(compress());
  csrf(_server);
  if (_.isObject(_app.config.cookie) && _.isString(_app.config.cookie.secret)) {
    _server.keys = [_app.config.cookie.secret];
  }
  _server.use(session());
  if (_.isFunction(_app.attachMiddlewares)) {
    _app.attachMiddlewares();
  }


  _server.use(function *(next){
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
    _server.use(serve(
      path.join(_app.dir, '..', _app.project.path.dist)
    ));
    _server.use(logger());
  }

  if (process.env.NODE_ENV === 'heroku' || process.env.NODE_ENV === 'production') {
    var maxAge = 1000 * 60 * 60 * 24 * 30;  // 1 month
    _server.use(serve(
      path.join(_app.dir, '..', _app.project.path.dist),
      { maxAge: maxAge }
    ));

    _server.on('error', function *(err) {
      console.log(err.stack);
      this.response.status = 500;
      this.response.body = 'Sorry we have encountered an error.';
    });
  }
}

function getServer() {
  return _server;
}

function run(app) {
  _app = app;
  _app.servers.koa = exports;
  _server = koa();
  _configure();
}

// Public API
exports.getServer = getServer;
exports.run = run;