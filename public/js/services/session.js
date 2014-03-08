
/* global angular, Firebase, console */

angular.module('ezApp')
	.factory('Session', function ($firebase, $firebaseSimpleLogin)
{
	'use strict';
	var session = {};

    var dataRef = new Firebase('https://itsallez-sltd37.firebaseio.com');
    var loginObj = $firebaseSimpleLogin(dataRef);
    loginObj.$getCurrentUser().then(function (user){
        debugger;
        session.currentUser = user;
    });



	session.getUserAccount = function(){
		if (session.user){
			var userRef = new Firebase('https://itsallez-sltd37.firebaseio.com/users/' + session.user.id);
			return $firebase(userRef);
		}
	};

	session.getViewableUsers = function(handler){
		var usersRef = new Firebase('https://itsallez-sltd37.firebaseio.com/users');
		var users = $firebase(usersRef);
		users.$on('loaded', function(){
			var currentUser = null;
			angular.forEach(users.$getIndex(), function (index){
				if (index === session.user.id)
					currentUser = users[index];
			});

			var viewableRoles = null;
			if (currentUser && currentUser.role === 'admin')
				viewableRoles = ['store', 'ro-manager'];

			if (viewableRoles)
			{
				var viewableUsers = [];
				angular.forEach(users.$getIndex(), function (index){
					for (var i = 0; i < viewableRoles.length; ++i)
						if (viewableRoles[i] === users[index].role)
						{
							var u = users[index];
							u.id = index;
							viewableUsers.push(u);
						}
				});
				handler(viewableUsers);
			}
		});
	};

	session.getEmployees = function(id, handler){
		var employeesRef = new Firebase('https://itsallez-sltd37.firebaseio.com/users/' + id + '/employees');
		var employees = $firebase(employeesRef);
		employees.$on('loaded', function(){
			handler(employees);
		});
	};

	return session;
});
