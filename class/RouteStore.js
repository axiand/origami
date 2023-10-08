const { METHODS } = require("../shared/methods")
const { RouteLeaf } = require("./RouteLeaf")
const { removeTrailingSlash } = require("../shared/removeTrailingSlash")

/**
 * The app route store.
 */
class RouteStore {
    constructor() {
        this.RouteTree = {}

        for(let method of METHODS) {
            this.RouteTree[method] = new RouteLeaf()
        }
    }

    /**
     * Mount a route to the store.
     * 
     * @param {Route} route - The route to mount
     * @returns {RouteLeaf}
     */
    mountRoute = function(route) {
        return this.RouteTree[route.method].appendChild(removeTrailingSlash(route.path), route)
    }

    /**
     * Get a route and metadata from the store.
     * 
     * @param {string} path - The path to search in the store for
     * @param {string} method - The method of the route
     * @returns {object} - The route, its includes, the query string of the path provided, and middlewares. 
     */
    getRoute = function(path, method) {
        let pathQuerySplit = path.split("?")
        let query = pathQuerySplit[1]
        let pathIsolated = pathQuerySplit[0]

        let {route, includes, middles} = this.RouteTree[method].getChild(pathIsolated, {}, {before: [], after: []})
        
        return {route: route, includes: includes, query: query, middles: middles}
    }
}

module.exports.RouteStore = RouteStore