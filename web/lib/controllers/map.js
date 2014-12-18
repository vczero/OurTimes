
app.controller('MapController', function(){
	// load map(Blocking)
	$LAB.script('http://webapi.amap.com/maps?v=1.3&key=ad925c5003760094713775d64748d872&callback=init').wait(function(){
		if(!AMap){
			location.reload(false);
		}
		var map = new AMap.Map('map', {
			resizeEnable: true,
			zooms: [5, 18]
		});
		map.setZoom(5);
		map.plugin(['AMap.ToolBar'], function(){
		    map.addControl(new AMap.ToolBar());
		});
	});
});
