const { removeTrailingSlash } = require("../shared/removeTrailingSlash")

class Route {
    constructor(method, path, resolver) {
        this.path = removeTrailingSlash(path)
        this.resolver = resolver
        this.method = method

        this.m_before = []
        this.m_after = []

        return this
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

module.exports.Route = Route