/**
 * Do not access Object.prototype method 'hasOwnProperty' from target object.
 * https://eslint.org/docs/rules/no-prototype-builtins
 */

export function hasOwnProperty(obj: any, prop: string) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
