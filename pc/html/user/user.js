var app = angular.module('app', []);
var userStr = document.cookie.split(';')[0].split('=')[1];
var userObj = null;
var map = null;
var hometown_lnglat = null;
var address_lnglat = null;
if(userStr){
    userObj = JSON.parse(userStr);
}


//地图初始化
map = new AMap.Map('user_map', {
    resizeEnable: true,
    zooms: [5, 18]
});
map.setZoom(5);
map.plugin(['AMap.ToolBar'], function(){
    map.addControl(new AMap.ToolBar());
});

//POST数据格式转化，解析第一层JSON
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

//获取用户的cookie，显示欢迎信息
app.controller('LoginController', function($scope) {
    if (userObj) {
         $scope.user = {
            name: userObj.realname || userObj.nickname || userObj.email
         }
    }
});

app.controller('UserController', function($scope, $http){
    //如果没有登录，显示普通用户的marker,去除敏感信息
    if(!userObj || userObj.tag !== 'BEN'){
        $http.get('http://127.0.0.1:3000/user/getCommon').success(function(data){
            if(data.status && data.user.length){
                var users = data.user;
                document.getElementById('_realName').innerHTML = '';
                document.getElementById('_tel').innerHTML = '';
                document.getElementById('_job').innerHTML = '';
                for(var i = 0; i < users.length; i++){
                    var user = users[i];
                    var locationArr = user.address_lnglat.split(',');
                    var marker = new AMap.Marker({
                        position: new AMap.LngLat(locationArr[0], locationArr[1])
                    });
                    marker.setIcon('../../img/pos.png');
                    marker.setMap(map);
                    marker.index = i;

                    AMap.event.addListener(marker, 'click', function(e){
                        var info = users[this.index];
                        document.getElementById('_nickname').innerHTML = (info.nickname || '').substr(0, 11);
                        document.getElementById('_address').innerHTML = (info.address || '').substr(0, 11);
                        document.getElementById('_hometown').innerHTML = (info.hometown || '').substr(0, 11);
                        document.getElementById('_sign').innerHTML = (info.sign || '').substr(0, 30);
                        document.getElementById('contact_img').src = info.avatar;
                    });
                }
            }else{
                alert('服务异常，获取用户信息失败...');
            }
        });
    }

    //如果登录且是'BEN'用户
    if(userObj && userObj.tag === 'BEN'){
        $http.get('http://127.0.0.1:3000/user/getBen').success(function(data){
            if(data.status && data.user.length){
                var users = data.user;
                
                for(var i = 0; i < users.length; i++){
                    var user = users[i];
                    var locationArr = user.address_lnglat.split(',');
                    var marker = new AMap.Marker({
                        position: new AMap.LngLat(locationArr[0], locationArr[1])
                    });
                    marker.setIcon('../../img/pos.png');
                    marker.setMap(map);
                    marker.index = i;

                    AMap.event.addListener(marker, 'click', function(e){
                        var info = users[this.index];
                        document.getElementById('_nickname').innerHTML = (info.nickname || '').substr(0, 11);
                        document.getElementById('_address').innerHTML = (info.address || '').substr(0, 11);
                        document.getElementById('_hometown').innerHTML = (info.hometown || '').substr(0, 11);
                        document.getElementById('_sign').innerHTML = (info.sign || '').substr(0, 30);
                        document.getElementById('contact_img').src = info.avatar;
                        document.getElementById('_realName').innerHTML = (info.realname || '').substr(0, 11);
                        document.getElementById('_tel').innerHTML = info.tel || '';
                        document.getElementById('_job').innerHTML = (info.job || '').substr(0, 11);;
                    });
                }
            }else{
                alert('服务异常，获取用户信息失败...');
            }
        });
    }


    //显示更新用户信息的UI
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

    //打开上传窗口
    $scope.upload = function(){
        if(userObj && userObj.token){
            document.getElementById('uploadImg').click();
            document.getElementById('selfToken').value = userObj.token;
        }else{
            alert('请登录');
        }  
    }

    //保存用户信息
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
            sign: sign || userObj.sign,
            hometown_lnglat: hometown_lnglat || userObj.hometown_lnglat,
            address_lnglat: address_lnglat || userObj.address_lnglat
        };
        
        if(userObj.tag === '游客'){
            $http.post('http://127.0.0.1:3000/user/updateCommon', obj).success(function(data) {
                if(data.status){
                    alert('保存成功');
                }else{
                    alert('保存失败');
                }
            });
        }
        if(userObj.tag === '本班'){
            $http.post('http://127.0.0.1:3000/user/updateBen', obj).success(function(data) {
                if(data.status){
                    alert('保存成功');
                }else{
                    alert('保存失败');
                }
            });
        }
    }

    //故乡地图选址
    $scope.home_getPoint = function(){
        var marker = new AMap.Marker({
            position: map.getCenter(),
            draggable: true,
            map: map
        });
        marker.setIcon('../../img/home.png');

        AMap.event.addListener(marker, 'dragend', function(e){
            map.plugin(['AMap.Geocoder'], function(){
                var geo = new AMap.Geocoder();
                hometown_lnglat = e.lnglat;
                geo.getAddress(hometown_lnglat);
                AMap.event.addListener(geo, 'complete', function(e){
                    if(e.info === 'OK'){
                        var address = e.regeocode.formattedAddress;
                        document.getElementById('hometown').value = address;
                    }else{
                        alert('地址解析失败');
                    }
                });
            });
        });
    };

    //工作地 地图选址
    $scope.address_getPoint = function(){
        var marker = new AMap.Marker({
            position: map.getCenter(),
            draggable: true,
            map: map
        });
        marker.setIcon('../../img/address.png');

        AMap.event.addListener(marker, 'dragend', function(e){
            map.plugin(['AMap.Geocoder'], function(){
                var geo = new AMap.Geocoder();
                address_lnglat = e.lnglat;
                geo.getAddress(address_lnglat);
                AMap.event.addListener(geo, 'complete', function(e){
                    if(e.info === 'OK'){
                        var address = e.regeocode.formattedAddress;
                        document.getElementById('address').value = address;
                    }else{
                        alert('地址解析失败');
                    }
                });
            });
        });
    }
});


