const REGEX_GET_AUTH_TOKEN = /AUTH_TOKEN=([A-Za-z0-9]+)/

const getTokenFromCookie = (cookie) => {
  const result = cookie.match(REGEX_GET_AUTH_TOKEN)
  if (!result) return null
  return result[1]
}
const setTokenToDocument = (token) => {
  // eslint-disable-next-line no-param-reassign
  if (!token) token = ``
  document.cookie = `AUTH_TOKEN=${token}`
}

let accessToken = getTokenFromCookie(document.cookie)

export default {
  getToken: () => accessToken,
  setToken: (newToken, persist = true) => {
    if (persist) {
      setTokenToDocument(newToken)
    }
    accessToken = newToken
  },
}
