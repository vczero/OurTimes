

app.controller('ArticleController', function($http, $scope, ServiceConfig){
	$http.get(ServiceConfig.article_get).success(function(data){
		if(data.status){
			$scope.items = data.items;
		}
	});
});
