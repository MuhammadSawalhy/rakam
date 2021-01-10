/**
 * return a vector represents the intersection point of the 2 lines
 * @param {Object} line1 instanceof {a: ___, b: ___, c: ___} representing a line equation: "a*x+b*y+c=0".
 * @param {Object} line2 instanceof {a: ___, b: ___, c: ___} representing a line equation: "a*x+b*y+c=0".
 */
export default function intersection(line1, line2) {
  let y = -(line1.c / line1.a - line2.c / line2.a) / (line1.b / line1.a - line2.b / line2.a);
  return {
    x: (-line1.b * y - line1.c) / line1.a,
    y,
  };
}
