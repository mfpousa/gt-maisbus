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
        if (!busLine) {
            $(this.overlayElement).fadeOut(250);
            $(this.busLineDetailElement).hide(250);
        } else {
            //alert(JSON.stringify(busLine));
            $(this.overlayElement).fadeIn(250);
            $(this.busLineDetailElement).css('box-shadow', '0 0 5px -3px ' + busLine['estilo']);
            $(this.busLineDetailElement).find('#header').css('background', busLine['estilo']);
            $(this.busLineDetailElement).find('#title').text(busLine['nombre']);
            $(this.busLineDetailElement).find('#information').html(busLine['informacion']);
            $(this.busLineDetailElement).show(250);
        }
    };

    this.init = () => {
        variableDeclarations();
        elementUpdates();
        eventHandling();
    };
}