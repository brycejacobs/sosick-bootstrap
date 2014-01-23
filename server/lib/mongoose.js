/*
 * ultimate.db.mongoose.connect
 */

'use strict';

var url = require('url'),
    util = require('util');

var _ = require('lodash'),
    mongoose = require('mongoose');

var _client = null;

/**
 * Connect to MongoDB.
 *
 * @param {Object} mongoConfig Mongo config.
 * @param {Object} cb Callback.
 * @return {Client}
 */
function connect(mongoConfig, cb) {
  console.log(mongoConfig);
  var mongoUrl = url.parse(process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || '');

  if (mongoUrl.href) {
    mongoConfig.host = mongoUrl.hostname;
    mongoConfig.port = parseInt(mongoUrl.port, 10);
    mongoConfig.username = mongoUrl.auth.split(':')[0];
    mongoConfig.password = mongoUrl.auth.split(':')[1];
    mongoConfig.db = mongoUrl.pathname.slice(1);
  }

  if (!_.isFunction(cb)) {
    cb = function (err) {
      if (err) { console.error(err); }
    };
  }

  if (!_.isObject(mongoConfig)) {
    return cb('mongoConfig must be an object.');
  }

  // Connect
  var uri = util.format(
    'mongodb://%s:%s/%s',
    mongoConfig.host || 'localhost',
    mongoConfig.port || 27017,
    mongoConfig.db || 'sosick-bootstrap'
  );

  if (mongoConfig.username && mongoConfig.password) {
    _client = mongoose.connect(uri, {
      user: mongoConfig.username || null,
      pass: mongoConfig.password || null,
    });
  } else {
    _client = mongoose.connect(uri);
  }

  // Events
  mongoose.connection.once('open', function () {
    console.log('Connected to Mongo: %s', uri);
    return cb();
  });
  mongoose.connection.on('error', function (err) {
    console.log('Error connecting to Mongo: %s\n%s', uri, err);
    return cb(err);
  });

  return _client;
}

exports.connect = connect;
// // Public API
// exports = module.exports = connect;

// Object.defineProperty(exports, '_client', {
//   get: function () {
//     return _client;
//   }
// });