import json

from django.contrib import messages
from django.http import HttpResponse, HttpResponseBadRequest
from django.shortcuts import render
from django.contrib.gis.geos import GEOSException
from django.core.urlresolvers import reverse

from .forms import ServiceAreaForm
from .models import ServiceArea


def add_service_area(request):
    """
    View that handles the process of adding a new service area.
    """
    error = False
    # Processing data from POST
    if request.method == 'POST':
        # Building the form
        service_area_form = ServiceAreaForm(request.POST)
        # Checking if the form is valid
        if service_area_form.is_valid():
            # Creating a new service area
            service_area_path = \
                service_area_form.cleaned_data['service_area_path']
            try:
                new_service_area = ServiceArea()
                new_service_area.polygon = 'POLYGON((%s))' % service_area_path
                new_service_area.save()
                messages.success(
                    request,
                    u'<strong>Success!</strong> A new service area was created'
                    u' and these are the coordinates:<br>%s'
                    % service_area_path.replace(', ', '<br>')
                )
            except GEOSException:
                error = True
        # The form is invalid
        else:
            error = True
        # Showing an error message
        if error:
            messages.error(
                request,
                u"<strong>Ouch.</strong> The service area couldn't be "
                u"created. Please verify the data."
            )
    # No POST data: showing the empty form
    else:
        service_area_form = ServiceAreaForm()
    # Returning
    return render(request, 'main/add_service_area.html', {
        'service_area_form': service_area_form
    })


def verify_point(request):
    """
    View that shows the landing page to verify a given point inside all
    service areas.
    """
    # Returning just a template
    return render(request, 'main/verify_point.html', {
        'verify_point_service_endpoint': reverse('verify_point_service')
    })


def verify_point_service(request):
    """
    View that checks if the given lat and lon are contained by one of the
    service areas available.
    """
    # Verifying if the request is AJAX and includes 'lat' and 'lon' params
    params = ['lat', 'lon']
    if not request.is_ajax() or not all(request.GET.get(x) for x in params):
        return HttpResponseBadRequest(
            u"This endpoint only accepts AJAX request that include 'lat' and "
            u"'lon' params."
        )
    # Verifying if the given lat and lon are contained in one of the service
    # areas available
    lat = request.GET['lat']
    lon = request.GET['lon']
    is_contained = ServiceArea.objects.filter(
        polygon__contains='POINT(%s %s)' % (lon, lat)
    ).exists()
    # Returning
    return HttpResponse(json.dumps({
        'is_contained': is_contained
    }), content_type='application/json')
