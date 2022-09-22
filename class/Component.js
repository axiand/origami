class Component {
    constructor(name, getRecipe = () => {}) {
        this.name = name
        this.recipe = {}

        this.recipe.Get = getRecipe

        return this
    }
}

module.exports.Component = Component