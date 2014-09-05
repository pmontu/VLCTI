from django.db import models


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
	address = models.CharField(max_length=200, null=True, blank=True)

	institution = models.CharField(max_length=200, null=True, blank=True)

	enquiredcourse = models.ForeignKey('Course', null=True, blank=True)
	enquiredsubjects = models.CharField(max_length=200, null=True, blank=True)
	enquiredstartdate = models.DateField(null=True, blank=True)

	parent = models.CharField(max_length=200, null=True, blank=True)
	parentinfo = models.CharField(max_length=200, null=True, blank=True)

	def __unicode__(self):
		return self.name
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

	courses = models.ManyToManyField('Group',through='Link')

	def __unicode__(self):
		return "%s - \"%s\" %dhrs @ Rs%d (%s)" % (self.student , self.joiningdate, self.hours, self.amount, self.get_mode_display())
	class Meta:
		ordering=('student',)










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



class Group(models.Model):

	facultycontract = models.ForeignKey('FacultyContract')
	course = models.ForeignKey(Course)

	start = models.TimeField()
	end = models.TimeField()

	mode = models.CharField(
		max_length=1,
		choices=(("I","Individual"),("G","Group")),
		null=True, blank=True
	)

	def __unicode__(self):
		return u"%s: %s @ (%s-%s)" % (self.course, self.facultycontract, str(self.start), str(self.end))







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

	address = models.CharField(max_length=200, null=True, blank=True)
	email = models.EmailField(max_length=254, null=True, blank=True)

	salaryquote = models.PositiveIntegerField(null=True, blank=True)
	salaryquotetype = models.CharField(
			max_length=1,
			choices=(("H","Hourly"),("M","Monthly")),
			null=True, blank=True
	)

	def __unicode__(self):
		return "%s %s" % (self.name, self.circle)
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


class Payment(models.Model):
	amount = models.PositiveIntegerField()
	date = models.DateField()
	serial = models.CharField(max_length=200)
	facultycontract = models.ForeignKey(FacultyContract)
	def __unicode__(self):
		return "\"%s\" %s : Rs%d , %s" % (self.date, self.serial, self.amount, self.facultycontract)














class Link(models.Model):
	contract = models.ForeignKey(Contract)
	group = models.ForeignKey(Group)
	def __unicode__(self):
		return "%s , %s" % (self.contract, self.group)
	class Meta:
		ordering=('id',)

