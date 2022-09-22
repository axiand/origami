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

    getHead = function(k) {
        return this.headers[k]
    }

    bake = function(v, ctx) {
        if(!this.includes[v]) throw new Error(`Attempted to bake ${v}, but it does not exist in the request includes.`)
    }
}

module.exports.RequestContext = RequestContext