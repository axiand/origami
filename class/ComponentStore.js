class ComponentStore {
    constructor() {
        this.store = {}
    }

    mountComponent = function(comp) {
        this.store[comp.name] = comp

        return this.store[comp.name]
    }
}

module.exports.ComponentStore = ComponentStore