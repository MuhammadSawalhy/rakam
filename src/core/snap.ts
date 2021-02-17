/**
 * "m" is the magnet arracting "v" if it is in a field of value "f"
 * @param v the value
 * @param m the magnet
 * @param f the mgnetic field
 */
export default function snap(v: number, m: number, f: number) {
  let e = Math.abs(v - m);
  return e <= f ? m : v;
}
