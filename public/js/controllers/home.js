/* global angular */

angular.module('ezApp')
	.controller('HomeCtrl', function ($scope, $firebase, $state, Auth, Session) {
	'use strict';

	$scope.user = Session.getUserAccount();
	$scope.userId = Session.user.id;

	$scope.selectedState = '';
	$scope.getClassForState = function (state) {
		return state === $scope.selectedState ? 'active' : '';
	};

	$scope.logout = function (){
		Auth.logout();
	};

	$scope.dashboard = function(){
		$scope.selectedState = 'dashboard';
		$state.transitionTo('home.dashboard');
	};
	$scope.sales = function(){
		$scope.selectedState = 'sales';
		$state.transitionTo('home.sales');
	};
	$scope.services = function(){
		$scope.selectedState = 'services';
		$state.transitionTo('home.services');
	};
	$scope.todo = function(){
		$scope.selectedState = 'todo';
		$state.transitionTo('home.todo');
	};

	$scope.storeSelected = function(id){
		debugger;
		$scope.selectedStore = id;
		if (Session.storeSelected)
			Session.storeSelected(id);
	};

	$scope.getClassForStore = function(id){
		return $scope.selectedStore === id ? 'active' : '';
	};

	

  $scope.viewableUsers = Session.getViewableUsers();


});

