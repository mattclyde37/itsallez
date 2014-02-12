
/* global angular, alert, Firebase, FirebaseSimpleLogin */

angular.module('ezApp')
	.factory('Auth', function ($state, Session)
{
	'use strict';

	var ref = new Firebase('https://itsallez-sltd37.firebaseio.com');
	var auth = new FirebaseSimpleLogin(ref, function(error, user) {
	  if (error) {
	    // an error occurred while attempting login
	    alert('Invalid email or password: ' + error);
	  } else if (user) {
	    // user authenticated with Firebase
	    Session.user = user;
	    $state.transitionTo('home');
	  } else {
	    // user is logged out
	    Session.user = null;
	    $state.transitionTo('login');
	  }
	});
	return auth;

});
