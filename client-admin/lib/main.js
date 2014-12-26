
var app = angular.module('app', ['ui.router', 'ngCookies', 'ngGrid']);
var SERVER_BASE_URL = 'http://127.0.0.1:3000/';
//初始化配置
app.run(['$rootScope', function($rootScope) {
    $rootScope.appName = '图班网';
    $rootScope.desc = '后台管理';
    $rootScope.author = '鬼谣';
    $rootScope.email = 'wlhmyit@126.com';
}]);

//服务列表
app.constant('ServiceConfig', {
    user_login: SERVER_BASE_URL + 'user/login',
    user_getAll: SERVER_BASE_URL + 'user/getAll',
    user_updateTag: SERVER_BASE_URL + 'user/updateTag',
    user_getUserByCondition: SERVER_BASE_URL + 'user/getByCondition',
    user_delete: SERVER_BASE_URL + 'user/delete',
    article_create: SERVER_BASE_URL + 'article/create',
    weibo_getByCondition: SERVER_BASE_URL + 'wei/getByCondition',
    weibo_set2null: SERVER_BASE_URL + 'wei/set2null',
    email_findPassword: SERVER_BASE_URL + 'email/findPassword'
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
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    /*URL路由*/
    $urlRouterProvider.otherwise("/");
    /*状态配置*/
    $stateProvider
    //登录
    .state('login', {
        url: '/',
        views: {
            '': {
                templateUrl: 'views/login.html',
                controller: 'LoginController'
            }
        }
    })
    
    .state('index', {
        url: '/index',
        views: {
            '': {
                templateUrl: 'views/index.html',
                controller: 'MenuController'
            }
        }
    })
    
    .state('index.article', {
        url: '/article',
        views: {
            '': {
                templateUrl: 'views/index.html',
                controller: 'MenuController'
            },
            'list@index':{
            	templateUrl: 'views/article.html',
                controller: 'ArticleController'
            }
        }
    })
    
    .state('index.weibo', {
        url: '/weibo',
        views: {
            '': {
                templateUrl: 'views/index.html',
                controller: 'MenuController'
            },
            'list@index':{
            	templateUrl: 'views/weibo.html',
                controller: 'WeiboController'
            }
        }
    })
    
    .state('index.user', {
        url: '/user',
        views: {
            '': {
                templateUrl: 'views/index.html',
                controller: 'MenuController'
            },
            'list@index':{
            	templateUrl: 'views/user.html',
                controller: 'UserController'
            }
        }
    })
    
    .state('index.email', {
        url: '/email',
        views: {
            '': {
                templateUrl: 'views/index.html',
                controller: 'MenuController'
            },
            'list@index':{
            	templateUrl: 'views/email.html',
                controller: 'EmailController'
            }
        }
    });
}]);
