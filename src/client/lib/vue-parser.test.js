import { stripIndent } from 'common-tags'
import {
  getPartsFromDoc,
  replaceECMAExportWithCJSExport,
  compileRenderFunctionsFromTemplateDoc,
  scopeStyleDoc,
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
      scopedStyleDoc: null,
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
      scopedStyleDoc: null,
    }
    const result = getPartsFromDoc(doc)
    expect(result).toEqual(expected)
  })
  it(`can parse scoped styles`, () => {
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
      <style scoped>
        ${styleContents}
      </style>
    `
    const expected = {
      templateDoc: templateContents,
      scriptDoc: scriptContents,
      styleDoc: null,
      scopedStyleDoc: styleContents,
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
  it(`considers line breaks between 'export' 'default' and '{'`, () => {
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

describe(`compileRenderFunctionsFromTemplateDoc`, () => {
  it(`exists`, () => {
    expect(compileRenderFunctionsFromTemplateDoc).toBeDefined()
  })
  it(`is a function`, () => {
    expect(compileRenderFunctionsFromTemplateDoc).toBeInstanceOf(Function)
  })
  it(`throws with missing templateDoc parameter`, () => {
    expect(() => {
      compileRenderFunctionsFromTemplateDoc()
    }).toThrow(`templateDoc`)
  })
  it(`returns a renderOptions object`, () => {
    const templateDoc = `<h1>Hello World</h1>`
    const result = compileRenderFunctionsFromTemplateDoc(templateDoc)
    expect(result).toMatchSnapshot()
  })
  it(`adds a attribute to a render function`, () => {
    const templateDoc = `<h1>Hello World</h1>`
    // language=JavaScript
    const result = compileRenderFunctionsFromTemplateDoc(templateDoc, { attr: `data-v-scoped` })
    expect(result).toMatchSnapshot()
  })
})
describe(`scopeStyleDoc`, () => {
  it(`exists`, () => {
    expect(scopeStyleDoc).toBeDefined()
  })
  it(`is a function`, () => {
    expect(scopeStyleDoc).toBeInstanceOf(Function)
  })
  it(`requires a styleDoc parameter`, () => {
    expect(() => {
      scopeStyleDoc()
    }).toThrow(`styleDoc`)
  })
  it(`requires a attribute parameter`, () => {
    const styleDoc = `.foo { color: red; }`
    expect(() => {
      scopeStyleDoc(styleDoc)
    }).toThrow(`attribute`)
  })
  it(`scopes a style doc`, () => {
    const styleDoc = `.foo { color: red; }`
    const attribute = `data-lel-wut`
    const expected = `.foo[data-lel-wut] { color: red; }`
    const result = scopeStyleDoc(styleDoc, attribute)
    expect(result).toEqual(expected)
  })
})
