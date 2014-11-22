
var app = angular.module('app', []);

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

app.controller('LoginController', function($scope, $http) {
    if (document.cookie) {
        var userid = document.cookie.split(';')[1].split('=')[1];
        if (userid && document.cookie.indexOf('userid=') > -1) {
            $http.get('http://127.0.0.1:3000/user/get?userid=' + userid).success(function(data) {
                if (data.status) {
                    $scope.user = {
                        name: data.nickname || data.email
                    };
                }
            });
        }
    }
});

app.controller('UserController', function($scope, $http){
    var token = document.cookie.split(';')[0].split('=')[1];
    if (document.cookie) {
        var userid = document.cookie.split(';')[1].split('=')[1];
        if (userid && document.cookie.indexOf('userid=') > -1) {
            $http.get('http://127.0.0.1:3000/user/get?userid=' + userid + '&token=' + token).success(function(data) {
                if (data.status) {
                    $scope.user = data;
                }
            });
        }
    }

    $scope.upload = function(){
        if(token){
            document.getElementById('uploadImg').click();
            document.getElementById('selfToken').value = token;
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
            token: token,
            nickname: nickname || '',
            realname: realname || '',
            tel: tel || '',
            hometown: hometown || '',
            job: job || '',
            address: address || '',
            sign: sign || ''
        };
        console.log(obj);
        $http.post('http://127.0.0.1:3000/user/update', obj).success(function(data) {
            console.log(data);
        });
    }
});


// var map = new AMap.Map('user_map', {
//     resizeEnable: true,
//     zooms: [5, 18]
// });
// map.setZoom(5);
// map.plugin(['AMap.ToolBar'], function(){
//     map.addControl(new AMap.ToolBar());
// });

// var pos = map.getCenter();
// for(var i = 0; i < 60; i++){
//     var p = new AMap.LngLat(pos.lng - Math.random() * 10, pos.lat -Math.random() * 10);
//     var marker = new AMap.Marker({
//         position: p
//     });

//     marker.name = '我梦到过' + i;
//     marker.setIcon('../../img/pos.png');
//     marker.setMap(map);
//     AMap.event.addListener(marker, 'click', function(e){
//         document.getElementById('name').innerHTML = this.name;
//     });
// }