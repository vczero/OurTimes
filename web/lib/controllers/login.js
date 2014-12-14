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
				document.cookie = 'user=' + JSON.stringify(data) + ' ;path=/';
				location.href = './../index/index.html';
			}else{
				alert('登录失败');
			}
		});
	};
});

