import Vue from 'vue'
import VueRouter from 'vue-router'
import Authenticator from './services/authenticator'

import Main from './routes/home'

Vue.use(VueRouter)

const routes = [
  {
    path: `/`,
    component: Main,
  },
  {
    path: `/:id`,
    component: Main,
  },
]

const router = new VueRouter({
  mode: `history`,
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.path === `/login-success` && to.query.access_token) {
    Authenticator.setToken(to.query.access_token)
    next(`/`)
    return
  }
  next()
})

export default router
