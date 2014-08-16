from django.db import models

class Student(models.Model):
	name = models.CharField(max_length=200)

class Course(models.Model):
	name = models.CharField(max_length=200)
	owner = models.ForeignKey('Course', null=True)

class Contract(models.Model):
	instalments = models.PositiveSmallIntegerField()
	totalamount = models.PositiveIntegerField()
	hoursoffered = models.PositiveSmallIntegerField()
	student = models.ForeignKey(Student)
	joiningdate = models.DateField()
	courses = models.ManyToManyField(Course,through='Package')

class Circle(models.Model):
	name = models.CharField(max_length=200)

class Faculty(models.Model):
	name = models.CharField(max_length=200)
	circle = models.ForeignKey(Circle)

class FacultyContract(models.Model):
	faculty = models.ForeignKey(Faculty,null=True)
	HOUR='Hourly'
	MONTH='Monthly'
	payment_mode_choices = ((HOUR,'H'),(MONTH,'M'))
	paymentmode = models.CharField(
		max_length=1,
		choices = payment_mode_choices
		)
	amount = models.PositiveIntegerField()

class Package(models.Model):
	package = models.ForeignKey(Contract)
	course = models.ForeignKey(Course)
	facultycontract = models.OneToOneField(FacultyContract)

class Recipt(models.Model):
	amount = models.PositiveIntegerField()
	date = models.DateField()
	number = models.CharField(max_length=20)
	package = models.ForeignKey(Package)

class Payment(models.Model):
	amount = models.PositiveIntegerField()
	date = models.DateField()
	number = models.CharField(max_length=20)
	facultycontract = models.ManyToManyField(FacultyContract)