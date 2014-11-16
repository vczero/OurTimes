var app = angular.module('app', []);

app.controller('LoginController', function($scope, $http){
	if(document.cookie){
		var userid = document.cookie.split(';')[1].split('=')[1];
		if(userid && document.cookie.indexOf('userid=') > -1){
			$http.get('http://127.0.0.1:3000/user/get?userid=' + userid).success(function(data){
				if(data.status){
					$scope.user = {
						name: data.nickname || data.email
					};
				}
			});
		}
	}
	
});
