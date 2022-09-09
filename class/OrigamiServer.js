const http = require('http')

class OrigamiServer {
    constructor(port) {
        this.port = port
    }

    listen = function() {
        this.Server = http.createServer((req, res) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({'message': "Hello, World!"}))
            res.end();
        })

        this.Server.listen(this.port)
    }
}

module.exports.OrigamiServer = OrigamiServer