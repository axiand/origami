var MethodFuncRelation = {
    'GET': 'Get',
    'POST': 'Post',
    'PUT': 'Put',
    'PATCH': 'Patch',
    'DELETE': 'Delete',
}

function linkMethodToFunc(method) {
    return MethodFuncRelation[method]
}

/**
 * The context of the request.
 * 
 * @constructor
 * @param {OrigamiServer} server - The server which was responsible for catching this request
 * @param {object} context - Additional context metadata
 */
class RequestContext {
    constructor(server, context) {
        this.ServerContext = server

        this.cache = {}

        this.includes = context.includes
        this.body = context.body
        this.headers = context.headers
        this.method = context.method
        this.queryString = context.queryString

        return this
    }

    /**
     * Get the server of this request.
     * 
     * @returns {OrigamiServer}
     */
    GetServer = function() {
        return this.ServerContext
    }

    /**
     * Get the app of this request.
     * 
     * @returns {Origami}
     */
    GetApp = function() {
        return this.ServerContext.Parent
    }

    /**
     * Get a header from the request by its key.
     * 
     * @param {string} k - The header key
     * @returns {string} - The header value
     */
    getHead = function(k) {
        return this.headers[k]
    }

    /**
     * Bake a component by its include key.
     * 
     * @param {string} v - The name of the include to attempt to bake.
     * @param {object} meta - Additional data to pass to the resolver.
     * @returns {object|RequestError}
     */
    bake = function(v, meta) {
        if(!this.includes[v]) throw new Error(`Attempted to bake ${v}, but it does not exist in the request includes.`)

        let inc = this.includes[v]
        let comp = this.GetApp().components.store[inc.typeName]

        if(!comp) throw new Error(`Attempt to bake ${inc.typeName}<${inc.key}>, but no such component exists.`)

        let rec = linkMethodToFunc(this.method)
        
        try {
            let inst = new comp.recipe()

            if(!inst[rec]) throw new Error(`Operator ${rec} of component ${inc.typeName} does not exist.`)

            let baked = inst[rec](inc.key, meta, this)

            return baked
        } catch(e) {
            if(e.constructor.name !== 'RequestError') {
                console.error("\x1b[31m", `origami: An error occurred while resolving ${inc.typeName}<${inc.key}>\n`, "\x1b[37m", e)
                throw `Dependency error on ${v}; see above`
            } else {
                throw e
            }
        }
    }

    /**
     * Get a query string param by its key name.
     * 
     * @param {string} k - The key of the query param to get
     * @returns {string}
     */
    getQuery = function(k) {
        if(!this.query) {
            this.query = new URLSearchParams(this.queryString)
        }

        return this.query.get(k)
    }
}

module.exports.RequestContext = RequestContext