from django.contrib import admin
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



admin.site.register(Student)
admin.site.register(Course)
admin.site.register(Contract)
admin.site.register(Circle)
admin.site.register(Faculty)
admin.site.register(Subject)
admin.site.register(FacultyContract)
admin.site.register(Receipt)
admin.site.register(Payment)
admin.site.register(Group)
