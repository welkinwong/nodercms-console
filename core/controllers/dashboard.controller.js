var os = require('os');
var async = require('async');
var _ = require('lodash');
var mongoose = require('mongoose');
var packageInfo = require('../../package.json');
var sitesService = require('../services/sites.service');

/**
 * 控制面板数据
 * @param {Object} req
 * @param {Object} res
 */
module.exports = function (req, res) {
  async.parallel({
    systemInfo: function (callback) {
      var system = {
        version: packageInfo.version,
        osType: os.type(),
        osRelease: os.release(),
      };

      callback(null, system);
    },
    nodeInfo: function (callback) {
      var nodeInfo = process.versions;

      callback(null, nodeInfo);
    },
    databaseInfo: function (callback) {
      var mongodbAdmin = new mongoose.mongo.Admin(mongoose.connection.db);

      mongodbAdmin.buildInfo(function (err, info) {
        if (err) {
          err.type = 'database';
          return callback(err);
        }

        callback(null, _.pick(info, 'version'));
      });
    },
    sitesTotal: sitesService.total,
  }, function (err, results) {
    if (err) {
      logger[err.type]().error(__filename, err);
      return res.status(500).end();
    }

    var data = {
      systemInfo: results.systemInfo,
      nodeInfo: results.nodeInfo,
      databaseInfo: results.databaseInfo,
      sitesTotal: results.sitesTotal
    };

    res.status(200).json(data);
  });
};