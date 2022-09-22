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

        this.includes = context.includes
        this.body = context.body
        this.headers = context.headers
        this.method = context.method

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
        
        let baked = comp.recipe[rec](inc.key, meta, this)
        return baked
    }
}

module.exports.RequestContext = RequestContext