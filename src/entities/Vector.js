import Angles from '../main/Angles.js';

export default class {
   constructor(x, y) {
      this.x = x;
      this.y = y;
   }

   static fromAngle(angle, mag = 1) {
      return new vector(mag * Math.cos(angle), mag * Math.sin(angle))
   }

   get mag() {
      return (this.x ** 2 + this.y ** 2) ** 0.5;
   }

   get angle() {
      return Angles.angle(new vector(1, 0), this);
   }

   /**
    * your parameter v is either vector or number.
    * @param {vector} v
    * @param {number} v
    */
   add(v) {
      if (v instanceof vector) {
         return new vector(this.x + v.x, this.y + v.y);
      }
      else if (!isNaN(v)) {
         return new vector(this.x + v, this.y + v);
      }
      else {
         throw new Error('your param is not valid.')
      }
   }

   /**
    * your parameter v is either vector or number.
    * @param {vector} v
    * @param {number} v
    */
   subtract(v) {
      if ((v instanceof vector) || (v instanceof Object)) {
         return new vector(this.x - v.x, this.y - v.y);
      }
      else if (!isNaN(v)) {
         return new vector(this.x - v, this.y - v);
      }
      else {
         throw new Error('your param is not valid.')
      }
   }

   /**
    * your parameter v is  or number.
    * @param {number} v
    */
   mult(v) {
      if (!isNaN(v)) {
         return new vector(this.x * v, this.y * v);
      }
      else {
         throw new Error('your param is not valid.')
      }
   }

   /**
    * @param {vector} v 
    */
   dot(v) {
      if (v instanceof vector) {
         return this.x * v.x + this.y * v.y;
      }
      else {
         throw new Error('your param is not valid.')
      }
   }

   rotate(a) {
      a += this.angle;
      return new vector(this.mag * Math.cos(a), this.mag * Math.sin(a));
   }

   toString() {
      return `(${this.x}, ${this.y})`;
   }

   toArray() {
      return [this.x, this.y];
   }

}
