var MethodFuncRelation = {
    'GET': 'Get',
    'POST': 'Create',
    'PUT': 'Update',
    'PATCH': 'Update',
    'DELETE': 'Delete',
}

function linkMethodToFunc(method) {
    return MethodFuncRelation[method]
}

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

    GetServer = function() {
        return this.ServerContext
    }
    GetApp = function() {
        return this.ServerContext.Parent
    }

    getHead = function(k) {
        return this.headers[k]
    }

    bake = function(v, meta) {
        if(!this.includes[v]) throw new Error(`Attempted to bake ${v}, but it does not exist in the request includes.`)

        let inc = this.includes[v]
        let comp = this.GetApp().components.store[inc.typeName]

        if(!comp) throw new Error(`Attempt to bake ${inc.typeName}<${inc.key}>, but no such component exists.`)

        let rec = linkMethodToFunc(this.method)
        
        try {
            let baked = comp.recipe[rec](inc.key, meta, this)

            return baked
        } catch(e) {
            if(e.constructor.name !== 'RequestError') {
                console.error("\x1b[31m", `[origami/ERROR] An error occurred while resolving ${inc.typeName}<${inc.key}>\n`, "\x1b[37m", e)
                throw `Dependency error on ${v}; see above`
            } else {
                throw e
            }
        }
    }

    parseQueryString = function(qs) {
        let split = qs.split('&')

        let returns = {}

        for(let s of split) {
            let kv = s.split('=')

            returns[kv[0]] = kv[1]
        }

        return returns
    } 

    getQuery = function(k) {
        let qcache = this.cache.query
        if(!qcache) {
            this.cache.query = this.parseQueryString(this.queryString)
            qcache = this.cache.query
        }

        return qcache[k]
    }
}

module.exports.RequestContext = RequestContext