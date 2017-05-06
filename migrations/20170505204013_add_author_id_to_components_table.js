'use strict'

exports.up = ({ schema }) => schema.alterTable(`components`, (table) => {
  table.integer(`author_id`)
    .references(`users.id`)
    .after(`component`)
})

exports.down = ({ schema }) => schema.alterTable(`components`, (table) => {
  table.dropColumn(`author_id`)
})
