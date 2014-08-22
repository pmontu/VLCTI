
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

def getStudentList(request):

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

	#	ORDER BY
	ob = "name"
	if q.__contains__("orderby"):
		o = q.__getitem__("orderby")
		if o == "name" or o == "id" or o == "-name" or o == "-id" :
			ob = o

	page=1
	if q.__contains__("page"):
		p=q.__getitem__("page")
		if p.isdigit() and int(p)>0:
			page = int(p)

	items = 10
	if q.__contains__("items"):
		i = q.__getitem__("items")
		if i.isdigit() and int(i)>0:
			items = int(i)

	s = items * (page-1)
	e = s + items

	if q.__contains__("direction"):
		d = q.__getitem__("direction")
		if d=="false":
			ob = "-"+ob

	#	QUERY
	l = 0
	if isNameValid and not isIDValid:
		studentModels = Student.objects.filter(name__contains=n).order_by(ob)[s:e]
		l = Student.objects.filter(name__contains=n).count()
	elif isIDValid:
		studentModels = Student.objects.filter(id=i).order_by(ob)[s:e]
		l=Student.objects.filter(id=i).count()
	else:
		studentModels = Student.objects.all().order_by(ob)[s:e]
		l = Student.objects.all().count()




	#	RESPONSE
	students = []
	for s in studentModels:
		d = {
			"id":s.id,
			"name":s.name
		}
		students.append(d)

	studentsData={
		"students":students,
		"length":l
	}
	jsonData = json.dumps(studentsData)
	return HttpResponse(jsonData,mimetype="application/json")
