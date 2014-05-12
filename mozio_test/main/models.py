from django.contrib.gis.db import models


class ServiceArea(models.Model):
    """
    Model that represents a service area.
    """

    polygon = models.PolygonField()
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    objects = models.GeoManager()

    class Meta:
        ordering = ('-created',)

    def get_google_maps_static_img_link(self):
        """
        Method that returns the link to the Google Maps API static map that
        shows this service area.
        """
        # TODO: Implement this so we can use it in the front-end.
        return ''
