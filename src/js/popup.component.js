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

    this.showMessage = (message) => {
        if (message === undefined) return;
        $(this.content).html(message);
        $(this.popupEl).fadeIn('fast');
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