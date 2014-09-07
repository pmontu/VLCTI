
from django.http import HttpResponse, QueryDict
from django.core import serializers

import json

from institute.models import Student
from institute.models import Course
from institute.models import Contract
from institute.models import Circle
from institute.models import Faculty
from institute.models import Link
from institute.models import FacultyContract
from institute.models import Receipt
from institute.models import Payment
from institute.models import Group

#	STUDENT_GET
#
#
###################################################

def course_list(request, parentid):

	parentid = int(parentid)

	try:
		if parentid>0:
			parent = Course.objects.filter(id=parentid)
	except:
		raise ValueError("Invalid parent course ID. Please provide number in [0,1,2...]")

	if parentid==0:
		courses = Course.objects.filter(parent__isnull=True)
	elif parentid>0:
		courses = Course.objects.filter(parent=parent)

	data = []
	for c in courses:
		data.append({"name":c.name,"id":c.id})

	return HttpResponse(json.dumps(data))

def student_get(request, id):

	data = {}

	try:
		s = Student.objects.select_related().get(id=id)
	except:
		raise Exception("Invalid Student ID")

	data["details"]={
		"name":s.name,
		"id":s.id,
		"dob":str(s.dob),
		"contact":{
			"email":s.email,
			"phone":s.phone,
			"address":s.address
		},
		"institution":s.institution,
		"enquiry":{
			"course":s.enquiredcourse.name,
			"subjects":s.enquiredsubjects,
			"start":str(s.enquiredstartdate)
		},
		"parent":{
			"name":s.parent,
			"info":s.parentinfo
		}
	}

	contracts = Contract.objects.filter(student = s)
	data["contracts"] = []
	for c in contracts:

		subjects = Link.objects.select_related().filter(contract = c)
		subs = []
		for s in subjects:
			subs.append({
					"type":s.group.get_mode_display(),
					"name":s.group.course.name,
					"id":s.group.course.id,
					"faculty":{
						"name":s.group.facultycontract.faculty.name,
						"id":s.group.facultycontract.faculty.id
					}
				})

		data["contracts"].append({
				"joiningdate":str(c.joiningdate),
				"hours":c.hours,
				"amount":c.amount,
				"mode":c.get_mode_display(),
				"instalments":c.instalments,
				"id":c.id,
				"subjects":subs
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
