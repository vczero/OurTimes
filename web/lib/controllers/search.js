
app.controller('SearchUserController', function($scope, $http, $cookieStore, $timeout, ServiceConfig){
	var AMap = null;
	var map = null;
	var user = $cookieStore.get('user');
	
	$scope.$on('mapObj', function(e, data){
		AMap = data.AMap;
		map = data.map;
		
		//没有登录的情况下： 初始化地图上的点位
		if(!user || user.tag !== 'BEN'){
			$http.get(ServiceConfig.user_common).success(function(data){
				 if(data.status && data.user.length){
	                var users = data.user;
	                //清空几个字段
	                $scope.realname = '';
	                $scope.tel = '';
	                $scope.job = '';
	                if(users.length){
	                	$scope.avatar = users[0].avatar;
	                	$scope.nickname = (users[0].nickname || '').substr(0, 11);
	                	$scope.jobAddress = (users[0].address || '').substr(0, 11);
	                	$scope.hometown = (users[0].hometown || '').substr(0, 11);
	                	$scope.sign = (users[0].sign || '').substr(0, 11);
	                }else{
	                	$scope.avatar = 'img/pp.png';
	                	$scope.nickname = '放羊的娃';
	                	$scope.jobAddress = '浙江省 杭州市';
	                	$scope.hometown = '安徽省 安庆市 望江县';
	                	$scope.sign = '梦想还是要有的，万一实现了呢！';
	                }
	                for(var i = 0; i < users.length; i++){
	                    var user = users[i];
	                    var locationArr = user.address_lnglat.split(',');
	                    var marker = new AMap.Marker({
	                        position: new AMap.LngLat(locationArr[0], locationArr[1])
	                    });
	                    marker.setIcon('img/pos.png');
	                    marker.setMap(map);
	                    marker.index = i;
	                    
	                    AMap.event.addListener(marker, 'click', function(e){
	                        var info = users[this.index];
	                        $scope.$apply(function(){
	                        	$scope.nickname =  (info.nickname || '').substr(0, 11);
	                        	$scope.avatar = info.avatar;
	                			$scope.jobAddress = (info.address || '').substr(0, 11);
	                			$scope.hometown = (info.hometown || '').substr(0, 11);
	                			$scope.sign = (info.sign || '').substr(0, 30) || '这家伙很懒，什么都没留下';
	                        });
	                    });
	                }
	            }else{
	                var width = window.innerWidth;
    				Tip.setTip(250, (parseInt(width) - 240)/2, null, null, 260, 80, '地图上的点被谁偷去啦...', 1);
    	    		$timeout(Tip.hideTip, 3000);
	            }
			}).error(function(){
				var width = window.innerWidth;
				Tip.setTip(250, (parseInt(width) - 240)/2, null, null, 260, 80, '服务器君挂了...', 1);
	    		$timeout(Tip.hideTip, 3000);
			});
		}
		//本班用户
		if(user && user.tag === 'BEN'){
			$http.get(ServiceConfig.user_ben).success(function(data){
				 if(data.status && data.user.length){
	                var users = data.user;
	                if(users.length){
	                	$scope.realname = (users[0].realname || '').substr(0, 11);
		                $scope.tel = (users[0].tel || '').substr(0, 11);
		                $scope.job = (users[0].job || '').substr(0, 11);		                
		                $scope.avatar = (users[0].avatar || '').substr(0, 11);
		                $scope.nickname = (users[0].nickname || '').substr(0, 11);
		                $scope.jobAddress = (users[0].address || '').substr(0, 11);
		                $scope.hometown = (users[0].hometown || '').substr(0, 11);
		                $scope.sign = (users[0].sign || '').substr(0, 11);	
	                }else{
	                	$scope.realname = '';
		                $scope.tel = '';
		                $scope.job = '';
		                $scope.avatar = 'img/pp.png';
		                $scope.nickname = '放羊的娃';
		                $scope.jobAddress = '浙江省 杭州市';
		                $scope.hometown = '安徽省 安庆市 望江县';
		                $scope.sign = '梦想还是要有的，万一实现了呢！';
	                }
	                for(var i = 0; i < users.length; i++){
	                    var user = users[i];
	                    var locationArr = user.address_lnglat.split(',');
	                    var marker = new AMap.Marker({
	                        position: new AMap.LngLat(locationArr[0], locationArr[1])
	                    });
	                    marker.setIcon('img/pos.png');
	                    marker.setMap(map);
	                    marker.index = i;

	                    AMap.event.addListener(marker, 'click', function(e){
	                    	var info = users[this.index];
	                    	$scope.$apply(function(){
	                        	$scope.nickname =  (info.nickname || '').substr(0, 11);
	                        	$scope.realname = (info.realname || '').substr(0, 11);
	                        	$scope.tel = info.tel || '';
	                        	$scope.job = (info.job || '').substr(0, 11);
	                        	$scope.avatar = info.avatar;
	                			$scope.jobAddress = (info.address || '').substr(0, 11);
	                			$scope.hometown = (info.hometown || '').substr(0, 11);
	                			$scope.sign = (info.sign || '').substr(0, 30) || '这家伙很懒，什么都没留下';
	                        });
	                    });
	                }
	            }else{
	                var width = window.innerWidth;
    				Tip.setTip(250, (parseInt(width) - 240)/2, null, null, 260, 80, '地图上的点被谁偷去啦...', 1);
    	    		$timeout(Tip.hideTip, 3000);
	            }
			}).error(function(){
				var width = window.innerWidth;
				Tip.setTip(250, (parseInt(width) - 240)/2, null, null, 260, 80, '服务器君挂了...', 1);
	    		$timeout(Tip.hideTip, 3000);
			});
		}
		
	});
	
	//搜索
	$scope.goSearch = function(name){
		//判断当前用户类型，然后根据name 或者真名搜索
	};

});
