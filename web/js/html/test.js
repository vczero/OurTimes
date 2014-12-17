
var app = angular.module('app', ['ui.router']);


app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
	
	$stateProvider
	  .state('contacts', {
	    templateUrl: 'contacts.html',
	    controller: function($scope){
	      $scope.contacts = [{ name: 'Alice' }, { name: 'Bob' }];
	    }
	  })
	  .state('contacts.list', {
	    templateUrl: 'contacts.list.html'
	  });
	function MainCtrl($state){
	  $state.transitionTo('contacts.list');
	}
	
}]);


app.controller('MainCtrl', function(){
	
});
