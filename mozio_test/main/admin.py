from django.contrib.gis import admin

from .models import ServiceArea


class ServiceAreaAdmin(admin.GeoModelAdmin):
    """
    Admin interface for the ServiceArea model.
    """
    list_display = ('created', 'polygon', 'modified')
    list_filter = ('created', 'modified')


admin.site.register(ServiceArea, ServiceAreaAdmin)
