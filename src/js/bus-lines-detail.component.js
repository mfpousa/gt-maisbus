function BusLinesDetailComponent () {

    let variableDeclarations = () => {
        this.overlayElement = $('.overlay');
        this.busLineDetailElement = $('#bus-line-detail');
    };

    let elementUpdates = () => {
        $(this.overlayElement).hide();
    };

    let eventHandling = () => {

        // Exit out the bus line detail popup when clicking outside the box
        $(this.overlayElement).click((evt) => {
            if ($(this.overlayElement)[0] === evt.target) {
                this.toggleBusLineDetail();
            }
        });

        // Set up the bus line detail element (the one that opens when a tile is clicked)
        // to hide from start and to show up when a tile is clicked
        $(this.busLineDetailElement).find('#detail-close').click(() => {
            this.toggleBusLineDetail();
        });
    };

    // Create the method to toggle the bus line detail popup
    this.toggleBusLineDetail = (busLine) => {
        if (!busLine || busLine['trayectos'] === undefined) {
            $(this.overlayElement).fadeOut(250);
            $(this.busLineDetailElement).hide(250);
        } else {
            let title = $(this.busLineDetailElement).find('#title');
            let journeys = $(this.busLineDetailElement).find('#journeys');
            $(journeys).empty();
            $(this.overlayElement).fadeIn(250);
            $(this.busLineDetailElement).css('box-shadow', '0 0 5px -3px ' + busLine['estilo']);
            $(this.busLineDetailElement).css('background', busLine['estilo']);
            $(title).text(busLine['nombre']);

            // Insert the information of all journeys
            busLine['trayectos'].forEach((journey) => {
                let newJourney = $('<div class="journey"></div>');
                $(newJourney).append($('<h2>Trayecto de ' + journey['sentido'].toLowerCase() + '</h2>'));

                // Create a list of bus stops
                let stopsList = $('<ul></ul>');
                journey['paradas'].forEach((busStop) => {
                    let newEntry = $('<li><div class="content">' + busStop['nombre'] + '</div></li>');
                    $(newEntry).css('border-color', busLine['estilo']);
                    $(stopsList).append(newEntry);
                });

                // Add the list to the journey entry
                $(newJourney).append(stopsList);

                // Add the new journey to the journeys list
                $(journeys).append(newJourney);
            });

            // Show the detail element
            $(this.busLineDetailElement).show(250);
        }
    };

    this.init = () => {
        variableDeclarations();
        elementUpdates();
        eventHandling();
    };
}