
//author vczero
(function(global){
	function setTip(top, left, right, bottom, width, height, content, line){
		if(document.getElementById('__vczero_vczero_tip'))
			return;
    	var div = document.createElement('div');
	    div.style.position = 'fixed';
	    if(typeof top === 'number'){
	    	 div.style.top =  top  + 'px';
	    }
	    if(typeof left === 'number'){
	    	 div.style.left = left + 'px';
	    }
	    if(typeof right === 'number'){
	    	 div.style.right = right + 'px';
	    }
	    if(typeof bottom === 'number'){
	    	 div.style.bottom = bottom + 'px';
	    }
	    
	    
	    div.id = '__vczero_vczero_tip';
	    div.style.zIndex = '100';
	    div.style.height = height + 'px';
	    div.style.width = width + 'px';
	    div.style.backgroundColor ='#000';
	    div.style.opacity = '0.7';
	    div.style.color = '#FFF';
	    div.style.textAlign = 'center';
	    div.style.fontSize = '15px';
	    div.style.lineHeight = height/line + 'px';
	    div.style.borderRadius = '3px';
	    div.innerHTML = content;
	    document.getElementsByTagName('body')[0].appendChild(div);
    }
    
    function hideTip(){
    	var tip = document.getElementById('__vczero_vczero_tip');
    	if(!tip)
    		return;
    	document.querySelector('body').removeChild(tip);
    }
    var Tip = {
    	setTip: setTip,
    	hideTip: hideTip
    }
    
    global.Tip = Tip;
	
})(window);;
var app = angular.module('app', ['ui.router', 'ngCookies']);
var SERVER_BASE_URL = 'http://127.0.0.1:3000/';

//初始化配置
app.run(['$rootScope', function($rootScope) {
    $rootScope.appName = '图班网';
    $rootScope.desc = '基于位置的通讯录';
    $rootScope.author = '鬼谣';
    $rootScope.email = 'wlhmyit@126.com';
}]);



//调用的服务列表
app.constant('ServiceConfig', {
    wei_content: SERVER_BASE_URL + 'wei/get',
    wei_zan: SERVER_BASE_URL + 'wei/zan',
    wei_comment: SERVER_BASE_URL + 'wei/comment',
    wei_create: SERVER_BASE_URL + 'wei/create',
    user_get: SERVER_BASE_URL + 'user/get',
    user_login: SERVER_BASE_URL + 'user/login',
    user_register: SERVER_BASE_URL + 'user/register',
    user_common: SERVER_BASE_URL + 'user/getCommon',
    user_ben: SERVER_BASE_URL + 'user/getBen',
    user_self: SERVER_BASE_URL + 'user/getSelf',
    user_common_update: SERVER_BASE_URL + 'user/updateCommon',
    user_ben_update: SERVER_BASE_URL + 'user/updateBen',
    user_ben_get_name: SERVER_BASE_URL + 'user/singleBen/name',
    user_common_get_nickname: SERVER_BASE_URL + 'user/getCommon/name',
    user_ben_get_realname: SERVER_BASE_URL + 'user/singleBen/name',
    wei_get_token_page: SERVER_BASE_URL + 'wei/getByToken',
    wei_delete: SERVER_BASE_URL + 'wei/delete',
    user_update_password: SERVER_BASE_URL + 'user/updatePassword',
    article_get: SERVER_BASE_URL + 'article/get',
    article_detail: SERVER_BASE_URL + 'article/get/id',
    amap_url: 'http://webapi.amap.com/maps?v=1.3&key=ad925c5003760094713775d64748d872&callback=init'
});


//JSON parse
app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.transformRequest = [function(data) {
        var obj = [];
        for (var key in data) {
            obj.push(key + '=' + data[key]);
        }
        return obj.join('&');
    }];

}]);

