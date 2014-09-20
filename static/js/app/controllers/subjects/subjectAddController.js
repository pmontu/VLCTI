angular.module("vlctiApp").controller("subjectAddController", 
	function($scope, $routeParams, $location, instituteFactory){

		$scope.contractId = parseInt($routeParams.contractId) ? $routeParams.contractId : null;
		$scope.alerts = [];
		$scope.filter = {};

		$scope.closeAlert = function(Index){
			$scope.alerts.splice(Index, 1);
		};

		function init(){


			instituteFactory.Contract.get($scope.contractId).success(function(Contract){
				$scope.contract = Contract;
				$scope.isValidContractId = true;

				instituteFactory.Student.get(Contract.studentId).success(function(Student){
					$scope.student = Student;
				}).error(function(){
					$scope.alerts.push({type:"danger", msg:"Unable to retrieve student details"});
				});


			}).error(function(){
				$scope.alerts.push({type:"danger", msg:"Unable to retrieve contract details"});
				$scope.isValidContractId = false;
			});

			instituteFactory.Course.list().success(function(Courses){
				$scope.courses = Courses;
			}).error(function(){
				$scope.alerts.push({type:"danger", msg:"Unable to retrieve list of courses"});
			});

			getGroups();

		};

		$scope.courseChanged = function(){
			if($scope.subject.courseId!=null){
				instituteFactory.Course.subjects($scope.subject.courseId).success(function(Subjects){
					$scope.subjects = Subjects;
				}).error(function(){
					$scope.alerts.push({type:"danger", msg:"Unable to retrieve list of subjects"});
				});
			}
		};

		$scope.filterCourseChanged = function(){
			delete $scope.filter.subjectId;
			if($scope.filter.courseId!=null){
				instituteFactory.Course.subjects($scope.filter.courseId).success(function(Subjects){
					$scope.filterSubjects = Subjects;
				}).error(function(){
					$scope.alerts.push({type:"danger", msg:"Unable to retrieve list of subjects"});
				});
			}
		};

		$scope.saveSubject = function(){
			$scope.subject.contractId = $scope.contract.id;
			instituteFactory.Subject.post($scope.subject).success(function(SubjectId){
				$scope.alerts.push({type:"success", msg:"Successfully saved.", subjectId:SubjectId});
			}).error(function(){
				$scope.alerts.push({type:"danger", msg:"Unable to save subject"});
			});
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

		init();


});