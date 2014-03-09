
/* global angular, Firebase, console */

angular.module('ezApp')
	.factory('Session', function ($firebase, $firebaseSimpleLogin)
{
	'use strict';
	var session = {};


    session.login = function (user){
        session.user = user;
        session.storeSelected(user.id);
        session.userLoggedIn(user);
    }
    session.userLoggedIn = function (user) {

    }

    session.logout = function (){
        session.user = null;
        session.storeSelected(null);
        session.userLoggedOut();
    }
    session.userLoggedOut = function (){

    }



    session.getCurrentUser = function(){
        var dataRef = new Firebase('https://itsallez-sltd37.firebaseio.com');
        var loginObj = $firebaseSimpleLogin(dataRef);
        var currentUser = loginObj.$getCurrentUser();
        currentUser.then(function (user){
            session.user = user;
        });
        return currentUser;
    }



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

    session.storeSelectedHandler = function (id){ }

    session.storeSelected = function (id){
        session.storeSelectedId = id;
        session.storeSelectedHandler(id);
    }



	return session;
});
