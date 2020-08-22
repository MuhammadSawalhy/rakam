export default class Lines {

   /**
    * returns the distance to a line whose equation instanceof 'a*x + b*y + c = 0'.
    * @param {vector} v instanceof vector
    * @param {Object} line instanceof {a: ___, b: ___, c: ___} in "a*x+b*y+c=0"
    */
   static distToLine(v, line) {
      if (v) {
         return Math.abs(line.a * v.x + line.b * v.y + line.c) / Math.sqrt(line.a ** 2 + line.b ** 2);
      }
   }

   /**
    * return the lineIntersection of the line which equation instanceof a1*x + b1*x + c1 and the perpendiuclar line crossing through v
    * @param {vector} v instanceof any obj{x,y} or vector.
    * @param {Object} line instanceof {a: ___, b: ___, c: ___} in "a*x+b*y+c=0"
    */
   static projectionToLine(v, line) {
      if (v && line) {
         return Lines.lineIntersection(line, Lines.lineEquation(line.angle + Math.PI / 2, v));
      }
   }

   /**
    * return {a: ___, b: ___, c: ___} in "a*x+b*y+c=0"
    * @param {Number} angle instanceof the sloopAngle
    * @param {vector} trans instanceof any obj{x,y} or vector that the line crossing through.
    */
   static lineEquation(angle, trans) {
      return {
         a: Math.sin(angle),
         b: -Math.cos(angle),
         c: -Math.sin(angle) * trans.x + Math.cos(angle) * trans.y,
         angle: angle
      };
   }

   /**
    * return a vector represents
    * @param {Object} lineEquation1 instanceof {a: ___, b: ___, c: ___} in "a*x+b*y+c=0"
    * @param {Object} lineEquation2 instanceof {a: ___, b: ___, c: ___} in "a*x+b*y+c=0"
    */
   static lineIntersection(line1, line2) {
      let y = -(line1.c / line1.a - line2.c / line2.a) / (line1.b / line1.a - line2.b / line2.a);
      return new vector(
         (-line1.b * y - line1.c) / line1.a,
         y
      );
   }


}