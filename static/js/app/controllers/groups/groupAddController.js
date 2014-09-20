angular.module("vlctiApp").controller("groupAddController",
	function($scope, instituteFactory, $routeParams, $location){

		$scope.agreementId = parseInt($routeParams.agreementId) ? $routeParams.agreementId : 0;

		$scope.alerts = [];

		$scope.closeAlerts = function(Index){
			$scope.alerts.splice(Index, 1);
		}

		function init(){

			instituteFactory.Agreement.get($scope.agreementId).success(function(Agreement){
				$scope.isValidAgreementId = true;
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
		}

		$scope.courseChanged = function(){
			if($scope.group.course!=null){
				instituteFactory.Course.subjects($scope.group.course).success(function(Subjects){
					$scope.subjects = Subjects;
				}).error(function(){
					$scope.alerts.push({type:"danger", msg:"Unable to retrieve list of subjects"});
				});
			}
		}

		$scope.saveGroup = function(){
			$scope.group.agreementId = $scope.agreement.id;
			instituteFactory.Group.post($scope.group).success(function(groupId){
				$scope.group = {};
				$scope.alerts.push({
					type:"success", 
					msg:"Successfully added.",
					groupId:groupId
				});
			}).error(function(){
				$scope.alerts.push({type:"danger", msg:"Unable to save class"});
			})
		}

		init();

	});