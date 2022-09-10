class RequestResponse {
    constructor() {
        this.status = 200
        this.body = {}
        this.mime = 'application/json'
        this.headers = {}

        return this
    }

    write = function(body, status = 200) {
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
        for(head of Object.keys(collection)) {
            console.log(head)
        }

        return this
    }
}

module.exports.RequestResponse = RequestResponse