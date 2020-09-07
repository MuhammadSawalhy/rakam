import { constrain } from "../core/index.js";

/**
 * returns angle between 0 and SCALE (one round)
 * returns the smaller angle between two vectors or lines
 * @param {vector} p1 instanceof vector or {x: ___, y: ___},
 * @param {vector} p2 instanceof vector or {x: ___, y: ___};
 * @param {object} options instanceof "Object" that defines "type" which is "verctors" or "lines"
 */
export function minAngle(p1, p2, { type="vectors" }) {
  if (type === "vectors") {
    // dot product devided by product if the magnitude
    // dot product = (p1.x*p2.x + p1.y*p2.y)
    // the dot product of 2 vectors = mag(p1) * mag(p2) * cos(the angle between these 2 vectors)
    let s = (p1.x*p2.x + p1.y*p2.y) / ((p1.x**2+p1.y**2) * (p2.x**2+p2.y**2))**0.5;
    let a = Math.acos(constrain(s, -1, 1)); // there may be a tiny float error, so let make sure it is valid
    return this.claspAngle(a);
  } else if (type === "lines") {
    let a = this.minAngle(p1, p2);
    return Math.min(a, Math.PI - a); // notice that {(a) and (Math.PI - a)} are always positive.
  }
}

/**
 * returns angle between 0 and SCALE (one round)
 * returns the bigger angle between two vectors or lines
 * @param {vector} p1 instanceof vector or {x: ___, y: ___},
 * @param {vector} p2 instanceof vector or {x: ___, y: ___};
 * @param {object} options instanceof "Object" that defines "type" which is "verctors" or "lines"
 */
export function maxAngle(p1, p2, { type = "vectors" }) {
  if (type === "vectors") {
    let min = this.minAngle(p1, p2);
    return Math.max(2 * Math.PI - min, min);
  } else if (type === "lines") {
    let a = this.minAngle(p1, p2);
    return Math.max(a, Math.PI - a); // notice that {(a) and (Math.PI - a)} are always positive.
  }
}

/**
 * returns angle between 0 and SCALE (one round).
 * returns the spwan angle beteen 2 vectors or lines,
 * when the first turns untill reaching the other one,
 * in counterclockwise (CCW), or the other direction (CW).
 * @param {vector} p1 instanceof vector or {x: ___, y: ___},
 * @param {vector} p2 instanceof vector or {x: ___, y: ___};
 * @param {object} options instanceof '{}' that defines 'type', 'dir'.
 */
export function angle(p1, p2, { type = "vectors", dir = -1 }) {
  if (type === "vectors") {
    var a1 = this.minAngle(p1, { x: 1, y: 0 });
    a1 = p1.y >= 0 ? a1 : -a1;
    var a2 = this.minAngle(p2, { x: 1, y: 0 });
    a2 = p2.y >= 0 ? a2 : -a2;
    let a = dir === -1 || dir === "-" || dir === "CCW" ? a2 - a1 : a1 - a2;

    return this.constrainAngle(a);
  } else if (type === "lines") {
    let a1 = this.angle(p1, p2, { type: "vectors", dir });
    let a2 = this.angle(p1, p2.mult(-1), { type: "vectors", dir });
    return Math.min(a1, a2); // that is a wonderful optimization for getting the angle of rotation when you rotate the 1st line to fit it on the other one, consider the dir of rotation inside options.
  }
}

/**
 * returns a float number constrined between 0 and 2*Math.PI by default
 * or any other ranges you pass
 * @param {Number} angle
 * @param {Array<Number>} inTheRound the default is 0, means that the
 * given angle is arrested inside the first round from 0 to SCALE
 */
export function normalizeInside(angle, roundOffset=0) {
  let r0 = this.SCALE*roundOffset,
  r1 = r0 + this.SCALE;
  angle = angle > r1 ?
            angle - Math.floor((angle - r0) / this.SCALE) * this.SCALE:
            angle < r0 ? 
              angle + Math.floor((r1 - angle) / this.SCALE) * this.SCALE:
              angle;
  return angle;
}

/**
 * return an object with degress, seconds and minutes properities
 * @param {Number} angle ::: in degrees as float number
 */
export function degMinSec(angle) {
  if (!isNaN(angle)) {
    let deg, min = 0, sec = 0, num;

    if (Math.round(angle) !== angle) {
      deg = angle < 0 ? Math.ceil(angle) : Math.floor(angle); // the same as Math.trunc
      // get the decimal number only 0.1326548
      // then multiply by 60 and trunc
      num = (angle - deg) * 60;
      min = angle < 0 ? Math.ceil(num) : Math.floor(num);
      num = (num - min) * 60;
      sec = angle < 0 ? Math.ceil(num) : Math.floor(num);

      //#region avoid a tiny error resulting in a slitly different angle
      if (Math.abs(sec - 60) <= 1) {
        min++;
        sec = 0;
      }
      if (min === 60) {
        deg += 1 * Math.sign(deg);
        min[0] = 0;
      }
      //#endregion
    }

    return { deg, min, sec };

  }
  throw new Error(`can't convert ${angle} into degrees form, please pass a valid number.`);
}

/**
 * @param {Object | Number} angle => {deg:, min:, sec:,} or angle as float number
 */
export function strDegMinSec(angle){
  angle = typeof angle === 'object' ? angle : degMinSec(angle);
  
  return angle.deg ? angle.deg + this.degMinSecSymbols.deg + ' ' : '' + 
   angle.min ? angle.min + this.degMinSecSymbols.min + ' ' : '' +
    angle.sec ? angle.sec + this.degMinSecSymbols.sec + ' ' : ''
  ;
}

export function fromDegMinSec(degMinSec) {
  return degMinSec.deg + degMinSec.min/60 + degMinSec.sec/3600;
}

export function fromStrDegMinSec(strDegMinSec) {
  let a;

  strDegMinSec.replace(this.degMinSecRegex, (str, d, m, s)=>{
    if(d === m === s !== void 0) {
      d = d || 0;
      m = m || 0;
      s = s || 0;
      a = d + m/60 + s/3600;
    }
  });
  if (a === void 0) throw new Error(`the angle is not represented in degrees, minute and seconds format.`);

  return a;
}
