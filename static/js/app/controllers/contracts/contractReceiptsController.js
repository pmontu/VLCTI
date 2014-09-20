angular.module("vlctiApp").controller("contractReceiptsController", function($scope, instituteFactory, $routeParams){
	$scope.contractId = parseInt($routeParams.contractId) ? $routeParams.contractId : null;
	$scope.alerts = [];
	receipts = [];
	$scope.itemsPerPage = 5;
	$scope.currentPage = 1;

	$scope.closeAlerts = function(Index){
		$scope.alerts.splice(Index, 1);
	}

	function init(){
		

		instituteFactory.Contract.get($scope.contractId).success(function(Contract){
			$scope.contract = Contract;
			$scope.isValidContractId = true;

			instituteFactory.Contract.receipts($scope.contractId).success(function(Receipts){
				receipts = Receipts;
				$scope.totalItems = receipts.length;
				$scope.receipts = Receipts.slice(0, $scope.itemsPerPage);
			}).error(function(){
				$scope.alerts.push({type:"danger", msg:"Unable to get list of receipts"});
			});

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

	$scope.pageChanged = function(){
		var start = (($scope.currentPage - 1) * $scope.itemsPerPage);
		var end = start + $scope.itemsPerPage;
		$scope.receipts = receipts.slice(start, end);
	}

	init();
});