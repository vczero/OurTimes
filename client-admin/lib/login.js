
app.controller('LoginController',
['$scope', '$http', '$rootScope', '$cookieStore', '$timeout', '$location', 'ServiceConfig', 
function($scope, $http, $rootScope, $cookieStore, $timeout, $location, ServiceConfig) {
	$scope.login = function() {
		var email = $scope.email,
			password = $scope.password,
			data = {
				'email': email,
				'password': password
			};
		$http.post(ServiceConfig.user_login, data).success(function(data) {
			if (data.status) {
				$cookieStore.put('user', data);
				$location.path('/index/user');
			} else {
				var width = window.innerWidth;
				Tip.setTip(250, (parseInt(width) - 240) / 2, null, null, 260, 80, '难倒你忘记了密码...', 1);
				$timeout(Tip.hideTip, 3000);
			}
		}).error(function() {
			var width = window.innerWidth;
			Tip.setTip(250, (parseInt(width) - 240) / 2, null, null, 260, 80, '服务君该回家养老了...', 1);
			$timeout(Tip.hideTip, 3000);
		});
	};

	$scope.goRegister = function() {
		$location.path('/register');
	};
}]);