
app.controller('WeiboController', function($http, $scope, ServiceConfig, Time){
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
    
    $scope.zan = function(item){
    	console.log(item);
    };
    
    $scope.comment = function(item){
    	item.isShowComDiv = true;
    };
});
