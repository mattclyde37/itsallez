/* global angular */

angular.module('ezApp')
	.controller('HomeCtrl', function ($scope, $firebase, $state, Auth, Session) {
	'use strict';

        var currentUser = Session.getCurrentUser();
        currentUser.then(function (user){
            $scope.userId = user.id;
            if (user) {
                Session.getEmployeeAccount(user.id, function(employee){
                    $scope.employee = employee;
                });
            }
        });

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
            $scope.selectedStore = id;
            Session.storeSelected(id);
        };

        $scope.getClassForStore = function(id){
            return $scope.selectedStore === id ? 'active' : '';
        };

        Session.getViewableUsers(function(users){
            $scope.viewableUsers = users;
        });
	
});

