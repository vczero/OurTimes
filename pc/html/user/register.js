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

app.controller('RegisterController', function($scope, $http){
	$scope.register = function(){
		var email = $scope.email,
			password = $scope.password,
			repeatpassword = $scope.repeatpassword;
		/*--这个验证可以放到指令里去--*/
		if(!email || !password || !repeatpassword){
			return alert('不能为空');
		}
		if(password !== repeatpassword){
			return alert('输入的密码不一致');
		}
		
		var data = {
			'email': email,
			'password': password,
			'repeatPassword': repeatpassword
		};
		
		$http.post('http://127.0.0.1:3000/user/register', data).success(function(data){
			if(data.status){
				document.cookie = 'token=' + escape(data.token) + ' ;path=/';
				document.cookie = 'userid=' + escape(data.userid) + ' ;path=/';
				location.href = './../index/index.html';
			}else{
				alert('注册失败，请重试');
			}
		});
	};
	
});
