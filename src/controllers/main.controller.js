/**
 * Main Controller
 */
angular.module('controllers').controller('main', ['$scope', '$http',
  function ($scope, $http) {
    'use strict';

    /**
     * 初始化变量
     */
    $scope.website = {
      hostname: window.location.hostname,
      origin: window.location.origin
    };
    $scope.systemInfo = {};
    $scope.nodeInfo = {};
    $scope.databaseInfo = {};
    $scope.sitesTotal = '';


    /**
     * 读取控制面板数据
     */
    $http.get('/api/dashboard')
      .then(function (res) {
        var data = res.data;

        $scope.systemInfo = data.systemInfo;
        $scope.nodeInfo = data.nodeInfo;
        $scope.databaseInfo = data.databaseInfo;
        $scope.sitesTotal = data.sitesTotal;
      }, function () {
        $scope.$emit('notification', {
          type: 'danger',
          message: '读取控制面板数据失败'
        });
      });
  }
]);