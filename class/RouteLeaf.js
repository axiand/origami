const {parsePathPart} = require("../shared/parsePathPart")

/**
 * A route tree leaf.
 * 
 * @constructor
 * @returns {RouteLeaf}
 */
class RouteLeaf {
    constructor() {
        this.children = {}
        this.route = null

        return this
    }

    /**
     * Append a child to the leaf.
     * 
     * @param {string} path - The path relative to the leaf 
     * @param {Route} route - The route to append
     * @returns {RouteLeaf}
     */
    appendChild = function(path, route) {
        let pathParts = path.split("/")
        let next = pathParts[0]

        if(!next) {
            if(this.route) {
                throw new Error(`origami: The route at "${route.path}" already exists`)
            }

            this.route = route

            return this
        } else {
            let partMeta = parsePathPart(next)

            if(!this.children[partMeta.part]) {
                this.children[partMeta.part] = new RouteLeaf()
            }

            let nextChild = this.children[partMeta.part]

            nextChild.symbol = partMeta.symbol
            nextChild.component = partMeta.component
            return nextChild.appendChild(pathParts.slice(1).join("/"), route)
        }
    }

    /**
     * Get a child of the leaf and its metadata.
     * 
     * @param {string} path - The path relative to the leaf
     * @param {object} includes - The current set of includes
     * @param {object} middles - The current set of middlewares 
     * @param {string} curr - The current path part 
     * @returns {object}
     */
    getChild = function(path, includes, middles, curr) {
        let pathParts = path.split("/")
        let next = pathParts[0]

        if(this.symbol) {includes[this.symbol] = {"key": curr, "typeName": this.component}}

        this.route ? middles.before = middles.before.concat(this.route.m_before) : null
        this.route ? middles.after = middles.after.concat(this.route.m_after) : null

        if(!next) return {route: this, includes: includes, middles: middles}

        if(this.children[next]) {
            return this.children[next].getChild(pathParts.slice(1).join("/"), includes, middles, next)
        } else if(this.children["*"]) {
            return this.children["*"].getChild(pathParts.slice(1).join("/"), includes, middles, next)
        } else {
            return {route: null, includes: {}}
        }
    }
}

module.exports.RouteLeaf = RouteLeaf