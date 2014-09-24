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

		}).when('/contract/:contractId/receipts',{
			controller: "contractReceiptsController",
			templateUrl: "views/contracts/contractReceipts.html"



		}).when('/contract/:contractId/subject/add',{
			controller: "subjectAddController",
			templateUrl: "views/subjects/subjectAdd.html"

		}).when('/subject/:subjectId/edit',{
			controller: "subjectEditController",
			templateUrl: "views/subjects/subjectEdit.html"



		}).when('/contract/:contractId/receipt/add',{
			controller: "receiptAddController",
			templateUrl: "views/receipts/receiptAdd.html"

		}).when('/receipt/:receiptId/edit',{
			controller: "receiptEditController",
			templateUrl: "views/receipts/receiptEdit.html"



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
		}).when('/agreement/:agreementId/payments',{
			controller: "agreementPaymentsController",
			templateUrl: "views/agreements/agreementPayments.html"


		}).when('/user/login',{
			controller: "userLoginController",
			templateUrl: "views/users/userLogin.html"
		}).when('/user/logout',{
			controller: "userLogoutController",
			templateUrl: "views/users/userLogout.html"


		}).when('/agreement/:agreementId/group/add',{
			controller: "groupAddController",
			templateUrl: "views/groups/groupAdd.html"
		}).when('/group/:groupId/edit',{
			controller: "groupEditController",
			templateUrl: "views/groups/groupEdit.html"



		}).when('/agreement/:agreementId/payment/add',{
			controller: "paymentAddController",
			templateUrl: "views/payments/paymentAdd.html"

		}).when('/payment/:paymentId/edit',{
			controller: "paymentEditController",
			templateUrl: "views/payments/paymentEdit.html"
		});
});




app.factory('instituteFactory', function($http){

	var factory = {};
	var domain = window.location.hostname + "/";

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
		},
		subjects:function(Id){
			return $http.get(domain+"course/"+Id+"/subjects.json");
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
		},
		receipts:function(Id){
			return $http.get(domain+"contract/"+Id+"/receipts.json");
		}
	};
	factory['Subject'] = {
		post:function(Data){
			return $http.post(domain+"subject/post.json",Data);
		},
		get:function(Id){
			return $http.get(domain+"subject/"+Id+"/get.json");
		},
		update:function(Data){
			return $http.post(domain+"subject/update.json",Data);
		}
	};
	factory['Receipt'] = {
		post:function(Data){
			return $http.post(domain+"receipt/post.json",Data);
		},
		get:function(Id){
			return $http.get(domain+"receipt/"+Id+"/get.json");
		},
		update:function(Data){
			return $http.post(domain+"receipt/update.json",Data);
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
		},
		payments:function(Id){
			return $http.get(domain+"agreement/"+Id+"/payments.json");
		}
	}
	factory['Group'] = {
		post:function(Data){
			return $http.post(domain+"group/post.json",Data);
		},
		update:function(Data){
			return $http.post(domain+"group/update.json",Data);
		},
		get:function(Id){
			return $http.get(domain+"group/"+Id+"/get.json");
		},
		list:function(Filters){
			return $http.post(domain+"group/list.json",Filters);
		}
	}
	factory['Payment'] = {
		post:function(Data){
			return $http.post(domain+"payment/post.json",Data);
		},
		get:function(Id){
			return $http.get(domain+"payment/"+Id+"/get.json");
		},
		update:function(Data){
			return $http.post(domain+"payment/update.json",Data);
		}
	};
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