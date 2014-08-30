var app = angular.module("vlcimApp",['ui.bootstrap','ngRoute']);

//app.controller = DatepickerDemoCtrl;

app.config(function($routeProvider,$httpProvider){
	$routeProvider.when('/students',
		{
			controller: "studentsController",
			templateUrl: "views/students.html"
		});
});

app.controller('studentsController',function($scope,instituteFactory){
	
});


app.directive("search",function(){
	return {
		restrict:"E",
		scope:{
			type:'@'
		},
		controller:function($scope){

			$scope.settings = {
				student:{
					columns:[
						{name:"name",type:"text",search:true},
						{name:"id",type:"number",search:true}
					]
				}
			};

			$scope.filter = function(){
				$scope.val = 10;
			};

		},
		templateUrl:"views/search.html",
		link:function($scope,element,attrs){
		}
	};
});
app.directive("inputs",function($compile){
	return{
		restrict:"E",
		scope:{
			fun:"&"
		},
		template:"<button ng-click='fun()'>click</button>",
		link:function($scope,element,attrs){
			//e = angular.element('<input class="form-control" type="text" placeholder="Name" ng-change="test()"/>');
			//element.append(e);
		}
	};
});
app.factory('instituteFactory', function($http){

	var factory = {};
	var domain = "http://192.168.0.2:12346/institute/";

	factory.getStudents = function(search){
		return $http.post(domain+"student/list.json",search);
	};

	return factory;
});