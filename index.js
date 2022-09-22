const { Component } = require("./class/Component")
const { ComponentStore } = require("./class/ComponentStore")
const { OrigamiMounter } = require("./class/Mounter")
const { OrigamiServer } = require("./class/OrigamiServer")
const { Route } = require("./class/Route")
const { RouteStore } = require("./class/RouteStore")

class Origami {
    constructor(port = 3000, settings = {}) {
        this.port = port
        this.settings = settings

        this.server = new OrigamiServer(this.port, this)

        this.mounter = new OrigamiMounter(this)

        this.routes = new RouteStore()
        this.components = new ComponentStore()
    }

    listen = function(cback = () => {}) {
        this.server.listen(this.port)

        cback(this)
    }

    Mount = function(thing) {
        return this.mounter.mount(thing)
    }

    Route = function(method, path, resolver) {
        return this.Mount(
            new Route(method, path, resolver)
        )
    }
    Component = function(name, getRecipe = () => {}) {
        return this.Mount(
            new Component(name, getRecipe)
        )
    }
}

module.exports.Origami = Origami