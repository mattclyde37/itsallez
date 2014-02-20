
/* global angular, Firebase, console */

angular.module('ezApp')
	.factory('Session', function ($firebase)
{
	'use strict';
	var session = {};

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
				viewableRoles = ['store'];

			if (viewableRoles)
			{
				var viewableUsers = [];
				angular.forEach(users.$getIndex(), function (index){
					for (var i = 0; i < viewableRoles.length; ++i)
						if (viewableRoles[i] === users[index].role)
							viewableUsers.push(users[index]);
				});
				handler(viewableUsers);
			}
		});
	};

	return session;
});
