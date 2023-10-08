/**
 * A request error object.
 * 
 * @constructor
 * @param {string|number} code - The code to identify the error by.
 * @param {string} message - A human-readable message to deliver with the error.
 * @param {number} status - The HTTP status of the error.
 */
class RequestError {
    constructor(code = 'BAD_REQUEST', message = '', status = 400) {
        this.status = status
        this.message = message
        this.code = code
    }
}

module.exports.RequestError = RequestError