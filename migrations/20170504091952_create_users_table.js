'use strict'

exports.up = ({ schema }) => schema.createTable(`users`, (table) => {
  table.increments() // a.k.a github_user_id
  table.string(`login`)
    .notNull()
    .unique()
  table.string(`avatar_url`)
  table.string(`access_token`)
  table.timestamp(`last_token_check`)
    .notNull()
})

exports.down = ({ schema }) => schema.dropTable(`users`)
