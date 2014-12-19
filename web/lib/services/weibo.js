

app.service('WeiboData', function($http, Time, ServiceConfig){
    return {
    	getItems: function(callback){
    		$http.get(ServiceConfig.wei_content).success(function(data) {
    			var items = [];
		        if(data.status){
		        	items = data.items;
		        	for(var i = 0; i < items.length; i++){
		        		items[i].time = Time.formatTime(items[i].time);
		        		items[i].isShowComDiv = false;
		        		var comments = items[i].comments;
		        		for(var j = 0; j < comments.length; j++){
		        			items[i].comments[j].time = Time.formatTime(items[i].comments[j].time);
		        		}
		        	}
		        	items = items;
		        }
		        this._items = items;
		        callback(_items);
		    });
    	},
    	
    	_items: '',
    	setItem: function(item){
    		console.log(this._items);
    		this._items[0] = item;
    	}
    	
    };
});
