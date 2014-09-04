
from django.http import HttpResponse, QueryDict
from django.core import serializers

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

#	STUDENT_GET
#
#
###################################################

def student_get(request, id):

	data = {}

	try:
		s = Student.objects.get(id=id)
	except:
		raise Exception("Invalid Student ID")

	data["details"]={
		"name":s.name,
		"id":s.id
	}

	contracts = Contract.objects.filter(student = s)
	data["contracts"] = []
	for c in contracts:

		packages = Package.objects.filter(contract = c)
		packs = []
		for p in packages:
			packs.append({
					"name":p.course.name,
					"id":p.course.id,
					"faculty":{
						"name":p.facultycontract.faculty.name,
						"id":p.facultycontract.faculty.id
					}
				})

		data["contracts"].append({
				"joiningdate":str(c.joiningdate),
				"hours":c.hours,
				"amount":c.amount,
				"mode":c.get_mode_display(),
				"instalments":c.instalments,
				"id":c.id,
				"subjects":packs
			})


	return HttpResponse(json.dumps(data))











#	STUDENT_LIST
#
############################################

#	1.string name
#	2.number id
#	3.string orderby
#	4.number page
#	5.number items
#	6.bool direction
#
#	totallength
#	students
#		id
#		name
#
#############################################

def student_list(request):

	studentModels = []


	j = json.loads(request.body)

	#	VALIDATION
	isNameValid = False
	if "name" in j:
		n = j["name"]
		isNameValid = True
	else:
		raise KeyError("name missing")

	isIDValid = False
	if "id" in j:
		id= j["id"]
		try:
			if int(id)>0:
				isIDValid = True
		except:
			raise ValueError("Invalid id - number")
	else:
		raise KeyError("id missing")

	ob = "name"
	if "orderby" in j:
		o = j["orderby"]
		if o == "name" or o == "id" or o == "-name" or o == "-id" :
			ob = o
		else:
			raise ValueError("Invalid orderby")
	else:
		raise KeyError("orderby missing")

	page=1
	if "page" in j:
		p = j["page"]
		try:
			if int(p)>0:
				page = int(p)
			else:
				raise ValueError("invalid page - positive number")
		except:
			raise ValueError("invalid page - number")		
	else:
		raise KeyError("page missing - number")

	items = 10
	if "items" in j:
		i = j["items"]
		try:
			if int(i)>0:
				items = int(i)
			else:
				raise ValueError("invalid items - positive number")
		except:
			raise ValueError("invalid items - number")

	s = items * (page-1)
	e = s + items

	if "direction" in j:
		d = j["direction"]
		try:
			if d==False:
				ob = "-"+ob
		except:
			raise ValueError("invalid direction - boolean")
	else:
		raise KeyError("missing direction - boolean")

	#	QUERY
	l = 0
	if isNameValid and not isIDValid:
		studentModels = Student.objects.filter(name__contains=n).order_by(ob)[s:e]
		l = Student.objects.filter(name__contains=n).count()
	elif isIDValid:
		studentModels = Student.objects.filter(id=id).order_by(ob)[s:e]
		l=Student.objects.filter(id=id).count()
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
		"totallength":l
	}
	jsonData = json.dumps(studentsData)
	return HttpResponse(jsonData,mimetype="application/json")
