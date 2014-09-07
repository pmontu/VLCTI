from django.conf.urls import patterns, url

from institute import views

urlpatterns = patterns (
	'',
	url(r'^student/list\.json$',views.student_list),
	url(r'^student/(\d+)/get\.json$',views.student_get),
	url(r'^course/parent/(\d+)/list\.json$',views.course_list),
	)