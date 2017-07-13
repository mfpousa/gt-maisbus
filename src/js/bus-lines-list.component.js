function BusLinesListComponent() {

    let variableDeclarations = () => {
        this.busLines = [];
        this.overlayElement = $('.overlay');
        this.busLineDetailElement = $('#bus-line-detail');
        this.busStopsContainer = $('#bus-lines');
    };

    let elementUpdates = () => {
        $(this.busLineDetailElement).hide();
        $(this.overlayElement).hide();
    };

    let eventHandling = () => {

        // Exit out the bus line detail popup when clicking outside the box
        $(this.overlayElement).click((evt) => {
            if ($(this.overlayElement)[0] === evt.target) {
                busLinesDetailComponent.toggleBusLineDetail();
            }
        });

        // Set up the bus line detail element (the one that opens when a tile is clicked)
        // to hide from start and to show up when a tile is clicked
        $(this.busLineDetailElement).find('#detail-close').click(() => {
            busLinesDetailComponent.toggleBusLineDetail();
        });
    };

    // Here we create the tiles based on the provided bus lines
    let updateAndDisplayBusLines = (busLines) => {

        // Remove all existing bus line tiles
        $(this.busStopsContainer).children('.bus-line').remove();

        // Create tiles
        for (let i = 0; i < busLines.length; i++) {
            createComponent(BusLineTileElement, this.busStopsContainer, {
                line: busLines[i],
                onclick: () => {
                    busLinesDetailComponent.toggleBusLineDetail(busLines[i]);
                }
            });
        }
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
            updateAndDisplayBusLines(this.busLines);
        });
    };
}
