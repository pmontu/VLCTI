angular.module("vlctiApp").controller("contractEditController",
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

			}).error(function(status){
				$scope.validContractId = false;
				$scope.alerts.push({type:"danger", msg:"Error obtaining details for contract Id: "+$scope.contractId});
			});

		}

		$scope.closeAlert = function(Index){
			$scope.alerts.splice(Index,1);
		};

		$scope.updateContract = function(){

			instituteFactory.Contract.update($scope.contract).success(function(contractId){
				
				$scope.alerts.push({type:"success", msg:"Successfully added contract: "+contractId});


			}).error(function(data, status){
				$scope.alerts.push({type:"danger", msg:"Error: "+status});
			})
		};

		init();



});
