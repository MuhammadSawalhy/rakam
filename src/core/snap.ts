/**
 * "m" is the magnet arracting "v" if it is in a field of value "f"
 * @param {number} v the value
 * @param {number} m the magnet
 * @param {number} f the mgnetic field
 */
export default function snap(v, m, f) {
  let e = Math.abs(v - m);
  return e <= f ? m : v;
}
