/* global angular  */

angular.module('ezApp')
	.controller('TodoCtrl', function ($scope, $firebase, $state, $interval, Auth, Todos, Session) {
	'use strict';

  $scope.archivedTodos = [];
  $scope.employees = [];

   $scope.priorities = [
    { label: 'A'},
    { label: 'B'},
    { label: 'C'},
    { label: 'D'}
  ];

  $scope.timeTypes = [
    { label: 'Minutes' },
    { label: 'Hours' },
    { label: 'Days' },
    { label: 'Weeks' }
  ];
  $scope.selectedTimeType = $scope.timeTypes[0];

  $scope.selectedPriority = $scope.priorities[0];
 
  $scope.addTodo = function() {
      var todo = { text:$scope.todoText, done:false, employee: { id:$scope.employee.id, name:$scope.employee.name}, $priority:$scope.selectedPriority.label, archive:false, duration:$scope.duration, timeType:$scope.selectedTimeType.label};
    $scope.todos.$add(todo);
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
    angular.forEach($scope.todos.$getIndex(), function (index) {
      if ($scope.todos[index]){
        count += $scope.todos[index].done && !$scope.todos[index].archive ? 1 : 0;
      }

    });
    return count;
  };

  $scope.todoChanged = function(id){
    $scope.todos.$save(id);
  };

  $scope.getOpenTodos = function(){
    $scope.openTodos = [];
    angular.forEach($scope.todos.$getIndex(), function (index){
      if ($scope.todos[index]) {
        if (!$scope.todos[index].archive)
        {
          var todo = $scope.todos[index];
          todo.id = index;
          $scope.openTodos.push(todo);
        }
      }
    });
    return $scope.openTodos;
  };

  $scope.getArchivedTodos = function(){
    $scope.archivedTodos = [];
    angular.forEach($scope.todos.$getIndex(), function(index){
      if ($scope.todos[index]) {
        if ($scope.todos[index].archive)
        {
          var todo = $scope.todos[index];
          todo.id = index;
          $scope.openTodos.push(todo);
        }
      }
    });
    return $scope.archivedTodos;
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

  if (Session.storeSelected)
    $scope.todos = Todos.getTodos(Session.storeSelected);
  Session.storeSelected = function(id){
    $scope.employees = [];
    $scope.todos = Todos.getTodos(id);
    Session.getEmployees(id, function(list){
      angular.forEach(list.$getIndex(), function (index){
        $scope.employees.push(list[index]);
      });
    });
  };

  $scope.viewableUsers = Session.getViewableUsers();

  $scope.editingTodo = {};

  $scope.toggleEditMode = function(todo){
    if ($scope.editingTodo === todo)
      $scope.editingTodo = {};
    else
      $scope.editingTodo = todo;
  }

  $scope.getEditButtonClass = function(todo){
    return ($scope.editingTodo === todo) ? 'ok' : 'pencil';
  }

  $scope.showReadOnly = function (todo){
    return (todo !== $scope.editingTodo);
  }

  $scope.showEditing = function (todo){
    return (todo === $scope.editingTodo);
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
