'use strict'

const ComponentsModel = require(`./model/Components`)

const schema = require(`./schema`)
const { graphqlKoa, graphiqlKoa } = require(`graphql-server-koa`)

const graphql = graphqlKoa((ctx) => {
  return {
    schema,
    context: {
      models: {
        Components: new ComponentsModel,
      }
    }
  }
})

module.exports = {
  graphql,
  graphiql: graphiqlKoa({ endpointURL: '/graphql' }),
}