//路由配置
app.config(['$stateProvider', '$urlRouterProvider', 
function($stateProvider, $urlRouterProvider) {
    /*URL路由*/
    $urlRouterProvider.otherwise("/");
    /*状态配置*/
    $stateProvider
    //首页
    .state('index', {
        url: '/',
        views: {
            '': {
                templateUrl: 'views/index/index.html',
            },
            'header@index': {
                templateUrl: 'views/header.html',
                controller: 'HeaderController'
            },
            'footer@index': {
                templateUrl: 'views/footer.html',
                controller: ''
            },
            'weibo@index': {
                templateUrl: 'views/index/weibo.html',
                controller: 'WeiboController'
            },
            'article@index': {
                templateUrl: 'views/index/article.html',
                controller: 'ArticleController'
            },
            'post@index': {
                templateUrl: 'views/index/post.html',
                controller: 'PostWeiboController'
            }
        }
    })

    .state('login', {
        url: '/login',
        views: {
            '': {
                templateUrl: 'views/login/login.html',
                controller: 'LoginController'
            }
        }
    })

    .state('register', {
        url: '/register',
        views: {
            '': {
                templateUrl: 'views/register/register.html',
                controller: 'RegisterController'
            }
        }
    })

    .state('contacts', {
        url: '/contacts',
        views: {
            '': {
                templateUrl: 'views/contacts/contacts.html',
                controller: ''
            },
            'header@contacts': {
                templateUrl: 'views/header.html',
                controller: 'HeaderController'
            },
            'userinfo@contacts': {
                templateUrl: 'views/contacts/userinfo.html',
                controller: 'UserInfoController'
            },
            'map@contacts': {
                templateUrl: 'views/contacts/map.html',
                controller: 'MapController'
            },
            'search@contacts': {
                templateUrl: 'views/contacts/search.html',
                controller: 'SearchUserController'
            }
        }
    })
    
    .state('ucenter', {
        url: '/ucenter',
        views: {
            '': {
                templateUrl: 'views/ucenter/ucenter.html',
                controller: ''
            },
            'header@ucenter': {
                templateUrl: 'views/header.html',
                controller: 'HeaderController'
            },
            'userWeibo@ucenter': {
                templateUrl: 'views/ucenter/weibo.html',
                controller: 'UcWeiboController'
            },
            'userDetailInfo@ucenter': {
                templateUrl: 'views/ucenter/user.html',
                controller: 'UcUserController'
            },
            'footer@ucenter': {
                templateUrl: 'views/footer.html',
                controller: ''
            }
        }
    })
    
    .state('article', {
        url: '/article/:id',
        views: {
            '': {
                templateUrl: 'views/article/article.html',
                controller: ''
            },
            'header@article': {
                templateUrl: 'views/header.html',
                controller: 'HeaderController'
            },
            'article_content@article': {
                templateUrl: 'views/article/article_content.html',
                controller: 'ArticleDetailController'
            },
            'footer@article': {
                templateUrl: 'views/footer.html',
                controller: ''
            }
        }
    })
    
    .state('article_index', {
        url: '/article',
        views: {
            '': {
                templateUrl: 'views/article/article.html',
                controller: ''
            },
            'header@article_index': {
                templateUrl: 'views/header.html',
                controller: 'HeaderController'
            },
            'article_content@article_index': {
                templateUrl: 'views/article/article_content.html',
                controller: 'ArticleDetailController'
            },
            'footer@article_index': {
                templateUrl: 'views/footer.html',
                controller: ''
            }
        }
    });


}]);;//获取微博数据
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
}]);;app.service('Time', function() {
	return {
		formatTime: function(date) {
			var time = new Date(date);
			return time.getFullYear() + '-' +
				(parseInt(time.getMonth()) + 1) + '-' +
				time.getDate() + '  ' +
				time.getHours() + ':' +
				time.getMinutes() + ':' +
				time.getSeconds();
		}
	};
});;//获取微博数据
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
}]);;app.controller('ArticleDetailController',
['$scope', '$http', '$location', 'ServiceConfig', 'Time',
function($scope, $http, $location, ServiceConfig, Time){
	//初始化显示我想成为路边鼓掌的人
	if($location.path() === '/article'){
		var path = '?_id=549c2c9a019ed08429e9fad8';
		$http.get(ServiceConfig.article_detail + path).success(function(data){
			if(data.status){
				data.time = Time.formatTime(data.time);
				$scope.article = data;
			}
		});
	}
	
	if($location.path().split('article/').length === 2){
		var _id = $location.path().split('article/')[1];
		var path = '?_id=' + _id;
		$http.get(ServiceConfig.article_detail + path).success(function(data){
			if(data.status){
				data.time = Time.formatTime(data.time);
				$scope.article = data;
			}
		});
	}
}]);
;//负责广播地图对象
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

}]);;app.controller('SearchUserController', 
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

}]);;app.controller('UserInfoController', 
['$scope', '$http', '$timeout', '$cookieStore', 'ServiceConfig',
function($scope, $http, $timeout, $cookieStore, ServiceConfig) {
    var AMap = null;
    var map = null;
    var width = window.innerWidth;
    var user = $cookieStore.get('user');

    $scope.$on('mapObj', function(e, data) {
        AMap = data.AMap;
        map = data.map;
    });

    //初始化，显示用户信息
    if (user) {
        $http.get(ServiceConfig.user_self + '?token=' + user.token).success(function(data) {
            if (data.status) {
                $scope.user = data;
            } else {
                $scope.user = {
                    avatar: 'img/avat.jpg'
                };
            }
        }).error(function() {
            $scope.user = {
                avatar: 'img/avat.jpg'
            };
            Tip.setTip(250, (parseInt(width) - 240) / 2, null, null, 260, 80, '哎呀，服务君开小差去了....', 1);
            $timeout(Tip.hideTip, 3000);
        });
    } else {
        $scope.user = {
            avatar: 'img/avat.jpg'
        };
    }

    //地图选点，选择故乡
    $scope.mapHometown = function() {
        var marker = new AMap.Marker({
            position: map.getCenter(),
            draggable: true,
            map: map
        });
        marker.setIcon('img/home.png');

        AMap.event.addListener(marker, 'dragend', function(e) {
            map.plugin(['AMap.Geocoder'], function() {
                var geo = new AMap.Geocoder();
                var hometown_lnglat = e.lnglat;
                geo.getAddress(hometown_lnglat, function(status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        var address = result.regeocode.formattedAddress;
                        $scope.$apply(function() {
                            $scope.user.hometown = address;
                            $scope.user.hometown_lnglat = hometown_lnglat;
                        });
                    } else {
                        Tip.setTip(250, 50, null, null, 260, 80, '地址解析失败..........', 1);
                        $timeout(Tip.hideTip, 3000);
                    }
                });
            });
        });
    };

    //工作地选点
    $scope.mapAddress = function() {
        var marker = new AMap.Marker({
            position: map.getCenter(),
            draggable: true,
            map: map
        });
        marker.setIcon('img/address.png');

        AMap.event.addListener(marker, 'dragend', function(e) {
            map.plugin(['AMap.Geocoder'], function() {
                var geo = new AMap.Geocoder();
                address_lnglat = e.lnglat;
                geo.getAddress(address_lnglat, function(status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        var address = result.regeocode.formattedAddress;
                        $scope.$apply(function() {
                            $scope.user.address = address;
                            $scope.user.address_lnglat = address_lnglat;
                        });
                    } else {
                        Tip.setTip(250, 50, null, null, 260, 80, '地址解析失败..........', 1);
                        $timeout(Tip.hideTip, 3000);
                    }
                });
            });
        });
    };

    //保存用户信息
    $scope.save = function(user) {
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
            address_lnglat: user.address_lnglat
        };

        if (user.tag === 'guest') {
            $http.post(ServiceConfig.user_common_update, obj).success(function(data) {
                if (data.status) {
                    Tip.setTip(250, 50, null, null, 260, 80, '您好！你的资料保存成功', 1);
                    $timeout(Tip.hideTip, 3000);
                } else {
                    Tip.setTip(250, 50, null, null, 260, 80, '不好意思,你的资料保存失败', 1);
                    $timeout(Tip.hideTip, 3000);
                }
            });
        }
        if (user.tag === 'ben') {
            $http.post(ServiceConfig.user_ben_update, obj).success(function(data) {
                if (data.status) {
                    Tip.setTip(250, 50, null, null, 260, 80, '您好！你的资料保存成功', 1);
                    $timeout(Tip.hideTip, 3000);
                } else {
                    Tip.setTip(250, 50, null, null, 260, 80, '不好意思,你的资料保存失败', 1);
                    $timeout(Tip.hideTip, 3000);
                }
            });
        }

    };

    //打开上传窗口
    $scope.upload = function() {
        if (user && user.token) {
            document.getElementById('uploadImg').click();
            document.getElementById('selfToken').value = user.token;
        } else {
            Util.alertForm('您好！请登录..........');
        }
    }

}]);;app.controller('HeaderController', 
['$scope', '$cookieStore',
function($scope, $cookieStore) {
	var user = $cookieStore.get('user');
	$scope.isLogined = false;
	if (user) {
		$scope.isLogined = true;
		$scope.username = user.realname || user.nickname || user.email;
	}

	//清除cookie，退出当前登录
	$scope.quit = function() {
		$cookieStore.remove('user');
		$scope.isLogined = false;
		$scope.username = '';
	};
}]);;

