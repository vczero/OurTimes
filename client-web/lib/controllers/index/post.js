app.controller('PostWeiboController', 
['$http', '$scope', '$cookieStore', '$timeout', 'ServiceConfig', 'Time',
function($http, $scope, $cookieStore, $timeout, ServiceConfig, Time) {
	$scope.isShowPanel = false;

	//控制发表微博的panel显示与隐藏
	$scope.show = function() {
		if ($scope.isShowPanel) {
			$scope.isShowPanel = false;
		} else {
			$scope.isShowPanel = true;
		}
	};
	//发表微博
	$scope.submit = function(content, tag1, tag2, tag3) {
		var content = content,
			user = $cookieStore.get('user'),
			tagArr = [tag1, tag2, tag3],
			tags = [];
		if (!content) {
			//弹出提示，发表的内容不能为空
			Tip.setTip(200, 350, null, null, 260, 80, '哥哥，无字天书是不能发表的哦~~', 1);
			$timeout(Tip.hideTip, 2300);
			return;
		}
		if (!user) {
			//弹出提示，请先登录
			Tip.setTip(200, 350, null, null, 260, 80, '发表微博，起码登录一下吧~~', 1);
			$timeout(Tip.hideTip, 2300);
			return;
		}
		for (var tag in tagArr) {
			if (tagArr[tag])
				tags.push(tagArr[tag]);
		}

		var data = {
			token: user.token,
			content: content,
			tags: tags.join(',')
		};

		$http.post(ServiceConfig.wei_create, data).success(function(data) {
			if (data.status) {
				data.time = Time.formatTime(data.time);
				//向上广播数据
				$scope.$emit('weiboDataUp', data);
				$scope.isShowPanel = false;
				Tip.setTip(200, 350, null, null, 260, 80, '您发表的内容实在是太精彩了！', 1);
				$timeout(Tip.hideTip, 2300);
			} else {
				Tip.setTip(200, 350, null, null, 260, 80, '服务君，老大喊你回来干活~', 1);
				$timeout(Tip.hideTip, 2300);
			}
		}).error(function() {
			Tip.setTip(200, 350, null, null, 260, 80, '服务君该嗑药了，都出错了~', 1);
			$timeout(Tip.hideTip, 2300);
		});
	};


}]);