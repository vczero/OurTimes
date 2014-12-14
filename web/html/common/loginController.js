//获取用户的cookie，显示欢迎信息
app.controller('LoginController', function($scope) {
    if (userObj) {
         $scope.user = {
            name: userObj.realname || userObj.nickname || userObj.email
         }
    }
});