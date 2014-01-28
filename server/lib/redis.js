/*
 * ultimate.db.redis
 */

'use strict';

var url = require('url');

var _ = require('lodash'),
    redis = require('redis');

var _client = null;

function createClient(redisConfig, onConnectCallback) {
  var redisUrl = url.parse(process.env.REDISTOGO_URL || process.env.REDISCLOUD_URL || '');

  if (redisUrl.href) {
    redisConfig.host = redisUrl.hostname;
    redisConfig.port = parseInt(redisUrl.port, 10);
    redisConfig.password = redisUrl.auth.split(':')[1];
  }

  var client = redis.createClient(redisConfig.port, redisConfig.host);

  if (redisConfig.password) {
    client.AUTH(redisConfig.password);
  }

  client.once('connect', function () {
    console.log('Connected to Redis.');
    if (onConnectCallback) {
      onConnectCallback();
    }
  });

  client.on('error', function (err) {
    console.log('Connection error with Redis: %s', err);
  });

  return client;
}

/**
 * Connect to Redis.
 *
 * @param {Object} redisConfig Redis config.
 * @param {Function} cb Callback.
 * @return {Client}
 */
function connect(redisConfig, cb) {
  if (!_.isFunction(cb)) {
    cb = function (err) {
      if (err) { console.error(err); }
    };
  }

  if (_client && _client.connected) { return cb(); }

  if (!_.isObject(redisConfig)) {
    throw new Error('redisConfig must be an object.');
  }

  _client = createClient({
    host: redisConfig.host || 'localhost',
    port: redisConfig.port || 6379,
    password: redisConfig.password
  });

  _client.once('connect', function () {
    return cb();
  });

  _client.on('error', function (err) {
    return cb(err);
  });

  return _client;
}

function publish(channel, message) {
  _client.PUBLISH(channel, message);
}

// Accesssors
function getClient() {
  return _client;
}

// Public API
exports.getClient = getClient;
exports.createClient = createClient;
exports.connect = connect;
exports.publish = publish;