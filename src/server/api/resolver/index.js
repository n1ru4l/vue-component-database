'use strict'

const {
  property,
} = require(`lodash`)

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
    createComponent(obj, { component }, { user, models }) {
      if (!user) throw new Error(`Must be authenticated.`)
      const { Components } = models
      return Components.create(Object.assign({}, component, { authorId: user.id }))
    },
    async deleteComponent(obj, { componentId }, { user, models }) {
      if (!user) throw new Error(`Must be authenticated.`)
      const { Components } = models
      const component = await Components.findWhereId(componentId)
      if (!component) throw new Error(`Component not found.`)
      if (component.author_id !== user.id) throw new Error(`Not allowed to delete this component`)
      return Components.deleteById(componentId)
    },
    async updateComponent(obj, { componentId, data }, { user, models }) {
      if (!user) throw new Error(`Must be authenticated.`)
      const { Components } = models
      const component = await Components.findWhereId(componentId)
      if (!component) throw new Error(`Component not found.`)
      if (component.author_id !== user.id) throw new Error(`Not allowed to change this component`)
      return Components.update(componentId, data)
    },
  },
  User: {
    avatarUrl: property(`avatar_url`),
  },
  Component: {
    author(component, params, { models }) {
      const { Users } = models
      return Users.whereId(component.author_id)
    },
  },
}
