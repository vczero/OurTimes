
var app = angular.module('app', ['ui.router', 'ngCookies']);

//初始化配置
app.run(['$rootScope', function($rootScope) {
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
    user_ben_update: 'http://127.0.0.1:3000/user/updateBen',
    user_ben_get_name: 'http://127.0.0.1:3000/user/singleBen/name',
    user_common_get_nickname: 'http://127.0.0.1:3000/user/getCommon/name',
    user_ben_get_realname: 'http://127.0.0.1:3000/user/singleBen/name',
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
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
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
                controller: ''
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
                controller: ''
            },
            'userDetailInfo@ucenter': {
                templateUrl: '',
                controller: ''
            }
        }
    });


}]);