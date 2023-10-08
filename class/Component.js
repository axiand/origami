/**
 * A component.
 * 
 * @constructor
 * @param {string} name - The name of the component
 * @param {class} recipe - The recipe function of this component
 */
class Component {
    constructor(name, recipe) {
        this.name = name
        this.recipe = recipe

        return this
    }
}

module.exports.Component = Component