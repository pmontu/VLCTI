
from django.http import HttpResponse, QueryDict
from django.core import serializers
from django.contrib.auth import authenticate, login, logout


import json
import re
from datetime import date, time

from institute.models import Student
from institute.models import Course
from institute.models import Contract
from institute.models import Circle
from institute.models import Faculty
from institute.models import Subject
from institute.models import FacultyContract
from institute.models import Receipt
from institute.models import Payment
from institute.models import Group

def login_required(fun):
	def decoration(*args, **kwargs):
		if not args[0].user.is_authenticated():
			raise Exception("Please Login ")
		return fun(*args, **kwargs)
	return decoration

def user_info(request):

	user = request.user

	if not user.is_authenticated():
		raise Exception("Not logged in")

	data = {
		"username":user.username
	}

	return HttpResponse(json.dumps(data), mimetype="application/json")

@login_required
def user_logout(request):
	logout(request)

	return HttpResponse(mimetype="application/json")

def user_login(request):
	
	j = json.loads(request.body)

	username = j['username']
	password = j['password']
	user = authenticate(username=username, password=password)
	if user is not None and user.is_active:
		login(request, user)

	return HttpResponse(user.id, mimetype="application/json")

@login_required
def group_post(request):

	j = json.loads(request.body)

	g = Group()
	g.facultycontract = FacultyContract.objects.get(id = j["agreementId"])
	g.course = Course.objects.get(id = j["subject"])
	g.start = j["start"]
	g.end = j["end"]
	g.mode = j["mode"]
	g.save()

	return HttpResponse(json.dumps(g.id), mimetype="application/json")

@login_required
def group_update(request):

	j = json.loads(request.body)

	g = Group.objects.get(id = j["id"])
	g.save()

	return HttpResponse(json.dumps(g.id), mimetype="application/json")

@login_required
def group_get(request, id):

	g = Group.objects.select_related("FacultyContract__Faculty", "Course", "Course__Course").get(id = id)

	data = {
		"id":g.id,
		"subject":g.course.id,
		"course":g.course.parent.id if g.course.parent <> None else None,
		"agreementId":g.facultycontract.id,
		"start":time.strftime(g.start, "%H:%M"),
		"end":time.strftime(g.end, "%H:%M"),
		"mode":g.mode
	}

	return HttpResponse(json.dumps(data), mimetype="application/json")


@login_required
def agreement_post(request):

	j = json.loads(request.body)

	a = FacultyContract()

	a.faculty = Faculty.objects.get(id = j["facultyId"])
	a.startdate = j["startdate"]
	a.amount = j["amount"]
	a.mode = j["mode"]

	a.save()

	return HttpResponse(json.dumps(a.id), mimetype="application/json")

@login_required
def agreement_get(request, id):

	a = FacultyContract.objects.select_related().get(id = id)

	data = {
		"id":a.id,
		"startdate":str(a.startdate),
		"enddate":str(a.enddate) if a.enddate <> None else None,
		"amount":a.amount,
		"mode":a.mode,
		"type":a.get_mode_display(),
		"facultyId":a.faculty.id
	}

	return HttpResponse(json.dumps(data), mimetype="application/json")

@login_required
def agreement_update(request):

	j = json.loads(request.body)

	a = FacultyContract.objects.get(id = j["id"])

	a.startdate = j["startdate"]
	a.amount = j["amount"]
	a.mode = j["mode"]
	a.enddate = j["enddate"]

	a.save()

	return HttpResponse(json.dumps(a.id), mimetype="application/json")

@login_required
def agreement_groups(request, id):
	
	groups = Group.objects.select_related("Course").filter(facultycontract = Contract.objects.get(id = id))

	data = []
	for g in groups:
		data.append({
			"id":g.id,
			"subject":g.course.name,
			"start":time.strftime(g.start, "%H:%M"),
			"end":time.strftime(g.end, "%H:%M"),
			"mode":g.mode,
			"type":g.get_mode_display()
		})

	return HttpResponse(json.dumps(data), mimetype="application/json")

@login_required
def circle_list(request):

	circles = Circle.objects.all()

	data = []
	for c in circles:
		data.append({
			"name":c.name,
			"id":c.id	
		})

	return HttpResponse(json.dumps(data), mimetype="application/json")


