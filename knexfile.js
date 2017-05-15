'use strict'

require(`dotenv`).config()
const path = require(`path`)

const { env } = process

if (env.DB_CONNECTION === `sqlite3`) {
  module.exports = {
    client: `sqlite3`,
    connection: {
      filename: path.join(__dirname, env.DB_FILENAME),
    },
  }
} else if (env.DB_CONNECTION === `mysql`) {
  module.exports = {
    client: `mysql`,
    connection: {
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_DATABASE,
    }
  }
} else {
  throw new Error(`Unsupported Database! '${env.DB_CONNECTION}'`)
}
