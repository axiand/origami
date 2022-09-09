const { OrigamiServer } = require("./class/OrigamiServer")
const { RouteStore } = require("./class/RouteStore")

class Origami {
    constructor(port = 3000, settings = {}) {
        this.port = port
        this.settings = settings

        this.server = new OrigamiServer(this.port, this)

        this.routes = new RouteStore()
    }

    listen = function(cback = () => {}) {
        this.server.listen(this.port)

        cback(this)
    }

    mountRoute = function(route) {
        return this.routes.mountRoute(route)
    }
}

module.exports.Origami = Origami