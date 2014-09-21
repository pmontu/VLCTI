angular.module("vlctiApp").controller("paymentAddController", function($scope, $routeParams, instituteFactory, $location){
	$scope.agreementId = parseInt($routeParams.agreementId) ? $routeParams.agreementId : null;
	$scope.alerts = [];

	$scope.closeAlerts = function(Index){
		$scope.alerts.splice(Index, 1);
	}

	function init(){
		
		instituteFactory.Agreement.get($scope.agreementId).success(function(Agreement){
			$scope.agreement = Agreement;
			$scope.isValidAgreementId = true;

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

	$scope.savePayment = function(){
		$scope.payment.agreementId = $scope.agreement.id;
		instituteFactory.Payment.post($scope.payment).success(function(paymentId){
			$scope.alerts.push({
				type:"success",
				msg:"Successfully added payment.",
				paymentId:paymentId
			});
			$location.path("/agreement/"+$scope.payment.agreementId+"/payments");
			$scope.payment = {};
		}).error(function(){
			$scope.alerts.push({type:"danger", msg:"Unable to add payment"});
		});
	}

	init();
});