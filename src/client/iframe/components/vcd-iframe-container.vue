<template>
    <vcd-component-proxy
      :options="componentOptions"
      :properties="componentProperties"
    />
</template>
<script>
  import vcdComponentProxy from './vcd-component-proxy.vue'
  import { createVueComponentOptions } from '../../lib/vue-loader'

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
        const componentOptions = createVueComponentOptions(event.data.parts)
        this.componentOptions = componentOptions
        this.componentProperties = {} // @TODO: Implement component properties
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
