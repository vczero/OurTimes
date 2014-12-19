
//这里需要将type=email，起到过滤作用
app.controller('LoginController', function($scope, $http, $cookieStore, $location, ServiceConfig){
	$scope.login = function(){
		var email = $scope.email,
			password = $scope.password,
			data = {
				'email': email,
				'password': password
			};
		$http.post(ServiceConfig.user_login, data).success(function(data){
			if(data.status){
				$cookieStore.put('user', data);
				$location.path('/');
			}else{
				//登录失败
			}
		});
	};
	
	$scope.goRegister = function(){
		$location.path('/register');
	};
});

