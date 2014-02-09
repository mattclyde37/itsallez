/* global angular, alert */

angular.module('ezApp')
	.controller('LoginCtrl', function ($scope, $firebase, $state, Auth) {
	'use strict';

  $scope.login = function(){
    Auth.login('password', {
      email: $scope.email,
      password: $scope.password
    });
  };
  $scope.register = function(){
    Auth.createUser($scope.email, $scope.password, function (error, user) {
      if (!error)
        alert('Account Created for: ' + user.email);
    });
  };
});