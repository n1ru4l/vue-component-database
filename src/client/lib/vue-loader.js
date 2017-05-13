/* eslint-disable import/prefer-default-export */
import { isRequired } from './util'

export function parseModule(
  scripDoc = isRequired(`scriptDoc`)
) {
  const module = { exports: {} }
  // eslint-disable-next-line no-new-func
  Function(`exports`, `require`, `module`, scripDoc).call(module.exports, module.exports, m => window[m], module)
  return module
}

export function createFunctionFromCode(code = isRequired(`code`)) {
  // eslint-disable-next-line no-eval
  return eval(`(${code})`)
}

export function createVueComponentOptions({
  scriptDoc = isRequired(`script`),
  renderOptions = null
} = {}) {
  const { exports } = parseModule(scriptDoc)
  // eslint-disable-next-line no-eval
  if (renderOptions) {
    exports.render = createFunctionFromCode(renderOptions.render)
    exports.staticRenderFns = (renderOptions.staticRenderFns || []).map(createFunctionFromCode)
  }
  return exports
}
