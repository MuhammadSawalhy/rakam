import Node from './inherited/Node.js';
class NAN extends Node {
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
      if (fromTheSame(this, node)) {
         if (this.name == node.name) {
            return true;
         }
      }
      return false;
   }
} 
