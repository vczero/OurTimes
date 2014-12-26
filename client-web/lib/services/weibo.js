//获取微博数据
app.service('WeiboData', 
['$http', 'Time', 'ServiceConfig',
function($http, Time, ServiceConfig) {
	return {
		getItems: function(page, callback) {
			$http.get(ServiceConfig.wei_content + '?page=' + page).success(function(data) {
				var items = [];
				if (data.status) {
					items = data.items;
					for (var i = 0; i < items.length; i++) {
						items[i].time = Time.formatTime(items[i].time);
						items[i].isShowComDiv = false;
						var comments = items[i].comments;
						for (var j = 0; j < comments.length; j++) {
							items[i].comments[j].time = Time.formatTime(items[i].comments[j].time);
						}
					}
					items = items;
				}
				callback(items, data.pageSize);
			}).error(function() {
				callback([], 0);
			});
		}
	};
}]);