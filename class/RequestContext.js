class RequestContext {
    constructor(server, context) {
        this.ServerContext = server
        
        this.includes = context.includes
        this.body = context.body
        this.headers = context.headers

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