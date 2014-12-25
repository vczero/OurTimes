app.controller('ArticleDetailController', function($scope, $http, $location, ServiceConfig, Time){
	//初始化显示我想成为路边鼓掌的人
	if($location.path() === '/article'){
		var path = '?_id=549c2c9a019ed08429e9fad8';
		$http.get(ServiceConfig.article_detail + path).success(function(data){
			if(data.status){
				data.time = Time.formatTime(data.time);
				$scope.article = data;
			}
		});
	}
	
	if($location.path().split('article/').length === 2){
		var _id = $location.path().split('article/')[1];
		var path = '?_id=' + _id;
		$http.get(ServiceConfig.article_detail + path).success(function(data){
			if(data.status){
				data.time = Time.formatTime(data.time);
				$scope.article = data;
			}
		});
	}
});
