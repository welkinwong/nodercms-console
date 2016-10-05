var logger = require('../../lib/logger.lib');
var sitesService = require('../services/sites.service');

/**
 * 多个站点
 * @param {Object} req
 *        {Number} req.query.currentPage
 *        {Number} req.query.pageSize
 * @param {Object} res
 */
exports.list = function (req, res) {
  req.checkQuery({
    'currentPage': {
      optional: true,
      isInt: { errorMessage: 'currentPage 需为数字' }
    },
    'pageSize': {
      optional: true,
      isInt: { errorMessage: 'pageSize 需为数字' }
    }
  });

  var query = {};

  if (req.query.currentPage) query.currentPage = req.query.currentPage;
  if (req.query.pageSize) query.pageSize = req.query.pageSize;

  if (req.validationErrors()) {
    logger.system().error(__filename, '参数验证失败', req.validationErrors());
    return res.status(400).end();
  }

  sitesService.list(query, function (err, sites) {
    if (err) {
      logger[err.type]().error(err);
      return res.status(500).end();
    }

    res.status(200).json(sites);
  });
};

/**
 * 创建站点
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
exports.create = function (req, res, next) {
  req.checkBody({
    'domain': {
      notEmpty: {
        options: [true],
        errorMessage: 'domain 不能为空'
      },
      isString: { errorMessage: 'domain 需为字符串' }
    },
    'ip': {
      notEmpty: {
        options: [true],
        errorMessage: 'ip 不能为空'
      },
      isIP: { errorMessage: 'ip 格式不正确' }
    },
    'version': {
      notEmpty: {
        options: [true],
        errorMessage: 'version 不能为空'
      },
      isString: { errorMessage: 'version 需为字符串' }
    },
    'os.type': {
      notEmpty: {
        options: [true],
        errorMessage: 'os type 不能为空'
      },
      isString: { errorMessage: 'os type 需为字符串' }
    },
    'os.version': {
      notEmpty: {
        options: [true],
        errorMessage: 'os version 不能为空'
      },
      isString: { errorMessage: 'os version 需为字符串' }
    },
    'node': {
      notEmpty: {
        options: [true],
        errorMessage: 'node 不能为空'
      },
      isString: { errorMessage: 'node 需为字符串' }
    },
    'mongodb': {
      notEmpty: {
        options: [true],
        errorMessage: 'mongodb 不能为空'
      },
      isString: { errorMessage: 'mongodb 需为字符串' }
    }
  });

  // var data = {
  //   domain: 'abc.com',
  //   ip: '128.24.33.121',
  //   version: '1.12.4',
  //   os: {
  //     type: 'Mac',
  //     version: '11.11'
  //   },
  //   node: '6.2',
  //   mongodb: '3.4'
  // };

  var data = {
    domain: req.body.domain,
    ip: req.body.ip,
    version: req.body.version,
    os: {
      type: req.body.os.type,
      version: req.body.os.version
    },
    node: req.body.node,
    mongodb: req.body.mongodb
  };

  sitesService.one({ domain: req.body.domain }, function (err, site) {
    if (err) {
      logger[err.type]().error(__filename, err);
      return res.status(500).end();
    }

    if (site) {
      sitesService.update({ _id: site._id, data: data }, function (err) {
        if (err) {
          logger[err.type]().error(__filename, err);
          return res.status(500).end();
        }

        res.status(204).end();
      });
    } else {
      sitesService.save({ data: data }, function (err) {
        if (err) {
          logger[err.type]().error(__filename, err);
          return res.status(500).end();
        }

        res.status(204).end();
      });
    }
  });
};