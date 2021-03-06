angular.module("vlctiApp").controller("studentAddController",
	function($scope, instituteFactory, $location){
		
		$scope.alerts= [];

		function init(){

			instituteFactory.Course.list().success(function(data){
				$scope.courses = data;
			}).error(function(status){
				$scope.alerts.push({type:"warning", msg:"Unable to obtain list of courses"});
			});

		}

		$scope.closeAlert = function(Index){
			$scope.alerts.splice(Index,1);
		};

		$scope.addStudent = function(){

			instituteFactory.Student.post($scope.student).success(function(studentId){
				$scope.alerts.push({
					type:"success",
					msg:"Successfully added user",
					studentName:$scope.student.name,
					studentId:studentId
				});

				$location.path("/student/"+studentId+"/contract/add");

				$scope.student={};


			}).error(function(data, status){
				$scope.alerts.push({type:"danger", msg:"Error: "+status});
			})
		};

		init();



});
