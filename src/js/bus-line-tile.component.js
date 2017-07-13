function BusLineTileElement () {
    this.createElement = (parentEl, options) => {

        // Get parameters from options object
        let line = options['line'];
        let enableAnimations = options['enableAnimations'] === undefined ? true : options['enableAnimations'];
        let onclick = options['onclick'];

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

        // Hide the new tile to allow a smooth fadein afterwards
        $(busLineElement).hide();

        // Modify children values
        let number = $(busLineElement).find('.number');
        let name = $(busLineElement).find('.name');
        let search = $(busLineElement).find('.search');
        let wrapper = $(busLineElement).find('.wrapper');
        $(number).text(line['sinoptico']);
        $(name).text(line['nombre']);
        $(name).hide();

        if (enableAnimations) {
            let intervalId;
            // Event handling
            $(wrapper).mouseenter(() => {
                $(name).stop(true, true);
                $(name).slideDown(250);
                $(number).slideUp(250);
                intervalId = setInterval(() => {
                    $(name).slideToggle(1000);
                    $(number).slideToggle(1000);
                }, 3000);
            });
            $(wrapper).mouseleave(() => {
                $(name).slideUp(250);
                $(number).stop(true, true);
                $(number).slideDown(250);
                clearInterval(intervalId);
            });
        }

        // Handle click event calling the provided handler
        $(wrapper).click(onclick);

        // Apply styles to children
        $(wrapper).css({
            background: line['estilo'],
            outlineColor: line['estilo']
        });

        // Append new tile to list
        $(parentEl).append(busLineElement);

        // Fade in tile
        $(busLineElement).fadeIn('slow');

        // Finally return the freshly created element
        return busLineElement;
    };
}