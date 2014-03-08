/* global angular  */

angular.module('ezApp')
	.controller('TodoCtrl', function ($scope, $firebase, $state, $interval, Auth, Todos, Session) {
	'use strict';

        Session.userLoggedIn = function (user){
            debugger;
        }

        if (Session.user)
        {
            if (!Session.storeSelectedId)
                Session.storeSelectedId = Session.user.id;
            Todos.loadTodos(Session.user.id, function (todos){
                $scope.todos = todos;
                $scope.openTodos = $scope.getOpenTodos($scope.todos);
                $scope.archivedTodos = $scope.getArchivedTodos($scope.todos);
            });
        }
        else
            $scope.todos = {};


        $scope.archivedTodos = [];
        $scope.employees = [];

        $scope.priorities = [
        { label: 'A'},
        { label: 'B'},
        { label: 'C'},
        { label: 'D'}
        ];
        $scope.selectedPriority = $scope.priorities[0];

        $scope.timeTypes = [
        { label: 'Minutes' },
        { label: 'Hours' },
        { label: 'Days' },
        { label: 'Weeks' }
        ];
        $scope.selectedTimeType = $scope.timeTypes[0];


        $scope.addTodo = function() {
            Todos.addTodo(Session.storeSelectedId, $scope.todoText, $scope.employee, $scope.selectedPriority.label, $scope.duration, $scope.selectedTimeType.label);
            $scope.todoText = '';
        };


        $scope.remaining = function() {
            var count = 0;
            angular.forEach($scope.todos.$getIndex(), function (index) {
            if ($scope.todos[index])
                count += $scope.todos[index].done ? 0 : 1;
            });
            return count;
        };

        $scope.total = function() {
            var count = 0;
            angular.forEach($scope.todos.$getIndex(), function (index) {
                if ($scope.todos[index])
                    if (!$scope.todos[index].archive)
                count++;
            });
            return count;
        };

        $scope.completed = function() {
            var count = 0;
            for (var i = 0; i < $scope.openTodos.length; ++i){
                if ($scope.openTodos[i].done)
                    count++;
            }
            return count;
        };

        $scope.getOpenTodos = function(fromTodos){
            var todos = [];
            angular.forEach(fromTodos.$getIndex(), function (index){
                if (fromTodos[index]) {
                    if (!fromTodos[index].archive)
                    {
                        var todo = fromTodos[index];
                        todo.id = index;
                        todos.push(todo);
                    }
                }
            });
            return todos;
        };

        $scope.getArchivedTodos = function(fromTodos){
            var todos = [];
            angular.forEach(fromTodos.$getIndex(), function(index){
                if (fromTodos[index]) {
                    if (fromTodos[index].archive) {
                        var todo = fromTodos[index];
                        todo.id = index;
                        todos.push(todo);
                    }
                }
            });
            return todos;
        };

        $scope.showCompleted = false;

        $scope.toggleCompleted = function(){
            $scope.showCompleted = !$scope.showCompleted;
        };

        $scope.toggleCompletedStr = function(){
            return $scope.showCompleted ? 'Hide' : 'Show';
        };

        $scope.archive = function(){
            angular.forEach($scope.todos.$getIndex(), function(index){
                if ($scope.todos[index]){
                    if ($scope.todos[index].done && !$scope.todos[index].archive) {
                       $scope.todos[index].archive = true;
                       $scope.todos.$save(index);
                    }
                }
            });
        };

        $scope.selectedTodosCount = function(){
            var count = 0;
            for (var i = 0; i < $scope.archivedTodos.length; ++i){
                if ($scope.archivedTodos[i].selected)
                count++;
            }
            return count;
        };

        $scope.showDeleteBtn = function(){
            return ($scope.selectedTodosCount() > 0);
        };

        $scope.deleteSelected = function (){
            angular.forEach($scope.todos.$getIndex(), function (index){
                for (var i = 0; i < $scope.archivedTodos.length; ++i) {
                    if ($scope.archivedTodos[i].selected && $scope.archivedTodos[i].id === $scope.todos[index].id){
                      $scope.todos.$remove(index);
                    }
                }
            });
        };

        $scope.getCheveronDirection = function() {
            return $scope.showCompleted ? 'up' : 'down';
        };

        $scope.getDurationStr = function(todo){
            return (todo.duration) ? todo.duration + ' ' + todo.timeType : 'n/a';
        };


        if (Session.storeSelectedId)
            Todos.loadTodos(Session.storeSelectedId, function (todos){
                $scope.todos = todos;
            });

        Session.storeSelectedHandler = function(id){
            $scope.employees = [];
            Todos.loadTodos(id, function (todos){
                $scope.todos = todos;
                $scope.openTodos = $scope.getOpenTodos($scope.todos);
                $scope.archivedTodos = $scope.getArchivedTodos($scope.todos);
            });

            $scope.todos.$on('change', function(){
                $scope.openTodos = $scope.getOpenTodos($scope.todos);
                $scope.archivedTodos = $scope.getArchivedTodos($scope.todos);
            });

            Session.getEmployees(id, function(list){
                var emps = [];
                angular.forEach(list.$getIndex(), function (index){
                    emps.push(list[index]);
                });
                $scope.employees = emps;
            });
        };

        $scope.editingTodoId = null;

        $scope.toggleEditMode = function(todo){

            debugger;
            if ($scope.editingTodoId)
                $scope.todos.$save($scope.editingTodoId);

            if ($scope.editingTodoId === todo.id)
                $scope.editingTodoId = null;
            else
                $scope.editingTodoId = todo.id;
        }

        $scope.getEditButtonClass = function(todo){
            return ($scope.editingTodoId === todo.id) ? 'ok' : 'pencil';
        }

        $scope.showReadOnly = function (todo){
            return (todo.id !== $scope.editingTodoId);
        }

        $scope.showEditing = function (todo){
            return (todo.id === $scope.editingTodoId);
        }

        $scope.showNewTaskWindow = function(value){
            $scope.newTaskWindowVisible = value;
        }

    });


angular.module('ezApp')
    .directive('chosen', function(){
    'use strict';

        var linker = function(scope, element, attr){
            scope.$watch(attr.watch, function(){
                element.trigger('chosen:updated');
            });
            element.chosen({height: "120%"});
        };

        return {
            restrict: 'A',
            link: linker
        };
    });
