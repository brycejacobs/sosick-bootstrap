/*
 * nodemon --watch server --harmony-generators server
 *
 * server/app.js
 */

'use strict';

var path = require('path'),
    http = require('http');

var _ = require('lodash'),
    requireDir = require('require-dir'),
    mongoose = require('mongoose');

var koa = require('koa');


//Find out which environment we are preparing for.
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require(path.join(path.normalize(__dirname + '/../config'), process.env.NODE_ENV));

// Create an app
var app = {
  config: config,
  dir: __dirname,
  lib: {},
  project: require('../project'),
  routes: require('./routes'),
  servers: {
    http: {
      httpServer: null,
      getServer: function () {
        return this.httpServer;
      },
      run: function (server, port) {
        this.httpServer = http.createServer(server.callback()).listen(port);
      }
    },
    koa: {
      koaServer: null,
      getServer: function () {
        return this.koaServer;
      },
      run: function () {
        this.koaServer = koa();
        return;
      }
    }
  }
};

// Defaults for config
_.defaults(app.config, {
  url: app.config.url || 'http://localhost:' + app.project.server.port
});

//Attach All project specific middleware here.
app.attachMiddleware = function() {


};

// Run app.servers
app.run = function () {
  // Connect to DB
  // require('./lib/mongoose').connect(app.config.db.mongo);
  // require('./lib/redis').connect(app.config.db.redis);

  //KOA server
  app.servers.koa.run();
  require('./lib/Middlewares').attachMiddleware(app);

  //HTTP Server
  var port = process.env.PORT || app.project.server.port || 3000;
  app.servers.http.run(app.servers.koa.getServer(), port);

  //Make the models and such available.
  app.lib.mongoose = mongoose;
  app.models = requireDir(app.dir + '/models');
  app.controllers = requireDir(app.dir + '/controllers');
  require('./routes').registerRoutes(app);

  return app.servers.http.getServer();
};

// Assign app to exports
exports = module.exports = app;