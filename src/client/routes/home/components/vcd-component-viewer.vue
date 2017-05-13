<template>
  <div class="vcd-component-viewer">
    <slot name="buttons"/>
    <iframe
      class="vcd-component-viewer__iframe"
      src="about:blank"
      ref="iframe"
    />
    <transition name="fade">
      <div
        v-if="isComponentGenerating"
        class="vcd-component-viewer__overlay"
      >
        <mu-circular-progress
          :size="60"
          :strokeWidth="5"
        />
      </div>
    </transition>
  </div>
</template>
<script>
  import {
    flow as compose,
    update,
    uniqueId,
  } from 'lodash'
  import {
    getPartsFromDoc,
    replaceECMAExportWithCJSExport,
    compileRenderFunctionsFromTemplateDoc,
    scopeStyleDoc,
  } from 'lib/vue-parser'
  import muCircularProgress from 'muse-ui/src/circularProgress/circularProgress.vue'

  const { Babel } = global
//  const Babel = require(`babel-standalone`)

  const transformCodeToEs5 = compose(
    replaceECMAExportWithCJSExport,
    code => Babel.transform(code, { presets: [ `es2015` ] }).code
  )

  const codeToParts = (doc, scopeAttr = uniqueId(`data-v-`)) => compose(
    getPartsFromDoc,
    parts => update(parts, `scriptDoc`, transformCodeToEs5),
    (parts) => {
      if (parts.templateDoc) {
        // eslint-disable-next-line no-param-reassign
        parts.renderOptions = compileRenderFunctionsFromTemplateDoc(parts.templateDoc, {
          attr: scopeAttr
        })
      }
      return parts
    },
    parts => update(parts, `scopedStyleDoc`, styleDoc => styleDoc && scopeStyleDoc(styleDoc, scopeAttr))
  )(doc)

  const BUNDLE_URL = (process.env.NODE_ENV === `production`)
    ? `/assets/iframe.bundle.js`
    : `http://localhost:${process.env.WEBPACK_DEV_PORT}/build/iframe.bundle.js`

  /* eslint-disable no-param-reassign */
  const prepareIframe = iframe => new Promise((resolve) => {
    iframe.src = `about:blank`
    iframe.onload = () => {
      iframe.contentWindow.document.documentElement.innerHTML = `
        <head></head>
        <body>
          <main id="main"></main>
        </body>
      `
      const elements = []
      const scriptTag = document.createElement(`script`)
      scriptTag.setAttribute(`src`, BUNDLE_URL)
      elements.push(scriptTag)

      if (process.env.NODE_ENV === `production`) {
        const styleTag = document.createElement(`link`)
        styleTag.setAttribute(`rel`, `stylesheet`)
        styleTag.setAttribute(`type`, `text/css`)
        styleTag.setAttribute(`href`, `/assets/iframe.bundle.css`)
        elements.push(styleTag)
      }
      // eslint-disable-next-line no-return-assign
      const promises = elements.map(element => new Promise(res => element.onload = res))
      elements.forEach(element => iframe.contentWindow.document.body.appendChild(element))
      Promise.all(promises).then(resolve)
    }
  })
  /* eslint-enable no-param-reassign */

  export default {
    components: {
      muCircularProgress
    },
    props: {
      code: {
        type: String,
        default: ``,
      },
    },
    data: () => ({
      isComponentGenerating: true,
    }),
    // lifecycle
    created() {
      window.addEventListener(`message`, this.onReceiverMessageFromIframe)
    },

    watch: {
      code() {
        const { iframe } = this.$refs
        this.isComponentGenerating = true
        prepareIframe(iframe).then(() => {
          const message = {
            parts: codeToParts(this.code),
            type: `codeUpdate`,
          }
          iframe.contentWindow.postMessage(message, `*`)
        })
      },
    },
    methods: {
      onReceiverMessageFromIframe(ev) {
        const { data } = ev
        if (data.type === `FINISHED_RENDER` && data.success) {
          this.isComponentGenerating = false
        }
      },
    }
  }
</script>
<style scoped>
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

  .vcd-component-viewer__overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0, .1);

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .3s
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0
  }
</style>
