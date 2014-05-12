// Global variable to store our objects
var MozioTest = MozioTest || {};


MozioTest.BasicMap = function() {
    // Default properties
    this._map = null;
    this._mapDefaultOptions = {
        center: new google.maps.LatLng(3.43, -76.53),
        zoom: 13
    };
};

// Adding methods to all BasicMap instances
MozioTest.BasicMap.prototype = {
    _createMap: function() {
        /*
        Method that initializes the map, assuming that the google.maps object
        is ready.
        */
        this._map = new google.maps.Map(document.getElementById('map'), this._mapDefaultOptions);
    }
};


// Helper functions

function formatLatLonToString(lat, lon) {
    return lon.toString().substr(0, 7) + ', ' + lat.toString().substr(0, 7);
}
