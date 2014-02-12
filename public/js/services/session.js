
/* global angular, Firebase */

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

	session.getViewableUsers = function(){
		var usersRef = new Firebase('https://itsallez-sltd37.firebaseio.com/users');
		var users = $firebase(usersRef);
		return users;
	};

	return session;
});
