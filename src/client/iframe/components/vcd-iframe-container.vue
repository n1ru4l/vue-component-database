<template>
    <vcd-component-proxy
      :options="componentOptions"
      :properties="componentProperties"
    />
</template>
<script>
  import vcdComponentProxy from './vcd-component-proxy.vue'
  import { createVueComponentOptions } from '../../lib/vue-loader'

  const addStyleDocToHead = (styleDoc) => {
    const styleTagEl = document.createElement(`style`)
    styleTagEl.innerHTML = styleDoc
    document.head.appendChild(styleTagEl)
  }

  export default {
    components: {
      vcdComponentProxy,
    },
    data: () => ({
      componentOptions: `div`,
      componentProperties: {},
    }),
    methods: {
      handleMessage(event) {
        // @TODO: Security?
        if (event.data.type !== `codeUpdate`) return
        const { parts } = event.data
        if (parts.styleDoc) addStyleDocToHead(parts.styleDoc)
        if (parts.scopedStyleDoc) addStyleDocToHead(parts.scopedStyleDoc)
        const componentOptions = createVueComponentOptions(parts)
        this.componentOptions = componentOptions
        this.componentProperties = {} // @TODO: Implement component properties
        // @TODO: Security
        window.parent.postMessage({ type: `FINISHED_RENDER`, success: true }, `*`)
      },
    },
    mounted() {
      window.addEventListener(`message`, this.handleMessage)
    },
    destroyed() {
      window.removeEventListener(`message`, this.handleMessage)
    },
  }
</script>
<style>
  html,
  body {
    padding: 0;
    margin: 0;
  }
  * {
    box-sizing: border-box;
  }
  body {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
