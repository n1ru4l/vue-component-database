import Vue from 'vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'

import router from './router'
import apolloProvider from './apollo-provider'

import vcdMainComponent from './components/vcd-main-component.vue'

Vue.use(VueMaterial)

const RootComponent = Vue.extend(vcdMainComponent)

new RootComponent({
  router,
  apolloProvider,
}).$mount(`#main`)
