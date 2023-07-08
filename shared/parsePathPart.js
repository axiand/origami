function parsePathPart(part) {
    //check for dynamic notation
    if(part.startsWith(":")) {
        let what = part.slice(1)

        //check for component notation
        if(what.split(" ")[1]) {
            return {part: "*", symbol: what.split(" ")[1], component: what.split(" ")[0]}
        } else {
            return {part: "*", symbol: what, component: null}
        }
    } else {
        return {part: part, symbol: null, component: null}
    }
}

module.exports.parsePathPart = parsePathPart;