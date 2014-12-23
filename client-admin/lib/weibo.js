
app.controller('WeiboController', function($scope, $rootScope, $http, $cookieStore, $timeout, ServiceConfig) {
	var user = $cookieStore.get('user');
	var width = window.innerWidth;
	//控制按钮选中状态
	$rootScope.select_user = 'menu_unselect';
	$rootScope.select_article = 'menu_unselect';
	$rootScope.select_weibo = 'menu_select';
	$rootScope.select_qita = 'menu_unselect';
	$rootScope.select_login = 'menu_unselect';
	
	$scope.email = '';
	
	$scope.search = function(email, nickname, realname, keyweords){
		var condition = '';
		if(email){
			condition = '?email=' + email;
		}
		if(nickname){
			condition = '?nickname=' + nickname;
		}
		if(realname){
			condition = '?realname=' + realname;
		}
		if(keyweords){
			condition = '?content=' + keyweords;
		}
		$http.get(ServiceConfig.weibo_getByCondition + condition).success(function(data){
			$scope.weiboObj = JSON.stringify(data);
		});
	};
	
	$scope.modify = function(){
		var data = {
			token: user.token,
			_id: JSON.parse($scope.weiboObj)._id
		};

		$http.post(ServiceConfig.weibo_set2null, data).success(function(data){
			if(data.status){
				Tip.setTip(250, (parseInt(width) - 240) / 2, null, null, 260, 80, '微博置空成功....', 1);
				$timeout(Tip.hideTip, 3000);
			}else{
				Tip.setTip(250, (parseInt(width) - 240) / 2, null, null, 260, 80, '微博置空失败....', 1);
				$timeout(Tip.hideTip, 3000);
			}
		});
	};
});