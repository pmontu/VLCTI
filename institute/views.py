
from django.http import HttpResponse, QueryDict

import json

from institute.models import Student
from institute.models import Course
from institute.models import Contract
from institute.models import Circle
from institute.models import Faculty
from institute.models import Package
from institute.models import FacultyContract
from institute.models import Receipt
from institute.models import Payment

def getStudent(request):

	studentModels = []


	#	VALIDATION
	isNameValid = False
	q = QueryDict(request.body)
	if q.__contains__("name"):
		n = q.__getitem__("name")
		isNameValid = True

	isIDValid = False
	if q.__contains__("id"):
		i = q.__getitem__("id")
		if i.isdigit() and int(i)>0:
			isIDValid = True

	#	QUERY
	if isNameValid and not isIDValid:
		studentModels = Student.objects.filter(name__contains=n)
	elif isIDValid:
		studentModels = Student.objects.filter(id=i)
	else:
		studentModels = Student.objects.all()



	#	RESPONSE
	students = []
	for s in studentModels:
		d = {
			"id":s.id,
			"name":s.name
		}
		students.append(d)

	jsonData = json.dumps(students)
	return HttpResponse(jsonData,mimetype="application/json")

