'use strict'

exports.seed = async (knex) => {
  await knex(`users`).del()
  await knex(`users`).insert({
    id: 14338007,
    login: `n1ru4l`,
    access_token: null,
    avatar_url: `https://avatars1.githubusercontent.com/u/14338007?v=3`,
    last_token_check: Date.now(),
  })
}
