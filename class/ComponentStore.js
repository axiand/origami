/**
 * The component store.
 */
class ComponentStore {
    constructor() {
        this.store = {}
    }

    /**
     * Mount a component to the store.
     * 
     * @param {Component} comp - The component to mount
     * @returns {Component}
     */
    mountComponent = function(comp) {
        this.store[comp.name] = comp

        return this.store[comp.name]
    }
}

module.exports.ComponentStore = ComponentStore