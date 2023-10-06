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
                            queryString: query
                        }
                    )
                    let out = new RequestResponse()

                    // Execute before middlewares
                    for(let fn of middles.before) {
                        let new_ctx, new_res = await fn(ctx, out)

                        if(new_ctx instanceof RequestContext) ctx = new_ctx
                        if(new_res instanceof RequestResponse) out = new_res
                    }

                    // Execute the route resolver
                    let resolved = await route.route.resolver(ctx, out)

                    let { head, status, write } = this.handler.proc(resolved)

                    // Execute after middlewares
                    for(let fn of middles.after) {
                        await fn(ctx)
                    }

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