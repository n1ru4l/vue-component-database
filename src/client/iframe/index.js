import Vue from 'vue'

import vcdIframeContainer from './components/vcd-iframe-container.vue'

const App = Vue.extend(vcdIframeContainer)
// throw new Error(`amk`)

// eslint-disable-next-line no-new
new App({
  el: `#main`,
})
