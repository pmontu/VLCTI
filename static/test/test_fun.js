var app=angular.module("app",[]);
app.controller("one",function($scope){
	$scope.num={data:10};
	$scope.test = function(data){
		$scope.num = data;
	};
});
app.directive("new",function(){
	return {
		controller:function($scope){
			$scope.fun = function(){
				$scope.action()({data:20});
			};
		},
		restrict:"E",
		scope:{
			action:"&",
			obj:"="
		},
		template:'<button ng-click="fun()">inc</button>'
	};
});