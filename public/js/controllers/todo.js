/* global angular  */

angular.module('ezApp')
	.controller('TodoCtrl', function ($scope, $firebase, $state, $interval, Auth, Todos, Session) {
	'use strict';

        var currentUser = Session.getCurrentUser();
        currentUser.then(function (user){
            if (user) {
                //loadDataForUser(user.id);
            }
        });

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

        $scope.timeTypes = [
            'Minutes',
            'Hours',
            'Days',
            'Weeks'
        ];

        $scope.selectedTimeType = $scope.timeTypes[0];


        $scope.addTodo = function() {

            var selectedEmployeeAccount;
            var userEmployeeAccount;
            var callbacks = 0;

            Session.getEmployeeAccount(Session.user.id, function(emp){
                callbacks++;
                userEmployeeAccount = emp;
                if (callbacks == 2)
                    addTodo();
            })
            Session.getEmployeeAccount(Session.storeSelectedId, function(emp){
                callbacks++;
                selectedEmployeeAccount = emp;
                if (callbacks == 2)
                    addTodo();
            })
            function addTodo(){
                var markerColor = null;
                if (selectedEmployeeAccount.id !== userEmployeeAccount.id && userEmployeeAccount.markerColor){
                    markerColor = userEmployeeAccount.markerColor;
                    $scope.todoText += ' (From: ' + userEmployeeAccount.firstname.substring(0, 1).toUpperCase() + userEmployeeAccount.lastname.substring(0, 1).toUpperCase() + ')';
                }
                Todos.addTodo(Session.storeSelectedId, $scope.todoText, $scope.employee, $scope.selectedPriority.label, $scope.duration, $scope.selectedTimeType, markerColor);
                $scope.todoText = '';
            }

        };


        $scope.remaining = function() {
            var count = 0;
            if ($scope.todos) {
                angular.forEach($scope.todos.$getIndex(), function (index) {
                if ($scope.todos[index])
                    count += $scope.todos[index].done ? 0 : 1;
                });
            }
            return count;
        };

        $scope.total = function() {
            var count = 0;
            if ($scope.todos) {
                angular.forEach($scope.todos.$getIndex(), function (index) {
                    if ($scope.todos[index])
                        if (!$scope.todos[index].archive)
                    count++;
                });
            }
            return count;
        };

        $scope.completed = function() {
            var count = 0;
            if ($scope.openTodos) {
                for (var i = 0; i < $scope.openTodos.length; ++i){
                    if ($scope.openTodos[i].done)
                        count++;
                }
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


        debugger;
        if (Session.storeSelectedId)
            loadDataForUser(Session.storeSelectedId);

        Session.storeSelectedHandler = function(id){
            loadDataForUser(id);
        };

        function loadDataForUser(id){
            $scope.employees = [];
            Todos.loadTodos(id, function (todos){
                $scope.todos = todos;
                $scope.openTodos = $scope.getOpenTodos($scope.todos);
                $scope.archivedTodos = $scope.getArchivedTodos($scope.todos);
            });

            Session.getEmployees(id, function(list){
                var emps = [];
                if (list){
                    angular.forEach(list.$getIndex(), function (index){
                        emps.push(list[index]);
                    });
                }
                debugger;
                $scope.employees = emps;
                if ($scope.employees.length == 0){
                    Session.getEmployeeAccount(id, function (employee){
                        $scope.employee = employee;
                    })
                }
                else {
                    $scope.employees.splice(0, 0, {firstname:'(unassigned)', lastname:''});
                    $scope.employees.splice($scope.employees.length, 0, {firstname:'Trainee 1', lastname:''});
                    $scope.employees.splice($scope.employees.length, 0, {firstname:'Trainee 2', lastname:''});
                    $scope.employees.splice($scope.employees.length, 0, {firstname:'Trainee 3', lastname:''});

                    $scope.employee = $scope.employees[0];
                }
            });
        }


        $scope.editingTodoId = null;

        $scope.toggleEditMode = function(todo){

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

        $scope.showEditing_ForEmployeesDropdown = function(){
            return ($scope.employees.length > 0);
        }

        $scope.showEditing_ForEmployeesLabel = function (){
            return ($scope.employees.length === 0);
        }

        $scope.showNewTaskWindow = function(value){
            $scope.newTaskWindowVisible = value;
        }

        $scope.showEmployeeDropdown = function (){
            return ($scope.employees && $scope.employees.length > 0);
        }

        $scope.getBackgroundColor = function (todo){
            return (todo.markerColor) ? 'background-color: #' + todo.markerColor : '';
        }

    });


angular.module('ezApp')
    .directive('chosen', function(){
    'use strict';

        var linker = function(scope, element, attr){
            scope.$watch(attr.watch, function(){
                element.trigger('chosen:updated');
            });
            element.chosen();
        };

        return {
            restrict: 'A',
            link: linker
        };
    });

angular.module('ezApp')
    .filter('employeeName', function(){
        return function(emp){
            return emp.firstname + ' ' + emp.lastname.substring(0, 1).toUpperCase();
        }
    });
