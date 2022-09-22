class RequestError {
    constructor(code = 'BAD_REQUEST', message, status) {
        this.status = status
        this.message = message
        this.code = code
    }
}

module.exports.RequestError = RequestError