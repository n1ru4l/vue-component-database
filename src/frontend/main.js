import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'

import apolloProvider from './apollo-provider'
import Main from './routes/home';

Vue.use(VueMaterial)
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Main,
  },
  {
    path: '/:id',
    component: Main,
  }
]

const router = new VueRouter({
  mode: `history`,
  routes,
})

const app = new Vue({
  router,
  apolloProvider,
}).$mount(`#main`)

// const component = httpVueLoader(`//components/Test.vue`)
