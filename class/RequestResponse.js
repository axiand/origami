const { RequestError } = require("./RequestError")

class RequestResponse {
    constructor() {
        this.status = 200
        this.body = {}
        this.mime = 'application/json'
        this.headers = {}

        return this
    }

    write = function(body, status) {
        this.body = body

        if(status) this.status = status

        return this
    }

    setType = function(mime) {
        this.mime = mime

        return this
    }

    setHead = function(k, v) {
        this.headers[k] = v

        return this
    }

    setStatus = function(status) {
        this.status = status

        return this
    }

    setHeadMany = function(collection) {
        for(let head in collection) {
            this.setHead(head, collection[head])
        }

        return this
    }

    error = function(code = 'BAD_REQUEST', message = 'Bad Request', status = 400) {
        let e = new RequestError(status, message, code)

        return e
    }
}

module.exports.RequestResponse = RequestResponse