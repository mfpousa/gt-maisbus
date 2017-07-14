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

    let eventHandling = () => {};

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

            popupComponent.showMessage('Recuperando datos del servidor. Por favor espere');
            // Retrieve all missing information from server
            let pendingRequests = data.length;
            for (let i = 0; i < data.length; i++) {
                dataService.getBusLineById(data[i]['codigo'], (busLineData) => {
                    data[i] = busLineData;
                    pendingRequests--;
                    if (pendingRequests === 0) {
                        // Assign new information to global object
                        this.busLines = data;
                        updateAndDisplayBusLines(this.busLines);
                        popupComponent.hide();
                    }
                });
            }
        });
    };
}
