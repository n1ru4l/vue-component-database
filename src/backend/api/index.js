'use strict'

const knexConnector = require(`./connectors/knex`)
const GithubConnector = require(`./connectors/github`)

const ComponentsModel = require(`./model/Components`)
const UsersModel = require(`./model/Users`)

const schema = require(`./schema`)
const { graphqlKoa, graphiqlKoa } = require(`graphql-server-koa`)

const REGEX_PARSE_ACCESS_TOKEN = /Bearer (.*)$/

function parseAccessToken(authHeader = null) {
  if (!authHeader) return null
  const regexResult = authHeader.match(REGEX_PARSE_ACCESS_TOKEN)
  return regexResult[1]
}

const graphql = graphqlKoa(async (ctx) => {
  const accessToken = parseAccessToken(ctx.request.headers.authorization)

  const githubConnector = new GithubConnector({ accessToken })

  const Users = new UsersModel({ githubConnector, knexConnector })
  const Components = new ComponentsModel({ knexConnector })

  const user = await Users.getCurrentUser()

  return {
    schema,
    context: {
      models: {
        Users,
        Components,
      },
      user,
    },
  }
})

module.exports = {
  graphql,
  graphiql: graphiqlKoa({ endpointURL: `/graphql` }),
}
