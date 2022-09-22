class ComponentStore {
    constructor() {
        this.components = {}
    }

    mountComponent = function(comp) {
        this.components[comp.name] = comp

        return this.components[comp.name]
    }
}

module.exports.ComponentStore = ComponentStore