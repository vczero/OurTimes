
app.controller('WeiboController', function($scope, $rootScope, $http, $cookieStore, ServiceConfig) {
	var user = $cookieStore.get('user');
	//控制按钮选中状态
	$rootScope.select_user = 'menu_unselect';
	$rootScope.select_article = 'menu_unselect';
	$rootScope.select_weibo = 'menu_select';
	$rootScope.select_qita = 'menu_unselect';
	$rootScope.select_login = 'menu_unselect';
	
	
	$scope.search = function(){
		
	};
});