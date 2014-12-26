app.controller('WeiboController', 
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
            var zanToken = 'token=' + user.token,
                id = '&id=' + item._id,
                url = 'http://127.0.0.1:3000/wei/zan?' + zanToken + id;
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
            var commentToken = 'token=' + user.token,
                comment = '&comment=' + content,
                id = '&id=' + item._id,
                url = 'http://127.0.0.1:3000/wei/comment?' + commentToken + comment + id;
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
}]);