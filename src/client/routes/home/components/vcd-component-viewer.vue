<template>
  <div class="vcd-component-viewer">
    <slot name="buttons"/>
    <iframe
      class="vcd-component-viewer__iframe"
      src="about:blank"
      ref="iframe"
    />
  </div>
</template>
<script>
  import vcdComponentProxy from '../../../iframe/components/vcd-component-proxy.vue'

  const BUNDLE_URL = (process.env.NODE_ENV === `production`)
    ? `/assets/iframe.bundle.js`
    : `http://localhost:${process.env.WEBPACK_DEV_PORT}/build/iframe.bundle.js`

  export default {
    components: {
      vcdComponentProxy,
    },
    props: {
      code: {
        type: String,
        default: ``,
      },
    },
    mounted() {
      this.updateIframe()
    },
    methods: {
      updateIframe() {
        return new Promise((resolve) => {
          const { iframe } = this.$refs
          iframe.src = `about:blank`
          iframe.onload = () => {
            iframe.contentWindow.document.documentElement.innerHTML = `
              <head></head>
              <body>
                <main id="main"></main>
              </body>
            `
            const element = document.createElement(`script`)
            element.setAttribute(`src`, BUNDLE_URL)
            element.onload = () => {
              resolve()
            }
            iframe.contentWindow.document.body.appendChild(element)
          }
        })
      },
    },
    watch: {
      code() {
        this.updateIframe().then(() => {
          const { iframe } = this.$refs
          const message = {
            code: this.code,
            type: `codeUpdate`,
          }
          iframe.contentWindow.postMessage(message, `*`)
        })
      },
    },
  }
</script>
<style>
  .vcd-component-viewer {
    position: relative;
    display: flex;
    flex-grow: 1;
  }

  .vcd-component-viewer__iframe {
    border: 0;
    width: 100%;
    height: 100%;
  }
</style>
