function BusLinesSearchComponent () {

    let variableDeclarations = () => {
        this.busLines = [];
        this.busStopsContainer = $('#bus-lines-search');
        this.defaultNotFound = $('#default-not-found');
        this.defaultSearchResults = $('#default-search-results');
        this.destinationInput = $('#destination');
        this.maxBusStops = 3;
    };

    let elementUpdates = () => {
        $(this.defaultNotFound).text('No se han encontrado coincidencias').hide();;
        $(this.defaultSearchResults).text('Líneas que pasan por...').hide();
    };

    let eventHandling = () => {
        this.timeoutId = undefined;
        $(this.destinationInput).keyup(() => {
            if (this.timeoutId !== undefined) {
                clearTimeout(this.timeoutId);
                this.timeoutId = undefined;
            }
            this.timeoutId = setTimeout(() => {
                let destination = $(this.destinationInput).val();
                updateSearchResults(this.busLines, destination);
            }, 150);
        });
    };

    let updateSearchResults = (lines, destination) => {

        // Remove all existing bus line tiles
        $(this.busStopsContainer).children('.bus-stop').slideUp("slow", () => {
            $(this).remove();
        });

        // Exit out if there is no search parameter
        if (destination.trim().length === 0) {
            $(this.defaultNotFound).slideUp("slow");
            $(this.defaultSearchResults).slideUp("slow");
            return;
        }

        // Get the lines that pass through the matching bus stops
        let busStopsAndLines = new Map();
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            if (line['trayectos'] === undefined) return;
            for (let i1 = 0; i1 < line['trayectos'].length; i1++) {
                let journey = line['trayectos'][i1];
                for (let i2 = 0; i2 < journey['paradas'].length; i2++) {
                    let parada = journey['paradas'][i2];
                    if (parada['nombre'].toLowerCase().includes(destination.toLowerCase())) {
                        let busStopLines = busStopsAndLines.get(parada['nombre']);
                        if (busStopLines === undefined) busStopLines = [];
                        if (!busStopLines.includes(line)) busStopLines.push(line);
                        busStopsAndLines.set(parada['nombre'], busStopLines);
                    }
                }
            }
        }

        if (busStopsAndLines.size === 0) {
            $(this.defaultNotFound).slideDown("slow");
            $(this.defaultSearchResults).slideUp("slow");
        } else {
            $(this.defaultSearchResults).slideDown("slow");
            $(this.defaultNotFound).slideUp("slow");
        }

        // Display bus stops with their lines
        let busStops = this.maxBusStops;
        let animOffset = 100;
        busStopsAndLines.forEach((busStopLines, busStop, map) => {

            // Get out if the busStops limit has been met
            if (busStops <= 0) return;
            let busStopElement = $('<div class="bus-stop"></div>');
            $(busStopElement).html(`<h3 class="bus-stop-name"></h3><div class="bus-stop-lines"></div>`);
            let name = $(busStopElement).find('.bus-stop-name');
            let lines = $(busStopElement).find('.bus-stop-lines');
            $(busStopElement).hide();

            // Set values
            $(name).text(busStop);
            for (let i = 0; i < busStopLines.length; i++) {

                // Create the component and append it to the list
                createComponent(BusLineTileElement, lines, {
                    line: busStopLines[i],
                    onclick: () => {
                        busLinesDetailComponent.toggleBusLineDetail(busStopLines[i]);
                        console.log(JSON.stringify(busStopLines[i], null, "\t"));
                    },
                    enableAnimations: false
                });
            }

            // Add bus stop to the list
            $(this.busStopsContainer).append(busStopElement);

            setTimeout(() => {
                $(busStopElement).slideDown("slow");
            }, animOffset * (this.maxBusStops - busStops));
            busStops--;
        });
    };


    this.init = () => {
        variableDeclarations();
        elementUpdates();
        eventHandling();

        // Retrieve bus lines data from server
        dataService.getBusLines((data) => {

            // Retrieve all missing information from server
            for (let i = 0; i < data.length; i++) {
                dataService.getBusLineById(data[i]['codigo'], (busLineData) => {
                    data[i] = busLineData;
                });
            }

            // Assign new information to global object
            this.busLines = data;
        });
    };
}