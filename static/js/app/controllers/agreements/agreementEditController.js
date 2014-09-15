angular.module("vlctiApp").controller("agreementEditController",
	function($scope, instituteFactory, $routeParams){
		
		$scope.alerts= [];
		$scope.agreementId = parseInt($routeParams.agreementId) ? $routeParams.agreementId : 0;

		function init(){

			instituteFactory.Agreement.get($scope.agreementId).success(function(Agreement){
				$scope.agreement = Agreement;
				$scope.validAgreementId = true;

				instituteFactory.Faculty.get($scope.agreement.facultyId).success(function(Faculty){
					$scope.faculty = Faculty;
				});

			}).error(function(){
				$scope.validAgreementId = false;
				$scope.alerts.push({type:"danger", msg:"Error obtaining details for agreement Id: "+$scope.agreementId});
			});

		}

		$scope.closeAlert = function(Index){
			$scope.alerts.splice(Index,1);
		};

		$scope.updateAgreement = function(){

			instituteFactory.Agreement.update($scope.agreement).success(function(agreementId){
				
				$scope.alerts.push({type:"success", msg:"Successfully updated agreement id #"+agreementId});


			}).error(function(data, status){
				$scope.alerts.push({type:"danger", msg:"Error: "+status});
			})
		};

		init();



});
