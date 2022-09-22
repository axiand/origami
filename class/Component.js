class Component {
    constructor(name, getRecipe = () => {}) {
        this.name = name
        this.recipe = {}

        this.recipe.Get = getRecipe

        return this
    }

    gets = function(fn) {
        this.recipe.Get = fn

        return this
    }

    creates = function(fn) {
        this.recipe.Create = fn

        return this
    }

    updates = function(fn) {
        this.recipe.Update = fn

        return this
    }

    deletes = function(fn) {
        this.recipe.Delete = fn

        return this
    }
}

module.exports.Component = Component