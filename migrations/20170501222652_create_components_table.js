
exports.up = function({ schema }) {
  return schema.createTable(`components`, table => {
    table.increments()
    table.string(`title`)
      .notNull()
    table.string(`description`)
      .notNull()
    table.string(`component`)
      .notNull()
    table.timestamps()
  })
}

exports.down = function({ schema }) {
  return schema.dropTable(`components`)
}
