angular.module("vlctiApp").controller("groupEditController",
	function($scope, instituteFactory, $routeParams, $location){

		$scope.groupId = parseInt($routeParams.groupId) ? $routeParams.groupId : 0;

		$scope.alerts = [];

		$scope.closeAlerts = function(Index){
			$scope.alerts.splice(Index, 1);
		}

		function init(){

			instituteFactory.Group.get($scope.groupId).success(function(Group){
				$scope.group = Group;
				$scope.isValidGroupId = true;

				instituteFactory.Agreement.get(Group.agreementId).success(function(Agreement){
					$scope.agreement = Agreement;

					instituteFactory.Faculty.get(Agreement.facultyId).success(function(Faculty){
						$scope.faculty = Faculty;
					}).error(function(){
						$scope.alerts.push({type:"danger", msg:"Unable to retrieve faculty details"});
					});


				}).error(function(){
					$scope.alerts.push({type:"danger", msg:"Unable to retrieve agreement details"});
				});


				instituteFactory.Course.list().success(function(Courses){
					$scope.courses = Courses;
				}).error(function(){
					$scope.alerts.push({type:"danger", msg:"Unable to retrieve list of courses"});
				});

				instituteFactory.Course.subjects(Group.course).success(function(Subjects){
					$scope.subjects = Subjects;
				}).error(function(){
					$scope.alerts.push({type:"danger", msg:"Unable to retrieve list of subjects"});
				});

			}).error(function(){
				$scope.isValidGroupId = false;
				$scope.alerts.push({type:"danger", msg:"Unable to retrieve class details"});
			});
		}

		$scope.updateGroup = function(){

			instituteFactory.Group.update($scope.group).success(function(GroupId){
				$scope.alerts.push({type:"success", msg:"Successfully updated."});
			}).error(function(){
				$scope.alerts.push({type:"danger", msg:"Unable to update class"});
			});
		}

		init();
});