class RequestError {
    constructor(code = 'BAD_REQUEST', message = '', status = 400) {
        this.status = status
        this.message = message
        this.code = code
    }
}

module.exports.RequestError = RequestError