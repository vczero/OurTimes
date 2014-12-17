//获取module
var app = angular.module('app', ['ui.router']);

//初始化配置
app.run(['$rootScope', function($rootScope){
	$rootScope.appName = '图班网';
	$rootScope.desc = '基于位置的通讯录';
	$rootScope.author = '鬼谣';
	$rootScope.email = 'wlhmyit@126.com';
}]);

//调用的服务列表
app.constant('ServiceConfig', {
	wei_content: 'http://127.0.0.1:3000/wei/get',
	wei_zan: 'http://127.0.0.1:3000/wei/zan',
	wei_comment: 'http://127.0.0.1:3000/wei/comment',
	wei_create: 'http://127.0.0.1:3000/wei/create',
	user_get: 'http://127.0.0.1:3000/user/get',
	user_login: 'http://127.0.0.1:3000/user/login',
	user_register: 'http://127.0.0.1:3000/user/register',
	user_common: 'http://127.0.0.1:3000/user/getCommon',
	user_ben: 'http://127.0.0.1:3000/user/getBen',
	user_self: 'http://127.0.0.1:3000/user/getSelf',
	user_common_update: 'http://127.0.0.1:3000/user/updateCommon',
	user_ben_update: 'http://127.0.0.1:3000/user/updateBen'
});


//JSON parse
app.config(['$httpProvider', function($httpProvider){
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
	$httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.transformRequest = [function(data) {
  		var obj = [];
  		for(var key in data){
  			obj.push(key + '=' + data[key]);
  		}
  		return obj.join('&');
  	}];
	 
}]);

//路由配置
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
	/*URL路由*/
	$urlRouterProvider.otherwise("/index");
	/*状态配置*/
	$stateProvider
	//首页
    .state('index',{
    	url: '/index',
    	views:{
    		'': {
    			templateUrl: 'views/index.html',
    		},
    		'header@index':{
    			templateUrl: 'views/header.html',
    			controller: ''
    		},
    		'weibo@index':{
    			templateUrl: 'views/weibo.html',
    			controller: ''
    		},
    		'article@index':{
    			templateUrl: 'views/article.html',
    			controller: ''
    		}
    	}
    });

}]);


