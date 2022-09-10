const http = require('http')
const { removeTrailingSlash } = require('../shared/removeTrailingSlash')
const { RequestContext } = require('./RequestContext')
const { RequestHandler } = require('./RequestHandler')
const { RequestResponse } = require('./RequestResponse')

class OrigamiServer {
    constructor(port, parent) {
        this.port = port
        this.Parent = parent

        this.handler = new RequestHandler()
    }

    listen = function() {
        this.Server = http.createServer(async (req, res) => {
            let parsedUrl = removeTrailingSlash(req.url)
            let rt = this.Parent.routes.getRoute(parsedUrl)
            //console.log('Returned route', rt)

            if(!rt) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write('404 Not Found')
                res.end();

                return
            }

            let resolved = rt.route.resolver(
                new RequestContext(this), 
                new RequestResponse()
            )

            let { head, status, write } = this.handler.proc(resolved)

            res.writeHead(status, head)
            res.write(write)
            res.end();
            return
        })

        this.Server.listen(this.port)
    }
}

module.exports.OrigamiServer = OrigamiServer