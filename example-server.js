const { Route } = require('./class/Route.js')
const { Origami } = require('./index.js')

// Create an app running on port 3000
var app = new Origami(3006)

// Fire up the server
app.listen((app) => {
    console.log(`Server running on port ${app.port} - http://localhost:${app.port}/`)
})

let d = Date.now()

app.mountRoute(new Route('v1/users/:user', () => {}))

app.mountRoute(new Route('///v1/posts/:post////', () => {}))

app.mountRoute(new Route('/v1/messages/:channel/pinned', () => {}))

console.log(`${Date.now() - d}ms`)