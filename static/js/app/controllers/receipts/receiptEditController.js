angular.module("vlctiApp").controller("receiptEditController", function($scope, $routeParams, instituteFactory){
	$scope.receiptId = parseInt($routeParams.receiptId) ? $routeParams.receiptId : null;
	$scope.alerts = [];

	$scope.closeAlerts = function(Index){
		$scope.alerts.splice(Index, 1);
	}

	function init(){
		
		instituteFactory.Receipt.get($scope.receiptId).success(function(Receipt){
			$scope.receipt = Receipt;
			$scope.isValidReceiptId = true;

			instituteFactory.Contract.get(Receipt.contractId).success(function(Contract){
				$scope.contract = Contract;

				instituteFactory.Student.get(Contract.studentId).success(function(Student){
					$scope.student = Student;
				}).error(function(){
					$scope.alerts.push({type:"danger", msg:"Unable to get student details"});
				});
			}).error(function(){
				$scope.alerts.push({type:"danger", msg:"Unable to get contract details"});
			});	
		}).error(function(){
			$scope.alerts.push({type:"danger", msg:"Unable to get contract details"});
			$scope.isValidReceiptId = false;
		});
	}

	$scope.updateReceipt = function(){
		instituteFactory.Receipt.update($scope.receipt).success(function(receiptId){
			$scope.alerts.push({
				type:"success",
				msg:"Successfully updated receipt."
			});
		}).error(function(){
			$scope.alerts.push({type:"danger", msg:"Unable to update receipt"});
		});
	}

	init();	
});