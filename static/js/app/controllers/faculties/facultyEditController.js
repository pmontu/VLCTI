angular.module("vlctiApp").controller("facultyEditController",
	function($scope, instituteFactory, $routeParams){
		
		$scope.FacultyId = parseInt($routeParams.facultyId) ? $routeParams.facultyId : 0;
		$scope.alerts= [];

		function init(){

			instituteFactory.Faculty.get($scope.FacultyId).success(function(Faculty){
				$scope.faculty = Faculty;
				$scope.validFacultyId = true;
			}).error(function(data, status){
				$scope.validFacultyId = false;
				$scope.alerts.push({type:"danger", msg:"Error obtaining details for faculty id: "+$scope.FacultyId});
			});

			instituteFactory.Circle.list().success(function(circles){
	    		$scope.circles = circles;
	    	});

		}

		$scope.closeAlert = function(Index){
			$scope.alerts.splice(Index,1);
		};

		$scope.updateFaculty = function(){

			instituteFactory.Faculty.update($scope.faculty).success(function(Id){
				$scope.alerts.push({type:"success", msg:"Updated id: #"+Id})

			}).error(function(data, status){
				$scope.alerts.push({type:"danger", msg:"Error: #"+status});
			})
		};

		init();



});
