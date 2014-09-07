var app = angular.module("vlcimApp",['ui.bootstrap','ngRoute']);

//app.controller = DatepickerDemoCtrl;

app.config(function($routeProvider,$httpProvider){
	$routeProvider.when('/',
		{
			controller: "linkController",
			templateUrl: "views/link.html"
		});
});

app.directive("studentdetails",function(){
	return {
		restrict:"E",
		templateUrl:"views/student-details.html",
		controller:function($scope, instituteFactory){
			$scope.load = function(studentid){
				instituteFactory.Student.get(studentid).success(function(data){
					$scope.student = data;
				});
			};
			
		},
		link:function(scope, element, attrs){
			scope.$watch(attrs.id,function(value){
				if(!angular.isUndefined(value))
					scope.load(value);
			});
		}
	};
});

app.directive("addstudent",function(){
	return {
		restrict:"E",
		scope:{
			fun:"&",
			selection:"&"
		},
		controller:function($scope, instituteFactory){
			$scope.stage=1;
			$scope.alerts = [];

			instituteFactory.Course.list().success(function(data){
				$scope.courses = data;
			});

			$scope.save = function(){
				$scope.stage=3;
				$scope.alerts.push({
					msg:'Successfully added.',
					type:"success", user:"Manoj Kumar P",
					userid:1
				});
			};

			$scope.closeAlert = function(index){
				$scope.alerts.splice(index,1);
				if($scope.alerts.length==0){
					$scope.stage=1;
					$scope.fun()(0);
				}
			}

 		},
		templateUrl:"views/student-add.html"
	};
});


app.controller("linkController",function($scope){
	$scope.stage=0;
	$scope.stateChange = function(val){
		$scope.stage=val;
	}
	$scope.studentDetails = function(studentid){
		$scope.stage=3;
		$scope.studentid = studentid;
	}
});


app.directive("searchstudent",function(){
	return {
		restrict:"E",
		scope:{
			student:"=",
			fun:"&",
			selection:"&"
		},
		controller:function($scope, instituteFactory){
			//	SETTINGS
			$scope.stage = 1;

			$scope.search = {};
			$scope.column = {name:"name",id:"id"};
		    $scope.itemsPerPage = 5;
		    $scope.maxSize = 5;

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
				$scope.stage=1;
				$scope.selection()(student.id);
			};

			$scope.filter = function(){
				$scope.currentPage = 1;
				$scope.load();
			};

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
	factory['Course'] = {
		list:function(){
			return $http.post(domain+"course/list.json");
		}
	}

	return factory;
});