const {parsePathPart} = require("../shared/parsePathPart")

class RouteLeaf {
    constructor() {
        this.children = {}
        this.route = null

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
            nextChild.appendChild(pathParts.slice(1).join("/"), route)
        }
    }

    getChild = function(path, includes, curr) {
        let pathParts = path.split("/")
        let next = pathParts[0]

        if(this.symbol) {includes[this.symbol] = {"key": curr, "typeName": this.component}}

        if(!next) return {route: this, includes: includes}

        if(this.children[next]) {
            return this.children[next].getChild(pathParts.slice(1).join("/"), includes, next)
        } else if(this.children["*"]) {
            return this.children["*"].getChild(pathParts.slice(1).join("/"), includes, next)
        } else {
            return {route: null, includes: {}}
        }
    }
}

module.exports.RouteLeaf = RouteLeaf