from django.db import models
from datetime import date


#
#
#
#	COURSE
#
#
#



class Course(models.Model):
	name = models.CharField(max_length=200)
	parent = models.ForeignKey('Course', null=True, blank=True)
	def __unicode__(self):
		if self.parent <> None:
			return "%s < %s" % (self.name, self.parent)
		return self.name
	class Meta:
		ordering = ('id',)
		unique_together = ('name','parent')














#
#
#
#	STUDENT
#
#
#

class Student(models.Model):
	name = models.CharField(max_length=200)
	dob = models.DateField(null=True, blank=True)

	email = models.EmailField(max_length=254, null=True, blank=True)
	phone = models.CharField(max_length=10, null=True, blank=True)
	work = models.CharField(max_length=10, null=True, blank=True)
	cell = models.CharField(max_length=10, null=True, blank=True)
	address = models.CharField(max_length=200, null=True, blank=True)

	institution = models.CharField(max_length=200, null=True, blank=True)

	enquiredcourse = models.ForeignKey('Course', null=True, blank=True)
	enquiredsubjects = models.CharField(max_length=200, null=True, blank=True)
	enquiredstartdate = models.DateField(null=True, blank=True)

	parent = models.CharField(max_length=200, null=True, blank=True)
	parentinfo = models.CharField(max_length=200, null=True, blank=True)

	def __unicode__(self):
		return self.name
	def get_age(self):
		return date.today().year - self.dob.year if self.dob <> None and date.today() >= self.dob else None
	class Meta:
		ordering = ('id',)


class Receipt(models.Model):
	amount = models.PositiveIntegerField()
	date = models.DateField()
	serial = models.CharField(max_length=200)
	contract = models.ForeignKey('Contract')
	def __unicode__(self):
		return "\"%s\" %s : Rs%d , %s" % (self.date, self.serial, self.amount, self.contract)



class Contract(models.Model):

	instalments = models.PositiveSmallIntegerField(null=True,blank=True)
	mode = models.CharField(
		max_length=1,
		choices = (('I',"Instalments"),('M',"Monthly"),('Y',"Yearly"))
	)
	amount = models.PositiveIntegerField()
	hours = models.PositiveSmallIntegerField()

	student = models.ForeignKey(Student)
	joiningdate = models.DateField()

	leavingdate = models.DateField(null=True,blank=True)

	courses = models.ManyToManyField('Group',through='Subject')

	def __unicode__(self):
		return "%s - \"%s\" %dhrs @ Rs%d (%s)" % (self.student , self.joiningdate, self.hours, self.amount, self.get_mode_display())
	class Meta:
		ordering=('student',)



class Subject(models.Model):

	contract = models.ForeignKey(Contract)
	course = models.ForeignKey('Course')
	group = models.ForeignKey('Group', null=True, blank=True)

	joiningdate = models.DateField(null=True, blank=True)
	leavingdate = models.DateField(null=True, blank=True)


	def __unicode__(self):
		return "%s , %s" % (self.contract, self.group)
	class Meta:
		ordering=('id',)










#
#
#
#
#	FACULTY
#
#
#




class Circle(models.Model):
	name = models.CharField(max_length=200,unique=True)
	def __unicode__(self):
		return self.name
	class Meta:
		ordering=('name',)


class Faculty(models.Model):
	name = models.CharField(max_length=200)
	circle = models.ForeignKey(Circle)

	qualification = models.CharField(max_length=200, null=True, blank=True)
	experience = models.CharField(max_length=200, null=True, blank= True)

	specialization = models.CharField(max_length=200, null=True, blank=True)
	currentjob = models.CharField(max_length=200, null=True, blank=True)

	address = models.CharField(max_length=200, null=True, blank=True)
	email = models.EmailField(max_length=254, null=True, blank=True)
	phone = models.CharField(max_length=10, null=True, blank=True)

	sex = models.CharField(
		max_length=1,
		choices=(("M","Male"),("F","Female")),
		null=True, blank=True
	)
	dob = models.DateField(null=True, blank=True)

	morningstart = models.TimeField(null=True, blank=True)
	morningend = models.TimeField(null=True, blank=True)

	eveningstart = models.TimeField(null=True, blank=True)
	eveningend = models.TimeField(null=True, blank=True)

	twowheeler = models.NullBooleanField()
	references = models.CharField(max_length=200, null=True, blank=True)

	salaryquote = models.PositiveIntegerField(null=True, blank=True)
	salaryquotetype = models.CharField(
		max_length=1,
		choices=(("H","Hourly"),("M","Monthly")),
		null=True, blank=True
	)

	def __unicode__(self):
		return "%s %s" % (self.name, self.circle)
	def get_age(self):
		return date.today().year - self.dob.year if self.dob <> None and date.today() >= self.dob else None
	class Meta:
		ordering=('circle','name')

class FacultyContract(models.Model):
	faculty = models.ForeignKey(Faculty)
	mode = models.CharField(
		max_length=1,
		choices = (('H',"Hourly"),('M',"Monthly"))
	)
	amount = models.PositiveIntegerField()
	startdate = models.DateField()
	enddate = models.DateField(null=True,blank=True)
	def __unicode__(self):
		return "%s: Rs%d (%s)" % (self.faculty, self.amount, self.get_mode_display())
	class Meta:
		ordering = ('mode','faculty')

class Group(models.Model):

	facultycontract = models.ForeignKey('FacultyContract')
	course = models.ForeignKey(Course)

	start = models.TimeField()
	end = models.TimeField()

	mode = models.CharField(
		max_length=1,
		choices=(("I","Individual"),("G","Group"))
	)

	def __unicode__(self):
		return u"%s: %s @ (%s-%s)" % (self.course, self.facultycontract, str(self.start), str(self.end))


class Payment(models.Model):
	amount = models.PositiveIntegerField()
	date = models.DateField()
	serial = models.CharField(max_length=200)
	facultycontract = models.ForeignKey(FacultyContract)
	def __unicode__(self):
		return "\"%s\" %s : Rs%d , %s" % (self.date, self.serial, self.amount, self.facultycontract)



