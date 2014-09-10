var app = angular.module("vlctiApp",['ui.bootstrap','ngRoute']);

//app.controller = DatepickerDemoCtrl;

app.config(function($routeProvider,$httpProvider){
	$routeProvider.when('/',
		{
			controller: "studentsController",
			templateUrl: "views/students/students.html"
		}).when("/student/:studentId",
		{
			controller: "studentEditController",
			templateUrl: "views/students/studentEdit.html"
		}).when('/studentadd',{

			controller: "studentAddController",
			templateUrl: "views/students/studentAdd.html"
		});
});


app.factory('instituteFactory', function($http){

	var factory = {};
	var domain = "http://127.0.0.1:12346/institute/";

	factory['Student'] = {
		get:function(id){
			return $http.get(domain+"student/"+id+"/get.json");
		},
		list:function(search){
			return $http.post(domain+"student/list.json",search);
		},
		post:function(data){
			return $http.post(domain+"student/post.json",data);
		},
		update:function(Data){
			return $http.post(domain+"student/update.json",Data);
		}
	};
	factory['Course'] = {
		list:function(){
			return $http.post(domain+"course/list.json");
		}
	}

	return factory;
});