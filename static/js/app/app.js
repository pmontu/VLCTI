var app = angular.module("vlctiApp",['ui.bootstrap','ngRoute']);

//app.controller = DatepickerDemoCtrl;

app.config(function($routeProvider,$httpProvider){
	
	$routeProvider.when('/',{
			controller: "studentsController",
			templateUrl: "views/students/students.html"
		
		}).when("/student/:studentId/edit",{
			controller: "studentEditController",
			templateUrl: "views/students/studentEdit.html"
		
		}).when('/student/add',{
			controller: "studentAddController",
			templateUrl: "views/students/studentAdd.html"
		
		}).when('/student/:studentId/contracts',{
			controller: "studentContractsController",
			templateUrl: "views/students/studentContracts.html"



		}).when('/student/:studentId/contract/add',{
			controller: "contractAddController",
			templateUrl: "views/contracts/contractAdd.html"

		}).when('/contract/:contractId/edit',{
			controller: "contractEditController",
			templateUrl: "views/contracts/contractEdit.html"

		}).when('/contract/:contractId/subjects',{
			controller: "contractSubjectsController",
			templateUrl: "views/contracts/contractSubjects.html"



		}).when('/faculties',{
			controller: "facultiesController",
			templateUrl: "views/faculties/faculties.html"
		}).when('/faculty/:facultyId/edit',{
			controller: "facultyEditController",
			templateUrl: "views/faculties/facultyEdit.html"
		}).when('/faculty/add',{
			controller: "facultyAddController",
			templateUrl: "views/faculties/facultyAdd.html"
		}).when('/faculty/:facultyId/agreements',{
			controller: "facultyAgreementsController",
			templateUrl: "views/faculties/facultyAgreements.html"


		}).when('/faculty/:facultyId/agreement/add',{
			controller: "agreementAddController",
			templateUrl: "views/agreements/agreementAdd.html"
		}).when('/agreement/:agreementId/edit',{
			controller: "agreementEditController",
			templateUrl: "views/agreements/agreementEdit.html"
		}).when('/agreement/:agreementId/groups',{
			controller: "agreementGroupsController",
			templateUrl: "views/agreements/agreementGroups.html"


		}).when('/user/login',{
			controller: "userLoginController",
			templateUrl: "views/users/userLogin.html"
		}).when('/user/logout',{
			controller: "userLogoutController",
			templateUrl: "views/users/userLogout.html"
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
		},
		contracts:function(id){
			return $http.get(domain+"student/"+id+"/contracts.json");
		}
	};
	factory['Course'] = {
		list:function(){
			return $http.post(domain+"course/list.json");
		}
	};
	factory['Contract'] = {
		post:function(Data){
			return $http.post(domain+"contract/post.json",Data);
		},
		get:function(Id){
			return $http.get(domain+"contract/"+Id+"/get.json");
		},
		update:function(Data){
			return $http.post(domain+"contract/update.json",Data);
		},
		subjects:function(Id){
			return $http.get(domain+"contract/"+Id+"/subjects.json");
		}
	};
	factory['Faculty'] = {
		list:function(Query){
			return $http.post(domain+"faculty/list.json",Query);
		},
		get:function(Id){
			return $http.get(domain+"faculty/"+Id+"/get.json");
		},
		update:function(Data){
			return $http.post(domain+"faculty/update.json",Data);
		},
		post:function(Data){
			return $http.post(domain+"faculty/post.json",Data);
		},
		agreements:function(Id){
			return $http.get(domain+"faculty/"+Id+"/agreements.json");
		}
	}
	factory['Agreement'] = {
		post:function(Data){
			return $http.post(domain+"agreement/post.json",Data);
		},
		get:function(Id){
			return $http.get(domain+"agreement/"+Id+"/get.json");
		},
		update:function(Data){
			return $http.post(domain+"agreement/update.json",Data);
		},
		groups:function(Id){
			return $http.get(domain+"agreement/"+Id+"/groups.json");
		}
	}
	factory['Circle'] = {
		list:function(){
			return $http.post(domain+"circle/list.json");
		}
	};
	factory['User'] = {
		login:function(User){
			return $http.post(domain+"user/login.json",User);
		},
		logout:function(){
			return $http.post(domain+"user/logout.json");
		},
		info:function(){
			return $http.post(domain+"user/info.json");
		}
	};

	return factory;
});