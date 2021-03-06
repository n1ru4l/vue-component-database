<template>
  <div class="vcd-component-viewer">
    <slot name="buttons"/>
    <iframe
      sandbox="allow-same-origin allow-scripts"
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
    <vcd-error-log
      v-if="errors.length"
      :errors="errors"
    />
  </div>
</template>
<script>
  import { transform } from 'babel-standalone'
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
  import vcdErrorLog from './vcd-error-log.vue'

  const transformCodeToEs5 = compose(
    replaceECMAExportWithCJSExport,
    code => transform(code, { presets: [ `es2015` ] }).code
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

  const scriptSources = [
    `https://unpkg.com/vue@2.3.3/dist/vue.js`,
    window.IFRAME_BUNDLE_URL,
  ]
  const createScriptTag = (src) => {
    const scriptTag = document.createElement(`script`)
    scriptTag.setAttribute(`src`, src)
    return scriptTag
  }

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
      const elements = scriptSources.map(createScriptTag)

      if (process.env.NODE_ENV === `production`) {
        const styleTag = document.createElement(`link`)
        styleTag.setAttribute(`rel`, `stylesheet`)
        styleTag.setAttribute(`type`, `text/css`)
        styleTag.setAttribute(`href`, `/iframe.bundle.css`)
        elements.push(styleTag)
      }
      elements.reduce((promise, element) => promise.then(() => new Promise((res) => {
        element.onload = res
        iframe.contentWindow.document.body.appendChild(element)
      })), Promise.resolve()).then(resolve)
    }
  })
  /* eslint-enable no-param-reassign */

  export default {
    components: {
      muCircularProgress,
      vcdErrorLog,
    },
    data: () => ({
      isComponentGenerating: true,
      errors: [],
    }),
    // lifecycle
    created() {
      window.addEventListener(`message`, this.onReceiverMessageFromIframe)
    },
    methods: {
      onReceiverMessageFromIframe(ev) {
        const { data } = ev
        if (data.type === `FINISHED_RENDER` && data.success) {
          this.isComponentGenerating = false
        }
      },
      updateIframe(code) {
        const { iframe } = this.$refs
        this.isComponentGenerating = true
        this.errors = []

        let parts = null
        try {
          parts = codeToParts(code)
        } catch (err) {
          this.errors.push(err)
          this.isComponentGenerating = false
          return
        }

        prepareIframe(iframe).then(() => {
          const message = {
            parts,
            type: `codeUpdate`,
          }
          iframe.contentWindow.postMessage(message, `*`)
        })
      }
    }
  }
</script>
<style scoped>
  .vcd-component-viewer {
    position: relative;
    display: flex;
    flex-grow: 1;
    flex-flow: column;
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
