angular.module("vlctiApp").controller("paymentEditController", function($scope, $routeParams, instituteFactory){
	$scope.paymentId = parseInt($routeParams.paymentId) ? $routeParams.paymentId : null;
	$scope.alerts = [];

	$scope.closeAlerts = function(Index){
		$scope.alerts.splice(Index, 1);
	}

	function init(){
		
		instituteFactory.Payment.get($scope.paymentId).success(function(Payment){
			$scope.payment = Payment;
			$scope.isValidPaymentId = true;

			instituteFactory.Agreement.get(Payment.agreementId).success(function(Agreement){
				$scope.agreement = Agreement;

				instituteFactory.Faculty.get(Agreement.facultyId).success(function(Faculty){
					$scope.faculty = Faculty;
				}).error(function(){
					$scope.alerts.push({type:"danger", msg:"Unable to get faculty details"});
				});
			}).error(function(){
				$scope.alerts.push({type:"danger", msg:"Unable to get agreement details"});
			});	
		}).error(function(){
			$scope.alerts.push({type:"danger", msg:"Unable to get payment details"});
			$scope.isValidPaymentId = false;
		});
	}

	$scope.updatePayment = function(){
		instituteFactory.Payment.update($scope.payment).success(function(paymentId){
			$scope.alerts.push({
				type:"success",
				msg:"Successfully updated payment."
			});
		}).error(function(){
			$scope.alerts.push({type:"danger", msg:"Unable to update payment"});
		});
	}

	init();	
});