app.controller('ArticleController', 
['$http', '$scope', 'ServiceConfig',
function($http, $scope, ServiceConfig){
	$http.get(ServiceConfig.article_get).success(function(data){
		if(data.status){
			$scope.items = data.items;
		}
	});
}]);
;app.controller('PostWeiboController', 
['$http', '$scope', '$cookieStore', '$timeout', 'ServiceConfig', 'Time',
function($http, $scope, $cookieStore, $timeout, ServiceConfig, Time) {
	$scope.isShowPanel = false;

	//控制发表微博的panel显示与隐藏
	$scope.show = function() {
		if ($scope.isShowPanel) {
			$scope.isShowPanel = false;
		} else {
			$scope.isShowPanel = true;
		}
	};
	//发表微博
	$scope.submit = function(content, tag1, tag2, tag3) {
		var content = content,
			user = $cookieStore.get('user'),
			tagArr = [tag1, tag2, tag3],
			tags = [];
		if (!content) {
			//弹出提示，发表的内容不能为空
			Tip.setTip(200, 350, null, null, 260, 80, '哥哥，无字天书是不能发表的哦~~', 1);
			$timeout(Tip.hideTip, 2300);
			return;
		}
		if (!user) {
			//弹出提示，请先登录
			Tip.setTip(200, 350, null, null, 260, 80, '发表微博，起码登录一下吧~~', 1);
			$timeout(Tip.hideTip, 2300);
			return;
		}
		for (var tag in tagArr) {
			if (tagArr[tag])
				tags.push(tagArr[tag]);
		}

		var data = {
			token: user.token,
			content: content,
			tags: tags.join(',')
		};

		$http.post(ServiceConfig.wei_create, data).success(function(data) {
			if (data.status) {
				data.time = Time.formatTime(data.time);
				//向上广播数据
				$scope.$emit('weiboDataUp', data);
				$scope.isShowPanel = false;
				Tip.setTip(200, 350, null, null, 260, 80, '您发表的内容实在是太精彩了！', 1);
				$timeout(Tip.hideTip, 2300);
			} else {
				Tip.setTip(200, 350, null, null, 260, 80, '服务君，老大喊你回来干活~', 1);
				$timeout(Tip.hideTip, 2300);
			}
		}).error(function() {
			Tip.setTip(200, 350, null, null, 260, 80, '服务君该嗑药了，都出错了~', 1);
			$timeout(Tip.hideTip, 2300);
		});
	};


}]);;app.controller('WeiboController', 
['$http', '$scope', '$cookieStore', '$timeout', 'ServiceConfig', 'Time', 'WeiboData',
function($http, $scope, $cookieStore, $timeout, ServiceConfig, Time, WeiboData) {
    //初始化微博列表    
    WeiboData.getItems(0, function(data, pageSize) {
        if (data.length) {
            //第一条记录的索引
            $scope.currentPage = 0;
            //总页码
            $scope.pageSize = pageSize;
            //微博10条记录
            $scope.items = data;
        } else {
            Tip.setTip(100, 200, null, null, 260, 80, '服务君感冒了,请刷新页面重试...', 1);
            $timeout(Tip.hideTip, 3000);
        }
    });

    //对发表微博数据进行管理，置顶新发微博，减去尾部微博
    $scope.$on('weiboDataDown', function(e, data) {
        $scope.items.unshift(data);
        var n = $scope.items.length;
        if (n > 10) {
            $scope.items = $scope.items.slice(0, 10);
        }
    });


    //点赞
    $scope.zan = function(item) {
        var user = $cookieStore.get('user');
        if (user) {
            var zanToken = '?token=' + user.token,
                id = '&id=' + item._id,
                url = ServiceConfig.wei_zan + zanToken + id;
            $http.get(url).success(function(data) {
                if (data.status) {
                    if (data.zans) {
                        item.zans = data.zans;
                        Tip.setTip(200, 350, null, null, 240, 80, '谢谢您的打赏~~~~', 1);
                        $timeout(Tip.hideTip, 2300);
                    } else {
                        Tip.setTip(200, 350, null, null, 240, 80, '伦家怎么好意思再收呢！', 1);
                        $timeout(Tip.hideTip, 2300);
                    }

                } else {
                    Tip.setTip(200, 350, null, null, 240, 80, '不好意思，打赏失败了...', 1);
                    $timeout(Tip.hideTip, 2300);
                }
            }).error(function() {
                Tip.setTip(200, 350, null, null, 260, 80, '服务君感冒了,请刷新页面重试...', 1);
                $timeout(Tip.hideTip, 2300);
            });
        } else {
            Tip.setTip(200, 350, null, null, 240, 80, '只有登录了，才能点赞哦~~~', 1);
            $timeout(Tip.hideTip, 2300);
        }
    };

    //评论框弹出
    $scope.comment = function(item) {
        if (!item.isShowComDiv) {
            item.isShowComDiv = true;
        } else {
            item.isShowComDiv = false;
        }
    };
    //增加评论
    $scope.addComment = function(item, content) {
        var user = $cookieStore.get('user');
        if (user && content) {
            var commentToken = '?token=' + user.token,
                comment = '&comment=' + content,
                id = '&id=' + item._id,
                url = ServiceConfig.wei_comment + commentToken + comment + id;
            $http.get(url).success(function(data) {
                if (data.status) {
                    item.comments.push({
                        nickname: data.nickname,
                        email: data.email,
                        comment: data.comment,
                        avatar: data.avatar,
                        time: Time.formatTime(data.time)
                    });
                    //这里手动清除Dom的text更好
                    //视图更新已经在$degist
                    document.getElementById('_commentContent').value = '';
                    Tip.setTip(200, 350, null, null, 240, 80, '您的评论实在是精彩了~~', 1);
                    $timeout(Tip.hideTip, 2300);
                } else {
                    Tip.setTip(200, 350, null, null, 240, 80, '不好意思，评论失败了...', 1);
                    $timeout(Tip.hideTip, 2300);
                }
            }).error(function() {
                Tip.setTip(200, 350, null, null, 240, 80, '服务君感冒了，评论失败了...', 1);
                $timeout(Tip.hideTip, 2300);
            });
        } else {
            Tip.setTip(200, 350, null, null, 280, 80, '请登录，评论的内容不能为空~~', 1);
            $timeout(Tip.hideTip, 2300);
        }
    };

    //前一页
    $scope.prePage = function() {
        $scope.currentPage = $scope.currentPage - 1;
        if ($scope.currentPage >= 0) {
            WeiboData.getItems($scope.currentPage * 10, function(data) {
                if (data.length) {
                    $scope.items = data;
                } else {
                    Tip.setTip(200, 350, null, null, 260, 80, '君别着急，现在都查不出数据了...', 1);
                    $timeout(Tip.hideTip, 2300);
                }
            });
        } else {
            //还原点击减量
            $scope.currentPage = $scope.currentPage + 1;
            Tip.setTip(200, 350, null, null, 260, 80, '君别翻旧账了，这是第一页啦~~~', 1);
            $timeout(Tip.hideTip, 2300);
        }
    };
    //下一页
    $scope.nextPage = function() {
        $scope.currentPage = $scope.currentPage + 1;
        if ($scope.currentPage < $scope.pageSize) {
            WeiboData.getItems($scope.currentPage * 10, function(data) {
                if (data.length) {
                    $scope.items = data;
                } else {
                    Tip.setTip(200, 350, null, null, 260, 80, '君别着急，现在都查不出数据了...', 1);
                    $timeout(Tip.hideTip, 2300);
                }
            });
        } else {
            //还原点击增量
            $scope.currentPage = $scope.currentPage - 1;
            Tip.setTip(200, 350, null, null, 290, 80, '底都被你掏空了，这是最后一页啦~~~', 1);
            $timeout(Tip.hideTip, 2300);
        }
    };
    //safe
    $scope.safeApply = function(fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };
}]);;//这里需要将type=email，起到过滤作用
app.controller('LoginController', 
['$scope', '$http', '$cookieStore', '$timeout', '$location', 'ServiceConfig',
function($scope, $http, $cookieStore, $timeout, $location, ServiceConfig) {
	$scope.login = function() {
		var email = $scope.email,
			password = $scope.password,
			data = {
				'email': email,
				'password': password
			};
		$http.post(ServiceConfig.user_login, data).success(function(data) {
			if (data.status) {
				$cookieStore.put('user', data);
				$location.path('/');
			} else {
				var width = window.innerWidth;
				Tip.setTip(250, (parseInt(width) - 240) / 2, null, null, 260, 80, '难倒你忘记了密码...', 1);
				$timeout(Tip.hideTip, 3000);
			}
		}).error(function() {
			var width = window.innerWidth;
			Tip.setTip(250, (parseInt(width) - 240) / 2, null, null, 260, 80, '服务君该回家养老了...', 1);
			$timeout(Tip.hideTip, 3000);
		});
	};

	$scope.goRegister = function() {
		$location.path('/register');
	};
}]);;app.controller('RegisterController', 
['$scope', '$http', '$cookieStore', '$timeout', '$location', 'ServiceConfig',
function($scope, $http, $cookieStore, $timeout, $location, ServiceConfig) {

	$scope.register = function() {
		var email = $scope.email,
			password = $scope.password,
			repeatpassword = $scope.re_password,
			width = window.innerWidth;

		if (!email || !password || !repeatpassword) {
			Tip.setTip(250, (parseInt(width) - 240) / 2, null, null, 260, 80, '邮箱、密码不能为空....', 1);
			$timeout(Tip.hideTip, 3000);
			return;
		}
		if (password !== repeatpassword) {
			Tip.setTip(250, (parseInt(width) - 240) / 2, null, null, 260, 80, '两次输入密码不一致呀~~', 1);
			$timeout(Tip.hideTip, 3000);
			return;
		}

		var data = {
			'email': email,
			'password': password,
			'repeatPassword': repeatpassword
		};

		$http.post(ServiceConfig.user_register, data).success(function(data) {
			if (data.status) {
				$cookieStore.put('user', data);
				$location.path('/');
			} else {
				Tip.setTip(250, (parseInt(width) - 240) / 2, null, null, 260, 80, '注册失败，请重试~~', 1);
				$timeout(Tip.hideTip, 3000);
			}
		}).error(function() {
			Tip.setTip(250, (parseInt(width) - 240) / 2, null, null, 260, 80, '服务君感冒了，紧急修复中...', 1);
			$timeout(Tip.hideTip, 3000);
		});
	};

	$scope.goLogin = function() {
		$location.path('/login');
	};

}]);;//控制所有控制器间的数据传输和模型更新
app.controller('RootController', ['$scope', function($scope) {
	//广播微博数据
	$scope.$on('weiboDataUp', function(e, data) {
		$scope.$broadcast('weiboDataDown', data);
	});

	//广播地图对象
	$scope.$on('mapObject', function(e, data) {
		$scope.$broadcast('mapObj', data);
	});
}]);;
app.controller('UcUserController', 
['$http', '$cookieStore', '$scope', '$timeout', 'ServiceConfig',
function($http, $cookieStore, $scope, $timeout, ServiceConfig){
	var user = $cookieStore.get('user');
	if(!user){
		return;
	}
	$scope.user = user;
	
	$scope.changePassword = function(uc){
		if(uc){
			var old = uc.oldPassword;
			var newP = uc.newPassword;
			var reP = uc.rePassword;
			if(newP !== reP || !newP || !reP || !old){
				Tip.setTip(250, null, 150, null, 260, 80, '密码不一致或者没有输入密码', 1);
	        	$timeout(Tip.hideTip, 3000);
			}else{
				var data = {
					token: user.token,
					oldPassword: old,
					newPassword: newP,
					rePassword: reP
				};
				$http.post(ServiceConfig.user_update_password, data).success(function(data){
					if(data.status){
						Tip.setTip(250, null, 150, null, 260, 80, '更改密码成功...', 1);
	        			$timeout(Tip.hideTip, 3000);
					}else{
						Tip.setTip(250, null, 150, null, 260, 80, '更改密码失败...', 1);
	        			$timeout(Tip.hideTip, 3000);
					}
				});
			}
		}else{
			Tip.setTip(250, null, 150, null, 260, 80, '信息不能为空...', 1);
	        $timeout(Tip.hideTip, 3000);
		}
		
	};
}]);
;
app.controller('UcWeiboController', 
['$scope', '$http', '$cookieStore', '$timeout', 'ServiceConfig', 'Time', 'SelfWeibo',
function($scope, $http, $cookieStore, $timeout, ServiceConfig, Time, SelfWeibo){
	//显示用户以前发表的微博
	var user = $cookieStore.get('user');
	var width = window.innerWidth;
	if(!user){
		Tip.setTip(250, (parseInt(width) - 240) / 2, null, null, 260, 80, '请先登录您的账号~~~~', 1);
        $timeout(Tip.hideTip, 3000);
        return;
	}
	
	var path = '?token=' + user.token + '&page=0';
	var page = 0;
	
	SelfWeibo.getData(user.token, 0, function(data){
		if(data.status){
			$scope.pages = data.pageSize;
			$scope.items = data.items;
		}
	});

	//wei_delete
	$scope.deleteWeibo = function($index){
		var _id = $scope.items[$index]._id;
		var data = {
			token: user.token,
			_id: _id
		};
		$http.post(ServiceConfig.wei_delete, data).success(function(data){
			if(data.status){
				$scope.items = $scope.items.slice(1);
				Tip.setTip(250, (parseInt(width) - 240) / 2, null, null, 260, 80, '删除一条微博成功...', 1);
            	$timeout(Tip.hideTip, 3000);
			}else{
				Tip.setTip(250, (parseInt(width) - 240) / 2, null, null, 260, 80, '删除一条微博失败...', 1);
            	$timeout(Tip.hideTip, 3000);
			}
		});
	};
	//上一页
	$scope.prePage = function(){
		page = page -1;
		if(page >= 0){
			SelfWeibo.getData(user.token, page, function(data){
				if(data.status){
					$scope.items = data.items;
				}
			});
		}else{
			page = 0;
			Tip.setTip(250, (parseInt(width) - 240) / 2, null, null, 260, 80, '已经是第一页...', 1);
        	$timeout(Tip.hideTip, 3000);
		}
	};
	//下一页
	$scope.nextPage = function(){
		page = page + 1;
		if(page < $scope.pages){
			SelfWeibo.getData(user.token, page, function(data){
				if(data.status){
					$scope.items = data.items;
				}
			});
		}else{
			page = $scope.pages - 1;
			Tip.setTip(250, (parseInt(width) - 240) / 2, null, null, 260, 80, '已经是最后一页...', 1);
        	$timeout(Tip.hideTip, 3000);
		}
	};
}]);
