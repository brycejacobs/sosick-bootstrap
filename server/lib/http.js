/*
 * ultimate.server.http
 */

'use strict';

var http = require('http'),
    util = require('util');


var _app = null,
    _server = null;

function _configure() {
  // Proxy use() for grunt-express.
  _server.use = function () {
    _app.servers.koa.getServer().use.apply(_app.servers.koa.getServer(), arguments);
  };
}

function _listen() {
  var port = process.env.VMC_APP_PORT || process.env.PORT || _app.project.server.port || 3000;

  _server.listen(port, function () {
    console.log('KOA HTTP server listening on port %d', port);
  });
}

function getServer() {
  return _server;
}

function run(app) {
  _app = app;
  _app.servers.http = exports;
  _server = http.createServer(_app.servers.koa.getServer().callback());
  _listen();
}

// Public API
exports.getServer = getServer;
exports.run = run;