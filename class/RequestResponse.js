const { RequestError } = require("./RequestError")

/**
 * A request response object.
 * 
 * @constructor
 * @param {OrigamiServer} server - The server that instantiated this response
 * @param {ServerResponse} baseResponse - The original server response object
 * @returns {RequestResponse}
 */
class RequestResponse {
    constructor(server, baseResponse) {
        this.status = 200
        this.body = null
        this.mime = 'application/json'
        this.headers = {}
        this.server = server
        /** @private */
        this._responseBase = baseResponse

        return this
    }

    /**
     * Write something to the response body.
     * 
     * @param {*} body - The response body
     * @param {number} status - The HTTP status
     * @returns {RequestResponse}
     */
    write = function(body, status) {
        this.body = body

        if(status) this.status = status

        return this
    }

    /**
     * Shorthand to turn the response into a Buffer.
     * 
     * @param {string} type - The MIME type of the response
     * @returns {RequestResponse}
     */
    buffer = function(type = 'application/octet-stream') {
        this.body = Buffer.from([])

        this.setType(type)

        return this
    }

    /**
     * Set the MIME type of the response.
     * 
     * @param {string} mime 
     * @returns {RequestResponse}
     */
    setType = function(mime) {
        this.mime = mime

        return this
    }

    /**
     * Set a response header.
     * 
     * @param {string} k - The header name
     * @param {string} v - The header value
     * @returns {RequestResponse}
     */
    setHead = function(k, v) {
        this.headers[k] = v

        return this
    }

    /**
     * Set the HTTP status of the response.
     * 
     * @param {number} status - The HTTP status 
     * @returns {RequestResponse}
     */
    setStatus = function(status) {
        this.status = status

        return this
    }

    /**
     * Shorthand to set multiple headers at a time
     * 
     * @param {Array} collection - An object of key-value pairs to set as headers
     * @returns {RequestResponse}
     */
    setHeadMany = function(collection) {
        for(let head in collection) {
            this.setHead(head, collection[head])
        }

        return this
    }

    /**
     * Shorthand for creating a request error. This is meant for client errors, please throw instead for backend errors.
     * 
     * @param {string|number} code - The code to identify the error by.
     * @param {string} message - A human-readable message to deliver with the error.
     * @param {number} status - The HTTP status of the error.
     * @returns {RequestError}
     */
    error = function(code = 'BAD_REQUEST', message = 'Bad Request', status = 400) {
        let e = new RequestError(code, message, status)

        return e
    }
}

module.exports.RequestResponse = RequestResponse