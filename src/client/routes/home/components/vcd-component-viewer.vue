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
  import {
    flow as compose,
    update,
  } from 'lodash'
  import {
    getPartsFromDoc,
    replaceECMAExportWithCJSExport
  } from '../../../lib/vue-parser'

  const { Babel } = global

  const transformCodeToEs5 = compose(
    replaceECMAExportWithCJSExport,
    code => Babel.transform(code, { presets: [ `es2015` ] }).code
  )

  const codeToParts = compose(
    getPartsFromDoc,
    parts => update(parts, `scriptDoc`, transformCodeToEs5)
  )

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
      const promises = elements.map(element => new Promise(res => element.onload = res))
      elements.forEach(element => iframe.contentWindow.document.body.appendChild(element))
      Promise.all(promises).then(resolve)
    }
  })
  /* eslint-enable no-param-reassign */

  export default {
    props: {
      code: {
        type: String,
        default: ``,
      },
    },
    watch: {
      code() {
        const { iframe } = this.$refs
        prepareIframe(iframe).then(() => {
          const message = {
            parts: codeToParts(this.code),
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
