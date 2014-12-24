app.service('MenuSelect', ['$rootScope',
function($rootScope){
	return {
		setSelected: function(name){
			$rootScope.select_user = 'menu_unselect';
			$rootScope.select_article = 'menu_unselect';
			$rootScope.select_weibo = 'menu_unselect';
			$rootScope.select_email = 'menu_unselect';
			$rootScope.select_login = 'menu_unselect';
			
			if(name){
				$rootScope[name] = 'menu_select';
			}
		}
	}
}]);
