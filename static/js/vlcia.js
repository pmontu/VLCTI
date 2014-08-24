var app = angular.module("vlcimApp",['ui.bootstrap','ngRoute']);

//app.controller = DatepickerDemoCtrl;

app.config(function($routeProvider,$httpProvider){
  $routeProvider.when('/',
    {
      controller: "receiptsController",
      templateUrl: "views/receipts.html"
    })
  .when('/students',
    {
      controller:"studentsController",
      templateUrl:"views/students.html"
    });
  $httpProvider.defaults.transformRequest = function(data){
    if (data === undefined) {
      return data;
    }
    console.log($.param(data));
    return $.param(data);
  };
});

app.controller("receiptsController",function($scope,instituteFactory){

});

app.controller("studentsController",function($scope){

});

app.controller('studentsDirectiveController',function($scope,instituteFactory){
  
  $scope.searchStudentForm = {};

  //  STAGE 0 - STUDENTS
  $scope.reloadStudents = function(){

    $scope.searchStudentForm.name = "";
    $scope.searchStudentForm.id = 0;
    $scope.searchStudentForm.orderBy = "id";
    $scope.sortDirection = true;
    $scope.page = 1;

    $scope.refreshStudents();
  };

  //  STAGE 1 - STUDENTS
  $scope.refreshStudents = function(){

    //  RESET
    $scope.filterStudent = null;


    //  FETCH STUDENTS
    var requestData = {
      "name":$scope.searchStudentForm.name,
      "id":$scope.searchStudentForm.id,
      "orderby":$scope.searchStudentForm.orderBy,
      "items":4,
      "page":$scope.page,
      "direction":$scope.sortDirection
    }
    instituteFactory.getStudents(requestData).success(function(data){
      if(data.students.length>0){
        $scope.students = data.students;
        
        //  SEND MESSAGE TO PAGER
        requestDataPager = {
          totalItems:data.totallength,
          currentPage:requestData.page,
          itemsPerPage:requestData.items

        };
        $scope.$broadcast('initPagination',requestDataPager);
      }

    });

  };

  $scope.orderByStudents = function(column){
    $scope.searchStudentForm.orderBy = column;
    $scope.page = 1;
    $scope.refreshStudents();
  };


  //  STAGE 2 - RECEIPTS
  $scope.refreshContracts = function(student){
    $scope.filterStudent = student;

  };

  $scope.filter = function(){
    $scope.page = 1;
    $scope.refreshStudents();
  }

  $scope.$on('pageChanged',function(event,data){
    $scope.page = data;
    console.log(data);
    $scope.refreshStudents();
  });

  //  INITIALISE
  $scope.reloadStudents();
});

app.directive("students",function(){
  return {templateUrl:"directives/students.html"};
});


app.controller('paginationController', function ($scope) {
  $scope.maxSize = 5;

  $scope.pageChanged = function() {
    $scope.$emit('pageChanged',$scope.currentPage);
  };

  $scope.$on('initPagination',function(event,data){
    $scope.totalItems = data.totalItems;
    $scope.currentPage = data.currentPage;
    $scope.itemsPerPage = data.itemsPerPage;
  });

});


app.factory('instituteFactory', function($http){

  var factory = {};
  var domain = "http://127.0.0.1:12346/institute/";

  //$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


  factory.getStudents = function(search){
    return $http.post(domain+"student/list.json",search);
  };

  return factory;
});