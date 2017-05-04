import Vue from 'vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'

import router from './router'
import apolloProvider from './apollo-provider'

Vue.use(VueMaterial)

new Vue({
  router,
  apolloProvider,
}).$mount(`#main`)

// const component = httpVueLoader(`//components/Test.vue`)
