/**
 * Using obj.hasOwnproperty directly is a security threat (vulnerability)
 */

export default function hasOwnproperty(obj, prop) {
  return Object.prototype.hasOwnproperty(obj, prop);
}