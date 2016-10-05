var path = require('path');
var express = require('express');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var validator = require('./lib/validator.lib');
var logger = require('./lib/logger.lib');
var router = require('./lib/route-map.lib');
var errors = require('./core/controllers/errors.controller').error;
var sessionConfig = require('./config/session.config');

var app = express();

/**
 * 中间件
 */
app.use(compression());
app.use(logger.access());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session(sessionConfig));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * 转给 Roter 处理路由
 */
app.use(router);

/**
 * 错误处理程序
 */
app.use(errors);

/**
 * 导出 APP
 */
module.exports = app;
