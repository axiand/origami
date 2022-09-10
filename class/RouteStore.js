class RouteStore {
    constructor() {
        this.RouteTree = {}
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

        if(!object[symbol] || object[symbol].stub) {
            object[symbol] = {
                'name': CurIdx,
                'route': idx == pathArr.length - 1 ? route : null,
                'stub': idx == pathArr.length - 1 ? false : true,
                'children': object[symbol]?.children || {},
            }
        }

        this.routeTreeAdd(pathArr, idx + 1, object[symbol].children, route)

        return
    }

    getRoute = function(path) {
        let pathArr = path.split('/')
        let idx = 0

        let rt = this.routeTreeGet(pathArr, idx, this.RouteTree)
        return rt
    }

    routeTreeGet = function(pathArr, idx, object) {
        //console.log(pathArr, idx, pathArr.length - 1, pathArr[idx], object)

        if(!object) return null

        let CurIdx = pathArr[idx]

        let r = null

        if(idx == pathArr.length - 1) {
            if(object[CurIdx]) r = object[CurIdx]

            if(object['*']) r = object['*']

            if(!r || r.stub) r = null
        } else {
            r = this.routeTreeGet(pathArr, idx + 1, object['*']?.children || object[CurIdx]?.children)
        }

        return r
    }
}

module.exports.RouteStore = RouteStore