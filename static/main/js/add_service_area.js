// Global variable to store our objects
var MozioTest = MozioTest || {};


// We can only do this if BasicMap is defined
if (MozioTest.BasicMap) {

    // NOTE: All methods here assume that the google.maps object is defined.

    MozioTest.AddServiceArea = function() {
        // Default properties
        this._serviceAreaPoints = [];  // The current array of points to build the polygon off from
        this._serviceArea = null;  // The current polygon that represents a service area
        this._mapMarkers = {};  // The current set of markers in the map
        this.config = {
            serviceAreaFormId: 'service_area_form',
            serviceAreaPathFormFieldId: 'id_service_area_path'
        };
    };

    // Making AddServiceArea a 'subclass' of BasicMap
    MozioTest.AddServiceArea.prototype = Object.create(new MozioTest.BasicMap());

    // Public constructor
    MozioTest.AddServiceArea.prototype.init = function() {
        this._createMap();
        this._clearPoints();
        this._bindForm();
        this._addEventListeners();
    };

    // Private methods

    MozioTest.AddServiceArea.prototype._clearPoints = function() {
        /*
        Method that resets the array of points.
        */
        this._serviceAreaPoints = [];
    };
    MozioTest.AddServiceArea.prototype._checkPoints = function() {
        /*
        Method that checks if the current array of points is enough to form a
        polygon. If so, it creates it and updates the UI.
        */
        // Checking if there's a current service area so we can reset it
        if (this._serviceArea) {
            this._serviceArea.setMap(null);
            this._serviceArea = null;
        }
        // We need at least 3 points to create a new service area
        if (this._serviceAreaPoints.length > 2) {
            // Creating and adding the new polygon to the map
            this._serviceArea = new google.maps.Polygon({
                paths: this._serviceAreaPoints,
                strokeColor: '#000',
                strokeOpacity: 0.7,
                strokeWeight: 1,
                fillColor: '#333',
                fillOpacity: 0.33
            });
            this._serviceArea.setMap(this._map);
        }
        // UI - Toggling the actions buttons
        var
            $uiActionButtons = $('#info_area').find('.action_buttons'),
            $addServiceAreaButton = $uiActionButtons.find('#add_service_area');
        if (this._serviceAreaPoints.length == 0) {
            $addServiceAreaButton.hide();
            $uiActionButtons.fadeOut();
        }
        else {
            this._serviceAreaPoints.length < 3 ? $addServiceAreaButton.hide() : $addServiceAreaButton.show();
            $uiActionButtons.fadeIn();
        }
    };
    MozioTest.AddServiceArea.prototype._addPoint = function(point) {
        /*
        Method that adds a new point to the array of points and updates the UI.
        */
        // Creating a new marker in the map
        var
            that = this,
            newPointIdx = this._serviceAreaPoints.length,
            newPointLabel = formatLatLonToString(point.lat(), point.lng()),
            newMarker = new google.maps.Marker({
                position: point,
                map: this._map,
                title: (newPointIdx + 1).toString() + '.   ' + newPointLabel,
                animation: google.maps.Animation.DROP,
                draggable: true
            });
        // Adding extra data to the marker
        newMarker.extraData = {'idx': newPointIdx};
        // Adding event listeners to the marker
        google.maps.event.addListener(newMarker, 'dragend', function() {
            that._relocatePoint(this);
        });
        /*
        TODO: Make this work completely.
        google.maps.event.addListener(newMarker, 'click', function(e) {
            that._removePoint(this);
        });
        */
        // Saving the new marker
        this._mapMarkers[newPointIdx] = newMarker;
        // Adding the point to the array
        this._serviceAreaPoints.push(point);
        // Checking if we can form a polygon
        this._checkPoints();
        // UI - Adding the point to the list
        $('<li/>', {
            id: 'point_' + newPointIdx.toString(),
            text: newPointLabel
        }).appendTo('#service_area_point_list');
    };
    MozioTest.AddServiceArea.prototype._relocatePoint = function(marker) {
        /*
        Method that changes the location of the given marker, updating the
        point array and the UI.
        */
        var
            idx = marker.extraData.idx,
            markerLatlon = marker.getPosition(),
            newPointLabel = formatLatLonToString(markerLatlon.lat(), markerLatlon.lng());
        this._serviceAreaPoints[idx] = markerLatlon;
        this._checkPoints();
        // UI - Updating the label of the point
        marker.setTitle(newPointLabel);
        $('#service_area_point_list').find('#point_' + idx).text(newPointLabel);
    };
    MozioTest.AddServiceArea.prototype._removePoint = function(marker) {
        /*
        Method that removes the given point, both from the set and the UI.
        */
        var currentPointIdx = marker.extraData.idx;
        // Removing the given marker
        //this._serviceAreaPoints.splice(currentPointIdx, 1);
        this._serviceAreaPoints[currentPointIdx] = null;
        this._checkPoints();
        // UI - Removing the marker from the map and the list
        marker.setMap(null);
        delete this._mapMarkers[currentPointIdx];
        $('#service_area_point_list').find('#point_' + currentPointIdx.toString()).remove();
    };
    MozioTest.AddServiceArea.prototype._removeAllPoints = function() {
        /*
        Method that removes all points and updates the UI.
        */
        // Resetting the storage
        this._clearPoints();
        this._checkPoints();
        // UI - Clearing the map and the list
        for (var currentMarkerId in this._mapMarkers) {
            if (this._mapMarkers.hasOwnProperty(currentMarkerId)) {
                this._mapMarkers[currentMarkerId].setMap(null);
                delete this._mapMarkers[currentMarkerId];
            }
        }
        $('#service_area_point_list').empty();
    };
    MozioTest.AddServiceArea.prototype._getServiceAreaPathAsStr = function() {
        /*
        Method that returns the string representation of the current service
        area. Final results looks like 'point1_lon point2_lan, ...'.
        */
        var serviceAreaPathStr = '';
        if (this._serviceArea) {
            var serviceAreaPointArray = this._serviceArea.getPath();
            // Adding the first point at the end of the array to close the loop
            serviceAreaPointArray.push(serviceAreaPointArray.getAt(0));
            serviceAreaPointArray.forEach(function(current_point, idx) {
                serviceAreaPathStr += current_point.lng().toString() + ' ' + current_point.lat().toString();
                if (idx < serviceAreaPointArray.length-1) serviceAreaPathStr += ', '
            });
        }
        return serviceAreaPathStr;
    };
    MozioTest.AddServiceArea.prototype._bindForm = function() {
        /*
        */
        var that = this;
        // Handling form submit
        $('#' + that.config.serviceAreaFormId).submit(function() {
            var
                $serviceAreaPathField = $(this).find('#' + that.config.serviceAreaPathFormFieldId),
                serviceAreaPathStr = that._getServiceAreaPathAsStr();
            if (serviceAreaPathStr !== '') {
                $serviceAreaPathField.val(that._getServiceAreaPathAsStr());
                return true;
            }
            return false;
        });
    };
    MozioTest.AddServiceArea.prototype._addEventListeners = function() {
        /*
        Method that adds all event listeners to objects and UI components.
        */
        var that = this;
        // Map listeners
        google.maps.event.addListener(this._map, 'click', function(e) {
            that._addPoint(e.latLng);
        });
        // UI listeners
        $('#clear_map').click(function() {
            that._removeAllPoints();
            return false;
        });
    };

}
