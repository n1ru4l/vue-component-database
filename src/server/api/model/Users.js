'use strict'

const TIMESPAN_CHECK_ACCESS_TOKEN = 1000 * 60 * 30

function shouldCheckToken(lastTokenCheck) {
  return Date.now() - lastTokenCheck > TIMESPAN_CHECK_ACCESS_TOKEN
}

class User {

  constructor({
    githubConnector,
    knexConnector,
  }) {
    this.knex = knexConnector
    this.github = githubConnector
  }

  // @TODO: Encrypt/decrypt accessToken ?
  async getCurrentUser() {
    const { accessToken } = this.github
    if (!accessToken) return null

    let [ dbUser ] = await this.knex(`users`).where({
      access_token: accessToken,
    })

    if (dbUser) {
      if (process.env.NODE_ENV !== `production` || !shouldCheckToken(dbUser.last_token_check)) return dbUser
      const githubUser = await this.github.fetchCurrentUser()
      await this.knex(`users`).update({
        login: githubUser.login,
        avatar_url: githubUser.avatar_url,
        last_token_check: this.knex.fn.now(),
      }).where({ id: dbUser.id })
      return this.whereId(dbUser.id)
    }

    const githubUser = await this.github.fetchCurrentUser()
    if (!githubUser) return null

    dbUser = await this.whereId(githubUser.id)
    if (dbUser) {
      await this.knex(`users`).update({
        login: githubUser.login,
        avatar_url: githubUser.avatar_url,
        last_token_check: this.knex.fn.now(),
        access_token: accessToken,
      }).where({ id: dbUser.id })
      return this.whereId(dbUser.id)
    }

    // Auto-Create User
    return this.create({
      login: githubUser.login,
      id: githubUser.id,
      avatarUrl: githubUser.avatar_url,
      accessToken,
    })
  }

  async whereId(id) {
    const [ user ] = await this.knex(`users`).where({ id })
    return user || null
  }

  async create({
    id = null,
    login = null,
    avatarUrl = null,
    accessToken = this.accessToken,
  }) {
    const [ userId ] = await this.knex(`users`).insert({
      id,
      login,
      avatar_url: avatarUrl,
      access_token: accessToken,
      last_token_check: this.knex.fn.now(),
    }).returning(`id`)
    return this.whereId(userId)
  }
}

module.exports = User
