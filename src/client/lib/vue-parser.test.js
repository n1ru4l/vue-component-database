import { stripIndent } from 'common-tags'
import {
  getPartsFromDoc,
  replaceECMAExportWithCJSExport,
} from './vue-parser'

describe(`getPartsFromDoc`, () => {
  it(`exists`, () => {
    expect(getPartsFromDoc).toBeDefined()
  })
  it(`is a function`, () => {
    expect(getPartsFromDoc).toBeInstanceOf(Function)
  })
  it(`throws without document paramater`, () => {
    expect(() => {
      getPartsFromDoc()
    }).toThrow()
  })
  it(`returns a correct object`, () => {
    const templateContents = stripIndent`
      <div class="burr">Hallo Welt {{test}}</div>
    `
    // language=JavaScript
    const scriptContents = stripIndent`
      modules.exports = {
        data() {
          return {
            test: 31,
          }
        },
      }
    `
    // language=CSS
    const styleContents = stripIndent`
      .burr {
        color: red;
      }
    `
    const doc = stripIndent`
      <template>
        ${templateContents}
      </template>
      <script>
        ${scriptContents}
      </script>
      <style>
        ${styleContents}
      </style>
    `
    const expected = {
      templateDoc: templateContents,
      scriptDoc: scriptContents,
      styleDoc: styleContents,
    }

    const result = getPartsFromDoc(doc)
    expect(result).toEqual(expected)
  })
  it(`returns 'null' if there is no template and no style`, () => {
    // language=JavaScript
    const scriptContents = stripIndent`
      module.exports = {
        render(createElement) {
          return createElement('h1')
        }
      }
    `
    const doc = stripIndent`
      <script>
        ${scriptContents}
      </script>
    `
    const expected = {
      templateDoc: null,
      scriptDoc: scriptContents,
      styleDoc: null,
    }
    const result = getPartsFromDoc(doc)
    expect(result).toEqual(expected)
  })
})

describe(`replaceECMAExportWithCJSExport`, () => {
  it(`exists`, () => {
    expect(replaceECMAExportWithCJSExport).toBeDefined()
  })
  it(`is a function`, () => {
    expect(replaceECMAExportWithCJSExport).toBeInstanceOf(Function)
  })
  it(`throws without scriptDoc parameter`, () => {
    expect(() => {
      replaceECMAExportWithCJSExport()
    }).toThrow()
  })
  it(`replaces 'export default' with 'module.exports ='`, () => {
    // language=JavaScript
    const scriptDoc = stripIndent`
      export default {
        data() {
          return {
            foo: 'bar',
          }
        },
      }
    `
    // language=JavaScript
    const expected = stripIndent`
      module.exports = {
        data() {
          return {
            foo: 'bar',
          }
        },
      }
    `
    const result = replaceECMAExportWithCJSExport(scriptDoc)
    expect(result).toEqual(expected)
  })
  it(`considers missing spaces between 'default' and '{'`, () => {
    // language=JavaScript
    const scriptDoc = stripIndent`
      export default{
        data() {
          return {
            foo: 'bar',
          }
        },
      }
    `
    // language=JavaScript
    const expected = stripIndent`
      module.exports = {
        data() {
          return {
            foo: 'bar',
          }
        },
      }
    `
    const result = replaceECMAExportWithCJSExport(scriptDoc)
    expect(result).toEqual(expected)
  })
  it(`considers linebreaks between 'export' 'default' and '{'`, () => {
    // language=JavaScript
    const scriptDoc = stripIndent`
      export
      default
      {
        data() {
          return {
            foo: 'bar',
          }
        },
      }
    `
    // language=JavaScript
    const expected = stripIndent`
      module.exports = {
        data() {
          return {
            foo: 'bar',
          }
        },
      }
    `
    const result = replaceECMAExportWithCJSExport(scriptDoc)
    expect(result).toEqual(expected)
  })
})
