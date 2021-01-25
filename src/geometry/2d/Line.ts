import Vector, {TVector} from '../../../Vector';

export default class Line {
  a: number;
  b: number;
  c: number;
  slope: number;

  constructor (a: number | TVector, b: TVector) {
    let slope: number;
    if (typeof a === "object") {
      slope = new Vector(b.x, b.y).subtract(a).angle;
    } else slope = a;
    this.slope = slope;
    this.a = Math.sin(slope);
    this.b = -Math.cos(slope);
    this.c = -Math.sin(slope) * b.x + Math.cos(slope) * b.y;
  }

  /**
   * get the shortest distance between a Vector (or point), and a Line
   */
  distance(v: TVector): number {
    if (v) {
      return Math.abs(this.a * v.x + this.b * v.y + this.c) / Math.sqrt(this.a ** 2 + this.b ** 2);
    }
  }

  intersection(line: Line): Vector {
    let y = -(line.c / line.a - this.c / this.a) / (line.b / line.a - this.b / this.a);
    return new Vector(
      (-line.b * y - line.c) / line.a, // x
      y, // y
    );
  }

  proj(v: TVector): Vector {
    return this.intersection(new Line(this.slope + Math.PI / 2, v));
  }

}
