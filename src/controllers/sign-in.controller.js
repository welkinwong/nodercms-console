/**
 * Sign In Controller
 */
angular.module('controllers').controller('signIn', ['$scope', '$timeout', '$state', '$http',
  function ($scope, $timeout, $state, $http) {
    'use strict';

    $scope.transmitting = false;
    $scope.password = '';
    $scope.autoSignIn = false;
    $scope.wrongEmailOrPassword = false;
    $scope.wrongCaptcha = false;

    function resetEmailAndPassword () {
      $scope.wrongEmailOrPassword = false;
    }

    $scope.$watch('password', resetEmailAndPassword);

    $scope.signIn = function () {
      $scope.transmitting = true;

      $http.put('/api/account/sign-in', {
        password: $scope.password,
        autoSignIn: $scope.autoSignIn
      }).then(function () {
        $state.go('main');
      }, function (res) {
        $scope.getCaptcha();

        var data = res.data;

        switch (_.get(data, 'error.code')) {
          case 'WRONG_EMAIL_OR_PASSWORD':
            $scope.wrongEmailOrPassword = true;
            break;
          case 'WRONG_CAPTCHA':
            $scope.wrongCaptcha = true;
        }

        $scope.animateShake = true;
        $timeout(function () {
          $scope.animateShake = false;
          $scope.transmitting = false;
        }, 600);
      });
    };
  }
]);