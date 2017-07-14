function BusLinesDetailComponent () {

    let variableDeclarations = () => {
        this.overlayElement = $('.overlay');
        this.busLineDetailElement = $('#bus-line-detail');
        this.updateInterval = undefined;
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
    this.toggleBusLineDetail = (busLine, busStop) => {

        // If no parameter is provided please exit
        if (!busLine || busLine['trayectos'] === undefined) {
            $(this.overlayElement).fadeOut(250);
            $(this.busLineDetailElement).fadeOut(250);
            return;
        }

        // Load some elements
        let title = $(this.busLineDetailElement).find('#title');
        let journeys = $(this.busLineDetailElement).find('#journeys');

        // Do some thing over those elements
        $(title).text(busLine['nombre']);
        $(journeys).empty();
        $(this.overlayElement).fadeIn(250);
        $(this.busLineDetailElement).css('box-shadow', '0 0 5px ' + busLine['estilo']);
        $(this.busLineDetailElement).find('.header:first').css('background', busLine['estilo']);

        popupComponent.showMessage('Actualizando datos de la línea...');

        // Insert the information of all journeys
        busLine['trayectos'].forEach((journey) => {

            // Create a new journey
            let newJourney = $('<div class="journey"></div>');
            $(newJourney).html($('<h2>Trayecto de ' + journey['sentido'].toLowerCase() +
                '</h2><h3>(' + journey['nombre'] + ')</h3>'));

            // Create a list of bus stops
            let stopsList = $('<ul></ul>');
            journey['paradas'].forEach((busStop) => {

                // Create a new bus stop entry
                let newEntry = $('<li></li>');
                $(newEntry).click(() => {
                    alert(JSON.stringify(busStop, null, '\t'));
                });
                $(newEntry).attr('id', busStop['id']);
                $(newEntry).html('<div class="content"><div class="name"></div><div class="time"></div></div>');
                let content = $(newEntry).find('.content');
                let name = $(newEntry).find('.name');
                let time = $(newEntry).find('.time');
                $(name).text(busStop['nombre']);
                $(time).text('Calculando tiempo...');

                // Update the scheduling info for the next 'maxTime' minutes of service
                let maxTime = 30;
                this.updateInterval = setInterval(() => {
                    dataService.getSchedule(busLine['id'], busStop['id'], (data) => {
                        let currentDate = new Date(Date.now());
                        let stopDate = new Date(Date.now());
                        let nextBuses = [];
                        data.forEach((time) => {
                            let splits = time.split(':');
                            stopDate.setHours(Number.parseInt(splits[0]));
                            stopDate.setMinutes(Number.parseInt(splits[1]));
                            let minsDiff = (stopDate.getTime() - currentDate.getTime()) / 1000 / 60;
                            if (minsDiff < 0) return;
                            nextBuses.push(Number.parseInt(minsDiff.toString()));
                        });
                        nextBuses.sort((a, b) => {return a - b});
                        let ratio = (maxTime - nextBuses[0]) / maxTime;

                        // If the bus exceeds the waiting time of 'maxTime' then exit
                        if (ratio < 0) return;

                        let col = decomposeColor(busLine['estilo']);
                        // Only highlight the ones with urgent due time
                        if (ratio > 0.7) {
                            $(time).css('background', 'rgba(' +
                                col.r + ', ' + col.g + ', ' + col.b + ', ' + ratio + ')');
                        } else $(time).removeAttr('style');
                        if (nextBuses[0] !== undefined) {
                            $(time).text(nextBuses[0] + ' minutos');
                            $(time).fadeIn('slow');
                        }
                    });
                }, 20000);

                // Add the bus stop to the list
                $(stopsList).append(newEntry);
            });

            // Add the list to the journey entry
            $(newJourney).append(stopsList);

            // Add the new journey to the journeys list
            $(journeys).append(newJourney);
        });

        // Show the detail element
        $(this.busLineDetailElement).fadeIn(250);

        // Optionally scroll to the desired bus stop
        if (busStop !== undefined) {
            dataService.getBusStopByName(busStop, (data) => {
                if (data !== undefined && data[0]['id'] !== undefined) {
                    location.href = '#' + data[0]['id'];
                    $('#' + data[0]['id']).css({
                        background: busLine['estilo'],
                        borderLeft: '3px solid ' + busLine['estilo'],
                    });
                    setTimeout(() => {
                        let col = decomposeColor(busLine['estilo']);
                        $('#' + data[0]['id']).css({
                            transition: 'background 600ms',
                            background: 'rgba(' + col.r + ', ' + col.g + ', ' + col.b + ', 0.1)'
                        });
                    }, 200);
                }
            });
        }
    };

    this.init = () => {
        variableDeclarations();
        elementUpdates();
        eventHandling();
    };
}