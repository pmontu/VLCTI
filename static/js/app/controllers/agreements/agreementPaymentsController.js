angular.module("vlctiApp").controller("agreementPaymentsController", function($scope, instituteFactory, $routeParams){
	$scope.agreementId = parseInt($routeParams.agreementId) ? $routeParams.agreementId : null;
	$scope.alerts = [];
	payments = [];
	$scope.itemsPerPage = 5;
	$scope.currentPage = 1;

	$scope.closeAlerts = function(Index){
		$scope.alerts.splice(Index, 1);
	}

	function init(){
		

		instituteFactory.Agreement.get($scope.agreementId).success(function(Agreement){
			$scope.agreement = Agreement;
			$scope.isValidAgreementId = true;

			instituteFactory.Agreement.payments(Agreement.id).success(function(Payments){
				payments = Payments;
				$scope.totalItems = payments.length;
				$scope.payments = payments.slice(0, $scope.itemsPerPage);
			}).error(function(){
				$scope.alerts.push({type:"danger", msg:"Unable to get list of payments"});
			});

			instituteFactory.Faculty.get(Agreement.facultyId).success(function(Faculty){
				$scope.faculty = Faculty;
			}).error(function(){
				$scope.alerts.push({type:"danger", msg:"Unable to get faculty details"});
			});
		}).error(function(){
			$scope.alerts.push({type:"danger", msg:"Unable to get agreement details"});
			$scope.isValidAgreementId = false;
		});
	}

	$scope.pageChanged = function(){
		var start = (($scope.currentPage - 1) * $scope.itemsPerPage);
		var end = start + $scope.itemsPerPage;
		$scope.payments = payments.slice(start, end);
	}

	init();
});