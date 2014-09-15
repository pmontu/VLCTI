angular.module("vlctiApp").controller("facultiesController",function($scope, instituteFactory){
	//	SETTINGS
	$scope.stage = 1;

	$scope.search = {};
    $scope.itemsPerPage = 10;
    $scope.maxSize = 5;

    $scope.SortByColumnEnum = {
    	name:"name",
    	id:"id"
    };

    $scope.DisplayModeEnum = {
    	Card:0,
    	List:1
    };

    $scope.changeDisplayMode = function(DisplayMode){

    	switch(DisplayMode){
    		case $scope.DisplayModeEnum.Card:
    			$scope.listDisplayModeEnabled = false;
    			break;
    		case $scope.DisplayModeEnum.List:
    			$scope.listDisplayModeEnabled = true;
    			break;
    	}
    }

	//  STAGE 0 - STUDENTS
	$scope.reload = function(){

		$scope.search = {};
		$scope.search.orderBy = $scope.SortByColumnEnum.id;
		$scope.sortDirection = true;
    	$scope.currentPage = 1;

		$scope.load();

	};

	//  STAGE 1 - STUDENTS
	$scope.load = function(){


		//  FETCH STUDENTS
		$scope.requestData = {
			"name":$scope.search.name,
			"id":$scope.search.id != null ? $scope.search.id : 0,
			"sex":$scope.search.sex,
			"orderby":$scope.search.orderBy,
			"items":$scope.itemsPerPage,
			"page":$scope.currentPage,
			"direction":$scope.sortDirection,
			"circle":$scope.search.circle
		}

		instituteFactory.Faculty.list($scope.requestData).success(function(result){
			$scope.faculties = result.faculties;
            $scope.totalItems = result.queryresultsetlength;
            $scope.total = result.totallength;

		});

	};

	$scope.orderByStudents = function(SortByColumn){
		$scope.search.orderBy = SortByColumn;
		$scope.currentPage = 1;
		$scope.load();
	};


	$scope.filter = function(){
		$scope.currentPage = 1;
		$scope.load();
	};


    function init(){

    	instituteFactory.Circle.list().success(function(circles){
    		$scope.circles = circles;
    	});

    	$scope.changeDisplayMode($scope.DisplayModeEnum.List);

    	$scope.reload();
    }

    init();

});