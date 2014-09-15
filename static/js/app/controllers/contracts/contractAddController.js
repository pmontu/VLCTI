angular.module("vlctiApp").controller("contractAddController",
	function($scope, instituteFactory, $routeParams){
		
		$scope.alerts= [];
		$scope.studentId = parseInt($routeParams.studentId) ? $routeParams.studentId : 0;
		$scope.contract = {};

		function init(){

			instituteFactory.Student.get($scope.studentId).success(function(student){
				$scope.student = student;
				$scope.validStudentId = true;
			}).error(function(status){
				$scope.validStudentId = false;
				$scope.alerts.push({type:"danger", msg:"Error obtaining details for student Id: "+$scope.studentId});
			});

		}

		$scope.closeAlert = function(Index){
			$scope.alerts.splice(Index,1);
		};

		$scope.addContract = function(){

			$scope.contract.studentId = $scope.student.id;
			instituteFactory.Contract.post($scope.contract).success(function(data){
				$scope.alerts.push({
					type:"success",
					msg:"Successfully added contract",
					studentName:$scope.student.name,
					contractId:data
				});

			$scope.contract = {}


			}).error(function(data, status){
				$scope.alerts.push({type:"danger", msg:"Error: "+status});
			})
		};

		init();



});
