angular.module("vlctiApp").controller("studentContractsController",
	function($scope, instituteFactory, $routeParams){
		
		$scope.id = parseInt($routeParams.studentId) ? $routeParams.studentId : 0;
		$scope.alerts= [];

		function init(){

			instituteFactory.Student.get($scope.id).success(function(student){
				
				$scope.student = student;
				$scope.validStudentId = true;

				instituteFactory.Student.contracts($scope.id).success(function(contracts){
					$scope.contracts = contracts;
				}).error(function(status){
					$scope.alerts.push({type:"danger", msg:"Error obtaining contracts for "+$scope.student.name});
				});

			}).error(function(){
				$scope.validStudentId = false;
				$scope.alerts.push({type:"danger", msg:"Error obtaining details for Id: "+$scope.id});
			});


		}

		$scope.closeAlert = function(Index){
			$scope.alerts.splice(Index,1);
		};


		init();



});
