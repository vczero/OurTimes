
app.controller('MenuController', [
'$rootScope', '$location',
function($rootScope, $location){
	//menu_select
	//menu_unselect
	//控制按钮选中状态使用rootscope更好！这样，不必监听多处简单变量
	var path = $location.path();
	switch(path){
		case '/index/user':
			$rootScope.select_user = 'menu_select';
			break;
		case '/index/article':
			$rootScope.select_article = 'menu_select';
		    break;
		case '/index/weibo':
			$rootScope.select_weibo = 'menu_select';
		    break;
		case '/index/qita':
			$rootScope.select_qita= 'menu_select';
		    break;
		case '/index/login':
			$rootScope.select_login = 'menu_select';
		    break;
		default:
			break;
	}
}]);
