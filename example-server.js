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
    })

    res.write(
        {
            'user': 6,
            'name': 'Axi',
            'about': 'fdsgasdg',
            'rand': Math.random()
        }
    )

    return res
}))

app.mountRoute(new Route('///v1/posts/:post////', (ctx, res) => {
    return {res}
}))

app.mountRoute(new Route('/v1/messages/:group/:channel/pinned', (ctx, res) => {
    console.log(ctx.includes)

    return ctx.includes
}))

app.mountRoute(new Route('/v1/messages/', (ctx, res) => {
    res.write(ctx.GetApp().routes)

    return res
}))

console.log(`${Date.now() - d}ms`)