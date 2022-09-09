const { removeTrailingSlash } = require("../shared/removeTrailingSlash")

class Route {
    constructor(path, resolver) {
        this.path = removeTrailingSlash(path)
        this.resolver = resolver
    }
}

module.exports.Route = Route