
from django.http import HttpResponse, QueryDict
from django.core import serializers

import json
import re

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

def course_list(request):

	courses = Course.objects.select_related('Course').all()

	data = []
	for c in courses:
		pid=None
		if c.parent is not None:
			pid = c.parent.id
		data.append({"name":c.__unicode__(),"id":c.id,"parentid":pid})

	return HttpResponse(json.dumps(data), mimetype="application/json")

def student_post(request):

	j = json.loads(request.body)

	if "name" not in j:
		raise KeyError("Student name missing, It is a required field")
	if not re.match('^([a-zA-Z ]+)$',j["name"]):
		raise ValueError("Student name must contains alphabets and spaces only")

	s = Student(
		name = j["name"],
		dob = j["dob"] if "dob" in j else None,
		email = j["email"] if "email" in j else None,
		phone = j["phone"] if "phone" in j else None,
		address = j["address"] if "address" in j else None,
		institution = j["institution"] if "institution" in j else None,
		enquiredsubjects = j["subjects"] if "subjects" in j else None,
		enquiredstartdate = j["start"] if "start" in j else None,
		enquiredcourse = Course.objects.get(id = j["course"]) if "course" in j and Course.objects.filter(id=j["course"]).count() == 1 else None
		)
	s.save()
	return HttpResponse(json.dumps(s.id), mimetype="application/json")

def student_get(request, id):

	data = {}

	try:
		s = Student.objects.select_related().get(id=id)
	except:
		raise Exception("Invalid Student ID")

	data={
		"name":s.name,
		"id":s.id,
		"dob":str(s.dob),
		"email":s.email,
		"phone":s.phone,
		"address":s.address,
		"institution":s.institution,
		"course":s.enquiredcourse.id if s.enquiredcourse <> None else None,
		"subjects":s.enquiredsubjects,
		"start":str(s.enquiredstartdate),
		"parent":s.parent,
		"profession":s.parentinfo
	}

	return HttpResponse(json.dumps(data), mimetype="application/json")











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
