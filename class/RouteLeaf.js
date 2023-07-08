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
            this.route = route

            return this
        } else {
            let partMeta = parsePathPart(next)

            this.children[partMeta.part] = new RouteLeaf()

            let nextChild = this.children[partMeta.part]

            nextChild.symbol = partMeta.symbol
            nextChild.component = partMeta.component
            nextChild.appendChild(pathParts.slice(1).join("/"), route)
        }
    }
}

module.exports.RouteLeaf = RouteLeaf