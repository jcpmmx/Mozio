// Global variable to store our objects
var MozioTest = MozioTest || {};


// We can only do this if BasicMap is defined
if (MozioTest.BasicMap) {

    // NOTE: All methods here assume that the google.maps object is defined.

    MozioTest.VerifyPoint = function() {
        // Default properties
        this._serviceEndpoint = '';
    };

    // Making VerifyPoint a 'subclass' of BasicMap
    MozioTest.VerifyPoint.prototype = Object.create(new MozioTest.BasicMap());

    // Public constructor
    MozioTest.VerifyPoint.prototype.init = function(serviceEndpoint) {
        this._serviceEndpoint = serviceEndpoint;
        this._createMap();
        this._addEventListeners();
    };

    // Private methods
    MozioTest.VerifyPoint.prototype._verifyPoint = function(lat, lon) {
        /*
        Method that verifies against the back-end if a given lat and lon are
        contained by one of the service areas available.
        */
        var that = this;
        $.get(this._serviceEndpoint, {lat: lat, lon: lon})
            .done(function(data) {
                that._showResultMessage(lat, lon, data.is_contained);
            })
            .fail(function(data) {
                alert(data.responseText);
            });
        return false;
    };
    MozioTest.VerifyPoint.prototype._showResultMessage = function(lat, lon, is_contained) {
        /*
        Method that shows a nice message indicating if the given lat lon are
        contained in one of the service areas available.
        */
        var
            pointStr = formatLatLonToString(lat, lon),
            veredict = is_contained ? 'Yes' : 'No',
            cssClass = is_contained ? 'text-success' : 'text-danger';
        $('<li/>', {
            html: 'Point ' + pointStr + ': <span class="' + cssClass + '"><strong>' + veredict + '</strong><span>'
        }).prependTo('#verification_results');
    };
    MozioTest.VerifyPoint.prototype._addEventListeners = function() {
        /*
        Method that adds all event listeners to objects and UI components.
        */
        var that = this;
        // Map listeners
        google.maps.event.addListener(this._map, 'click', function(e) {
            that._verifyPoint(e.latLng.lat(), e.latLng.lng());
        });
    };

}
