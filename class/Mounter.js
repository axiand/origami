/**
 * The Origami mounter
 * 
 * @constructor
 * @param {Origami} server - The app which instantiated this mounter
 */
class OrigamiMounter {
    constructor(server) {
        this.server = server

        this.allowedMounts = ['Route', 'Component']
    }

    /**
     * Shorthand for mounting something to the app. Mount type is figured out automatically
     * 
     * @param {Route|Component} thing - The thing to mount
     * @returns {Route|Component}
     */
    mount = function(thing) {
        if(!this.allowedMounts.includes(thing.constructor.name)) {
            throw new Error(`origami: Expected one of ${this.allowedMounts.join(', ')}. Got ${thing.constructor.name}`)
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

    /**
     * Mount a route to the app
     * 
     * @param {Route} route 
     * @returns {Route}
     */
    mountRoute = function(route) {
        return this.server.routes.mountRoute(route).route
    }

    /**
     * Mount a component to the app
     * 
     * @param {Component} component 
     * @returns {Component}
     */
    mountComponent = function(component) {
        return this.server.components.mountComponent(component)
    }
}

module.exports.OrigamiMounter = OrigamiMounter