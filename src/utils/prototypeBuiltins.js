/* eslint-disable no-prototype-builtins */

/**
 * Using obj.hasOwnproperty directly is a security threat (vulnerability)
 */
export function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty(obj, prop);
}