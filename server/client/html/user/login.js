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

app.controller('LoginController', function($scope, $http){
	$scope.login = function(){
		var email = $scope.email,
			password = $scope.password,
			data = {
				'email': email,
				'password': password
			};
		$http.post('http://127.0.0.1:3000/user/login', data).success(function(data){
			if(data.status){
				document.cookie = 'token=' + escape(data.token) + ' ;path=/';
				document.cookie = 'userid=' + escape(data.userid) + ' ;path=/';
				location.href = './../index/index.html';
			}else{
				alert('登录失败');
			}
		});
	};
});
