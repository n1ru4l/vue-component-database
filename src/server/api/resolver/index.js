'use strict'

const { property } = require(`lodash`)

module.exports = {
  Query: {
    components(obj, args, { models }) {
      const { Components } = models
      return Components.findAll()
    },
    component(obj, args, { models }) {
      const { Components } = models
      return Components.findOne(args)
    },
    currentUser(obj, args, { user }) {
      return user
    },
  },
  Mutation: {
    createComponent(obj, { component }, { models }) {
      const { Components } = models
      return Components.create(component)
    },
    deleteComponent(obj, { componentId }, { models }) {
      const { Components } = models
      return Components.deleteById(componentId)
    },
  },
  User: {
    avatarUrl: property(`avatar_url`),
  },
}