@login_required
def faculty_get(request, id):

	faculty = Faculty.objects.select_related("Circle").get(id = id)

	data = {
		"name":faculty.name,
		"id":faculty.id,
		"circle":faculty.circle.id,

		"qual":faculty.qualification,
		"special":faculty.specialization,
		"exp":faculty.experience,
		"job":faculty.currentjob,

		"email":faculty.email,
		"phone":faculty.phone,
		"address":faculty.address,

		"sex":faculty.sex,
		"dob":str(faculty.dob) if faculty.dob <> None else None,
		"bike":faculty.twowheeler,

		"refer":faculty.references,
		"sal":faculty.salaryquote,
		"mode":faculty.salaryquotetype,

		"morningstart":str(faculty.morningstart) if faculty.morningstart <> None else None,
		"morningend":str(faculty.morningend) if faculty.morningend <> None else None,
		"eveningstart":str(faculty.eveningstart) if faculty.eveningstart <> None else None,
		"eveningend":str(faculty.eveningend) if faculty.eveningend <> None else None,

		"age":faculty.get_age()
	}

	return HttpResponse(json.dumps(data), mimetype="application/json")


@login_required
def faculty_update(request):

	j = json.loads(request.body)

	f = Faculty.objects.get(id = j["id"])

	if "name" not in j or len(j["name"])==0 :
		raise KeyError("Required Name")

	if "circle" not in j:
		raise KeyError("Required Circle")

	f.name = j["name"]
	f.circle = Circle.objects.get(id = j["circle"])

	f.qualification = j["qual"] if "qual" in j else None
	f.specialization = j["special"] if "special" in j else None
	f.experience = j["exp"] if "exp" in j else None
	f.currentjob = j["job"] if "job" in j else None
	
	f.email = j["email"] if "email" in j else None
	f.phone = j["phone"] if "phone" in j else None
	f.address = j["address"] if "address" in j else None

	f.sex = j["sex"] if "sex" in j else None
	f.dob = j["dob"] if "dob" in j else None
	f.twowheeler = j["bike"] if "bike" in j else None

	f.references = j["refer"] if "refer" in j else None
	f.salaryquote = j["sal"] if "sal" in j else None
	f.salaryquotetype = j["mode"] if "mode" in j else None

	f.morningstart = j["morningstart"] if "morningstart" in j else None
	f.morningend = j["morningend"] if "morningend" in j else None
	f.eveningstart = j["eveningstart"] if "eveningstart" in j else None
	f.eveningend = j["eveningend"] if "eveningend" in j else None


	f.save()

	return HttpResponse(f.id, mimetype="application/json")


@login_required
def faculty_post(request):

	j = json.loads(request.body)

	f = Faculty()

	if "name" not in j or len(j["name"])==0 :
		raise KeyError("Required Name")

	if "circle" not in j:
		raise KeyError("Required Circle")

	f.name = j["name"]
	f.circle = Circle.objects.get(id = j["circle"])

	f.qualification = j["qual"] if "qual" in j else None
	f.specialization = j["special"] if "special" in j else None
	f.experience = j["exp"] if "exp" in j else None
	f.currentjob = j["job"] if "job" in j else None
	
	f.email = j["email"] if "email" in j else None
	f.phone = j["phone"] if "phone" in j else None
	f.address = j["address"] if "address" in j else None

	f.sex = j["sex"] if "sex" in j else None
	f.dob = j["dob"] if "dob" in j else None
	f.twowheeler = j["bike"] if "bike" in j else None

	f.references = j["refer"] if "refer" in j else None
	f.salaryquote = j["sal"] if "sal" in j else None
	f.salaryquotetype = j["mode"] if "mode" in j else None

	f.morningstart = j["morningstart"] if "morningstart" in j else None
	f.morningend = j["morningend"] if "morningend" in j else None
	f.eveningstart = j["eveningstart"] if "eveningstart" in j else None
	f.eveningend = j["eveningend"] if "eveningend" in j else None


	f.save()

	return HttpResponse(f.id, mimetype="application/json")

@login_required
def faculty_agreements(request, id):

	agreements = FacultyContract.objects.filter(faculty = Faculty.objects.get(id = id))

	data = []
	for a in agreements:
		data.append({
			"type":a.get_mode_display(),
			"amount":a.amount,
			"startdate":str(a.startdate) if a.startdate <> None else None,
			"enddate":str(a.enddate) if a.enddate <> None else None,
			"id":a.id
		})

	return HttpResponse(json.dumps(data), mimetype="application/json")


