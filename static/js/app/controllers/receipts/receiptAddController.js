angular.module("vlctiApp").controller("receiptAddController", function($scope, $routeParams, instituteFactory, $location){
	$scope.contractId = parseInt($routeParams.contractId) ? $routeParams.contractId : null;
	$scope.alerts = [];

	$scope.closeAlerts = function(Index){
		$scope.alerts.splice(Index, 1);
	}

	function init(){
		
		instituteFactory.Contract.get($scope.contractId).success(function(Contract){
			$scope.contract = Contract;
			$scope.isValidContractId = true;

			instituteFactory.Student.get(Contract.studentId).success(function(Student){
				$scope.student = Student;
			}).error(function(){
				$scope.alerts.push({type:"danger", msg:"Unable to get student details"});
			});
		}).error(function(){
			$scope.alerts.push({type:"danger", msg:"Unable to get contract details"});
			$scope.isValidContractId = false;
		});	
	}

	$scope.saveReceipt = function(){
		$scope.receipt.contractId = $scope.contract.id;
		instituteFactory.Receipt.post($scope.receipt).success(function(receiptId){
			$scope.alerts.push({
				type:"success",
				msg:"Successfully added receipt.",
				receiptId:receiptId
			});
			$location.path("/contract/"+$scope.receipt.contractId+"/receipts");
			$scope.receipt = {};
		}).error(function(){
			$scope.alerts.push({type:"danger", msg:"Unable to add receipt"});
		});
	}

	init();
});