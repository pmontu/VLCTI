from django.conf.urls import patterns, url

from institute import views

urlpatterns = patterns (
	'',
	#url(r'^$',views.getStudentDetails),
	url(r'^student/list\.json$',views.getStudentList)
	)