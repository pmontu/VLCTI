angular.module("vlctiApp").controller("facultyAgreementsController",
	function($scope, instituteFactory, $routeParams){
		
		$scope.facultyId = parseInt($routeParams.facultyId) ? $routeParams.facultyId : 0;
		$scope.alerts= [];

		function init(){

			instituteFactory.Faculty.get($scope.facultyId).success(function(faculty){
				
				$scope.faculty = faculty;
				$scope.validStudentId = true;

				instituteFactory.Faculty.agreements($scope.facultyId).success(function(agreements){
					$scope.agreements = agreements;
				}).error(function(status){
					$scope.alerts.push({type:"danger", msg:"Error obtaining agreements for "+$scope.faculty.name});
				});

			}).error(function(){
				$scope.validStudentId = false;
				$scope.alerts.push({type:"danger", msg:"Error obtaining details for Id: "+$scope.facultyId});
			});


		}

		$scope.closeAlert = function(Index){
			$scope.alerts.splice(Index,1);
		};


		init();



});
