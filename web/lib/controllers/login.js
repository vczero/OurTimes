
//这里需要将type=email，起到过滤作用
app.controller('LoginController', function($scope, $http, $cookieStore, $location, ServiceConfig){
	$scope.isENull = false;
	$scope.isPNull = false;
	
	$scope.login = function(){
		var email = $scope.email,
			password = $scope.password,
			data = {
				'email': email,
				'password': password
			};
		if(email){
			$scope.isENull = false;
		}
		if(password){
			$scope.isPNull = false;
		}
		if(!email){
			$scope.isENull = true;
		}
		if(!password){
			$scope.isPNull = true;
		}
		$http.post(ServiceConfig.user_login, data).success(function(data){
			if(data.status){
				$cookieStore.put('user', data);
				$location.path('#/');
			}else{
				//登录失败
			}
		});
	};
});

