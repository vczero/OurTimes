
var app = angular.module('app', ['ui.router', 'ngCookies', 'ngGrid']);
//初始化配置
app.run(['$rootScope', function($rootScope) {
    $rootScope.appName = '图班网';
    $rootScope.desc = '后台管理';
    $rootScope.author = '鬼谣';
    $rootScope.email = 'wlhmyit@126.com';
}]);

//服务列表
app.constant('ServiceConfig', {
    user_login: 'http://127.0.0.1:3000/user/login',
    user_getAll: 'http://127.0.0.1:3000/user/getAll'
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
                controller: ''
            }
        }
    })
    
    .state('index.article', {
        url: '/article',
        views: {
            '': {
                templateUrl: 'views/index.html',
                controller: ''
            },
            'list@index':{
            	templateUrl: 'views/article.html',
                controller: ''
            }
        }
    })
    
    .state('index.weibo', {
        url: '/weibo',
        views: {
            '': {
                templateUrl: 'views/index.html',
                controller: ''
            },
            'list@index':{
            	templateUrl: 'views/weibo.html',
                controller: ''
            }
        }
    })
    
    .state('index.user', {
        url: '/user',
        views: {
            '': {
                templateUrl: 'views/index.html',
                controller: ''
            },
            'list@index':{
            	templateUrl: 'views/user.html',
                controller: 'UserController'
            }
        }
    })
    
    .state('index.qita', {
        url: '/qita',
        views: {
            '': {
                templateUrl: 'views/index.html',
                controller: ''
            },
            'list@index':{
            	templateUrl: 'views/qita.html',
                controller: ''
            }
        }
    });
}]);
