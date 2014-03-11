
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



	session.getEmployeeAccount = function(id, handler){
        var userRef = new Firebase('https://itsallez-sltd37.firebaseio.com/users/' + id);
        var emp =  $firebase(userRef);
        emp.$on('loaded', function (){
            handler(emp);
        })
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
			if (currentUser && currentUser.role === 'admin' || currentUser.role === 'tech')
				viewableRoles = ['store', 'RO Manager', 'admin'];
            if (currentUser && currentUser.role === 'RO Manager')
                viewableRoles = ['store'];

			if (viewableRoles)
			{
				var viewableUsers = [];
                var viewableStores = [];
				angular.forEach(users.$getIndex(), function (index){
					for (var i = 0; i < viewableRoles.length; ++i)
						if (viewableRoles[i] === users[index].role && session.user.id != index)
						{
							var u = users[index];
							u.id = index;
                            if (u.role === 'store')
                                viewableStores.push(u);
                            else
							    viewableUsers.push(u);
						}
				});
                viewableStores.sort(function (a, b){
                   return a.store_code > b.store_code;
                });
                var result = viewableStores.concat(viewableUsers);
				handler(result);
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
