
/* global angular, alert, Firebase, FirebaseSimpleLogin */

angular.module('ezApp')
	.factory('Auth', function ($state, Session)
{
	'use strict';

	var ref = new Firebase('https://itsallez-sltd37.firebaseio.com');
	var auth = new FirebaseSimpleLogin(ref, function(error, user) {
	  if (error) {
	    // an error occurred while attempting login
	    alert('Invalid email or password');
        console.log(error);
	  } else if (user) {
	    // user authenticated with Firebase
        Session.login(user);
	    $state.transitionTo('home.todo');
	  } else {
	    // user is logged out
        Session.logout();
        $state.transitionTo('login');
	  }
	});
	return auth;

});
