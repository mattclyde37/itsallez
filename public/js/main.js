/* global angular */

var app = angular.module('ezApp', ['ui.router', 'firebase']);


app.config(function ($stateProvider, $urlRouterProvider){
	'use strict';

	$urlRouterProvider.otherwise('/login');

	$stateProvider
		.state('login', {
			url: '/login',
			templateUrl: 'tmpl/login.html',
			controller: 'LoginCtrl'
		})
		.state('home', {
			url: '/',
			templateUrl: 'tmpl/home.html',
			controller: 'HomeCtrl'
		})
		.state('home.dashboard', {
			url: 'dashboard',
			templateUrl: 'tmpl/home.dashboard.html',
			controller: 'DashboardCtrl'
		})
		.state('home.sales', {
			url: 'sales',
			templateUrl: 'tmpl/home.sales.html',
			controller: 'SalesCtrl'
		})
		.state('home.services', {
			url: 'services',
			templateUrl: 'tmpl/home.services.html',
			controller: 'ServicesCtrl'
		})
		.state('home.todo', {
			url: 'todo',
			templateUrl: 'tmpl/home.todo.html',
			controller: 'TodoCtrl'
		});

});





