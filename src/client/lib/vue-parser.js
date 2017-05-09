import { isRequired } from './util'

const REGEX_PARSE_TEMPLATE = /<template>([\S\s]*)<\/template>/
const REGEX_PARSE_SCRIPT = /<script>([\S\s]*)<\/script>/
const REGEX_PARSE_STYLE = /<style>([\S\s]*)<\/style>/
const REGEX_REPLACE_ES_EXPORT_WITH_CJS_EXPORT = /(export[\n| *]*default[\n ]*{)/

export function getPartsFromDoc(
  doc = isRequired(`doc`)
) {
  const templateResult = doc.match(REGEX_PARSE_TEMPLATE)
  const scriptResult = doc.match(REGEX_PARSE_SCRIPT)
  const styleResult = doc.match(REGEX_PARSE_STYLE)
  return {
    templateDoc: templateResult ? (templateResult[1] || ``).trim() : null,
    scriptDoc: scriptResult ? (scriptResult[1] || ``).trim() : null,
    styleDoc: styleResult ? (styleResult[1] || ``).trim() : null,
  }
}

export function replaceECMAExportWithCJSExport(
  scriptDoc = isRequired(`scriptDoc`)
) {
  return scriptDoc.replace(REGEX_REPLACE_ES_EXPORT_WITH_CJS_EXPORT, `module.exports = {`)
}
