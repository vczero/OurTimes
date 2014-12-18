app.controller('RegisterController', function($scope, $http, $cookieStore, $location, ServiceConfig){
	
	$scope.register = function(){
		var email = $scope.email,
			password = $scope.password,
			repeatpassword = $scope.re_password;

		if(!email || !password || !repeatpassword){
			return alert('不能为空');
		}
		if(password !== repeatpassword){
			return alert('输入的密码不一致');
		}
		
		var data = {
			'email': email,
			'password': password,
			'repeatPassword': repeatpassword
		};
		
		$http.post(ServiceConfig.user_register, data).success(function(data){
			if(data.status){
				$cookieStore.put('user', data);
				console.log(data);
				$location.path('#/');
			}else{
				alert('注册失败，请重试');
			}
		});
	};

});