@login_required
def faculty_list(request):

	filters = {}


	j = json.loads(request.body)

	if "name" in j and len(j["name"]) > 0:
		filters["name__startswith"] = j["name"]

	if "id" in j:
		if int(j["id"]) > 0:
			filters["id"] = j["id"]

	if "circle" in j:
		filters["circle"] = Circle.objects.get(id = j["circle"])

	if "sex" in j and len(j["sex"])>0:
		filters["sex"] = j["sex"]

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
				j["orderby"] = "-"+j["orderby"]
		except:
			raise ValueError("invalid direction - boolean")
	else:
		raise KeyError("missing direction - boolean")


	#	QUERY
	faculties = Faculty.objects.select_related("Circle").filter(**filters).order_by(j["orderby"])[s:e]
	length = Faculty.objects.select_related("Circle").filter(**filters).count()
	count = Faculty.objects.all().count()


	#	RESPONSE
	data = {}
	data["faculties"] = []
	for f in faculties:
		data["faculties"].append({
			"id":f.id,
			"name":f.name,
			"age":f.get_age(),
			"phone":f.phone,
			"circle":f.circle.name,
			"qualification":f.qualification,
			"experience":f.experience
		})

	data["queryresultsetlength"] = length,
	data["totallength"] = count

	return HttpResponse(json.dumps(data),mimetype="application/json")



@login_required
def contract_subjects(request, id):
	
	subjects = Subject.objects.select_related("Group__FacultyContract__Faculty","Course").filter(contract = Contract.objects.get(id = id))

	data = []
	for s in subjects:
		data.append({
			"id":s.id,
			"subject":s.course.name,
			"from":str(s.joiningdate) if s.joiningdate <> None else None,
			"to":str(s.leavingdate) if s.leavingdate <> None else None,
			"faculty":s.group.facultycontract.faculty.name if s.group <> None else None,
			"facultyId":s.group.facultycontract.faculty.id if s.group <> None else None,
			"start":time.strftime(s.group.start, "%H:%M") if s.group <> None else None,
			"end":time.strftime(s.group.end, "%H:%M") if s.group <> None else None,
			"mode":s.group.mode if s.group <> None else None,
			"type":s.group.get_mode_display() if s.group <> None else None
		})

	return HttpResponse(json.dumps(data), mimetype="application/json")


@login_required
def contract_get(request, id):

	c = Contract.objects.select_related().get(id = id)

	data = {
		"id":c.id,
		"join":str(c.joiningdate),
		"leave":str(c.leavingdate) if c.leavingdate <> None else None,
		"amount":c.amount,
		"hours":c.hours,
		"mode":c.mode,
		"instalments":c.instalments,
		"type":c.get_mode_display(),
		"studentId":c.student.id
	}

	return HttpResponse(json.dumps(data), mimetype="application/json")

@login_required
def contract_update(request):

	j = json.loads(request.body)

	c = Contract.objects.get(id = j["id"])

	c.leavingdate = j["leave"] if j["leave"] > j["join"] else None

	c.save()

	return HttpResponse(c.id, mimetype="application/json")

@login_required
def contract_post(request):

	j = json.loads(request.body)

	c = Contract(
		student = Student.objects.get(id = j["studentId"]),
		amount = j["amount"],
		instalments = j["instalments"] if j["mode"] == "I" else None,
		mode = j["mode"],
		hours = j["hours"],
		joiningdate = j["join"]
	)

	c.save()

	return HttpResponse(c.id, mimetype="application/json")

@login_required
def course_list(request):

	courses = Course.objects.select_related('Course').filter(parent = None)

	data = []
	for c in courses:
		data.append({
			"name":c.name,
			"id":c.id
		})

	return HttpResponse(json.dumps(data), mimetype="application/json")

@login_required
def course_subjects(request, id):

	subjects = Course.objects.filter(parent = Course.objects.get(id = id))

	data = []
	for s in subjects:
		data.append({
			"name":s.name,
			"id":s.id
		})

	return HttpResponse(json.dumps(data), mimetype="application/json")

