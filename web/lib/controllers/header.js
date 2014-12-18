
app.controller('HeaderController', function($scope, $cookieStore){
	var user = $cookieStore.get('user');
	$scope.isLogined = false;
	if(user){
		$scope.isLogined = true;
		$scope.username = user.realname || user.nickname || user.email;
	}
	
	//清除cookie，退出当前登录
	$scope.quit = function(){
		$cookieStore.put('user', null);
		//刷新页面
		window.location.reload(false);
	};
});
