let dataService = (function() {

    // Declare global variables
    let apiUrl = 'http://app.tussa.org/tussa/api';
    
    // Api endpoint data getters
    function getBusLines(callback) {
        $.get(apiUrl + '/lineas', callback);
    }
    function getBusLineById(line, callback) {
        $.get(apiUrl + '/lineas/' + line, callback);
    }
    function getBusStopById(busStop, callback) {
        $.get(apiUrl + '/paradas/' + busStop, callback);
    }
    function getBusStopsNearBy(lat, lng, callback) {
        $.ajax({
            url: apiUrl + '/paradas/' + lat + '/' + lng,
            data: '{}',
            type: 'POST',
            contentType: 'application/json',
            success: callback
        });
    }

    // Return public methods
    return {
        getBusLines: function(callback) {getBusLines(callback)},
        getBusLineById: function(line, callback) {getBusLineById(line, callback)},
        getBusStopById: function(busStop, callback) {getBusStopById(busStop, callback)},
        getBusStopsNearBy: function(lat, lng, callback) {getBusStopsNearBy(lat, lng, callback)}
    }
})();
