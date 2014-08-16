
from django.http import HttpResponse

def getStudentDetails(request):
	val = str(request.POST)
	return HttpResponse(val)

