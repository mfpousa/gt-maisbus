let busLinesListComponent = new BusLinesListComponent();
let busLinesSearchComponent = new BusLinesSearchComponent();
let busLinesDetailComponent = new BusLinesDetailComponent();
let popupComponent = new PopupComponent();

$(document).ready(function() {
    busLinesListComponent.init();
    busLinesSearchComponent.init();
    busLinesDetailComponent.init();
    popupComponent.init();
});