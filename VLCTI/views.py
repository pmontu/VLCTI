from django.shortcuts import redirect

def home(request):
	return redirect('/static/index.html#/faculties')