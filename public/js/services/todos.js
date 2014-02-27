
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

	service.addTodo = function(userId, text, employee, priority, duration, timeType){
		var todos = service.getTodos(userId);
		debugger;
		todos.$add({
			text:text,
			done:false,
			archive:false,
			employee:employee,
			priority:priority,
			duration:duration,
			timeType:timeType,
			timeStamp:new Date()
		});
	};

    service.editTodo = function(userId, todoId, text, done, archive, employee, priority, duration, timeType, timeStamp){

    };


	return service;
});
