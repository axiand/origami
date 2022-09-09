const http = require('http')

class OrigamiServer {
    constructor(port, parent) {
        this.port = port
        this.Parent = parent
    }

    listen = function() {
        this.Server = http.createServer((req, res) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(this.Parent.routes))
            res.end();
        })

        this.Server.listen(this.port)
    }
}

module.exports.OrigamiServer = OrigamiServer