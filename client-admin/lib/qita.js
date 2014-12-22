
app.controller('QitaController', function($scope, $rootScope, $http, $cookieStore, ServiceConfig) {
	//控制按钮选中状态
	$rootScope.select_user = 'menu_unselect';
	$rootScope.select_article = 'menu_unselect';
	$rootScope.select_weibo = 'menu_unselect';
	$rootScope.select_qita = 'menu_select';
	$rootScope.select_login = 'menu_unselect';
});