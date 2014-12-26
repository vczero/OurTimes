
app.controller('UcWeiboController', 
['$scope', '$http', '$cookieStore', '$timeout', 'ServiceConfig', 'Time', 'SelfWeibo',
function($scope, $http, $cookieStore, $timeout, ServiceConfig, Time, SelfWeibo){
	//显示用户以前发表的微博
	var user = $cookieStore.get('user');
	var width = window.innerWidth;
	if(!user){
		Tip.setTip(250, (parseInt(width) - 240) / 2, null, null, 260, 80, '请先登录您的账号~~~~', 1);
        $timeout(Tip.hideTip, 3000);
        return;
	}
	
	var path = '?token=' + user.token + '&page=0';
	var page = 0;
	
	SelfWeibo.getData(user.token, 0, function(data){
		if(data.status){
			$scope.pages = data.pageSize;
			$scope.items = data.items;
		}
	});

	//wei_delete
	$scope.deleteWeibo = function($index){
		var _id = $scope.items[$index]._id;
		var data = {
			token: user.token,
			_id: _id
		};
		$http.post(ServiceConfig.wei_delete, data).success(function(data){
			if(data.status){
				$scope.items = $scope.items.slice(1);
				Tip.setTip(250, (parseInt(width) - 240) / 2, null, null, 260, 80, '删除一条微博成功...', 1);
            	$timeout(Tip.hideTip, 3000);
			}else{
				Tip.setTip(250, (parseInt(width) - 240) / 2, null, null, 260, 80, '删除一条微博失败...', 1);
            	$timeout(Tip.hideTip, 3000);
			}
		});
	};
	//上一页
	$scope.prePage = function(){
		page = page -1;
		if(page >= 0){
			SelfWeibo.getData(user.token, page, function(data){
				if(data.status){
					$scope.items = data.items;
				}
			});
		}else{
			page = 0;
			Tip.setTip(250, (parseInt(width) - 240) / 2, null, null, 260, 80, '已经是第一页...', 1);
        	$timeout(Tip.hideTip, 3000);
		}
	};
	//下一页
	$scope.nextPage = function(){
		page = page + 1;
		if(page < $scope.pages){
			SelfWeibo.getData(user.token, page, function(data){
				if(data.status){
					$scope.items = data.items;
				}
			});
		}else{
			page = $scope.pages - 1;
			Tip.setTip(250, (parseInt(width) - 240) / 2, null, null, 260, 80, '已经是最后一页...', 1);
        	$timeout(Tip.hideTip, 3000);
		}
	};
}]);
