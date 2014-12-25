
app.controller('UcUserController', function($http, $cookieStore, $scope, $timeout){
	var user = $cookieStore.get('user');
	$scope.user = user;
	
	$scope.changePassword = function(uc){
		if(uc){
			var old = uc.oldPassword;
			var newP = uc.newPassword;
			var reP = uc.rePassword;
			if(newP !== reP || !newP || !reP || !old){
				Tip.setTip(250, null, 150, null, 260, 80, '密码不一致或者没有输入密码', 1);
	        	$timeout(Tip.hideTip, 3000);
			}else{
				var data = {
					token: user.token,
					oldPassword: old,
					newPassword: newP,
					rePassword: reP
				};
			}
		}else{
			Tip.setTip(250, null, 150, null, 260, 80, '信息不能为空...', 1);
	        $timeout(Tip.hideTip, 3000);
		}
		
	};
});
