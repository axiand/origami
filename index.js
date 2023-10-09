const { Component } = require("./class/Component")
const { ComponentStore } = require("./class/ComponentStore")
const { OrigamiMounter } = require("./class/Mounter")
const { OrigamiServer } = require("./class/OrigamiServer")
const { Route } = require("./class/Route")
const { RouteStore } = require("./class/RouteStore")
const { RequestError } = require("./class/RequestError")
const { Loader } = require("./class/Loader")

/**
 * An Origami app.
 * @constructor
 * @param {number} port - The port the app should bind to
 * @param {object} settings - The settings to intialize the app with
 */
class Origami {
    constructor(port = 3000, settings = {}) {
        this.port = port
        this.settings = settings

        this.server = new OrigamiServer(this.port, this)

        this.mounter = new OrigamiMounter(this)
        this.loader = new Loader()

        this.routes = new RouteStore()
        this.components = new ComponentStore()
    }

    /**
     * Create an Origami server. Goes live on the port specified on instantiation.
     * 
     * @param {Function} cback - Callback to run after server goes live
     * @returns {Origami}
     */
    listen = function(cback = () => {}) {
        this.server.listen(this.port)

        cback(this)

        return this
    }

    /**
     * Mount a directory to the application. Routes and components are imported automatically.
     * 
     * @param {string} directory - The directory from which to import
     * @param {string} basePath - The path to bind imported routes under
     * @param {Function} cback - The callback to run after importing is finished
     * @returns {Origami}
     */
    use = async function(directory, basePath, cback = () => {}) {
        let thingsToMount = await this.loader.use(directory, basePath)

        for(let k in thingsToMount) {
            this.mounter.mount(thingsToMount[k])
        }

        await cback(this)

        return this
    }

    /**
     * Mount something onto the app.
     * 
     * @param {Route|Component} thing - The thing to try to mount.
     * @returns {Origami}
     */
    Mount = function(thing) {
        return this.mounter.mount(thing)
    }

    /**
     * @callback routeResolver
     * 
     * @param {RequestContext} ctx - The context of the incoming request
     * @param {RequestResponse} res - The response object of the incoming request
     */

    /**
     * Shorthand for creating a route and mounting it to the app.
     * 
     * @param {string} method - The method of the route. One of: GET, POST, PUT, DELETE, PATCH
     * @param {string} path - The path of the route
     * @param {routeResolver} resolver - The resolver function of the route
     * @returns {Route}
     */
    Route = function(method, path, resolver) {
        return this.Mount(
            new Route(method, path, resolver)
        )
    }

    /**
     * Shorthand for creating a component and mounting it to the app.
     * 
     * @param {string} name - The name of the component
     * @param {class} recipe - The recipe class of the component
     * @returns {Component}
     */
    Component = function(name, recipe) {
        return this.Mount(
            new Component(name, recipe)
        )
    }
}

module.exports.Origami = Origami
module.exports.Component = Component
module.exports.Route = Route
module.exports.RequestError = RequestError