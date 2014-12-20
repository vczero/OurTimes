
app.controller('UserInfoController', function($scope, $http, $timeout, $cookieStore, ServiceConfig){
	var AMap = null;
	var map = null;
	var width = window.innerWidth;
    var user = $cookieStore.get('user');
	
	$scope.$on('mapObj', function(e, data){
		AMap = data.AMap;
		map = data.map;
	});

    //初始化，显示用户信息
    if(user){
        $http.get(ServiceConfig.user_self + '?token=' + user.token).success(function(data) {
            if(data.status){
                $scope.user = data;
            }else{
                $scope.user = {
			    	avatar: 'img/avat.jpg'
			    };
            }
        }).error(function(){
        	$scope.user = {
		    	avatar: 'img/avat.jpg'
		    };
            Tip.setTip(250, (parseInt(width) - 240)/2, null, null, 260, 80, '哎呀，服务君开小差去了....', 1);
            $timeout(Tip.hideTip, 3000);
        });
    }else{
    	$scope.user = {
	    	avatar: 'img/avat.jpg'
	    };
    }
	
	//地图选点，选择故乡
	$scope.mapHometown = function(){
		var marker = new AMap.Marker({
            position: map.getCenter(),
            draggable: true,
            map: map
        });
        marker.setIcon('img/home.png');
        
        AMap.event.addListener(marker, 'dragend', function(e){
            map.plugin(['AMap.Geocoder'], function(){
                var geo = new AMap.Geocoder();
                var hometown_lnglat = e.lnglat;
                geo.getAddress(hometown_lnglat, function(status, result){
                	if(status === 'complete' && result.info === 'OK'){
                		var address = result.regeocode.formattedAddress;
                		$scope.$apply(function(){
                			$scope.user.hometown = address;
                            $scope.user.hometown_lnglat = hometown_lnglat;
                		});
                	}else{
						Tip.setTip(250, 50, null, null, 260, 80, '地址解析失败..........', 1);
    					$timeout(Tip.hideTip, 3000);
                	}
                });    
            });
        });
	};
	
	//工作地选点
	$scope.mapAddress = function(){
		var marker = new AMap.Marker({
            position: map.getCenter(),
            draggable: true,
            map: map
        });
        marker.setIcon('img/address.png');

        AMap.event.addListener(marker, 'dragend', function(e){
            map.plugin(['AMap.Geocoder'], function(){
                var geo = new AMap.Geocoder();
                address_lnglat = e.lnglat;
                geo.getAddress(address_lnglat, function(status, result){
                	if(status === 'complete' && result.info === 'OK'){
                		var address = result.regeocode.formattedAddress;
                		$scope.$apply(function(){
                			$scope.user.address = address;
                            $scope.user.address_lnglat = address_lnglat;
                		});
                	}else{
						Tip.setTip(250, 50, null, null, 260, 80, '地址解析失败..........', 1);
    					$timeout(Tip.hideTip, 3000);
                	}
                });
            });
        });
	};
	
    //保存用户信息
    $scope.save = function(user){
        var obj = {
            token: user.token,
            nickname: user.nickname,
            realname: user.realname,
            tel: user.tel,
            hometown: user.hometown,
            job: user.job,
            address: user.address,
            sign: user.sign,
            hometown_lnglat: user.hometown_lnglat,
            address_lnglat:  user.address_lnglat
        };
        
        if(user.tag === '游客'){
            $http.post(ServiceConfig.user_common_update, obj).success(function(data) {
                if(data.status){
                    Tip.setTip(250, 50, null, null, 260, 80, '您好！你的资料保存成功', 1);
                    $timeout(Tip.hideTip, 3000);
                }else{
                    Tip.setTip(250, 50, null, null, 260, 80, '不好意思,你的资料保存失败', 1);
                    $timeout(Tip.hideTip, 3000);
                }
            });
        }
        if(user.tag === '本班'){
            $http.post(ServiceConfig.user_ben_update, obj).success(function(data) {
                if(data.status){
                    Tip.setTip(250, 50, null, null, 260, 80, '您好！你的资料保存成功', 1);
                    $timeout(Tip.hideTip, 3000);
                }else{
                    Tip.setTip(250, 50, null, null, 260, 80, '不好意思,你的资料保存失败', 1);
                    $timeout(Tip.hideTip, 3000);
                }
            });
        }

    };
	
	//打开上传窗口
    $scope.upload = function(){
        if(user && user.token){
            document.getElementById('uploadImg').click();
            document.getElementById('selfToken').value = user.token;
        }else{
            Util.alertForm('您好！请登录..........'); 
        }  
    }
    
});
