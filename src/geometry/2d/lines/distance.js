/**
 * returns the distance between a point and a line.
 * @param {vector} v instanceof vector or {xL number, y: number}
 * @param {Object} line instanceof {a: ___, b: ___, c: ___} representing a line equation: "a*x+b*y+c=0".
 */
export default function distance(v, line) {
  if (v) {
    return Math.abs(line.a * v.x + line.b * v.y + line.c) / Math.sqrt(line.a ** 2 + line.b ** 2);
  }
}