@login_required
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
		cell = j["cell"] if "cell" in j else None,
		work = j["work"] if "work" in j else None,
		address = j["address"] if "address" in j else None,
		institution = j["institution"] if "institution" in j else None,
		enquiredsubjects = j["subjects"] if "subjects" in j else None,
		enquiredstartdate = j["start"] if "start" in j else None,
		enquiredcourse = Course.objects.get(id = j["course"]) if "course" in j and Course.objects.filter(id=j["course"]).count() == 1 else None
		)
	s.save()
	return HttpResponse(json.dumps(s.id), mimetype="application/json")

@login_required
def student_update(request):

	j = json.loads(request.body)

	if "id" not in j:
		raise KeyError("Need id to update student, It is a required field")
	if not isinstance(j["id"],(int,long)) or not int(j["id"]) > 0:
		raise KeyError("Invalid Id, required integer not less than 1")

	if "name" not in j:
		raise KeyError("Student name missing, It is a required field")
	if not re.match('^([a-zA-Z ]+)$',j["name"]):
		raise ValueError("Student name must contains alphabets and spaces only")

	try:
		s = Student.objects.get(id = int(j["id"]))
	except:
		raise Exception("Error retrieving details from id")

	s.name = j["name"]
	s.dob = j["dob"] if "dob" in j and j["dob"] <> "" else None
	s.email = j["email"] if "email" in j else None
	s.phone = j["phone"] if "phone" in j else None
	s.cell = j["cell"] if "cell" in j else None
	s.work = j["work"] if "work" in j else None
	s.address = j["address"] if "address" in j else None
	s.institution = j["institution"] if "institution" in j else None
	s.enquiredsubjects = j["subjects"] if "subjects" in j else None
	s.enquiredstartdate = j["start"] if "start" in j and j["start"] <> "" else None
	s.enquiredcourse = Course.objects.get(id = j["course"]) if "course" in j and Course.objects.filter(id=j["course"]).count() == 1 else None
	s.parent = j["parent"] if "parent" in j else None
	s.parentinfo = j["profession"] if "profession" in j else None

	s.save()
	return HttpResponse(json.dumps(s.id), mimetype="application/json")

@login_required
def student_get(request, id):

	data = {}

	try:
		s = Student.objects.select_related().get(id=id)
	except:
		raise Exception("Invalid Student ID")

	data={
		"name":s.name,
		"id":s.id,
		"dob":str(s.dob) if s.dob <> None else None,
		"email":s.email,
		"phone":s.phone,
		"cell":s.cell,
		"work":s.work,
		"address":s.address,
		"institution":s.institution,
		"course":s.enquiredcourse.id if s.enquiredcourse <> None else None,
		"subjects":s.enquiredsubjects,
		"start":str(s.enquiredstartdate) if s.enquiredstartdate <> None else None,
		"parent":s.parent,
		"profession":s.parentinfo,
		"age":s.get_age()
	}

	return HttpResponse(json.dumps(data), mimetype="application/json")



@login_required
def student_contracts(request, id):

	contracts = Contract.objects.filter(student = Student.objects.get(id = id))

	data = []
	for c in contracts:
		data.append({
			"id":c.id,
			"instalments":c.instalments,
			"modeid":c.mode,
			"mode":c.get_mode_display(),
			"amount":c.amount,
			"hours":c.hours,
			"join":str(c.joiningdate),
			"leave":str(c.leavingdate) if c.leavingdate <> None else None
		})

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

@login_required
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
		studentModels = Student.objects.filter(name__startswith=n).order_by(ob)[s:e]
		l = Student.objects.filter(name__startswith=n).count()
	elif isIDValid:
		studentModels = Student.objects.filter(id=id).order_by(ob)[s:e]
		l=Student.objects.filter(id=id).count()
	else:
		studentModels = Student.objects.all().order_by(ob)[s:e]
		l = Student.objects.all().count()

	t = Student.objects.all().count()


	#	RESPONSE
	students = []
	for s in studentModels:
		d = {
			"id":s.id,
			"name":s.name,
			"email":s.email,
			"cell":s.cell,
			"age":s.get_age(),
			"address":s.address
		}
		students.append(d)

	studentsData={
		"students":students,
		"queryresultsetlength":l,
		"totallength":t
	}
	jsonData = json.dumps(studentsData)
	return HttpResponse(jsonData,mimetype="application/json")
