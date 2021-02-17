import trunc from '../../core/trunc';
import type { TypeVector } from '../../Vector';
import type { Angles } from './index';

type DMSType = { deg: number; min: number; sec: number };

export const angleTypes = {
  RAD: 'rad',
  DEG: 'deg',
  GON: 'gon',
  GRAD: 'gradian',
};


//--------------------------------//
//          conversions           //
//--------------------------------//

/**
 * Calculate gons (gradians) from current angle and SCALE
 */
export function toGrad(this: Angles, n: number): number {
  // https://en.wikipedia.org/wiki/Gradian
  return n / this.__GON_TO_SCALE;
}

/**
 * Calculate angle from gons (gradians) unit
 */
export function fromGrad(this: Angles, n: number): number {
  // https://en.wikipedia.org/wiki/Gradian
  return n * this.__GON_TO_SCALE;
}

/**
 * Calculate angle from gons (gradians) unit
 */
export function fromGon(this: Angles, n: number): number {
  // https://en.wikipedia.org/wiki/Gradian
  return n * this.__GON_TO_SCALE;
}

/**
 * Calculate angle from degree unit
 */
export function fromDeg(this: Angles, n: number): number {
  return n * this.__DEG_TO_SCALE;
}

/**
 * Calculate angle from radian unit
 */
export function fromRad(this: Angles, n: number): number {
  return n * this.__RAD_TO_SCALE;
}

//#endregion

/**
 * Know whether 2 angles are equivalent or not
 */
export function equals(this: Angles, a1: number, a2: number): boolean {
  a1 = a1 % this.__SCALE;
  a2 = a2 % this.__SCALE;
  return a2 >= a1 - this.EPSILON && a1 >= a2 - this.EPSILON;
}

/**
 * returns angle between 0 and SCALE (one round)
 * returns the minimal angle between two vectors or lines
 */
export function minAngle (
  this: Angles,
  p1: TypeVector,
  p2: TypeVector,
  { type = 'vectors' } = {}
): number {
  if (type === 'lines') {
    const a = this.minAngle(p1, p2);
    return Math.min(a, this.__HALF_SCALE - a); // notice that {(a) and (Math.PI - a)} are always positive.
  }
    
  // dot product devided by product if the magnitude
  // dot product = (p1.x*p2.x + p1.y*p2.y)
  // the dot product of 2 vectors = mag(p1) * mag(p2) * cos(the angle between these 2 vectors)
  // let s = (p1.x * p2.x + p1.y * p2.y) / ((p1.x ** 2 + p1.y ** 2) * (p2.x ** 2 + p2.y ** 2)) ** 0.5;
  // there may be a tiny float error, so let make sure it is valid
  // return Math.acos(constrain(Math.abs(s), 0, 1)) * this.__RAD_TO_SCALE;

  return this.distance(
    Math.atan2(p1.y, p1.x) * this.__RAD_TO_SCALE,
    Math.atan2(p2.y, p2.x) * this.__RAD_TO_SCALE
  );
}

/**
 * returns the greater angle (in [0, SCALE))
 * between two vectors (default) or lines
 */
export function maxAngle(
  this: Angles,
  p1: TypeVector,
  p2: TypeVector,
  { type = 'vectors' }: { type?: 'vectors' | 'lines' } = {}
) {
  if (type === 'lines') {
    const a = this.minAngle(p1, p2);
    return Math.max(a, this.__HALF_SCALE - a); // notice that {(a) and (Math.PI - a)} are always positive.
  }

  const a1 = Math.atan2(p1.y, p1.x);
  const a2 = Math.atan2(p2.y, p2.x);
  return this.normalize((a1 > a2 ? a2 - a1 : a1 - a2) * this.__RAD_TO_SCALE);
}

/**
 * returns the angle beteen 2 vectors or lines,
 * when the first turns untill reaching the other one,
 * in counterclockwise (dir = 1), or the other direction (dir = -1).
 */
