class RequestContext {
    constructor(server, context) {
        this.ServerContext = server
        this.includes = context.includes

        return this
    }

    GetServer = function() {
        return this.ServerContext
    }
    GetApp = function() {
        return this.ServerContext.Parent
    }
}

module.exports.RequestContext = RequestContext