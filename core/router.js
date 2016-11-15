/**
 * 路由表
 */
module.exports = {
  /**
   * Console 首页
   */
  '/': {
    get: 'home'
  },

  '/admin*': {
    get: 'admin'
  },

  /**
   * API
   */
  '/api': {
    /**
     * 公用部分
     */
    // 当前用户帐号
    '/account': {
      '/captcha': {
        get: 'account.captcha'
      },

      '/sign-in': {
        put: 'account.signIn'
      },

      '/sign-out': {
        put: 'account.signOut'
      }
    },

    // 检查是否登录
    '/*': {
      all: 'account.check'
    },

    // 控制面板数据
    '/dashboard': {
      get: 'dashboard'
    },

    // 站点
    '/sites': {
      get: 'sites.list'
    },

    // 系统信息
    '/info': {
      get: 'info.get',
      put: 'info.update'
    }
  },

  /**
   * OPEN API
   */
  '/openApi': {
    '*': {
      all: 'cors'
    },

    '/info': {
      get: 'info.get'
    },

    '/sites': {
      post: 'sites.create'
    }
  }
};