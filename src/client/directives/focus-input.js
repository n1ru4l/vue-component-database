const VALID_SELECTORS = [ `textarea`, `input` ]

export default {
  componentUpdated(el, binding) {
    if (!binding.value) return
    if (VALID_SELECTORS.some(selector => el.matches(selector))) {
      el.focus()
      return
    }
    const child = el.querySelector(VALID_SELECTORS.join(`, `))
    if (child) child.focus()
  }
}
