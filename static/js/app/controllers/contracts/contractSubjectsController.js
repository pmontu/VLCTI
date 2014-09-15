angular.module("vlctiApp").controller("contractSubjectsController",
	function($scope, instituteFactory, $routeParams){

		$scope.alerts= [];
		$scope.contractId = parseInt($routeParams.contractId) ? $routeParams.contractId : 0;

		function init(){

			instituteFactory.Contract.get($scope.contractId).success(function(contract){
				$scope.contract = contract;
				$scope.validContractId = true;

				instituteFactory.Student.get($scope.contract.studentId).success(function(student){
					$scope.student = student;
				});

				instituteFactory.Contract.subjects($scope.contract.id).success(function(subjects){
					$scope.subjects = subjects;
				});

			}).error(function(status){
				$scope.validContractId = false;
				$scope.alerts.push({type:"danger", msg:"Error obtaining details for contract Id: "+$scope.contractId});
			});

		}

		$scope.closeAlert = function(Index){
			$scope.alerts.splice(Index,1);
		};


		init();

	}
);