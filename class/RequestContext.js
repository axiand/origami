class RequestContext {
    constructor(server) {
        this.ServerContext = server

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