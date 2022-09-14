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
            let { route, includes } = this.Parent.routes.getRoute(parsedUrl, req.method)

            let body = []
            //console.log('Returned route', route)
            //console.log('Returned includes', includes)

            console.log(req.method)

            if(!route) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write('404 Not Found')
                res.end();

                return
            }

            req.on('data', (chunk) => {

                body.push(chunk)

            }).on('end', () => {

                body = Buffer.concat(body)

                try {

                    let resolved = route.route.resolver(
                        new RequestContext(this,
                            {
                                includes: includes,
                                body: body,
                                headers: req.headers
                            }
                        ), 
                        new RequestResponse()
                    )
        
                    let { head, status, write } = this.handler.proc(resolved)

                    res.writeHead(status, head)
                    res.write(write)
                    res.end();
                } catch(e) {
                    console.error("\x1b[31m", `[origami/ERROR] An error occurred while resolving ${route.route.path}\n`, "\x1b[37m", e)

                    res.writeHead(500, {})
                    res.write('Internal Server Error')
                    res.end();
                }

            })

            return
        })

        this.Server.listen(this.port)
    }
}

module.exports.OrigamiServer = OrigamiServer