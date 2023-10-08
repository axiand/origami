const fs = require('fs/promises')
const path = require("path")
const { removeTrailingSlash } = require("../shared/removeTrailingSlash")

class Loader {
    constructor() {}

    use = async function(directory, basePath) {
        let objs = await this.loadFromDir(directory, removeTrailingSlash(basePath))

        return objs
    }

    loadFromDir = async function(dir, basePath) {
        let current_exports = []
        let files = await fs.readdir(dir)

        for(let f of files) {
            // If our file is probably a javascript file
            if(f.endsWith(".js") || f.endsWith(".ts")) {
                let f_exports = require(path.join(dir, f))

                for(let exp in f_exports) {
                    let p = f_exports[exp]

                    // todo: instanceof does not work here for some reason, so we have to check by constructor name instead. need to see how to fix this later
                    if(p.constructor.name == "Route" || p.constructor.name == "Component") { 
                        current_exports.push(p)
                        if(p.constructor.name == "Route") { // Special cases for routes: we'll want to override the path and log it to the console.
                            p.path = ( basePath.split("/").concat(removeTrailingSlash(p.path).split("/")) ).join("/").replace("@", ":")
                            console.log(`origami-loader: ${path.join(dir, f)} -> ${p.method} ${p.path}`) 
                        }
                    }
                }
            } else if(!f.split(".")[1]) { // If our file is likely a directory
                //todo: a bit faulty, would likely cause issues in cases of files with special names e.g. a file named "foo" would be treated as a dir
                current_exports = current_exports.concat(await this.loadFromDir(path.join(dir, f), basePath + "/" + f))
            }
        }

        return current_exports
    }
}

module.exports.Loader = Loader