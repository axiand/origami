class OrigamiMounter {
    constructor(server) {
        this.server = server

        this.allowedMounts = ['Route', 'Component']
    }

    mount = function(thing) {
        if(!this.allowedMounts.includes(thing.constructor.name)) {
            throw new Error(`Mounter: Expeted one of ${this.allowedMounts.join(', ')}. Got ${thing.constructor.name}`)
        }

        switch(thing.constructor.name) {
            case('Route'):
                return this.mountRoute(thing)
            case('Component'):
                return this.mountComponent(thing)
            default:
                return
        }
    }

    
    mountRoute = function(route) {
        return this.server.routes.mountRoute(route)
    }
    mountComponent = function(component) {
        return this.server.components.mountComponent(component)
    }
}

module.exports.OrigamiMounter = OrigamiMounter