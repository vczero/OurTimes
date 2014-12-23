
app.controller('EmailController', function($scope, $rootScope, $http, $timeout, $cookieStore, ServiceConfig) {
	var user = $cookieStore.get('user');
	var width = window.innerWidth;
	//控制按钮选中状态
	$rootScope.select_user = 'menu_unselect';
	$rootScope.select_article = 'menu_unselect';
	$rootScope.select_weibo = 'menu_unselect';
	$rootScope.select_qita = 'menu_select';
	$rootScope.select_login = 'menu_unselect';
	
	$scope.postEmail = function(email){
		var data = {
			token: user.token,
			email: email
		};
		
		$http.post(ServiceConfig.email_findPassword, data).success(function(data){
			if(data.status){
				Tip.setTip(250, (parseInt(width) - 240) / 2, null, null, 260, 80, '邮件发送成功....', 1);
				$timeout(Tip.hideTip, 3000);
			}else{
				Tip.setTip(250, (parseInt(width) - 240) / 2, null, null, 260, 80, '邮件发送失败....', 1);
				$timeout(Tip.hideTip, 3000);
			}
		});
	};
});