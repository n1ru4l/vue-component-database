'use strict'

const fs = require(`fs-promise`)
const path = require(`path`)

const { makeExecutableSchema } = require(`graphql-tools`)

const resolvers = require(`./resolver`)

const schema = fs.readFileSync(path.join(__dirname, `schema.graphql`), `utf-8`)

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
})

module.exports = executableSchema
