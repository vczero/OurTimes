app.controller('SearchUserController', 
['$scope', '$http', '$cookieStore', '$timeout', 'ServiceConfig',
function($scope, $http, $cookieStore, $timeout, ServiceConfig) {
	var AMap = null;
	var map = null;
	var user = $cookieStore.get('user');
	var width = window.innerWidth;

	$scope.$on('mapObj', function(e, data) {
		AMap = data.AMap;
		map = data.map;

		//没有登录的情况下： 初始化地图上的点位
		if (!user || user.tag !== 'ben') {
			$http.get(ServiceConfig.user_common).success(function(data) {
				if (data.status && data.user.length) {
					var users = data.user;
					//清空几个字段
					$scope.realname = '';
					$scope.tel = '';
					$scope.job = '';
					if (users.length) {
						$scope.avatar = users[0].avatar;
						$scope.nickname = getSubStr(users[0].nickname, 11);
						$scope.jobAddress = getSubStr(users[0].address, 11);
						$scope.hometown = getSubStr(users[0].hometown, 11);
						$scope.sign = getSubStr(users[0].sign, 11);
					} else {
						$scope.avatar = 'img/pp.png';
						$scope.nickname = '放羊的娃';
						$scope.jobAddress = '浙江省 杭州市';
						$scope.hometown = '安徽省 安庆市 望江县';
						$scope.sign = '梦想还是要有的，万一实现了呢！';
					}
					for (var i = 0; i < users.length; i++) {
						if(!users[i].address_lnglat){
							continue;
						}
						var user = users[i];
						var locationArr = user.address_lnglat.split(',');
						var marker = new AMap.Marker({
							position: new AMap.LngLat(locationArr[0], locationArr[1])
						});
						marker.setIcon('img/pos.png');
						marker.setMap(map);
						marker.index = i;

						AMap.event.addListener(marker, 'click', function(e) {
							var info = users[this.index];
							$scope.$apply(function() {
								$scope.nickname = getSubStr(info.nickname, 11);
								$scope.avatar = info.avatar;
								$scope.jobAddress = getSubStr(info.address, 11);
								$scope.hometown = getSubStr(info.hometown, 11);
								$scope.sign = getSubStr(info.sign, 30) || '这家伙很懒，什么都没留下';
							});
						});
					}
				} else {
					Tip.setTip(250, (parseInt(width) - 240) / 2, null, null, 260, 80, '地图上的点被谁偷去啦...', 1);
					$timeout(Tip.hideTip, 3000);
				}
			}).error(function() {
				Tip.setTip(250, (parseInt(width) - 240) / 2, null, null, 260, 80, '服务器君挂了...', 1);
				$timeout(Tip.hideTip, 3000);
			});
		}
		//本班用户
		if (user && user.tag === 'ben') {
			$http.get(ServiceConfig.user_ben + '?token=' + user.token).success(function(data) {
				if (data.status && data.users.length) {
					var users = data.users;
					if (users.length) {
						$scope.realname = getSubStr(users[0].realname, 11) || '未知';
						$scope.tel = getSubStr(users[0].tel, 11) || '未知';
						$scope.job = getSubStr(users[0].job, 11) || '未知';
						$scope.avatar = users[0].avatar, 11;
						$scope.nickname = getSubStr(users[0].nickname, 11) || '未知';
						$scope.jobAddress = getSubStr(users[0].address, 11) || '未知';
						$scope.hometown = getSubStr(users[0].hometown, 11) || '未知';
						$scope.sign = getSubStr(users[0].sign, 11) || '未知';
					} else {
						$scope.realname = '';
						$scope.tel = '';
						$scope.job = '';
						$scope.avatar = 'img/pp.png';
						$scope.nickname = '放羊的娃';
						$scope.jobAddress = '浙江省 杭州市';
						$scope.hometown = '安徽省 安庆市 望江县';
						$scope.sign = '梦想还是要有的，万一实现了呢！';
					}
					for (var i = 0; i < users.length; i++) {
						if(!users[i].address_lnglat){
							continue;
						}
						var user = users[i];
						var locationArr = user.address_lnglat.split(',');
						var marker = new AMap.Marker({
							position: new AMap.LngLat(locationArr[0], locationArr[1])
						});
						marker.setIcon('img/pos.png');
						marker.setMap(map);
						marker.index = i;

						AMap.event.addListener(marker, 'click', function(e) {
							var info = users[this.index];
							$scope.$apply(function() {
								$scope.nickname = getSubStr(info.nickname, 11);
								$scope.realname = getSubStr(info.realname, 11);
								$scope.tel = info.tel || '';
								$scope.job = getSubStr(info.job, 11);
								$scope.avatar = info.avatar;
								$scope.jobAddress = getSubStr(info.address, 11);
								$scope.hometown = getSubStr(info.hometown, 11);
								$scope.sign = getSubStr(info.sign, 30) || '这家伙很懒，什么都没留下';
							});
						});
					}
				} else {
					Tip.setTip(250, (parseInt(width) - 240) / 2, null, null, 260, 80, '地图上的点被谁偷去啦...', 1);
					$timeout(Tip.hideTip, 3000);
				}
			}).error(function() {
				Tip.setTip(250, (parseInt(width) - 240) / 2, null, null, 260, 80, '服务器君挂了...', 1);
				$timeout(Tip.hideTip, 3000);
			});
		}

	});

	//搜索
	$scope.goSearch = function(name) {
		//判断当前用户类型，然后根据name 或者真名搜索
		//昵称搜索
		if (!user || user.tag !== 'ben') {
			$http.get(ServiceConfig.user_common_get_nickname + '?nickname=' + name).success(function(data) {
				if (data.status) {
					$scope.avatar = data.avatar;
					$scope.nickname = getSubStr(data.nickname, 11);
					$scope.jobAddress = getSubStr(data.address, 11);
					$scope.hometown = getSubStr(data.hometown, 11);
					$scope.sign = getSubStr(data.sign, 30) || '这个家伙很懒，什么都没留下...';
				} else {
					Tip.setTip(220, null, 50, null, 260, 80, '没有查询到数据.....', 1);
					$timeout(Tip.hideTip, 3000);
				}
			});
		}
		//真名搜索
		if (user && user.tag === 'ben') {
			var url = ServiceConfig.user_ben_get_realname + '?realname=' + name + '&token=' + user.token;
			$http.get(url).success(function(data) {
				if (data.status) {
					$scope.nickname = getSubStr(data.nickname, 11);
					$scope.realname = getSubStr(data.realname, 11);
					$scope.tel = data.tel || '';
					$scope.job = getSubStr(data.job, 11);
					$scope.avatar = data.avatar;
					$scope.jobAddress = getSubStr(data.address, 11);
					$scope.hometown = getSubStr(data.hometown, 11);
					$scope.sign = getSubStr(data.sign, 30) || '这家伙很懒，什么都没留下...';
				} else {
					Tip.setTip(220, null, 50, null, 260, 80, '没有查询到数据.....', 1);
					$timeout(Tip.hideTip, 3000);
				}
			});
		}
	};

	$scope.enterSearch = function($event, name){
		if($event.keyCode === 13 || $event.which === 32){
			$scope.goSearch(name);
		}
	};
	function getSubStr(str, n) {
		return (str || '').substr(0, n);
	}

}]);