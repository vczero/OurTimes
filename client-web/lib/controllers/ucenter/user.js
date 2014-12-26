
app.controller('UcUserController', 
['$http', '$cookieStore', '$scope', '$timeout', 'ServiceConfig',
function($http, $cookieStore, $scope, $timeout, ServiceConfig){
	var user = $cookieStore.get('user');
	if(!user){
		return;
	}
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
				$http.post(ServiceConfig.user_update_password, data).success(function(data){
					if(data.status){
						Tip.setTip(250, null, 150, null, 260, 80, '更改密码成功...', 1);
	        			$timeout(Tip.hideTip, 3000);
					}else{
						Tip.setTip(250, null, 150, null, 260, 80, '更改密码失败...', 1);
	        			$timeout(Tip.hideTip, 3000);
					}
				});
			}
		}else{
			Tip.setTip(250, null, 150, null, 260, 80, '信息不能为空...', 1);
	        $timeout(Tip.hideTip, 3000);
		}
		
	};
}]);
