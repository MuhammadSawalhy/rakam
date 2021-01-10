/**
 * return {a: ___, b: ___, c: ___} in "a*x+b*y+c=0"
 * @param {Number} slopeAngle slope angle
 * @param {vector} trans instanceof any obj{x,y} or vector that the line crossing through.
 */
export default function equation(slopeAngle, trans) {
  return {
    a: Math.sin(slopeAngle),
    b: -Math.cos(slopeAngle),
    c: -Math.sin(slopeAngle) * trans.x + Math.cos(slopeAngle) * trans.y,
    slopeAngle,
  };
}
