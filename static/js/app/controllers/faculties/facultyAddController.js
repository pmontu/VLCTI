angular.module("vlctiApp").controller("facultyAddController",
	function($scope, instituteFactory, $routeParams, $location){
		
		$scope.alerts= [];

		function init(){

			instituteFactory.Circle.list().success(function(circles){
	    		$scope.circles = circles;
	    	});

		}

		$scope.closeAlert = function(Index){
			$scope.alerts.splice(Index,1);
		};

		$scope.saveFaculty = function(){

			instituteFactory.Faculty.post($scope.faculty).success(function(facultyId){
				$scope.alerts.push({
					type:"success",
					msg:"Successfully Added.",
					facultyName:$scope.faculty.name,
					facultyId:facultyId
				});

				$location.path("/faculty/"+facultyId+"/agreement/add");

				$scope.faculty = {};

			}).error(function(data, status){
				$scope.alerts.push({type:"danger", msg:"Error: #"+status});
			})
		};

		init();



});
