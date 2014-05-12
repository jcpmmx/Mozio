from django import forms


class ServiceAreaForm(forms.Form):
    """
    Form that handles the creation of new service area.
    """
    service_area_path = forms.CharField()
