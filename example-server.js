const { RequestError } = require('./class/RequestError.js')
const { Route } = require('./class/Route.js')
const { Origami } = require('./index.js')

let d = Date.now()

// Create an app running on port 3000
var app = new Origami(3006)

// Fire up the server
app.listen((app) => {
    console.log(`Server running on port ${app.port} - http://localhost:${app.port}/`)
})

app.mountRoute(new Route('GET', 'v1/users/:user', (ctx, res) => {
    return res.error(400, Math.random(), 'ERR_NOT_ALLOWED')
}))

app.mountRoute(new Route('POST', '///v1/posts/:post////', (ctx, res) => {
    return {res}
}))

app.mountRoute(new Route('GET', '/v1/messages/:Group server/:Channel channel/pinned', (ctx, res) => {
    return res
        .write(ctx.body)
}))

app.mountRoute(new Route('DELETE', '/v1/messages/', (ctx, res) => {
    res.write(ctx.GetApp().routes)

    return res
}))

console.log(`${Date.now() - d}ms`)