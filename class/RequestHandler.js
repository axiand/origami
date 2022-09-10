class RequestHandler {
    constructor() {
        return this
    }

    proc = function(resolverResponse) {
        if(!resolverResponse) {
            return this.handleRawObject({})
        }

        switch(resolverResponse.constructor.name) {
            case('RequestResponse'):
                return this.handleRequestResponse(resolverResponse)
            case('Object'):
                return this.handleRawObject(resolverResponse)
            default:
                throw new Error(`Request response type is invalid. Expected RequestResponse or Object, got ${resolverResponse.constructor.name}`)
        }
    }

    handleRequestResponse = function(resolved) {
        resolved.headers['Content-Type'] = resolved.mime

        let head = resolved.headers
        let status = resolved.status
        let write = resolved.mime == 'application/json' ? JSON.stringify(resolved.body) : Buffer.from(resolved.body)

        return {
            head: head,
            status: status,
            write: write,
        }
    }

    handleRawObject = function(obj) {
        let head = { 'Content-Type': 'application/json'}
        let status = 200
        let write = JSON.stringify(obj)

        return {
            head: head,
            status: status,
            write: write,
        }
    }
}

module.exports.RequestHandler = RequestHandler