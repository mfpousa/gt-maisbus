let busLinesListComponent = new BusLinesListComponent();
let busLinesSearchComponent = new BusLinesSearchComponent();
let busLinesDetailComponent = new BusLinesDetailComponent();

$(document).ready(function() {
    busLinesListComponent.init();
    busLinesSearchComponent.init();
    busLinesDetailComponent.init();
});

function createAndAppendBusLine (busLine, container, onclick, handleAnimations) {
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
    $(number).text(busLine['sinoptico']);
    $(name).text(busLine['nombre']);
    $(name).hide();

    if (handleAnimations || handleAnimations === undefined) {
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
    $(wrapper).click(onclick);

    // Apply styles to children
    $(wrapper).css({
        background: busLine['estilo'],
        outlineColor: busLine['estilo']
    });

    // Append new tile to list
    $(container).append(busLineElement);

    // Fade in tile
    $(busLineElement).fadeIn('slow');
}