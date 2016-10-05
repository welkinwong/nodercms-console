/**
 * Sites Controller
 */
angular.module('controllers').controller('sites', ['$scope', '$state', '$stateParams', '$http',
  function ($scope, $state, $stateParams, $http) {
    'use strict';

    /**
     * 初始化变量
     */
    $scope.transmitting = false;
    $scope.sites = [];
    $scope.currentPage = 1;
    $scope.totalPages = 0;

    /**
     * 读取站点列表
     */
    $http.get('/api/sites', { params: { currentPage: $scope.currentPage, pageSize: 20 } })
      .then(function (res) {
        var data = res.data;

        $scope.sites = data.sites;
        $scope.totalPages = data.pages;
      });
  }
]);