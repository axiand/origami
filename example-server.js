const { Route } = require('./class/Route.js')
const { Origami } = require('./index.js')

let d = Date.now()

// Create an app running on port 3000
var app = new Origami(3006)

// Fire up the server
app.listen((app) => {
    console.log(`Server running on port ${app.port} - http://localhost:${app.port}/`)
})

app.mountRoute(new Route('v1/users/:user', (ctx, res) => {
    res.setHeadMany({
        'a': 'b',
        'c': 'd',
        'Refresh': 1000,
        'Content-Length': 300,
    })
}))

app.mountRoute(new Route('///v1/posts/:post////', () => {}))

app.mountRoute(new Route('/v1/messages/:channel/pinned', () => {}))

app.mountRoute(new Route('/v1/messages/', () => {}))

console.log(`${Date.now() - d}ms`)