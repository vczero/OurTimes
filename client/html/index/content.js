var app = angular.module('app', []);
app.config(['$httpProvider', function($httpProvider){
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
	$httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.transformRequest = [function(data) {
  		var obj = [];
  		for(var key in data){
  			obj.push(key + '=' + data[key]);
  		}
  		return obj.join('&');
  	}];
	 
}]);

app.controller('ContentController', function($scope, $http){
	var data = {
		token: '5460bd81250a3020243af1ab',
		content: '一起看烟火',
		tag: ['开森', '美好']
	};
	$http.post('http://127.0.0.1:3000/wei/create', data).success(function(data){
		console.log(data);
	});
	
	$scope.items = [
		{
			content: '我想说，呵呵',
			author: 'vczero',
			time: '2014-09-09',
			tags: '好玩  可爱',
			zan_count: 20,
			comment_cout: 10,
			comments:[
				{
					name: '小蛋',
					comment: '真好',
					time: '2014-09-09'
				},
				{
					name: '小蛋',
					comment: '真好',
					time: '2014-09-09'
				},
				{
					name: '小蛋',
					comment: '真好',
					time: '2014-09-09'
				}
			]
		},
		{
			content: '我想说，呵呵',
			author: 'vczero',
			time: '2014-09-09',
			tags: '好玩  可爱',
			zan_count: 20,
			comment_cout: 10,
			comments:[
				{
					name: '小蛋',
					comment: '真VVVVVVVVVVVVVVVVVVVVV好',
					time: '2014-09-09'
				}
				
			]
		},
		{
			content: '我想说，呵呵',
			author: 'vczero',
			time: '2014-09-09',
			tags: '好玩  可爱',
			zan_count: 20,
			comment_cout: 10
		},
		{
			content: '我想说，呵呵',
			author: 'vczero',
			time: '2014-09-09',
			tags: '好玩  可爱',
			zan_count: 20,
			comment_cout: 10
		}
	];
	
});

app.controller('ArticleController', function($scope, $http){
	$scope.articles = [
		{
			title: '我的特一营'
		},
		{
			title: '我的特一营'
		},
		{
			title: '我的特一营'
		}
	];
});

