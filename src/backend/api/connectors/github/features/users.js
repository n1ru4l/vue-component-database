'use strict'

async function fetchCurrentUser() {
  if (!this.accessToken) return null
  const { data } = await this.getData({
    path: `/user`,
  })
  return data
}

module.exports = {
  fetchCurrentUser,
}
