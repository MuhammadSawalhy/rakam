
type TAngleType = "deg" | "grad" | "gon";
export type TVector = Vector | { x: number, y: number };

export default class Vector {
  x: number;
  y: number;
  private _mag: number;
  private _angle: number;

  constructor(x: TVector | number, y?: number) {
    if (y) {
      this.x = +x;
      this.y = y;
    } else if (typeof x === 'object') {
      this.x = x.x;
      this.y = x.y;
    } else {
      throw new Error('invalid arguments when creating a vector');
    }
  }

  /**
   *
   * @param angle
   * @param mag
   * @param angleType one of the values of geometry.angles.angleTypes
   */
  static fromAngle(angle: number, mag = 1, angleType?: TAngleType) {
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
    return new Vector(mag * Math.cos(angle), mag * Math.sin(angle));
  }

  get mag() {
    if (this._mag !== undefined) return this._mag;
    return this._mag = (this.x ** 2 + this.y ** 2) ** 0.5;
  }

  set mag(v) {
    let a = this.angle;
    this.x = v * Math.cos(a);
    this.y = v * Math.sin(a);
    this._mag = v;
  }

  get angle() {
    if (this._angle !== undefined) return this._angle;
    return this._angle = Math.atan2(this.y, this.x);
  }

  set angle(v: number) {
    let m = this.mag;
    this.x = m * Math.cos(v);
    this.y = m * Math.sin(v);
    this._angle = v;
  }

  /**
   * new identical instance
   */
  clone(): Vector {
    return new Vector(this.x, this.y);
  }

  /**
   * your parameter v is either vector or number.
   */
  add(v: TVector) {
    this.x += v.x;
    this.y += v.y;
    this._angle = undefined; this._mag = undefined;
    return this;
  }

  /**
   * your parameter v is either vector or number.
   */
  subtract(v: TVector) {
    this.x -= v.x;
    this.y -= v.y;
    this._angle = undefined; this._mag = undefined;
    return this;
  }

  /**
   * your parameter v is  or number.
   */
  scale(v: number) {
    this.x *= v;
    this.y *= v;
    // scale _mag if is not defined
    this._mag = this._mag !== undefined ? this._mag*v : undefined;
    return this;
  }

  /**
   * your parameter a is  or number.
   */
  rotate(a: number) {
    this.angle += a;
    return this;
  }

  /**
   * get the dot product of this vector and another vector
   */
  dot(v: TVector) {
    return this.x * v.x + this.y * v.y;
  }

  toString() {
    return `(${this.x}, ${this.y})`;
  }

  toArray() {
    return [this.x, this.y];
  }
}
