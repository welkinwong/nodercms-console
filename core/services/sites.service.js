var _ = require('lodash');
var async = require('async');
var sitesModel = require('../models/sites.model');

/**
 * 站点列表
 * @param {Object} options
 *        {Number} options.currentPage
 *        {Number} options.pageSize
 * @param {Function} callback
 */
exports.list = function (options, callback) {
  var currentPage = 1;
  var pageSize = 50;

  if (options.currentPage) currentPage = parseInt(options.currentPage);
  if (options.pageSize) pageSize = parseInt(options.pageSize);

  async.waterfall([
    function (callback) {
      sitesModel.count({}, function (err, count) {
        if (err) return callback(err);

        if (count) {
          callback(null, count);
        } else {
          callback(null, null);
        }
      });
    },
    function (count, callback) {
      sitesModel.find({})
        .sort('-createAt')
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .select('domain ip version os node mongodb createAt updateAt signInAt')
        .lean()
        .exec(function (err, sites) {
          if (err) {
            err.type = 'database'
            return callback(err);
          }

          callback(null, count, sites);
        });
    }
  ], function (err, count, sites) {
    var result = {
      sites: sites,
      pages: Math.ceil(count / pageSize)
    };

    callback(err, result);
  });
};

/**
 * 单个站点
 * @param {Object} options
 *        {MongoId} options._id
 * @param {Function} callback
 */
exports.one = function (options, callback) {
  if (!options.domain) {
    var err = {
      type: 'system',
      error: '没有 domain 传入'
    };

    return callback(err);
  }

  var domain = options.domain;

  sitesModel.findOne({ domain: domain })
    .lean()
    .exec(function (err, site) {
      if (err) {
        err.type = 'database';
        return callback(err);
      }

      callback(null, site)
    });
};

/**
 * 存储站点
 * @param {Object} options
 *        {MongoId} options._id
 *        {Object} options.data
 * @param {Function} callback
 */
exports.save = function (options, callback) {
  if (!options.data) {
    var err = {
      type: 'system',
      error: '没有 data 传入'
    };

    return callback(err);
  }

  var _id = options._id;
  var data = options.data;

  if (_id) {
    sitesModel.update({ _id: _id }, data, { runValidators: true }, function (err) {
      if (err) {
        err.type = 'database';
        return callback(err);
      }

      callback();
    });
  } else {
    new sitesModel(data).save(function (err, site) {
      if (err) {
        err.type = 'database';
        return callback(err);
      }

      callback(null, site);
    });
  }
};

/**
 * 站点总数
 * @param {Function} callback
 */
exports.total = function (callback) {
  sitesModel.count({}, function (err, count) {
    if (err) {
      err.type = 'database';
      return callback(err);
    }

    callback(null, count);
  });
};