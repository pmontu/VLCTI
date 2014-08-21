
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


def getStudentDetails(request):
    query = QueryDict(request.body)
    n = query.get("circle","Vadapalani")
    c = Circle.objects.filter(name=n)
    fs = Faculty.objects.filter(circle = c)
    return HttpResponse(fs)

def getStudent(request):

	studentModels = []

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

	if isNameValid and not isIDValid:
		studentModels = Student.objects.filter(name__contains=n)
	elif not isNameValid and isIDValid:
		studentModels = Student.objects.filter(id=i)
	elif isNameValid and isIDValid:
		studentModels = Student.objects.filter(id=i)




	students = []
	for s in studentModels:
		d = {
			"id":s.id,
			"name":s.name
		}
		students.append(d)

	jsonData = json.dumps(students)
	return HttpResponse(jsonData,mimetype="application/json")

