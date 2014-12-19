app.controller('PostWeiboController', function($http, $scope, $cookieStore, ServiceConfig){
	$scope.isShowPanel = false;
	
	//控制发表微博的panel显示与隐藏
	$scope.show = function(){
		if($scope.isShowPanel){
			$scope.isShowPanel = false;
		}else{
			$scope.isShowPanel = true;
		}
	};
	//发表微博
	$scope.submit = function(content, tag1, tag2, tag3){		
		var content = content,
		    user = $cookieStore.get('user'),
		    tagArr = [tag1, tag2,tag3],
		    tags = [];
		if(!content){
			//弹出提示，发表的内容不能为空
			return '';
		}
		if(!user){
			//弹出提示，请先登录
			return '';
		}
		for(var tag in tagArr){
			if(tagArr[tag])
				tags.push(tagArr[tag]);
		}
		
		var data = {
            token: user.token,
            content: content,
            tags: tags.join(',')
        };
        
        $http.post(ServiceConfig.wei_create, data).success(function(data){
        	if(data.status){
        		$scope.$emit('weiboDataUp', data);
        		$scope.isShowPanel = false;
        	}else{
        		
        	}
        });
	};
	

});
