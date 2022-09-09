const { OrigamiServer } = require("./class/OrigamiServer")

class Origami {
    constructor(port = 3000, settings = {}) {
        this.port = port
        this.settings = settings

        this.server = new OrigamiServer(this.port)
    }

    listen = function(cback = () => {}) {
        this.server.listen(this.port)

        cback(this)
    }
}

module.exports.Origami = Origami