class RouteStore {
    constructor() {
        this.RouteTree = {}
    }

    resolveUrlPart = function(part) {
        if(part[0] == ":") {
            let partContent = part.slice(1)

            if(partContent.includes(' ')) {
                let split = partContent.split(' ')

                return {
                    'includes': split[1],
                    'typeName': split[0],
                }
            }

            return {
                'includes': partContent,
                'typeName': null
            }
        } else { return {
            'includes': part,
            'typeName': null,
        } }
    }

    mountRoute = function(route) {
        let pathArr = route.path.split('/')
        let idx = 0

        this.routeTreeAdd(pathArr, idx, this.RouteTree, route)

        //console.log(JSON.stringify(this.RouteTree, ' ', 3))
    }

    routeTreeAdd = function(pathArr, idx, object, route) {
        //console.log(pathArr, idx, pathArr.length - 1, object)

        if(idx == pathArr.length) return

        let CurIdx = pathArr[idx]

        let symbol = CurIdx.startsWith(':') ? '*' : CurIdx

        if(object[symbol] && !object[symbol].stub && idx == pathArr.length - 1) {
            throw new Error(`Route with matcher ${pathArr.join('/')} already exists!`)
        }

        console.log(this.resolveUrlPart(CurIdx))

        if(!object[symbol] || object[symbol].stub) {
            object[symbol] = {
                'name': CurIdx,
                'route': idx == pathArr.length - 1 ? route : null,
                'stub': idx == pathArr.length - 1 ? false : true,
                'includes': CurIdx.startsWith(':') ? CurIdx.slice(1) : null,
                'children': object[symbol]?.children || {},
            }
        }

        this.routeTreeAdd(pathArr, idx + 1, object[symbol].children, route)

        return
    }

    getRoute = function(path) {
        let pathArr = path.split('/')
        let idx = 0

        let { route, includes } = this.routeTreeGet(pathArr, idx, this.RouteTree, {})
        return { route: route, includes: includes }
    }

    routeTreeGet = function(pathArr, idx, object, includes) {
        //console.log(pathArr, idx, pathArr.length - 1, pathArr[idx], object)

        if(!object) return {
            route: null,
            includes: includes
        }

        let CurIdx = pathArr[idx]

        let iTarget = object[CurIdx]||object['*']
        if(iTarget && iTarget.includes) {
            includes[iTarget.includes] = CurIdx
        }

        let r = null

        if(idx == pathArr.length - 1) {
            if(object[CurIdx]) r = object[CurIdx]

            if(object['*']) r = object['*']

            if(!r || r.stub) r = null
        } else {
            r = this.routeTreeGet(pathArr, idx + 1, object['*']?.children || object[CurIdx]?.children, includes).route
        }

        return {
            route: r,
            includes: includes
        }
    }
}

module.exports.RouteStore = RouteStore