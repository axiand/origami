const { removeTrailingSlash } = require("../shared/removeTrailingSlash")

class Route {
    constructor(method, path, resolver) {
        this.path = removeTrailingSlash(path)
        this.resolver = resolver
        this.method = method

        return this
    }
}

module.exports.Route = Route