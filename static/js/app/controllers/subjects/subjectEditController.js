angular.module("vlctiApp").controller("subjectEditController", 
	function($scope, $routeParams, $location, instituteFactory){

		$scope.subjectId = parseInt($routeParams.subjectId) ? $routeParams.subjectId : null;
		$scope.alerts = [];
		$scope.filter = {};

		$scope.closeAlert = function(Index){
			$scope.alerts.splice(Index, 1);
		};

		function init(){

			instituteFactory.Subject.get($scope.subjectId).success(function(Subject){

				$scope.isValidSubjectId = true;
				$scope.subject = Subject;

				instituteFactory.Course.list().success(function(Courses){
					$scope.courses = Courses;
				}).error(function(){
					$scope.alerts.push({type:"danger", msg:"Unable to retrieve list of courses"});
				});

				instituteFactory.Course.subjects(Subject.course).success(function(Subjects){
					$scope.subjects = Subjects;
				}).error(function(){
					$scope.alerts.push({type:"danger", msg:"Unable to retrieve list of subjects"});
				});

				instituteFactory.Contract.get(Subject.contract).success(function(Contract){
					$scope.contract = Contract;

					instituteFactory.Student.get(Contract.studentId).success(function(Student){
						$scope.student = Student;
					}).error(function(){
						$scope.alerts.push({type:"danger", msg:"Unable to retrieve student details"});
					});


				}).error(function(){
					$scope.alerts.push({type:"danger", msg:"Unable to retrieve contract details"});
				});

			
			}).error(function(){
				$scope.isValidSubjectId = false;
				$scope.alerts.push({type:"danger", msg:"Unable to retrieve subject details"});
			})

			getGroups();

		}

		function getGroups(){
			if($scope.filter.courseId==null) delete $scope.filter.courseId;
			if($scope.filter.facultyId==null) delete $scope.filter.facultyId;
			instituteFactory.Group.list($scope.filter).success(function(Groups){
				$scope.groups = Groups;
			}).error(function(){
				$scope.alerts.push({type:"danger", msg:"Unable to retrieve list of class rooms"});
			});
		}

		$scope.filterChanged = function(){
			getGroups();
		};

		$scope.updateSubject = function(){
			instituteFactory.Subject.update($scope.subject).success(function(SubjectId){
				$scope.alerts.push({type:"success", msg:"Successfully saved.", subjectId:SubjectId});
			}).error(function(){
				$scope.alerts.push({type:"danger", msg:"Unable to update subject"});
			});
		}

		init();

		

});