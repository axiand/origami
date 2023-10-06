const {parsePathPart} = require("../shared/parsePathPart")

class RouteLeaf {
    constructor() {
        this.children = {}
        this.route = null
        this.m_before = []
        this.m_after = []

        return this
    }

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

    getChild = function(path, includes, middles, curr) {
        let pathParts = path.split("/")
        let next = pathParts[0]

        if(this.symbol) {includes[this.symbol] = {"key": curr, "typeName": this.component}}

        middles.before = middles.before.concat(this.m_before)
        middles.after = middles.after.concat(this.m_after)

        if(!next) return {route: this, includes: includes, middles: middles}

        if(this.children[next]) {
            return this.children[next].getChild(pathParts.slice(1).join("/"), includes, middles, next)
        } else if(this.children["*"]) {
            return this.children["*"].getChild(pathParts.slice(1).join("/"), includes, middles, next)
        } else {
            return {route: null, includes: {}}
        }
    }

    before = function(fn) {
        this.m_before.push(fn)

        return this
    }

    after = function(fn) {
        this.m_after.push(fn)

        return this
    }
}

module.exports.RouteLeaf = RouteLeaf