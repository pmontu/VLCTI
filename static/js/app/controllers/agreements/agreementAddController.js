angular.module("vlctiApp").controller("agreementAddController",
	function($scope, instituteFactory, $routeParams){
		
		$scope.alerts= [];
		$scope.facultyId = parseInt($routeParams.facultyId) ? $routeParams.facultyId : 0;
		$scope.agreement = {};

		function init(){

			instituteFactory.Faculty.get($scope.facultyId).success(function(Faculty){
				$scope.faculty = Faculty;
				$scope.validFacultyId = true;
			}).error(function(){
				$scope.validFacultyId = false;
				$scope.alerts.push({type:"danger", msg:"Error obtaining details for faculty Id: "+$scope.facultyId});
			});

		}

		$scope.closeAlert = function(Index){
			$scope.alerts.splice(Index,1);
		};

		$scope.saveAgreement = function(){

			$scope.agreement.facultyId = $scope.faculty.id;
			instituteFactory.Agreement.post($scope.agreement).success(function(data){
				$scope.alerts.push({
					type:"success",
					msg:"Successfully added agreement",
					facultyName:$scope.faculty.name,
					agreementId:data
				});

			$scope.agreement = {}


			}).error(function(data, status){
				$scope.alerts.push({type:"danger", msg:"Error: "+status});
			});
		};

		init();



});
