/* eslint-disable import/prefer-default-export */

export function isRequired(param) {
  throw new Error(`Parameter ${param} is required.`)
}
