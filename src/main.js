/**
 * I'm the King of the World!
 */
angular.module('nodercms-console', [
  'ngAnimate',
  'ipCookie',
  'ui.router',
  'ngFileUpload',
  'angular-img-cropper',
  // 'angular-loading-bar',
  'controllers',
  'services',
  'directives',
  'filters',
  'views'
])
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider',
  function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    'use strict';

    // 修改默认请求头
    $httpProvider.defaults.headers.common = {'content-type': 'application/json;charset=utf-8'};

    // 拦截无权限请求
    $httpProvider.interceptors.push('authorityInterceptor');

    // 开启 HTML5 模式
    $locationProvider.html5Mode(true);

    // 将所有未匹配路由转至根目录
    $urlRouterProvider.otherwise(function ($injector) { $injector.get('$state').go('main') });

    // 路由
    $stateProvider
      // 登录
      .state('signIn', {
        url: '^/admin/sign-in',
        controller: 'signIn',
        templateProvider: ['$templateCache', function($templateCache) {
          return $templateCache.get('sign-in.view.html');
        }]
      })

      // 控制面板
      .state('main', {
        url: '^/admin',
        controller: 'main',
        templateProvider: ['$templateCache', function($templateCache) {
          return $templateCache.get('main.view.html');
        }]
      })

    　// 站点管理
      .state('main.sites', {
        url: '^/admin/sites',
        controller: 'sites',
        templateProvider: ['$templateCache', function($templateCache) {
          return $templateCache.get('sites.view.html');
        }]
      })

      // 系统设置
      .state('main.setting', {
        url: '^/admin/setting',
        controller: 'setting',
        templateProvider: ['$templateCache', function($templateCache) {
          return $templateCache.get('setting.view.html');
        }]
      })
  }
]).run(['checkSignIn', '$templateCache', function (checkSignIn) {
  // 检查用户是否登录
  checkSignIn();
}]);

/**
 * 创建 Controllers, Services, Directives, Filters 模块
 */
angular.module('controllers', []);
angular.module('services', []);
angular.module('directives', []);
angular.module('filters', []);
angular.module('views', []);