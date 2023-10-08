/**
 * The request handler. Responsible for interpreting response objects from resolver functions, and translating them to something understood by the server code.
 */
class RequestHandler {
    constructor() {
        this.AllowedClasses = ['RequestResponse', 'Object', 'RequestError']

        return this
    }

    /**
     * Process a response.
     * 
     * @param {RequestResponse|object|RequestError} resolverResponse - The resolver function response to try to process.
     * @returns {object} - A server-readable response.
     */
    proc = function(resolverResponse) {
        if(!resolverResponse) {
            return this.handleRawObject({})
        }

        switch(resolverResponse.constructor.name) {
            case('RequestResponse'):
                return this.handleRequestResponse(resolverResponse)
            case('Object'):
                return this.handleRawObject(resolverResponse)
            case('RequestError'):
                return this.handleError(resolverResponse)
            default:
                throw new Error(`origami: Request response type is invalid. Expected one of: ${this.AllowedClasses.join(', ')}. got ${resolverResponse.constructor.name}`)
        }
    }

    /**
     * Handle a RequestResponse object.
     * 
     * @param {RequestResponse} resolved - A resolved request response.
     * @returns {object}
     */
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

    /**
     * Handle a raw object.
     * 
     * @param {object} obj - The object to handle. 
     * @returns {object}
     */
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

    /**
     * Handle a RequestError object.
     * 
     * @param {RequestError} err - The request error to handle.
     * @returns {object}
     */
    handleError = function(err) {
        let head = {}
        let status = err.status
        let write = JSON.stringify(
            {
                'code': err.code,
                'message': err.message
            }
        )

        return {
            head: head,
            status: status,
            write: write,
        }
    }
}

module.exports.RequestHandler = RequestHandler