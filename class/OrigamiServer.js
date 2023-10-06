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
            let { route, includes, query } = this.Parent.routes.getRoute(parsedUrl, req.method)

            let body = []
            //console.log('Returned route', route)
            //console.log('Returned includes', includes)

            if(!route || !route.route) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write('404 Not Found')
                res.end();

                return
            }

            req.on('data', (chunk) => {

                body.push(chunk)

            }).on('end', async () => {

                body = Buffer.concat(body)

                try {

                    let resolved = await route.route.resolver(
                        new RequestContext(this,
                            {
                                includes: includes,
                                body: body,
                                headers: req.headers,
                                method: req.method,
                                queryString: query
                            }
                        ), 
                        new RequestResponse()
                    )
        
                    let { head, status, write } = this.handler.proc(resolved)

                    res.writeHead(status, head)
                    res.write(write)
                    res.end();
                } catch(e) {
                    if(e.constructor.name == 'RequestError') {
                        res.writeHead(e.status, {})
                        res.write(JSON.stringify({'code': e.code, 'message': e.message}))
                        res.end();

                        return
                    }

                    console.error("\x1b[31m", `origami: An error occurred while resolving ${route.route.path}\n`, "\x1b[37m", e)

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