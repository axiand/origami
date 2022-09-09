const { Origami } = require('./index.js')

// Create an app running on port 3000
var app = new Origami(3006)

// Fire up the server
app.listen((app) => {
    console.log(`Server running on port ${app.port} - http://localhost:${app.port}/`)
})

let d = Date.now()

app.mountRoute('v1/users/:user/posts')
app.mountRoute('v1/users/:user/posts/:post')
app.mountRoute('v1/blogs/:blog')
app.mountRoute('v1/users')
app.mountRoute('v1/users/:user/comments/:comment/likes/:like/remove/confirm')
app.mountRoute('v1/users/:user/comments/:comment/likes/:like/add/confirm')

console.log(`${Date.now() - d}ms`)