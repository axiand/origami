const { removeTrailingSlash } = require("../shared/removeTrailingSlash")

/**
 * An Origami route.
 * 
 * @constructor
 * @param {string} method - The HTTP method of the route
 * @param {string} path - The path of the route
 * @param {Function} resolver - The resolver function of the route
 * @returns {Route} - The newly created route
 */
class Route {
    constructor(method, path, resolver) {
        this.path = removeTrailingSlash(path)
        this.resolver = resolver
        this.method = method

        this.m_before = []
        this.m_after = []

        return this
    }

    /**
     * @callback beforeMiddlewareResolver
     * 
     * @param {RequestContext} ctx - The request context
     * @param {RequestResponse} res - The request response
     */

    /**
     * Add a before middleware to the route
     * 
     * @param {beforeMiddlewareResolver} fn - The middleware function to add
     * @returns {Route}
     */
    before = function(fn) {
        this.m_before.push(fn)

        return this
    }

    /**
     * @callback afterMiddlewareResolver
     * 
     * @param {RequestContext} ctx - The request context
     */

    /**
     * Add an after middleware to the route
     * 
     * @param {afterMiddlewareResolver} fn - The middleware function to add
     * @returns {Route}
     */
    after = function(fn) {
        this.m_after.push(fn)

        return this
    }
}

module.exports.Route = Route