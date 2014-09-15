angular.module("vlctiApp").controller("userLogoutController",function($scope, instituteFactory, $location){

	$scope.alerts = [];


	instituteFactory.User.logout().success(function(data){
		$scope.alerts.push({type:"info", msg:"Session closed."});
	}).error(function(){
		$scope.alerts.push({type:"danger", msg:"Problem with server"});
	});
	
	$scope.closeAlert = function(Index){
		$scope.alerts.splice(Index,1);
	};

});