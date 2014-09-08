from django.conf.urls import patterns, url

from institute import views

urlpatterns = patterns (
	'',
	url(r'^student/list\.json$',views.student_list),
	url(r'^student/(\d+)/get\.json$',views.student_get),
	url(r'^course/list\.json$',views.course_list),
	url(r'^student/post\.json$',views.student_post),
	)