
exports.up = ({ schema }) => {
  return schema.createTable(`users`, table => {
    table.increments()
    table.string(`github_user_id`)
      .notNull()
    table.string(`login`)
      .notNull()
      .unique()
    table.string(`access_token`)
    table.timestamp(`last_token_check`)
      .notNull()
  })
};

exports.down = ({ schema }) => {
  return schema.dropTable(`users`)
};
