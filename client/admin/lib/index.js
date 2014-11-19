var app = angular.module('app', []);
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

app.controller('UserController', function($scope, $http){
	$http.get('http://127.0.0.1:3000/user/getAll?token=5460bd81250a3020243af1ab').success(function(data){
		var obj = data.items;
		for(var i = 0; i < obj.length; i++){
			obj[i].time = Util.timeFormat(obj[i].time);		}
		$scope.datas = obj;
	});
});

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


