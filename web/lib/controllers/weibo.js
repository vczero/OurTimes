
app.controller('WeiboController', function($http, $scope, $cookieStore, ServiceConfig, Time, WeiboData){
	//初始化微博列表    
    WeiboData.getItems(0, function(data, pageSize){
    	if(data.length){
    		//第一条记录的索引
    		$scope.currentPage = 0;
    		//总页码
    		$scope.pageSize = pageSize;
    		//微博10条记录
    		$scope.items = data;
    	}else{
    		//弹出错误信息
    	}
    });
    
    //对发表微博数据进行管理，置顶新发微博，减去尾部微博
    $scope.$on('weiboDataDown', function(e, data) {
    	$scope.items.unshift(data);   
    	var n = $scope.items.length;
    	if(n > 10){
    		$scope.items = $scope.items.slice(0, 10);
    	}
    });
      
    
    //点赞
    $scope.zan = function(item){
    	var user = $cookieStore.get('user');
    	if(user){
    		var zanToken = 'token=' + user.token,
            	id = '&id=' + item._id,
            	url = 'http://127.0.0.1:3000/wei/zan?' + zanToken + id;
             $http.get(url).success(function(data) {
                if (data.status) {
                    if (data.zans) {
                        item.zans = data.zans;
                        //谢谢您的打赏~~
                    } else {
                        //伦家怎么好意思再收呢！
                    }

                } else {
                    //不好意思，打赏失败了...
                }
            });
    	}else{
    		//请先登录
    	}
    };
    
    //评论框弹出
    $scope.comment = function(item){
    	if(!item.isShowComDiv){
    		item.isShowComDiv = true;
    	}else{
    		item.isShowComDiv = false;
    	}
    };
    //增加评论
    $scope.addComment = function(item, content){
    	var user = $cookieStore.get('user');
    	if(user && content){
    		var commentToken = 'token=' + user.token,
                comment = '&comment=' + content,
                id = '&id=' + item._id,
                url = 'http://127.0.0.1:3000/wei/comment?' + commentToken + comment + id;
            $http.get(url).success(function(data) {
            	if(data.status){
            		item.comments.push({
                        nickname: data.nickname,
                        email: data.email,
                        comment: data.comment,
                        avatar: data.avatar,
                        time: Time.formatTime(data.time)
                    });
                    document.getElementById('postweibo').value = '';
            	}else{
            		//评论失败：服务出现故障
            	}
            });
    	}else{
    		//评论失败：原因未登录 或者内容为空
    	}
    };
    
    
    $scope.prePage = function(){
    	$scope.currentPage = $scope.currentPage - 1;
    	if($scope.currentPage >= 0){
    		WeiboData.getItems($scope.currentPage * 10, function(data){
		    	if(data.length){
		    		$scope.items = data;
		    	}else{
		    		//弹出错误信息
		    	}
		    });
    	}else{
    		//还原点击减量
    		$scope.currentPage = $scope.currentPage + 1;
    		//已经是第一页提醒
    		
    	}
    };
    
     $scope.nextPage = function(){
    	$scope.currentPage = $scope.currentPage + 1;
    	console.log($scope.currentPage);
    	if($scope.currentPage < $scope.pageSize){
    		WeiboData.getItems($scope.currentPage * 10, function(data){
		    	if(data.length){
		    		$scope.items = data;
		    	}else{
		    		//弹出错误信息
		    	}
		    });
    	}else{
    		//还原点击增量
    		$scope.currentPage = $scope.currentPage -1;
    		//已是最后一页提醒
    	}
    	
    };
});
