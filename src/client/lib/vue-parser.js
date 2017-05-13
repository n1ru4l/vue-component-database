import { isRequired } from './util'
import { compile } from 'vue-template-compiler'
import transpile from 'vue-template-es2015-compiler'
import postcss from 'postcss'
import scopeIdPlugin from './postcss-scope-id-plugin'

const REGEX_PARSE_TEMPLATE = /<template>([\S\s]*)<\/template>/
const REGEX_PARSE_SCRIPT = /<script>([\S\s]*)<\/script>/
const REGEX_PARSE_STYLE = /<style>([\S\s]*)<\/style>/
const REGEX_PARSE_SCOPED_STYLES = /<style scoped>([\S\s]*)<\/style>/
const REGEX_REPLACE_ES_EXPORT_WITH_CJS_EXPORT = /(export[\n| *]*default[\n ]*{)/

export function getPartsFromDoc(
  doc = isRequired(`doc`)
) {
  const templateResult = doc.match(REGEX_PARSE_TEMPLATE)
  const scriptResult = doc.match(REGEX_PARSE_SCRIPT)
  const styleResult = doc.match(REGEX_PARSE_STYLE)
  const scopedStyleResult = doc.match(REGEX_PARSE_SCOPED_STYLES)
  return {
    templateDoc: templateResult ? (templateResult[1] || ``).trim() : null,
    scriptDoc: scriptResult ? (scriptResult[1] || ``).trim() : null,
    styleDoc: styleResult ? (styleResult[1] || ``).trim() : null,
    scopedStyleDoc: scopedStyleResult ? (scopedStyleResult[1] || ``).trim() : null,
  }
}

export function createRenderFunction(code = isRequired(`code`)) {
  return transpile(`function render(){${code}}`)
}

export function compileRenderFunctionsFromTemplateDoc(
  templateDoc = isRequired(`templateDoc`),
  {
    attr = null,
  } = {}
) {
  const result = compile(templateDoc, {
    modules: [
      ...(attr ? [
        {
          preTransformNode: el => el && el.attrsList && el.attrsList.push({ name: attr, value: `` }),
        }
      ] : [])
    ]
  })
  return {
    render: createRenderFunction(result.render),
    staticRenderFns: result.staticRenderFns.map(createRenderFunction)
  }
}

export function scopeStyleDoc(
  styleDoc = isRequired(`styleDoc`),
  attribute = isRequired(`attribute`)
) {
  return postcss([ scopeIdPlugin({ id: attribute }) ]).process(styleDoc).css
}

export function replaceECMAExportWithCJSExport(
  scriptDoc = isRequired(`scriptDoc`)
) {
  return scriptDoc.replace(REGEX_REPLACE_ES_EXPORT_WITH_CJS_EXPORT, `module.exports = {`)
}
