var app = angular.module('app', []);

var userStr = document.cookie.split(';')[0].split('=')[1];
var userObj = null;
if(userStr){
    userObj = JSON.parse(userStr);
}

app.controller('ContentController', function($scope, $http) {
    var pageSize = 0;
    //创建UI
    //获取最近10条用户发表的微言
    function initItems(callback) {
            var loading = document.getElementById('loading');
            loading.style.visibility = 'visible';
            $http.get('http://127.0.0.1:3000/wei/get').success(function(data) {
                if (data.status) {
                    for (var i = 0, len = data.items.length; i < len; i++) {
                        var item = data.items[i],
                            comments = item.comments;
                        item.time = Util.formatTime(item.time);
                        for (var j = 0, jl = comments.length; j < jl; j++) {
                            comments[j].time = Util.formatTime(comments[j].time);
                        }
                    }
                    pageSize = data.pageSize;
                    $scope.page = 1;
                    $scope.items = data.items;
                    loading.style.visibility = 'hidden';
                    setTimeout(callback, 50);
                }
            });
        }
    //分页
    function paging(callback, page) {
            var loading = document.getElementById('loading');
            loading.style.visibility = 'visible';
            $http.get('http://127.0.0.1:3000/wei/get?page=' + page).success(function(data) {
                if (data.status) {
                    for (var i = 0, len = data.items.length; i < len; i++) {
                        var item = data.items[i],
                            comments = item.comments;
                        item.time = Util.formatTime(item.time);
                        for (var j = 0, jl = comments.length; j < jl; j++) {
                            comments[j].time = Util.formatTime(comments[j].time);
                        }
                    }
                    $scope.items = data.items;
                    loading.style.visibility = 'hidden';
                    setTimeout(callback, 50);
                }
            });
        }
    //及时显示用户微言 & 隐藏所有的评论DIV
    initItems(function() {
        var commentDiv = document.getElementsByClassName('item_comment');
        for (var i = 0; i < commentDiv.length; i++) {
            commentDiv[i].style.display = 'none';
        }
    });
    //发表评论的显示 & 关闭
    $scope.showComment = function(index) {
        var commentDiv = document.getElementsByClassName('item_comment');
        for (var i = 0; i < commentDiv.length; i++) {
            commentDiv[i].style.display = 'none';
        }
        commentDiv[index].style.display = 'block';
        commentDiv[index].className = 'item_comment';
    };
    //发表微言的面板显示 & 隐藏
    $scope.postWei = function() {
        var attr = document.getElementById('postDiv').style.visibility;
        if (attr === 'visible')
            document.getElementById('postDiv').style.visibility = 'hidden';
        if (attr === 'hidden' || !attr)
            document.getElementById('postDiv').style.visibility = 'visible';
    };

    //点赞功能
    $scope.zan = function(index) {
        if (userObj) {
            var zanToken = 'token=' + userObj.token,
                id = '&id=' + $scope.items[index]._id,
                url = 'http://127.0.0.1:3000/wei/zan?' + zanToken + id;
            $http.get(url).success(function(data) {
                if (data.status) {
                    if (data.zans) {
                        $scope.items[index].zans = data.zans;
                        Util.alertForm('谢谢您的打赏~~');
                    } else {
                        Util.alertForm('伦家怎么好意思再收呢！');
                    }

                } else {
                    Util.alertForm('不好意思，打赏失败了...');
                }
            });
        } else {
            Util.alertForm('对不起，请先登录......');
        }
    };

    //评论
    $scope.comment = function(index) {
        if (userObj) {
            var input = document.getElementsByClassName('item_comment_input')[index],
                text = input.value;
            if (!text || !text.trim()) {
                return Util.alertForm('不好意思，评论不能为空...');
            };
            var commentToken = 'token=' + userObj.token,
                comment = '&comment=' + text,
                id = '&id=' + $scope.items[index]._id,
                url = 'http://127.0.0.1:3000/wei/comment?' + commentToken + comment + id;
            $http.get(url).success(function(data) {
                if (data.status) {
                    $scope.items[index].comments.push({
                        nickname: data.nickname,
                        email: data.email,
                        comment: data.comment,
                        avatar: data.avatar,
                        time: Util.formatTime(data.time)
                    });
                    input.value = '';
                } else {
                    Util.alertForm('不好意思，评论失败...');
                }
            });
        } else {
            Util.alertForm('对不起，请先登录...');
        }
    };
    //创建新的微言
    $scope.createWei = function() {
        if(!userObj){
            return Util.alertForm('对不起，请先登录......');
        }
        var content = document.getElementById('postContent').value,
            tags = [];
        var token = userObj.token;
        if (!token) {
            return Util.alertForm('对不起，请先登录......');
        }
        if (!content){
            return Util.alertForm('空内容是不能发表哦~~');
        }
        var tagArr = document.getElementsByClassName('posttag');
        for (var i = 0; i < tagArr.length; i++) {
            if (tagArr[i].value) {
                tags.push(tagArr[i].value);
            }
        }
        var data = {
            token: token,
            content: content,
            tags: tags.join(',')
        };
        $http.post('http://127.0.0.1:3000/wei/create', data).success(function(data) {
            if (data.status) {
                initItems(function() {
                    var commentDiv = document.getElementsByClassName('item_comment');
                    for (var i = 0; i < commentDiv.length; i++) {
                        commentDiv[i].style.display = 'none';
                    }
                    document.getElementById('postDiv').style.visibility = 'hidden';
                    //置空表单
                    document.getElementById('postContent').value = '';
                    for (var j = 0; j < tagArr.length; j++) {
                        tagArr[j].value = '';
                    }
                });
            } else {
                Util.alertForm('不好意思，发表失败了...');
            }
        });
    };

    $scope.prePage = function() {
        $scope.page--;
        if ($scope.page >0) {
            paging(function() {
                var commentDiv = document.getElementsByClassName('item_comment');
                for (var i = 0; i < commentDiv.length; i++) {
                    commentDiv[i].style.display = 'none';
                }
            }, ($scope.page - 1) * 10);
        }else{
        	$scope.page = 1;
        }
    };

    $scope.nextPage = function() {
    	$scope.page++;
    	if($scope.page <= pageSize){
    		paging(function() {
	            var commentDiv = document.getElementsByClassName('item_comment');
	            for (var i = 0; i < commentDiv.length; i++) {
	                commentDiv[i].style.display = 'none';
	            }
	        }, ($scope.page - 1) * 10);
    	}else{
    		$scope.page = pageSize;
    	}
        
    };

});

app.controller('ArticleController', function($scope, $http) {
    $scope.articles = [{
        title: '我的特一营'
    }, {
        title: '我的特一营'
    }, {
        title: '我的特一营'
    }];
});

app.controller('LoginController', function($scope, $http) {
    if (userObj) {
         $scope.user = {
            name: userObj.realname || userObj.nickname || userObj.email
         }
    }

});



