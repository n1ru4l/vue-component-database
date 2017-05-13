/* eslint-disable no-param-reassign,no-shadow */
import postcss from 'postcss'
import selectorParser from 'postcss-selector-parser'

/**
 * @source https://github.com/vuejs/vue-loader/blob/2f299fc8ed323fd036a65dc2c0d2bf117447a4f9/lib/style-compiler/plugins/scope-id.js
 */
export default postcss.plugin(`add-id`, opts => (root) => {
  root.each(function rewriteSelector(node) {
    if (!node.selector) {
        // handle media queries
      if (node.type === `atrule` && node.name === `media`) {
        node.each(rewriteSelector)
      }
      return
    }
    node.selector = selectorParser((selectors) => {
      selectors.each((selector) => {
        let node = null
        selector.each((n) => {
          if (n.type !== `pseudo`) node = n
        })
        selector.insertAfter(node, selectorParser.attribute({
          attribute: opts.id
        }))
      })
    }).process(node.selector).result
  })
})
