//Copied from the documentation: https://github.com/axiand/origami-docs/blob/master/Getting%20Started/Intro.md

// Import Origami
const { Origami } = require('./index')

// Create an app running on port 3000
var app = new Origami(3000)

// Fire up the server
app.listen((app) => {
    console.log(`Server running on port ${app.port} - http://localhost:${app.port}/`)
})

// Create a GET /helloworld route
app.Route('GET', '/helloworld', (ctx, res) => {
    return res
           .write(
                {'greeting': 'Hello, World!'}
           )
})

// Create a route with a variable
// Origami calls these "includes"
app.Route('GET', '/articles/:artId', (ctx, res) => {
    let article = ctx.includes.artId

    /** Your database logic would probably go here. **/

    return res.write(
        {
            'id': article.key,
            'author': 'Firstname Lastname',
            'title': 'Article Name',
            'body': 'Article Body'
        }
    )
})

// Create a component class
class UserClass {
    constructor() {
        return {
            Get: (key) => {
                return {"id": key} 
            }
        }
    }
}

// Bind our class to the app
app.Component("User", UserClass)

// Create a route that uses the new class
app.Route('GET', '/users/:User target', (ctx, res) => {
    return {
        "user": ctx.bake("target")
    }
})