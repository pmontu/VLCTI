from django.conf.urls import patterns, url

from institute import views

urlpatterns = patterns (
	'',
	url(r'^student/list\.json$',views.student_list),
	url(r'^student/(\d+)/get\.json$',views.student_get),
	url(r'^student/(\d+)/contracts\.json$',views.student_contracts),
	url(r'^student/post\.json$',views.student_post),
	url(r'^student/update\.json$',views.student_update),

	url(r'^course/list\.json$',views.course_list),
	url(r'^course/(\d+)/subjects\.json$',views.course_subjects),

	url(r'^contract/post\.json$',views.contract_post),
	url(r'^contract/update\.json$',views.contract_update),
	url(r'^contract/(\d+)/get\.json$',views.contract_get),
	url(r'^contract/(\d+)/subjects\.json$',views.contract_subjects),
	url(r'^contract/(\d+)/receipts\.json$',views.contract_receipts),

	url(r'^receipt/post\.json$',views.receipt_post),
	url(r'^receipt/update\.json$',views.receipt_update),
	url(r'^receipt/(\d+)/get\.json$',views.receipt_get),

	url(r'^subject/post\.json$',views.subject_post),
	url(r'^subject/(\d+)/get\.json$',views.subject_get),
	url(r'^subject/update\.json$',views.subject_update),

	url(r'^faculty/list\.json$',views.faculty_list),
	url(r'^faculty/(\d+)/get\.json$',views.faculty_get),
	url(r'^faculty/update\.json$',views.faculty_update),
	url(r'^faculty/post\.json$',views.faculty_post),
	url(r'^faculty/(\d+)/agreements\.json$',views.faculty_agreements),

	url(r'^agreement/post\.json$',views.agreement_post),
	url(r'^agreement/update\.json$',views.agreement_update),
	url(r'^agreement/(\d+)/get\.json$',views.agreement_get),
	url(r'^agreement/(\d+)/groups\.json$',views.agreement_groups),
	url(r'^agreement/(\d+)/payments\.json$',views.agreement_payments),

	url(r'^group/post\.json$',views.group_post),
	url(r'^group/update\.json$',views.group_update),
	url(r'^group/(\d+)/get\.json$',views.group_get),
	url(r'^group/list\.json$',views.group_list),

	url(r'^payment/post\.json$',views.payment_post),
	url(r'^payment/update\.json$',views.payment_update),
	url(r'^payment/(\d+)/get\.json$',views.payment_get),

	url(r'^circle/list\.json$',views.circle_list),

	url(r'^user/login\.json$',views.user_login),
	url(r'^user/logout\.json$',views.user_logout),
	url(r'^user/info\.json$',views.user_info),
	)