import Vue from 'vue'
import 'muse-ui/src/styles/base.less'

import focusInputDirective from './directives/focus-input'

import router from './router'
import apolloProvider from './apollo-provider'

import vcdMainComponent from './components/vcd-main-component.vue'

Vue.directive(`focus-input`, focusInputDirective)

const RootComponent = Vue.extend(vcdMainComponent)

// eslint-disable-next-line no-new
new RootComponent({
  el: `#main`,
  router,
  apolloProvider,
})
