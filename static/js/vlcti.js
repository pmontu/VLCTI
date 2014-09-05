var app = angular.module("vlcimApp",['ui.bootstrap','ngRoute']);

//app.controller = DatepickerDemoCtrl;

app.config(function($routeProvider,$httpProvider){
	$routeProvider.when('/',
		{
			controller: "studentsController",
			templateUrl: "views/students.html"
		});
});

app.controller('studentsController',function($scope,instituteFactory){
	$scope.selectSubjects = function(subjects){
		$scope.subjects = subjects;
	};
	$scope.reset = function(){
		$scope.subjects = null;
		$scope.student = null;
		$scope.info = null;
	};
	$scope.get = function(student){
		$scope.student = student;
		instituteFactory.Student.get(student.id).success(function(data){
			$scope.info = data;
		});
	};
	$scope.updatedetails = function(){
		
	};
});

app.directive("contractadd",function(){
	return {
		restrict:"E",
		scope:{},
		controller:function($scope){},
		templateUrl:"views/contract-add.html"
	};
});

app.directive("studentsearch",function(){
	return {
		restrict:"E",
		scope:{
			action:"&",
			reset:"&"
		},
		controller:function($scope, instituteFactory){
			//	SETTINGS
			$scope.search = {};
			$scope.column = {name:"name",id:"id"};
		    $scope.itemsPerPage = 5;
		    $scope.maxSize = 5;

			//  STAGE 0 - STUDENTS
			$scope.reload = function(){

				$scope.reset();

				$scope.search.name = "";
				$scope.search.id = 0;
				$scope.search.orderBy = $scope.column.id;
				$scope.sortDirection = true;
		    	$scope.currentPage = 1;

				$scope.load();

			};

			//  STAGE 1 - STUDENTS
			$scope.load = function(){

				//  RESET
				$scope.selected = null;


				//  FETCH STUDENTS
				var requestData = {
					"name":$scope.search.name,
					"id":$scope.search.id,
					"orderby":$scope.search.orderBy,
					"items":$scope.itemsPerPage,
					"page":$scope.currentPage,
					"direction":$scope.sortDirection
				}

				instituteFactory.Student.list(requestData).success(function(data){
					if(data.students.length>0){
						$scope.students = data.students;
		                $scope.totalItems = data.totallength;

					}

				});

			};

			$scope.orderByStudents = function(column){
				$scope.search.orderBy = column;
				$scope.currentPage = 1;
				$scope.load();
			};


			//  STAGE 2
			$scope.select = function(student){
				$scope.selected = student
				$scope.action()(student);
			};

			$scope.filter = function(){
				$scope.currentPage = 1;
				$scope.load();
			};

			//  INITIALISE
			$scope.reload();
		},
		templateUrl:"views/student-search.html"
	};
});

app.factory('instituteFactory', function($http){

	var factory = {};
	var domain = "http://127.0.0.1:12346/institute/";

	factory['Student'] = {
		get:function(id){
			return $http.get(domain+"student/"+id+"/get.json");
		},
		list:function(search){
		return $http.post(domain+"student/list.json",search);
		}
	};

	return factory;
});