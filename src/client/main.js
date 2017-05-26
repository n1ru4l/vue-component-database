import Vue from 'vue'
import router from './router'
import 'muse-ui/src/styles/base.less'
import apolloProvider from './apollo-provider'

import vcdMainComponent from './components/vcd-main-component.vue'

const RootComponent = Vue.extend(vcdMainComponent)

// eslint-disable-next-line no-new
new RootComponent({
  el: `#main`,
  router,
  apolloProvider,
})

if (`serviceWorker` in navigator) {
  navigator.serviceWorker.register(`/service-worker.js`)
}
