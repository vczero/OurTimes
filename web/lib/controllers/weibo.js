
app.controller('WeiboController', function($http, $scope, $cookieStore, ServiceConfig, Time){
	//初始化微博列表
	$http.get(ServiceConfig.wei_content).success(function(data) {
        if(data.status){
        	var items = data.items;
        	for(var i = 0; i < items.length; i++){
        		items[i].time = Time.formatTime(items[i].time);
        		items[i].isShowComDiv = false;
        		var comments = items[i].comments;
        		for(var j = 0; j < comments.length; j++){
        			items[i].comments[j].time = Time.formatTime(items[i].comments[j].time);
        		}
        	}
        	$scope.items = items;
        }else{
        	//弹出框 服务不可用
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
                    //这一块需要清除文本框内容
            	}else{
            		//评论失败：服务出现故障
            	}
            });
    	}else{
    		//评论失败：原因未登录 或者内容为空
    	}
    };
});
