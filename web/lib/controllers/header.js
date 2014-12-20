
app.controller('HeaderController', function($scope, $cookieStore){
	var user = $cookieStore.get('user');
	$scope.isLogined = false;
	if(user){
		$scope.isLogined = true;
		$scope.username = user.realname || user.nickname || user.email;
	}
	
	//清除cookie，退出当前登录
	$scope.quit = function(){
		$cookieStore.remove('user');
		$scope.isLogined = false;
		$scope.username = '';
	};
});
