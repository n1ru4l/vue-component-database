'use strict'

module.exports = {
  // Mutation: {},
  Query: {
    components(obj, args, { models }) {
      const { Components } = models
      return Components.findAll()

    },
    component(obj, args, { models }) {
      const { Components } = models
      return Components.findOne(args)
    }
  },
  Mutation: {
    createComponent(obj, { component }, { models }) {
      const { Components } = models
      return Components.create(component)
    },
    deleteComponent(obj, { componentId }, { models }) {
      const { Components } = models
      return Components.deleteById(componentId)
    }
  }
}
