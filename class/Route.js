const { removeTrailingSlash } = require("../shared/removeTrailingSlash")

class Route {
    constructor(path, resolver) {
        this.path = removeTrailingSlash(path)
        this.resolver = resolver

        return this
    }
}

module.exports.Route = Route