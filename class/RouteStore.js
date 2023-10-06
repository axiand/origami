const { METHODS } = require("../shared/methods")
const { parsePathPart } = require("../shared/parsePathPart")
const { RouteLeaf } = require("./RouteLeaf")

class RouteStore {
    constructor() {
        this.RouteTree = {}

        for(let method of METHODS) {
            this.RouteTree[method] = new RouteLeaf()
        }
    }

    mountRoute = function(route) {
        return this.RouteTree[route.method].appendChild(route.path, route)
    }

    getRoute = function(path, method) {
        let pathQuerySplit = path.split("?")
        let query = pathQuerySplit[1]
        let pathIsolated = pathQuerySplit[0]

        let {route, includes, middles} = this.RouteTree[method].getChild(pathIsolated, {}, {before: [], after: []})
        
        return {route: route, includes: includes, query: query, middles: middles}
    }
}

module.exports.RouteStore = RouteStore