var logger = require('../../lib/logger.lib');
var infoService = require('../services/info.service');

/**
 * 获取系统信息
 * @param {Object} req
 *        {Number} req.query.currentPage
 *        {Number} req.query.pageSize
 * @param {Object} res
 */
exports.get = function (req, res) {
  infoService.get(function (err, info) {
    if (err) {
      logger[err.type]().error(__filename, err);
      return res.status(500).end();
    }

    res.status(200).json({
      version: info.version
    });
  });
};

/**
 * 更新系统信息
 * @param {Object} req
 *        {String} req.body.version
 * @param {Object} res
 */
exports.update = function (req, res) {
  req.checkBody({
    'version': {
      notEmpty: {
        options: [true],
        errorMessage: 'version 不能为空'
      },
      isString: { errorMessage: 'version 需为字符串' }
    }
  });

  if (req.validationErrors()) {
    logger.system().error(__filename, '参数验证失败', req.validationErrors() );
    return res.status(400).end();
  }

  var data = {
    version: req.body.version
  };

  infoService.save({ data: data }, function (err) {
    if (err) {
      logger[err.type]().error(__filename, err);
      return res.status(500).end();
    }

    res.status(204).end();
  });
};