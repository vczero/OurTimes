var app = angular.module('app', []);
var userStr = document.cookie.split(';')[0].split('=')[1];
var userObj = null;
if(userStr){
    userObj = JSON.parse(userStr);
}

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

app.controller('LoginController', function($scope) {
    if (userObj) {
         $scope.user = {
            name: userObj.realname || userObj.nickname || userObj.email
         }
    }
});

app.controller('UserController', function($scope, $http){
    if (userObj) {
        $http.get('http://127.0.0.1:3000/user/getSelf?token=' + userObj.token).success(function(data) {
            if(data.status){
                $scope.user = data;
                document.cookie = 'user=' + JSON.stringify(data) + ' ;path=/';
            }else{
                alert('获取用户信息失败');
            }
        });
        
    }

    $scope.upload = function(){
        if(userObj && userObj.token){
            document.getElementById('uploadImg').click();
            document.getElementById('selfToken').value = userObj.token;
        }else{
            alert('请登录');
        }  
    }

    $scope.save = function(){
        var nickname = document.getElementById('nickname').value,
            realname = document.getElementById('realname').value,
            tel = document.getElementById('tel').value,
            hometown = document.getElementById('hometown').value,
            job = document.getElementById('job').value,
            address = document.getElementById('address').value,
            sign = document.getElementById('sign').value;
        var obj = {
            token: userObj.token,
            nickname: nickname || userObj.nickname,
            realname: realname || userObj.realname || '',
            tel: tel || userObj.tel || '',
            hometown: hometown || userObj.hometown,
            job: job || userObj.job || '',
            address: address || userObj.address,
            sign: sign || userObj.sign
        };
        if(userObj.tag === '游客'){
            $http.post('http://127.0.0.1:3000/user/updateCommon', obj).success(function(data) {
                console.log(data);
            });
        }
        if(userObj.tag === '本班'){
            $http.post('http://127.0.0.1:3000/user/updateBen', obj).success(function(data) {
                console.log(data);
            });
        }
    }
});


var map = new AMap.Map('user_map', {
    resizeEnable: true,
    zooms: [5, 18]
});
map.setZoom(5);
map.plugin(['AMap.ToolBar'], function(){
    map.addControl(new AMap.ToolBar());
});

var pos = map.getCenter();
for(var i = 0; i < 60; i++){
    var p = new AMap.LngLat(pos.lng - Math.random() * 10, pos.lat -Math.random() * 10);
    var marker = new AMap.Marker({
        position: p
    });

    marker.name = '我梦到过' + i;
    marker.setIcon('../../img/pos.png');
    marker.setMap(map);
    AMap.event.addListener(marker, 'click', function(e){
        document.getElementById('name').innerHTML = this.name;
    });
}