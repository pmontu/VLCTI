angular.module("vlctiApp").directive("navbar",function (){
	return {
		restrict:"E",
		scope:{},
		templateUrl:"views/navigation/navbar.html",
		controller:function($scope, instituteFactory, $location){
			
			instituteFactory.User.info().success(function(user){
				$scope.user = user;
			}).error(function(){
				$location.path("/user/login")
			});
		}
	}
})