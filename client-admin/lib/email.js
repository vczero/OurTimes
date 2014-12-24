
app.controller('EmailController',
['$scope', '$rootScope', '$http', '$timeout', '$cookieStore', 'ServiceConfig', 'MenuSelect',
function($scope, $rootScope, $http, $timeout, $cookieStore, ServiceConfig, MenuSelect) {
	var user = $cookieStore.get('user');
	var width = window.innerWidth;
	
	MenuSelect.setSelected('select_email');
	
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
}]);