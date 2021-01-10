export default class vector {
  constructor(x, y) {
    if (y) {
      this.x = x;
      this.y = y;
    } else if (typeof x === 'object') {
      this.x = x.x;
      this.t = x.y;
    } else {
      throw 'invalid arguments';
    }
  }

  /**
   *
   * @param {Number} angle
   * @param {Number} mag
   * @param {String} angleType one of the values of geometry.angles.angleTypes
   */
  static fromAngle(angle, mag = 1, angleType = 'rad') {
    switch (angleType) {
      case 'deg':
        angle *= Math.PI / 180;
        break;
      case 'gon':
        angle *= Math.PI / 400;
        break;
      case 'grad':
        angle *= Math.PI / 400;
        break;
    }
    return new vector(mag * Math.cos(angle), mag * Math.sin(angle));
  }

  get mag() {
    return (this.x ** 2 + this.y ** 2) ** 0.5;
  }
  set mag(v) {
    if (!isNaN(v)) {
      let a = this.angle;
      this.x = v * Math.cos(a);
      this.y = v * Math.sin(a);
    } else {
      throw new Error("can't assign NaN to this vector magnitude, your param is not valid.");
    }
  }

  get angle() {
    return this.atan2(this.y, this.x);
  }
  set angle(v) {
    if (!isNaN(v)) {
      let m = this.mag;
      this.x = m * Math.cos(v);
      this.y = m * Math.sin(v);
    } else {
      throw new Error("can't assign NaN to this vector angle, your param is not valid.");
    }
  }

  /**
   * your parameter v is either vector or number.
   * @param {vector} v
   * @param {number} v
   */
  add(v) {
    if (typeof v === 'object' && !isNaN(v.x) && !isNaN(v.y)) {
      return new vector(this.x + v.x, this.y + v.y);
    } else {
      throw new Error("can't add the passed value to this vector, your param is not valid.");
    }
  }

  /**
   * your parameter v is either vector or number.
   * @param {vector} v
   * @param {number} v
   */
  subtract(v) {
    if (typeof v === 'object' && !isNaN(v.x) && !isNaN(v.y)) {
      return new vector(this.x - v.x, this.y - v.y);
    } else {
      throw new Error("can't subtract the passed value to this vector, your param is not valid.");
    }
  }

  /**
   * your parameter v is  or number.
   * @param {number} v
   */
  scale(v) {
    if (!isNaN(v)) {
      this.x *= v;
      this.y *= v;
    } else {
      throw new Error("can't scale this vector, your param is not valid.");
    }
  }

  /**
   * your parameter a is  or number.
   * @param {number} a
   */
  rotate(a) {
    this.angle += a;
  }

  /**
   * get the dot product of this vector and another vector
   * @param {vector} v
   */
  dot(v) {
    if (v instanceof vector) {
      return this.x * v.x + this.y * v.y;
    } else {
      throw new Error('can\'t "dot" with the passed value and this vector, your param is not valid.');
    }
  }

  toString() {
    return `(${this.x}, ${this.y})`;
  }

  toArray() {
    return [this.x, this.y];
  }
}