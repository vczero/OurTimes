
var app = angular.module('app', ['ui.router', 'ngCookies']);
var SERVER_BASE_URL = 'http://127.0.0.1:3000/';

//初始化配置
app.run(['$rootScope', function($rootScope) {
    $rootScope.appName = '图班网';
    $rootScope.desc = '基于位置的通讯录';
    $rootScope.author = '鬼谣';
    $rootScope._email = 'wlhmyit@126.com';
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


}]);