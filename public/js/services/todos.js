
/* global angular, Firebase */

angular.module('ezApp')
	.factory('Todos', function ($firebase)
{
	'use strict';

	var service = {};
	service.getTodos = function (userId){
		var todosRef = new Firebase('https://itsallez-sltd37.firebaseio.com/todos/' + userId);
		return $firebase(todosRef);
	};

	return service;
});
