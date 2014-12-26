//负责广播地图对象
app.controller('MapController', 
['$scope', '$http', '$cookieStore', 'ServiceConfig',
function($scope, $http, $cookieStore, ServiceConfig) {
	// load map(Blocking)
	$LAB.script(ServiceConfig.amap_url).wait(function() {
		//初始化地图对象
		var random = Math.random(100000000000);
		if (!AMap) {
			location.reload(false);
		}
		var map = new AMap.Map('map', {
			resizeEnable: true,
			zooms: [5, 18]
		});
		map.setZoom(5);
		map.plugin(['AMap.ToolBar'], function() {
			map.addControl(new AMap.ToolBar());
		});
		//第一次：广播地图对象
		$scope.$emit('mapObject', {
			AMap: AMap,
			map: map
		});
		//第二次：每次加载页面，刷新，要不然无法触发marker点加载事件；这就是随机数的妙处
		$scope.$watch(random, function() {
			$scope.$emit('mapObject', {
				AMap: AMap,
				map: map,
				random: random
			});
		});
	});

}]);