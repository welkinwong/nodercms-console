var mongoose = require('mongoose');

/**
 * 站群模型
 */
var sitesSchema = new mongoose.Schema({
  // 域名
  domain: {
    type: String,
    unique: true,
    required: true
  },

  // IP
  ip: {
    type: String,
    required: true
  },

  // 版本
  version: {
    type: String,
    required: true
  },

  // 操作系统
  os: {
    type: {
      type: String,
      required: true
    },
    version: {
      type: String,
      required: true
    }
  },

  // Node 版本
  node: {
    type: String,
    required: true
  },

  // MongoDB 版本
  mongodb: {
    type: String,
    required: true
  },

  // 注册日期
  createAt: {
    type: Date,
    default: Date.now
  },

  // 更新日期
  updateAt: {
    type: Date,
    default: Date.now
  },

  // 最后登陆日期
  signInAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'sites',
  id: false
});

module.exports = mongoose.model('Sites', sitesSchema);