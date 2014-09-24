from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()


urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'VLCTI.views.home'),

    url(r'^institute/', include('institute.urls')),

    url(r'^admin/', include(admin.site.urls)),
)
