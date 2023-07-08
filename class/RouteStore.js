const { METHODS } = require("../shared/methods")
const { RouteLeaf } = require("./RouteLeaf")

class RouteStore {
    constructor() {
        this.RouteTree = {}

        for(let method of METHODS) {
            this.RouteTree[method] = new RouteLeaf()
        }
    }

    mountRoute = function(route) {
        this.RouteTree[route.method].appendChild(route.path, route)
        
        return this
    }
}

module.exports.RouteStore = RouteStore