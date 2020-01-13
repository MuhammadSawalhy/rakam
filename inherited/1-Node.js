class Node
{

   constructor(children, argsCount) {
      this.argsCount = argsCount;
      if (!children) {
         if (argsCount > 0) {
            throw new Error("Wrong count of arguments");
         }
         this.children = [];
         return;
      }
      if (argsCount > 0 && children.length < this.argsCount) {
         throw new Error("Wrong number of arguments");
      }
      this.children = children;
   }

   // #region Overridable, abstract Voids and Functions

   /**
    * @param {calculationSettings} cs 
    * @param {Map} tempVars 
    */

   derivative(cs){}

   simplify(){}

   isEqual(node){}

   toString(){}

   // #endregion

   // #region Common functions

   get isBoolean() {
      return this instanceof Boolean;
   }

   get containsVariable()
   {
      if (this instanceof Variable) {
         return true;
      }
      if (this.children)
         for(let child of this.children)
         {
            if (child.containsVariable) {
               return true;
            }
         }
      return false;
   }

   /** this won't work in all situations */
   get containsListOfNumbers()
   {
      if (this instanceof Set || this instanceof ArithmeticSequence) {
         return true;
      }
      if (this instanceof Variable) return this.value.containsListOfNumbers;
      for(let child of this.children)
      {
         if (child.containsListOfNumbers) {
            return true;
         }
      }
      return false;
   }

   get isConstantOrVariable()
   {
      return this instanceof Variable || this instanceof ConstantSourceNode;
   }

   // #endregion

}