class RequestError {
    constructor(status, message, code = 'BAD_REQUEST') {
        this.status = status
        this.message = message
        this.code = code
    }
}

module.exports.RequestError = RequestError