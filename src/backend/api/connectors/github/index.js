'use strict'

// Inspired by https://github.com/github/platform-samples/tree/master/api/javascript/es2015-nodejs/libs

const fetch = require(`isomorphic-fetch`)
const users = require(`./features/users`)

const GITHUB_BASE_URI = `https://api.github.com`

class HttpException extends Error {
  constructor({
    message,
    status,
    statusText,
    url,
  }) {
    super(message)
    this.status = status
    this.statusText = statusText
    this.url = url
  }
}

class GithubConnector {

  constructor({
      baseUri = GITHUB_BASE_URI,
      accessToken = null,
  } = {}, // eslint-disable-next-line indent
  features = [
    users,
  ]) {
    this.baseUri = baseUri
    this.accessToken = accessToken
    this.credentials = (accessToken !== null && accessToken.length > 0) ? `token ${accessToken}` : null

    // eslint-disable-next-line quote-props
    this.headers = {
      'Content-Type': `application/json`,
      Accept: `application/vnd.github.v3.full+json`,
      Authorization: this.credentials,
    }
    return Object.assign(this, ...features)
  }

  async callGitHubAPI({ method, path, data }) {
    const response = await fetch(this.baseUri + path, {
      method,
      headers: this.headers,
      body: data !== null ? JSON.stringify(data) : null,
    })

    if (!response.ok) {
      throw new HttpException({
        message: `HttpException[${method}]`,
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      })
    }

    response.data = await response.json()
    return response
  }

  getData({ path }) {
    return this.callGitHubAPI({
      method: `GET`,
      path,
      data: null,
    })
  }

  deleteData({ path }) {
    return this.callGitHubAPI({
      method: `DELETE`,
      path,
      data: null,
    })
  }

  postData({ path, data }) {
    return this.callGitHubAPI({
      method: `POST`,
      path,
      data,
    })
  }

  putData({ path, data }) {
    return this.callGitHubAPI({
      method: `PUT`,
      path,
      data,
    })
  }
}

module.exports = GithubConnector
