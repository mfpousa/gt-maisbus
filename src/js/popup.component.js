function PopupComponent() {

    let variableDeclarations = () => {
        this.popupEl = $('#popup');
        this.content = $(this.popupEl).find('.content');
    };

    let elementUpdates = () => {
        this.popupEl.hide();
    };

    let eventHandling = () => {
    };

    this.showMessage = (message, time = 2000) => {
        if (message === undefined) return;
        $(this.content).html(message);
        $(this.popupEl).fadeIn('slow', () => {
            setTimeout(this.hide, time);
        });
    };

    this.hide = () => {
        $(this.popupEl).fadeOut('slow');
    };

    this.init = () => {
        variableDeclarations();
        elementUpdates();
        eventHandling();
    };
}