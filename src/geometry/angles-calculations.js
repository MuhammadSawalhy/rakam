
import {constrain} from "../core/index.js";
import {deg} from './angles-conversions.js';
import vector from '../vector.js'

/**
 * returns angle between 0 and 2*PI (one round)
 * returns the smaller angle between two vectors or lines
 * @param {vector} p1 instanceof vector or {x: ___, y: ___},
 * @param {vector} p2 instanceof vector or {x: ___, y: ___};
 * @param {object} options instanceof '{}' that defines 'type'.
 */
export function minAngle(p1, p2, {type}) {
  type = type || "vectors";
  if (type === "vectors") {
    let s = p1.dot(p2) / (p1.mag * p2.mag);
    let a = Math.acos(constrain(s, -1, 1));

    return this.constrainAngle(a);
  } else if (type === "lines") {
    let a = this.minAngle(p1, p2);
    return Math.min(a, Math.PI - a); // notice that {(a) and (Math.PI - a)} are always positive.
  }
}

/**
 * returns angle between 0 and 2*PI (one round)
 * returns the bigger angle between two vectors or lines
 * @param {vector} p1 instanceof vector or {x: ___, y: ___},
 * @param {vector} p2 instanceof vector or {x: ___, y: ___};
 * @param {object} options instanceof '{}' that defines 'type'.
 */
export function maxAngle(p1, p2, {type}) {
  type = type || "vectors";
  if (type === "vectors") {
    let min = this.minAngle(p1, p2);
    return Math.max(2 * Math.PI - min, min);
  } else if (type === "lines") {
    let a = this.minAngle(p1, p2);
    return Math.max(a, Math.PI - a); // notice that {(a) and (Math.PI - a)} are always positive.
  }
}

/**
 * returns angle between 0 and 2*PI (one round)
 * returns the spwan angle beteen 2 vectors or lines
 * when the first turns untill reaching the other one
 * in counterclockwise or the other direction
 * @param {vector} p1 instanceof vector or {x: ___, y: ___},
 * @param {vector} p2 instanceof vector or {x: ___, y: ___};
 * @param {object} options instanceof '{}' that defines 'type', 'dir'.
 */
export function angle(p1, p2, {type, dir}) {
  type = type || "vectors";
  dir = dir || "counterclockwise";

  if (type === "vectors") {
    var a1 = this.minAngle(p1, {x: 1, y: 0});
    a1 = p1.y >= 0 ? a1 : -a1;
    var a2 = this.minAngle(p2, {x: 1, y: 0});
    a2 = p2.y >= 0 ? a2 : -a2;
    let a = dir === "counterclockwise" || dir === "+" ? a2 - a1 : a1 - a2;

    return this.constrainAngle(a);
  } else if (type === "lines") {
    let a1 = this.angle(p1, p2, { type: "vectors", dir });
    let a2 = this.angle(p1, p2.mult(-1), { type: "vectors", dir });
    return Math.min(a1, a2); // that is a wonderful optimization for getting the angle of rotation when you rotate the 1st line to fit it on the other one, consider the dir of rotation inside options.
  }
}

/**
 * the returned angle instanceof constrined between 0 and 2*Math.PI
 * @param {number} angle,
 * @param {number} type, if 0 the your angle will be inside [-pi, pi]
 *                     - else if 1 your angle will be inside [0, 2pi]
 */
export function constrainAngle(angle, type = 0) {
  if (type === 1) {
    let sin_ = Math.sin(angle);
    let cos_ = Math.cos(angle);
    let a = Math.asin(Math.abs(sin_)); // the same as Math.abs(Math.asin(sin_));
    return sin_ >= 0
      ? cos_ >= 0
        ? a // first quarter, sin + , cos +
        : Math.PI - a // second quarter, sin + , cos -
      : cos_ >= 0
      ? 2 * Math.PI - a // second quarter, sin - , cos +
      : Math.PI + a; // second quarter, sin - , cos -
  } else if (type === 0) {
    // default
    let sin_ = Math.sin(angle);
    let cos_ = Math.cos(angle);
    let a = Math.asin(Math.abs(sin_)); // the same as Math.abs(Math.asin(sin_));
    return sin_ >= 0
      ? cos_ >= 0
        ? a // first quarter, sin + , cos +
        : Math.PI - a // second quarter, sin + , cos -
      : cos_ >= 0
      ? -a // fourth quarter, sin - , cos +
      : -Math.PI + a; // third quarter, sin - , cos -
  }
}

export function snapAngle(a, valuesTOsnapTO) {
  let margin = deg(2.5); /// 2.5deg
  /// sanp to 30 or 210 deg, and so on.
  if (!valuesTOsnapTO) {
    let snapTo = [Math.PI / 6, Math.PI / 4, Math.PI / 3, Math.PI / 2]; /// four special angles
    for (let i = 0; i < 4; i++) {
      snapTo.push(Math.PI - snapTo[i]);
      snapTo.push(Math.PI + snapTo[i]);
      snapTo.push(2 * Math.PI - snapTo[i]);
    }
    snapTo.push(0);
    snapTo.push(Math.PI);
    valuesTOsnapTO = snapTo;
  }
  for (let s of valuesTOsnapTO) {
    let a1 = minAngle(vector.fromAngle(a), vector.fromAngle(s)); // angles between two vectors not lines.
    if (a1 <= margin) {
      return s;
    }
  }
  return a;
}

