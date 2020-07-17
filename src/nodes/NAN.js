import Node from './Node.js';
export default class NAN extends Node {
   constructor() {
      super([], 0);
      this.syntaxType = 'literal';
   }

   calculate(cs, tempVars) {
      return NAN;
   }

   derivative(cs) {
      return this;
   }

   toString() {
      return 'NAN';
   }

   simplify() {
      return this;
   }

   isEqual(node) {
      if (this.constructor === node.contructor) {
         if (this.name == node.name) {
            return true;
         }
      }
      return false;
   }
} 
