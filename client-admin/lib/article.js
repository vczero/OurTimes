
app.controller('ArticleController', 
['$scope', '$rootScope', '$timeout', '$http', '$cookieStore', 'ServiceConfig', 'MenuSelect',
function($scope, $rootScope, $timeout, $http, $cookieStore, ServiceConfig, MenuSelect) {
	var user = $cookieStore.get('user');
	var width = window.innerWidth;
	
	MenuSelect.setSelected('select_article');
	
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
}]);