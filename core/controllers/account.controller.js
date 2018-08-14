var fs = require('fs');
var path = require('path');
var logger = require('../../lib/logger.lib');
var normalConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../../config/normal.config.js')));

/**
 * 检查是否登陆
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
exports.check = function (req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({
      error: {
        code: 'NOT_LOGGED_IN',
        message: '没有登录'
      }
    });
  }
};

/**
 * 登陆
 * @param {Object} req
 * 				{String} req.body.email
 * 				{String} req.body.password
 * @param {Function} res
 */
exports.signIn = function (req, res) {
  req.checkBody({
    'password': {
      notEmpty: {
        options: [true],
        errorMessage: 'password 不能为空'
      },
      isLength: {
        options: [6],
        errorMessage: 'password 不能小于 6 位'
      }
    },
    'autoSignIn': {
      notEmpty: {
        options: [true],
        errorMessage: 'autoSignIn 不能为空'
      },
      isBoolean: { errorMessage: 'autoSignIn 需为布尔值' }
    }
  });

  var password = req.body.password;
  var autoSignIn = req.body.autoSignIn;

  if (req.validationErrors()) {
    logger.system().error(__filename, '参数验证失败', req.validationErrors());
    return res.status(400).end();
  }

  if (password === normalConfig.password) {
    delete req.session.captcha;
    req.session.user = 'admin';
    if (autoSignIn) req.session.cookie.maxAge = 60 * 1000 * 60 * 24 * 90;

    res.status(204).end();
  } else {
    res.status(401).json({
      error: {
        code: 'WRONG_EMAIL_OR_PASSWORD',
        message: '用户名或密码错误'
      }
    });
  }
};

/**
 * 注销登陆
 * @param {Object} req
 * @param {Object} res
 */
exports.signOut = function (req, res) {
  req.session.destroy(function(err) {
    if (err) {
      logger.system().error(__filename, err);
      return res.status(500).end();
    }

    res.status(204).end();
  });
};