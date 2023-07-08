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
            this.children[next] = new RouteLeaf()

            this.children[next].appendChild(pathParts.slice(1).join("/"), route)
        }
    }
}

module.exports.RouteLeaf = RouteLeaf