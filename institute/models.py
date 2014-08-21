from django.db import models

class Student(models.Model):
	name = models.CharField(max_length=200)
	def __unicode__(self):
		return self.name
	class Meta:
		ordering = ('id',)

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

class Contract(models.Model):
	instalments = models.PositiveSmallIntegerField(null=True,blank=True)
	INSTALMENTS = 'Instalments'
	MONTHLY = 'Monthly'
	YEARLY = 'Yearly'
	mode_choices = (('I',INSTALMENTS),('M',MONTHLY),('Y',YEARLY))
	mode = models.CharField(
		max_length=1,
		choices = mode_choices
	)
	amount = models.PositiveIntegerField()
	hours = models.PositiveSmallIntegerField()
	student = models.ForeignKey(Student)
	joiningdate = models.DateField()
	leavingdate = models.DateField(null=True,blank=True)
	courses = models.ManyToManyField(Course,through='Package')
	def __unicode__(self):
		return "%s - \"%s\" %dhrs @ Rs%d (%s)" % (self.student , self.joiningdate, self.hours, self.amount, self.get_mode_display())
	class Meta:
		ordering=('student',)

class Circle(models.Model):
	name = models.CharField(max_length=200,unique=True)
	def __unicode__(self):
		return self.name
	class Meta:
		ordering=('name',)


class Faculty(models.Model):
	name = models.CharField(max_length=200)
	circle = models.ForeignKey(Circle)
	def __unicode__(self):
		return "%s %s" % (self.name, self.circle)
	class Meta:
		ordering=('circle','name')

class FacultyContract(models.Model):
	faculty = models.ForeignKey(Faculty)
	HOUR='Hourly'
	MONTH='Monthly'
	mode_choices = (('H',HOUR),('M',MONTH))
	mode = models.CharField(
		max_length=1,
		choices = mode_choices
	)
	amount = models.PositiveIntegerField()
	startdate = models.DateField(null=True,blank=True)
	enddate = models.DateField(null=True,blank=True)
	def __unicode__(self):
		return "%s: Rs%d (%s)" % (self.faculty, self.amount, self.get_mode_display())
	class Meta:
		ordering = ('mode','faculty')

#CoursePackageFromContractForFaculty
class Package(models.Model):
	contract = models.ForeignKey(Contract)
	course = models.ForeignKey(Course)
	facultycontract = models.ForeignKey(FacultyContract, null=True)
	def __unicode__(self):
		return "%s , %s , %s" % (self.contract, self.course, self.facultycontract)
	class Meta:
		ordering=('id',)

class Receipt(models.Model):
	amount = models.PositiveIntegerField()
	date = models.DateField()
	serial = models.CharField(max_length=200)
	contract = models.ForeignKey(Contract)
	def __unicode__(self):
		return "\"%s\" %s : Rs%d , %s" % (self.date, self.serial, self.amount, self.contract)

class Payment(models.Model):
	amount = models.PositiveIntegerField()
	date = models.DateField()
	serial = models.CharField(max_length=200)
	facultycontract = models.ForeignKey(FacultyContract)
	def __unicode__(self):
		return "\"%s\" %s : Rs%d , %s" % (self.date, self.serial, self.amount, self.facultycontract)

