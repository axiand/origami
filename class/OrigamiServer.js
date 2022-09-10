const http = require('http')
const { removeTrailingSlash } = require('../shared/removeTrailingSlash')
const { RequestContext } = require('./RequestContext')
const { RequestResponse } = require('./RequestResponse')

class OrigamiServer {
    constructor(port, parent) {
        this.port = port
        this.Parent = parent
    }

    listen = function() {
        this.Server = http.createServer(async (req, res) => {
            let parsedUrl = removeTrailingSlash(req.url)
            let rt = this.Parent.routes.getRoute(parsedUrl)
            console.log('Returned route', rt)

            if(!rt) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write('404 Not Found')
                res.end();

                return
            }

            let resp = rt.route.resolver(
                new RequestContext(), 
                new RequestResponse()
            )

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(this.Parent.routes, null, 4))
            res.end();
        })

        this.Server.listen(this.port)
    }
}

module.exports.OrigamiServer = OrigamiServer