export function angle (
  this: Angles,
  p1: TypeVector,
  p2: TypeVector,
  { type = 'vectors', dir = 1 }: { type?: 'vectors' | 'lines'; dir?: -1 | 1 } = {}
): number {
  var a1, a2;
  if (type === 'lines') {
    // they are lines
    a1 = this.angle(p1, p2, { type: 'vectors', dir });
    a2 = this.angle(p1, { x: -p2.x, y: -p2.y }, { type: 'vectors', dir });
    // that is a wonderful optimization for getting the angle of rotation
    // when you rotate the 1st line to fit it on the other one, consider
    // the dir of rotation inside options.
    return Math.min(a1, a2);
  }

  // type === 'vectors', or maybe...
  a1 = Math.atan2(p1.y, p1.x);
  a2 = Math.atan2(p2.y, p2.x);
  return this.normalize(dir * (a1 - a2) * this.__RAD_TO_SCALE);
}

/**
 * returns a float number constrined between 0 and SCALE by default
 * or any other ranges you pass
 * @param angle
 * @param roundOffset ratio of the SCALE, the angle is normalized
 * between `SCALE * roundOffset` and `SCALE * (roundOffset + 1)`
 */
export function normalizeInside(this: Angles, angle: number, roundOffset = 0) {
  let r0 = this.__SCALE * roundOffset,
    r1 = r0 + this.__SCALE;
  angle =
    angle > r1
      ? angle - Math.floor((angle - r0) / this.__SCALE) * this.__SCALE
      : angle < r0
      ? angle + Math.floor((r1 - angle) / this.__SCALE) * this.__SCALE
      : angle;
  return angle;
}

/**
 * @param {Number} angle in degrees
 * @param {Number} secAccuracy number of digits after the dicimal point of "sec"
 * @returns {Object} an object with deg (degrees), min (minutes) and sec (seconds) properities
 */
export function degMinSec(this: Angles, angle: number, secAccuracy = 2) {
  if (!isNaN(angle)) {
    let deg = angle,
      min = 0,
      sec = 0;

    if (Math.round(angle) !== angle) {
      deg = trunc(angle); // the same as Math.trunc
      // get the decimal number only 0.1326548
      // then multiply by 60 and trunc
      sec = (angle - deg) * 60; // this is always positive
      min = Math.floor(sec);
      sec = (sec - min) * 60; // this is always positive

      if (secAccuracy >= 0) {
        sec = Math.round(sec * 10 ** secAccuracy) / 10 ** secAccuracy;
      }

      if (sec === 60) {
        min++;
        sec = 0;
      }

      if (min === 60) {
        deg += 1 * Math.sign(deg);
        min = 0;
      }
    }

    return { deg, min, sec };
  }
  throw new Error(
    `can't convert ${angle} into degrees form, please pass a valid number.`
  );
}

/**
 * @param {Object | Number} angle {deg:, min:, sec:,} or angle as float number
 * @returns {String}
 */
export function strDegMinSec(this: Angles, angle: number | DMSType, secAccuracy = 2) {
  angle = typeof angle === 'object' ? angle : this.degMinSec(angle, secAccuracy);

  return (
    (angle.deg ? angle.deg + this.__dmsSymbols.deg + ' ' : '') +
    (angle.min ? angle.min + this.__dmsSymbols.min + ' ' : '') +
    (angle.sec ? angle.sec + this.__dmsSymbols.sec : '')
  );
}

/**
 * @param {Object} degMinSec
 * @returns {Number}
 */
export function fromDegMinSec(this: Angles, degMinSec: DMSType) {
  return (
    ((degMinSec.deg + degMinSec.min / 60 + degMinSec.sec / 3600) / 360) * this.__SCALE
  );
}

export function fromStrDegMinSec(this: Angles, strDegMinSec: string): number {
  let a;

  strDegMinSec.replace(this.__dmsRegex, (_, d, m, s) => {
    d = parseInt(d) || 0;
    m = parseInt(m) || 0;
    s = parseFloat(s) || 0;
    a = d + m / 60 + s / 3600;
    return '';
  });

  if (a === undefined)
    throw new Error(
      `the angle is not represented in degrees, minute and seconds format.`
    );

  return (a / 360) * this.__SCALE; // convert to the current scale
}

//#region aliases, shorcuts

export const DMS = degMinSec;

export const strDMS = strDegMinSec;

export const fromDMS = fromDegMinSec;

export const fromStrDMS = fromStrDegMinSec;
