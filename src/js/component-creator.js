function createComponent(componentType, parentEl, options) {
    let componentTypeInstance;
    if (componentType !== undefined && (componentTypeInstance = new componentType()).createElement !== undefined) {
        return componentTypeInstance.createElement(parentEl, options);
    }
}