let accessToken = localStorage.getItem(`accessToken`) || null

export default {
  getToken: () => accessToken,
  setToken: (newToken, persist = true) => {
    if (persist) {
      localStorage.setItem(`accessToken`, newToken)
    }
    accessToken = newToken
  },
}
