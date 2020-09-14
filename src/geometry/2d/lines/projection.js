import equation from './equation';
import intersection from "./intersection";

/**
 * return the projection of a point on a given line which is 
 * the lineIntersection of the line which equation instanceof
 * a*x + b*x + c and the perpendiuclar line crossing through v
 * @param {vector} v instanceof any obj{x,y} or vector.
 * @param {Object} line instanceof {a: ___, b: ___, c: ___} representing a line equation: "a*x+b*y+c=0".
 */
export default function proj(v, line) {
  if (v && line) {
    return intersection(line, equation(line.angle + Math.PI / 2, v));
  } else throw "invalid arguments";
}