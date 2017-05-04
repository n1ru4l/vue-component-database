'use strict'

const TIMESPAN_CHECK_ACCESS_TOKEN = 1000 * 60 * 30

function shouldCheckToken(lastTokenCheck) {
  return Date.now() - lastTokenCheck > TIMESPAN_CHECK_ACCESS_TOKEN
}

const userCache = new Map() // @TODO: Poor mans cache

class User {

  constructor({
    githubConnector,
    knexConnector,
  }) {
    this.knex = knexConnector
    this.github = githubConnector
  }

  async getCurrentUser() {
    const { accessToken } = this.github
    if (!accessToken) return null

    let [ dbUser ] = await this.knex(`users`).where({
      access_token: accessToken,
    })

    if (dbUser) {
      let user = userCache.get(dbUser.id)

      if (shouldCheckToken(dbUser.last_token_check) || !user) {
        user = await this.github.fetchCurrentUser()
        userCache.set(dbUser.id, user)
        await this.knex(`users`).update({
          last_token_check: Date.now(),
        }).where({ id: dbUser.id })
      }

      return user
    }

    const user = await this.github.fetchCurrentUser()
    if (!user) return null

    dbUser = await this.whereGithubId(user.id)
    if (dbUser) {
      await this.knex(`users`).update({
        last_token_check: Date.now(),
        access_token: accessToken,
      }).where({ id: dbUser.id })
      return user
    }

    // Auto-Create User
    await this.create({
      login: user.login,
      githubUserId: user.id,
      accessToken,
    })

    return user
  }

  async whereId(id) {
    const [ user ] = await this.knex(`users`).where({ id })
    return user || null
  }

// eslint-disable-next-line camelcase
  async whereGithubId(github_user_id) {
    const [ user ] = await this.knex(`users`).where({ github_user_id })
    return user || null
  }

  async create({
    login = null,
    githubUserId = null,
    accessToken = this.accessToken,
  }) {
    const [ userId ] = await this.knex(`users`).insert({
      login,
      github_user_id: githubUserId,
      access_token: accessToken,
      last_token_check: Date.now(),
    }).returning(`id`)
    return this.whereId(userId)
  }
}

module.exports = User
