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

        this.routeTreeAdd(pathArr, idx + 1, object[symbol].children)

        return
    }
}

module.exports.RouteStore = RouteStore