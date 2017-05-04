'use strict'

const fetch = require(`isomorphic-fetch`)
const FormData = require(`form-data`)
const querystring = require('querystring')

async function requestGithubToken(code) {
  const data = new FormData
  data.append(`client_id`, process.env.GITHUB_CLIENT_ID)
  data.append(`client_secret`, process.env.GITHUB_CLIENT_SECRET)
  data.append('code', code)

  const response = await fetch(`https://github.com/login/oauth/access_token`, {
    method: `POST`,
    body: data,
  })

  const { access_token } = querystring.parse(await response.text())
  return access_token
}

module.exports = requestGithubToken
