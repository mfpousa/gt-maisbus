var busLinesComponent = (() => {
    
    this.busLinesContainer = undefined;
    this.defaultNotFound = undefined;
    this.busLines = undefined;
    this.busLineDetailElement = undefined;
    this.destinationInput = undefined;
    this.overlayElement = undefined;
    // This is just a flag
    this.searchMode = false;
    
    this.init = () => {
        
        // Assign variables
        busLines = [];
        overlayElement = $('.overlay');
        overlayElement.hide();
        busLineDetailElement = $('#bus-line-detail');
        busLinesContainer = $('#bus-lines');
        defaultNotFound = $(busLinesContainer).find('#default-not-found');
        $(defaultNotFound).text('No se han encontrado coincidencias');
        $(defaultNotFound).hide();
        
        // Set up the bus line detail element (the one that opens when a tile is clicked)
        // to hide from start and to show up when a tile is clicked
        $(busLineDetailElement).hide();
        $(busLineDetailElement).find('#detail-close').click(() => {
            toggleBusLineDetail();
        });
        
        // Get and configure destination input (search input box on the top right)
        destinationInput = $('#destination');
        
        $(destinationInput).keyup(() => {
            let destination = $(destinationInput).val();
            if (destination.trim().length < 3) {
                if (searchMode) {
                    for (let i = 0; i < busLines.length; i++) {
                        busLines[i].search = undefined;
                    }
                    updateAndDisplayBusLines(busLines);
                    $(defaultNotFound).slideUp(250);
                    this.searchMode = false;
                }
                return;
            }
            this.searchMode = true;
            let match;
            updateAndDisplayBusLines(busLines.filter((busLine) => {
                let show = busLine.nombre.toLowerCase()
                .includes(destination.toLowerCase());
                match = busLine.nombre.replace(new RegExp(destination, 'gi'), '<b>' + destination + '</b>');
                if (!show) {
                    for (let i = 0; i < busLine.trayectos.length; i++) {
                        let trayecto = busLine.trayectos[i];
                        for (let i1 = 0; i1 < trayecto.paradas.length; i1++) {
                            let parada = trayecto.paradas[i1];
                            let condition = parada.nombre.toLowerCase()
                            .includes(destination.toLowerCase());
                            show = show || condition;
                            if (condition) match = parada.nombre.replace(new RegExp(destination, 'gi'), '<b>' + destination + '</b>');
                            if (show) {
                                break;
                            }
                        }
                    }
                }
                if (show) busLine.search = match;
                return show;
            }));
        });
        
        // Retrieve bus lines data from server
        dataService.getBusLines((data, status) => {
            
            // Retrieve all missing information from server
            for (let i = 0; i < data.length; i++) {
                dataService.getBusLineById(data[i].codigo, (busLineData, status) => {
                    data[i] = busLineData;
                });
            }
            
            // Assign new information to global object
            busLines = data;
            updateAndDisplayBusLines(busLines);
        });
    };
    
    // Create the method to toggle the element's visibility
    this.toggleBusLineDetail = (busLine) => {
        if (!busLine) {
            $(overlayElement).fadeOut(250);
            $(busLineDetailElement).hide(250);
        } else {
            //alert(JSON.stringify(busLine));
            $(overlayElement).fadeIn(250);
            $(busLineDetailElement).css('box-shadow', '0 0 20px ' + busLine.estilo);
            $(busLineDetailElement).find('#header').css('background', busLine.estilo);
            $(busLineDetailElement).find('#title').text(busLine.nombre);
            $(busLineDetailElement).find('#information').html(busLine.informacion);
            $(busLineDetailElement).show(250);
        }
    }
    
    // Tiles receive a different treatment when the user enters a search query
    this.isSearchTile = (busLine) => {
        return busLine.search !== undefined
    }
    
    // Here we create the tiles based on the provided bus lines
    this.updateAndDisplayBusLines = (busLines) => {
        
        // Load bus lines container and remove all its children
        $(busLinesContainer).children('.bus-line').remove();
        
        if (busLines.length === 0) {
            $(defaultNotFound).slideDown(250);
            return;
        }
        
        $(defaultNotFound).hide();
        for (let i = 0; i < busLines.length; i++) {
            
            // Create and stylize new bus line element
            let busLineElement = $('<div class="bus-line"></div>')
            .html(
                `<div class="wrapper">
                    <div class="content">
                        <div class="number"></div>
                        <div class="search"></div>
                        <div class="name"></div>
                    </div>
                </div>`);
            $(busLineElement).hide();
            
            // Modify children values
            let number = $(busLineElement).find('.number');
            let name = $(busLineElement).find('.name');
            let search = $(busLineElement).find('.search');
            let wrapper = $(busLineElement).find('.wrapper');
            $(number).text(busLines[i].sinoptico);
            $(name).text(busLines[i].nombre);
            if (isSearchTile(busLines[i])) {
                $(search).html(busLines[i].search);
                $(search).slideDown(250);
                $(number).slideUp(250);
                $(name).remove();
            }
            
            let intervalId;
            // Handle events
            $(wrapper).mouseenter(() => {
                if (isSearchTile(busLines[i])) {
                    $(number).stop(true, true);
                    $(number).slideDown(250);
                    $(search).slideUp(250);
                } else {
                    $(name).stop(true, true);
                    $(name).slideDown(250);
                    $(number).slideUp(250);
                }
                intervalId = setInterval(() => {
                    $(name).slideToggle(1000);
                    $(number).slideToggle(1000);
                }, 3000);
            });
            $(wrapper).mouseleave(() => {
                if (isSearchTile(busLines[i])) {
                    $(number).slideUp(250);
                    $(search).stop(true, true);
                    $(search).slideDown(250);
                } else {
                    $(name).slideUp(250);
                    $(number).stop(true, true);
                    $(number).slideDown(250);
                }
                clearInterval(intervalId);
            });
            $(wrapper).click(() => {
                toggleBusLineDetail(busLines[i]);
            });
            
            // Apply styles to children
            $(name).hide();
            $(wrapper).css('background', busLines[i].estilo);
            
            // Append new bus line element to list
            $(busLinesContainer).append(busLineElement);
            
            // Animate new entry
            $(busLineElement).fadeIn('slow');
        }
    }
    
    return {
        init: () => {init();}
    };
})();
