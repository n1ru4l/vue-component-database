'use strict'

exports.up = ({ schema }) => schema.createTable(`components`, (table) => {
  table.increments()
  table.string(`title`)
    .notNull()
  table.string(`description`)
    .notNull()
  table.string(`component`)
    .notNull()
  table.timestamps()
})

exports.down = ({ schema }) => schema.dropTable(`components`)
