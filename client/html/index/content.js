var app = angular.module('app', []);
app.controller('ContentController', function($scope, $http){
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

