from django.conf.urls import patterns, url

from .views import add_service_area, verify_point, verify_point_service


urlpatterns = patterns(
    '',
    url(r'^$', add_service_area, name='add_service_area'),
    url(r'^verify/$', verify_point, name='verify_point'),
    url(
        r'^verify_point_service/$', verify_point_service,
        name='verify_point_service'
    ),
)
