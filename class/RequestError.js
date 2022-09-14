class RequestError {
    constructor(status, message) {
        this.status = status
        this.message = message
    }
}

module.exports.RequestError = RequestError