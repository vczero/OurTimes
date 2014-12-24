
app.controller('UserController', 
['$scope', '$rootScope', '$timeout', '$http', '$cookieStore', 'ServiceConfig', 'MenuSelect',
function($scope, $rootScope, $timeout, $http, $cookieStore, ServiceConfig, MenuSelect) {
	var user = $cookieStore.get('user');
	var width = window.innerWidth;
	
	MenuSelect.setSelected('select_user');
	
	//分页
	$scope.mySelections = [];
	$scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    }; 
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [10, 15, 30],
        pageSize: 10,
        currentPage: 1
    };	
	$scope.setPagingData = function(data, page, pageSize){	
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.myData = pagedData;
        $scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.getPagedDataAsync = function (pageSize, page) {
        setTimeout(function () {
            $http.get(ServiceConfig.user_getAll + '?token=' + user.token).success(function (data) {
            	if(data.status){
            		$scope.setPagingData(data.items, page, pageSize);
            	}
            }); 
        }, 100);
    };
	
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
	
    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
          	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        }
    }, true);
    
	$scope.$on('ngGridEventEndCellEdit', function(evt){
    	var obj = evt.targetScope.row.entity;
    	var data = {
    		userid: obj.userid,
    		token: user.token,
    		tag: obj.tag
    	};
    	$http.post(ServiceConfig.user_updateTag, data).success(function(data){
    		if(!data.status){
				Tip.setTip(250, (parseInt(width) - 240) / 2, null, null, 260, 80, '数据更新失败', 1);
				$timeout(Tip.hideTip, 3000);
    		}
    	});
	});
	
	$scope.removeRow = function(entity){
		//确认提示框
		//alert('确定删除');
		var data = {
			token: user.token,
			userid: entity.userid
		};
		console.log(ServiceConfig.user_delete);
		$http.post(ServiceConfig.user_delete, data).success(function(data){
			if(data.status){
				Tip.setTip(250, (parseInt(width) - 240) / 2, null, null, 260, 80, '删除成功......', 1);
				$timeout(Tip.hideTip, 3000);
			}else{
				Tip.setTip(250, (parseInt(width) - 240) / 2, null, null, 260, 80, '删除失败......', 1);
				$timeout(Tip.hideTip, 3000);
			}
		});
	};
	
    $scope.gridOptions = {
        data: 'myData',
        enablePaging: true,
		showFooter: true,
		enableCellEdit: true,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        multiSelect: false,
        selectedItems: $scope.mySelections,
        columnDefs: [
    		{field:'userid', displayName:'用户ID'},
    		{field:'email', displayName:'邮箱'}, 
    		{field:'tag', displayName:'角色'},
    		{field:'nickname', displayName:'昵称'},
    		{field:'realname', displayName:'真实姓名'},
    		{field:'tel', displayName:'电话'},
    		{ field: '慎重操作', cellTemplate: '<button class="user_btn" ng-click="removeRow(row.entity)">删除</button>' }
    	]
    };
    
    //搜索
    $scope.Search = function($event, choose, keywords){
    	if($event.keyCode === 13 || $event.which === 32){
    		var condition = '?token=' + user.token + '&';
    		var choose = choose || 'default';
    		switch(choose){
    			case 'email':
    				condition = condition + 'email=' + keywords;
    				break;
				case 'nickname':
					condition = condition + 'nickname=' + keywords;
    				break;
				case 'realname':
					condition = condition + 'realname=' + keywords;
    				break;
    			default:
    				console.log(keywords);
    				condition = condition + 'email=' + keywords;
    				break;
    		}
    		$http.get(ServiceConfig.user_getUserByCondition + condition).success(function(data){
				if(data.status){
					$scope.mySelections = data.items;
					//后期做一个弹出框，让用户自己选择查询到的用户，然后进行显示
					//或者展示出所有的用户信息
				}else{
					
				}
			});
    	}
    };
	
}]);






