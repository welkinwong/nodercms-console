/**
 * settingController
 */
angular.module('controllers').controller('setting', ['$scope', '$http',
  function ($scope, $http) {
    'use strict';

    /**
     * 初始化变量
     */
    $scope.transmitting = true;
    $scope.version = '';

    /**
     * 获取系统信息
     */
    $http.get('/api/info')
      .success(function (result) {
        $scope.version = result.version;

        $scope.transmitting = false;
      })
      .error(function () {
        $scope.$emit('notification', {
          type: 'danger',
          message: '获取 NoderCMS 信息失败'
        });
      });

    /**
     * 更新系统信息
     */
    $scope.submitSetting = function () {
      $scope.transmitting = true;

      $http.put('/api/info', { version: $scope.version })
        .then(function () {
          $scope.transmitting = false;

          $scope.$emit('notification', {
            type: 'success',
            message: '系统信息已保存'
          });
        }, function () {
          $scope.transmitting = false;

          $scope.$emit('notification', {
            type: 'danger',
            message: '系统信息保存失败'
          });
        })
    };
  }
]);