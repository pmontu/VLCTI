angular.module("vlctiApp").controller("studentEditController",
	function($scope, instituteFactory, $routeParams){
		
		$scope.id = parseInt($routeParams.studentId) ? $routeParams.studentId : 0;
		$scope.alerts= [];

		function init(){

			instituteFactory.Student.get($scope.id).success(function(data){
				$scope.student = data;
				$scope.validStudentId = true;
			}).error(function(status){
				$scope.validStudentId = false;
				$scope.alerts.push({type:"danger", msg:"Error obtaining details for Id: "+$scope.id});
			});

			instituteFactory.Course.list().success(function(data){
				$scope.courses = data;
			}).error(function(status){
				$scope.alerts.push({type:"warning", msg:"Unable to obtain list of courses"});
			});

		}

		$scope.closeAlert = function(Index){
			$scope.alerts.splice(Index,1);
		};

		$scope.updateStudent = function(){

			instituteFactory.Student.update($scope.student).success(function(data){
				$scope.alerts.push({type:"success", msg:"Updated successfully: "+data})

			}).error(function(data, status){
				$scope.alerts.push({type:"danger", msg:"Error: "+status});
			})
		};

		init();



});
