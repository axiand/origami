const { Component } = require("./class/Component")
const { ComponentStore } = require("./class/ComponentStore")
const { OrigamiMounter } = require("./class/Mounter")
const { OrigamiServer } = require("./class/OrigamiServer")
const { Route } = require("./class/Route")
const { RouteStore } = require("./class/RouteStore")
const { RequestError } = require("./class/RequestError")
const { Loader } = require("./class/Loader")

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

    listen = function(cback = () => {}) {
        this.server.listen(this.port)

        cback(this)

        return this
    }

    use = async function(directory, basePath, cback = () => {}) {
        let thingsToMount = await this.loader.use(directory, basePath)

        for(let k in thingsToMount) {
            this.mounter.mount(thingsToMount[k])
        }

        await cback(this)

        console.log(JSON.stringify(this.routes.RouteTree))

        return this
    }

    Mount = function(thing) {
        return this.mounter.mount(thing)
    }

    Route = function(method, path, resolver) {
        return this.Mount(
            new Route(method, path, resolver)
        )
    }

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