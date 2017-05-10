import Vue from 'vue'

import vcdIframeContainer from './components/vcd-iframe-container.vue'

const App = Vue.extend(vcdIframeContainer)

// eslint-disable-next-line no-new
new App({
  el: `#main`,
})
