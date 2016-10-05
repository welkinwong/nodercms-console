var logger = require('../../lib/logger.lib');
var captcha = require('../../lib/captcha.lib');
var normalConfig = require('../../config/normal.config');

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
 * 登陆验证码
 * @param {Object} req
 * @param {Object} res
 */
exports.captcha = function (req, res) {
  var source = captcha();

  req.session.captcha = source.code;

  res.status(200).json(source.dataURL);
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
    'captcha': {
      notEmpty: {
        options: [true],
        errorMessage: 'captcha 不能为空'
      },
      isLength: {
        options: [4, 4],
        errorMessage: '验证码长度需为 4 位'
      }
    },
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
  var captcha = req.body.captcha;
  var autoSignIn = req.body.autoSignIn;

  if (req.validationErrors()) {
    logger.system().error(__filename, '参数验证失败', req.validationErrors());
    return res.status(400).end();
  }

  if (captcha !== req.session.captcha) {
    res.status(401).json({
      error: {
        code: 'WRONG_CAPTCHA',
        message: '验证码错误'
      }
    });
    return false;
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