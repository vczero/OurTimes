app.controller('RegisterController', 
['$scope', '$http', '$cookieStore', '$timeout', '$location', 'ServiceConfig',
function($scope, $http, $cookieStore, $timeout, $location, ServiceConfig) {

	$scope.register = function() {
		var email = $scope.email,
			password = $scope.password,
			repeatpassword = $scope.re_password,
			width = window.innerWidth;

		if (!email || !password || !repeatpassword) {
			Tip.setTip(250, (parseInt(width) - 240) / 2, null, null, 260, 80, '邮箱、密码不能为空....', 1);
			$timeout(Tip.hideTip, 3000);
			return;
		}
		if (password !== repeatpassword) {
			Tip.setTip(250, (parseInt(width) - 240) / 2, null, null, 260, 80, '两次输入密码不一致呀~~', 1);
			$timeout(Tip.hideTip, 3000);
			return;
		}

		var data = {
			'email': email,
			'password': password,
			'repeatPassword': repeatpassword
		};

		$http.post(ServiceConfig.user_register, data).success(function(data) {
			if (data.status) {
				$cookieStore.put('user', data);
				$location.path('/');
			} else {
				Tip.setTip(250, (parseInt(width) - 240) / 2, null, null, 260, 80, '注册失败，请重试~~', 1);
				$timeout(Tip.hideTip, 3000);
			}
		}).error(function() {
			Tip.setTip(250, (parseInt(width) - 240) / 2, null, null, 260, 80, '服务君感冒了，紧急修复中...', 1);
			$timeout(Tip.hideTip, 3000);
		});
	};

	$scope.goLogin = function() {
		$location.path('/login');
	};

}]);