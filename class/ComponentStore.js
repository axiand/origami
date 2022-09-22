class ComponentStore {
    constructor() {
        this.components = {}
    }

    mountComponent = function(comp) {
        this.components[comp.name] = comp

        return comp
    }
}

module.exports.ComponentStore = ComponentStore