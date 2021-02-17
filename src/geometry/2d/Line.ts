import Vector, {TypeVector} from '../../Vector';

/**
 * ax+by+c=0
 */
export default class Line {
  a: number;
  b: number;
  c: number;
  slope: number;

  /**
   * 
   * @param a the __1st point__ if you want a line between two point,
   * or the __slope angle__ of the line
   * @param b a point.
   */
  constructor (a: number | TypeVector, b: TypeVector) {
    let slope;
    if (typeof a === "object") {
      slope = new Vector(b.x, b.y).subtract(a).angle;
    } else slope = a;
    this.slope = slope;
    this.a = Math.sin(slope);
    this.b = -Math.cos(slope);
    this.c = -(this.a * b.x + this.b * b.y);
  }

  /**
   * get the shortest distance between a Vector (or point), and a Line
   */
  distance(v: TypeVector): number {
    return Math.abs(this.a * v.x + this.b * v.y + this.c) / Math.sqrt(this.a ** 2 + this.b ** 2);
  }

  intersection(line: Line): Vector {
    // some math hacking
    let y = -(line.c / line.a - this.c / this.a) / (line.b / line.a - this.b / this.a);
    return new Vector(
      (-line.b * y - line.c) / line.a, // x
      y,
    );
  }

  proj(v: TypeVector): Vector {
    return this.intersection(new Line(this.slope + Math.PI / 2, v));
  }

}
