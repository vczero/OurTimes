var app = angular.module('app', []);

console.log(document.cookie);

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
	//获取token
	var token = document.cookie.split(';')[0].split('=')[1];

	//初始化显示微内容列表
	function initItems(callback){
		$http.get('http://127.0.0.1:3000/wei/get').success(function(data){
		if(data.status){
				for(var i = 0, len = data.items.length; i < len; i++){
					var item = data.items[i],
						comments = item.comments;
					item.time = new Date(item.time).toDateString();
					for(var j = 0, jl = comments.length; j < jl; j++){
						comments[j].time = new Date(comments[j].time).toDateString();
					}
				}
				$scope.items = data.items;
				
				setTimeout(callback, 50);
			}
		});
	}
	
	initItems(function(){
		var commentDiv = document.getElementsByClassName('item_comment');
		for(var i = 0; i < commentDiv.length; i++){
			commentDiv[i].style.display = 'none';
		}
	});
	
	//点赞功能
	$scope.zan = function(index){
		if(document.cookie.indexOf('token=') > -1){
			var zanToken = 'token=' + token;
			var id = '&id=' + $scope.items[index]._id;
			var url = 'http://127.0.0.1:3000/wei/zan?' + zanToken + id; 
			$http.get(url).success(function(data){
				if(data.status){
					$scope.items[index].zans = data.zans;
					alert('谢谢您的打赏~~');
				}else{
					alert('打赏失败~~');
				}
			});
		}else{
			alert('请先登录');
		}
	};
	
	//评论
	$scope.comment = function(index){
		if(document.cookie.indexOf('token=') > -1){
			var input = document.getElementsByClassName('item_comment_input')[index];
			var text = input.value;
			if(!text || !text.trim()){
				return alert('评论不允许为空');
			};
			var commentToken = 'token=' + token;
			var comment = '&comment=' + text;
			var id = '&id=' + $scope.items[index]._id;
			var url = 'http://127.0.0.1:3000/wei/comment?' + commentToken + comment + id;
			$http.get(url).success(function(data){
				if(data.status){
					$scope.items[index].comments.push({
						nickname: data.nickname,
						email: data.email,
						comment: data.comment,
						time: new Date(data.time).toLocaleString()
					});
					input.value = '';
//					alert('评论成功');
				}else{
					alert('评论失败');
				}
			});
		}else{
			alert('请先登录');
		}
	};
	
	$scope.showComment = function(index){
		var commentDiv = document.getElementsByClassName('item_comment');
		for(var i = 0; i < commentDiv.length; i++){
			commentDiv[i].style.display = 'none';
		}
		console.log(commentDiv[index]);
		commentDiv[index].style.display = 'block';
		commentDiv[index].className = 'item_comment';
	};
	
	$scope.postWei = function(){
		document.getElementById('postDiv').style.visibility = 'visible';
	};
	
	$scope.createWei = function(){
		var content = document.getElementById('postContent').value;
		var data = {
			token: token,
			content: content,
			tags:'打工,吱吱'
		};
		
		$http.post('http://127.0.0.1:3000/wei/create', data).success(function(data){
			if(data.status){
				initItems(function(){
					var commentDiv = document.getElementsByClassName('item_comment');
					for(var i = 0; i < commentDiv.length; i++){
						commentDiv[i].style.display = 'none';
					}
					document.getElementById('postDiv').style.visibility = 'hidden';
				});
			}else{
				alert('发表失败');
			}
		});
	};
	
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


