import { stripIndent } from 'common-tags'
import toAst from 'to-ast'

import {
  parseModule,
  createVueComponentOptions,
} from './vue-loader'

describe(`parseModule`, () => {
  it(`exists`, () => {
    expect(parseModule).toBeDefined()
  })
  it(`is a function`, () => {
    expect(parseModule).toBeInstanceOf(Function)
  })
  it(`requires a scriptDoc parameter`, () => {
    expect(() => {
      parseModule()
    }).toThrow()
  })
  it(`parses a simple module`, () => {
    // language=JavaScript
    const scriptDoc = stripIndent`
      module.exports = {
        data: function data() {
          return {
            foo: 'bars',
          }
        }
      }
    `
    const expected = {
      exports: {
        data: function data() { // eslint-disable-line object-shorthand
          return {
            foo: 'bars', // eslint-disable-line quotes
          }
        },
      },
    }
    const result = parseModule(scriptDoc)
    expect(toAst(result)).toEqual(toAst(expected))
  })
  it(`can load modules with require`, () => {
    window.SumGlobalModule = `TRALALALA`
    // language=JavaScript
    const scriptDoc = stripIndent`
      const leModule = require('SumGlobalModule')
      module.exports = {
        leModule: leModule,
      }
    `
    const module = parseModule(scriptDoc)
    const expected = window.SumGlobalModule
    expect(module.exports.leModule).toEqual(expected)
  })
})

describe(`createVueComponentOptions`, () => {
  it(`exists`, () => {
    expect(createVueComponentOptions).toBeDefined()
  })
  it(`is a function`, () => {
    expect(createVueComponentOptions).toBeInstanceOf(Function)
  })
  it(`requires a script parameter`, () => {
    expect(() => {
      createVueComponentOptions()
    }).toThrowError(`script`)
  })
  it(`converts scriptDoc to component options`, () => {
    // language=JavaScript
    const scriptDoc = stripIndent`
      module.exports = {
        data: function data() {
          return {
            foo: 'bars'
          }
        }
      }
    `
    const expected = {
      data: function data() { // eslint-disable-line object-shorthand
        return {
          foo: 'bars', // eslint-disable-line quotes
        }
      },
    }
    const componentOptions = createVueComponentOptions({ scriptDoc })
    expect(toAst(componentOptions)).toEqual(toAst(expected))
  })
  it(`considers renderOptions`, () => {
    // language=JavaScript
    const scriptDoc = stripIndent`
      module.exports = {
        data: function data() {
          return {
            foo: 'bars'
          }
        }
      }
    `
    // language=JavaScript
    const renderOptions = {
      render: `function render (h) { return h('div') }`
    }
    const { render } = createVueComponentOptions({ scriptDoc, renderOptions })
    expect(render).toBeInstanceOf(Function)
  })
  it(`ignores renderFunctionDoc if there is a render function in the scriptDoc`, () => {
    // language=JavaScript
    const scriptDoc = stripIndent`
      module.exports = {
        data: function data() {
          return {
            foo: 'bars'
          }
        },
        render: function scurr(h) {
          return h('div')
        }
      }
    `
    // language=JavaScript
    const renderFunctionDoc = stripIndent`
      function render(h) { return h('span') }
    `
    const { render } = createVueComponentOptions({ scriptDoc, renderFunctionDoc })
    const ast = toAst(render)
    expect(ast.id.name).toEqual(`scurr`)
  })
})
