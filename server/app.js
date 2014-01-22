/*
 * nodemon --watch server --harmony-generators server
 *
 * server/app.js
 */

'use strict';

var util = require('util');

var path = require('path');

var _ = require('lodash'),
    Q = require('q'),
    requireDir = require('require-dir');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require(path.join(path.normalize(__dirname + '/../config'), process.env.NODE_ENV))

// Create an app
var app = {
  config: config,
  dir: __dirname,
  project: require('../project'),
  routes: require('./routes'),
  servers: {}
};

// Assign app to exports
exports = module.exports = app;


// Defaults for config
_.defaults(app.config, {
  url: app.config.url || 'http://localhost:' + app.project.server.port
});

// Load modules
app.lib = requireDir(app.dir + '/lib');
app.models = requireDir(app.dir + '/models');
app.controllers = requireDir(app.dir + '/controllers');

// Attach middlewares called by app.servers.express
app.attachMiddlewares = function () {

  // Get better stack traces in dev, avoid due to perf issues in production
  if (process.env.NODE_ENV === 'development') {
    Q.longStackSupport = true;
  }

  // Custom
  // app.servers.express.getServer().use(function (req, res, next) {
  //   // Locals
  //   res.locals.livereload = process.env.LIVERELOAD;
  //   res.locals.csrf = req.session._csrf;
  //   res.locals.user = req.user;
  //   res.locals.role = {
  //     admin: false
  //   };

  //   // User cookie
  //   if (!req.user) {
  //     app.lib.cookie.clearUserCookie(req, res);
  //   } else {
  //     app.lib.cookie.setUserCookie(req, res);
  //   }

  //   // Live reload
  //   if (process.env.LIVERELOAD) {
  //     res.cookie('livereload', process.env.LIVERELOAD);
  //   } else {
  //     res.clearCookie('livereload');
  //   }

  //   next();
  // });
};

// Run app.servers
app.run = function () {
  // Connect to DB

  // require('./utility/mongooseconnect').connect(app.config.db.mongo);
  // require('./utility/redisconnect').connect(app.config.db.redis);

  // Start servers
  require('./utility/koa').run(app);

  // Return HTTP server
  return app.servers.koa.getServer();
};
