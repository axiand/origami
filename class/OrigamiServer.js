const http = require('http')
const { removeTrailingSlash } = require('../shared/removeTrailingSlash')
const { RequestContext } = require('./RequestContext')
const { RequestHandler } = require('./RequestHandler')
const { RequestResponse } = require('./RequestResponse')

/**
 * An Origami server.
 * 
 * @constructor
 * @param {number} port - The port of this server
 * @param {Origami} parent - The app which instantiated this server
 */
class OrigamiServer {
    constructor(port, parent) {
        this.port = port
        this.Parent = parent

        this.handler = new RequestHandler()
    }

    /**
     * Create an HTTP server and listen.
     */
    listen = function() {
        this.Server = http.createServer(async (req, res) => {
            let parsedUrl = removeTrailingSlash(req.url)
            let { route, includes, query, middles } = this.Parent.routes.getRoute(parsedUrl, req.method)

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
                    //Setup contexts
                    let ctx =  new RequestContext(this,
                        {
                            includes: includes,
                            body: body,
                            headers: req.headers,
                            method: req.method,
                            queryString: query,
                            _requestBase: req,
                        }
                    )
                    let out = new RequestResponse(this, res)

                    // Execute before middlewares
                    for(let fn of middles.before) {
                        let new_ctx, new_res = await fn(ctx, out)

                        if(new_ctx instanceof RequestContext) ctx = new_ctx
                        if(new_res instanceof RequestResponse) out = new_res
                    }

                    // Execute the route resolver
                    let resolved = await route.route.resolver(ctx, out)

                    let { head, status, write } = this.handler.proc(resolved)

                    if(res.writableEnded) return; // We shouldn't try to write headers, body etc. 
                                                  // if the response has already been ended by other means 
                                                  // e.g. with the StreamedResponse API

                    // Write the things to be written and end the response.
                    res.writeHead(status, head)
                    res.write(write)
                    res.end();

                    // Execute after middlewares
                    for(let fn of middles.after) {
                        await fn(ctx)
                    }
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