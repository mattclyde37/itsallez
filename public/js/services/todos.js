
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

    service.loadTodos = function (userId, handler){
        var todosRef = new Firebase('https://itsallez-sltd37.firebaseio.com/todos/' + userId);
        var todos = $firebase(todosRef);
        todos.$on('loaded', function (){
            handler(todos);
        })
        todos.$on('change', function(){
            handler(todos);
        })
    }

	service.addTodo = function(userId, text, employee, priority, duration, timeType){
        if (text)
        {
            var todos = service.getTodos(userId);
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
        }
	};

    service.editTodo = function(userId, todoId, text, done, archive, employee, priority, duration, timeType, timeStamp){

    };


	return service;
});
