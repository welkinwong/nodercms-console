var logger = require('../../lib/logger.lib');
var cache = require('../../lib/cache.lib');
var optionsModel = require('../models/options.model');

/**
 * 获取系统信息
 * @param {Function} callback
 */
exports.get = function (callback) {
  var infoCache = cache.get('siteInfo');

  if (infoCache) {
    callback(null, infoCache);
  } else {
    optionsModel.findOne({ name: 'info' }, function (err, info) {
      if (err) {
        err.type = 'database';
        return callback(err);
      }

      if (info) {
        cache.set('info', info.value, 1000 * 60 * 60 * 24 * 30);

        callback(null, info.value);
      } else {
        callback(null, { version: '0.0.0' });
      }
    });
  }
};

/**
 * 存储系统信息
 * @param {Object} options
 *        {Object} options.data
 * @param {Function} callback
 */
exports.save = function (options, callback) {
  optionsModel.findOneAndUpdate({ name: 'info' }, {
    value: options.data
  }, { runValidators: true }, function (err, info) {
    if (err) {
      err.type = 'database';
      callback(err);
    }

    if (!info) {
      new optionsModel({
        name: 'info',
        value: options.data
      }).save(function (err) {
        if (err) {
          err.type = 'database';
          return callback(err);
        }

        callback();
      });

      return false;
    }

    cache.del('info');

    callback(null);
  });
};