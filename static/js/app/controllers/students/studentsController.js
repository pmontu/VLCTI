angular.module("vlctiApp").controller("studentsController",function($scope, instituteFactory){

    $scope.DisplayModeEnum = {
    	Card:0,
    	List:1
    }

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

		$scope.search.name = "";
		$scope.search.id = 0;
		$scope.search.orderBy = $scope.column.id;
		$scope.sortDirection = true;
    	$scope.currentPage = 1;

		$scope.load();

	};

	//  STAGE 1 - STUDENTS
	$scope.load = function(){


		//  FETCH STUDENTS
		var requestData = {
			"name":$scope.search.name != null ? $scope.search.name : "",
			"id":$scope.search.id != null ? $scope.search.id : 0,
			"orderby":$scope.search.orderBy,
			"items":$scope.itemsPerPage,
			"page":$scope.currentPage,
			"direction":$scope.sortDirection
		}

		instituteFactory.Student.list(requestData).success(function(data){
			//if(data.students.length>0)
			{
				$scope.students = data.students;
                $scope.totalItems = data.queryresultsetlength;
                $scope.total = data.totallength;

			}

		});

	};

	$scope.orderByStudents = function(column){
		$scope.search.orderBy = column;
		$scope.currentPage = 1;
		$scope.load();
	};


	$scope.filter = function(){
		$scope.currentPage = 1;
		$scope.load();
	};


    function init(){

		$scope.search = {};
		$scope.column = {name:"name",id:"id"};
	    $scope.itemsPerPage = 10;
	    $scope.maxSize = 5;

    	$scope.changeDisplayMode($scope.DisplayModeEnum.List);

    	$scope.reload();
    }

    init();

});