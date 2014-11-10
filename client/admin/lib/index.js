var app = angular.module('app', []);
app.config(['$httpProvider', function($httpProvider){
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
	$httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.transformRequest = [function(data) {
  		var obj = [];
  		for(var key in data){
  			obj.push(key + '=' + data[key]);
  		}
  		return obj.join('&');
  	}];
	 
}]);

app.controller('UserController', function($scope, $http){
	$http.get('http://127.0.0.1:3000/user/getAll?token=5460bd81250a3020243af1ab').success(function(data){
		console.log(data);
		$scope.datas = data.items;
		
	});
	
});
