

app.controller('UserController', function($scope, $http, $cookieStore, ServiceConfig) {
	var user = $cookieStore.get('user');
    var t = '54708d04f13af4683711434844F71FB1-A640-44DE-8ED1-0AFD3AB295B4';

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
    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
        setTimeout(function () {
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();
                $http.get(ServiceConfig.user_getAll + '?token=' + t).success(function (data) {
                    $scope.setPagingData(data.items,page,pageSize);
                });            
            } else {
                $http.get(ServiceConfig.user_getAll + '?token=' + t).success(function (data) {
                    $scope.setPagingData(data.items,page,pageSize);
                });
            }
        }, 100);
    };
	
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
	
    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
	
    $scope.gridOptions = {
        data: 'myData',
        enablePaging: true,
		showFooter: true,
		enableCellEdit: true, //可编辑
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,
        columnDefs: [
    		{field:'userid', displayName:'用户ID'},
    		{field:'email', displayName:'邮箱'}, 
    		{field:'tag', displayName:'角色'},
    		{field:'nickname', displayName:'昵称'},
    		{field:'realname', displayName:'真实姓名'},
    		{field:'tel', displayName:'电话'}
    	]
    };
	
});






