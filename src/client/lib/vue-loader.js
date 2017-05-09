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

export function createVueComponentOptions({
  scriptDoc = isRequired(`script`),
  templateDoc = null
} = {}) {
  const { exports } = parseModule(scriptDoc)
  if (templateDoc) exports.template = templateDoc
  return exports
}
