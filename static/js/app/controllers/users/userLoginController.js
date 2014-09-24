angular.module("vlctiApp").controller("userLoginController",function($scope, instituteFactory, $location){

	$scope.alerts = [];

	$scope.login = function(){

		instituteFactory.User.login($scope.user).success(function(data){
			$location.path("/faculties");
		}).error(function(){
			$scope.alerts.push({type:"danger", msg:"Authentication Failed"})
		});
	};

	$scope.resetAlerts = function(){
		$scope.alerts=[];
	};

	$scope.closeAlert = function(Index){
		$scope.alerts.splice(Index,1);
	};

});