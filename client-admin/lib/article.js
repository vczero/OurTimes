
app.controller('ArticleController', function($scope, $rootScope, $timeout, $http, $cookieStore, ServiceConfig) {
	var user = $cookieStore.get('user');
	var width = window.innerWidth;
	
	//控制按钮选中状态
	$rootScope.select_user = 'menu_unselect';
	$rootScope.select_article = 'menu_select';
	$rootScope.select_weibo = 'menu_unselect';
	$rootScope.select_qita = 'menu_unselect';
	$rootScope.select_login = 'menu_unselect';
	
	$scope.author = '';
	
	$scope.submit = function(title, author, link, ref, content){
		var article = {
			token: user.token,
			title: title || '',
			author: author || '',
			link: link || '',
			ref: ref || '',
			content: content || []
		};
		
		$http.post(ServiceConfig.article_create, article).success(function(data){
			console.log(data);
			if(data.status){
				$scope.author = '';
				$scope.title = '';
				$scope.author = '';
				$scope.ref = '';
				$scope.link = '';
				$scope.content = '';
				
				Tip.setTip(250, (parseInt(width) - 240) / 2, null, null, 260, 80, '文章发表成功....', 1);
				$timeout(Tip.hideTip, 3000);
			}else{
				Tip.setTip(250, (parseInt(width) - 240) / 2, null, null, 260, 80, '文章发表失败....', 1);
				$timeout(Tip.hideTip, 3000);
			}
		});
	};
});