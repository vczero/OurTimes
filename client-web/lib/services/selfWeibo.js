//获取微博数据
app.service('SelfWeibo', 
['$http', 'ServiceConfig', 'Time',
function($http, ServiceConfig, Time) {
	return {
		getData: function(token, page, callback) {
			var path = '?token=' + token + '&page=' + page;
			$http.get(ServiceConfig.wei_get_token_page + path).success(function(data) {
				if(data.status){
					var items = data.items;
					for(i in items){
						items[i].time = Time.formatTime(items[i].time);
						for(var j in items[i].comments){
							items[i].comments[j].time = Time.formatTime(items[i].comments[j].time);
						}
					}
				}
				callback(data);
			}).error(function() {
				callback({status: 0});
			});
		}
	};
}]);