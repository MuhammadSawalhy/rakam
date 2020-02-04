
class CalculationSettings {

   constructor(angleType, gs = null) {
      this.gs = gs;
      this.angleType = angleType;
      
      /// <summary>
      /// the pre-added vars, {0:x, 1:y, 2:nth, 3:pi, 4:E, 5:phi, ...}
      /// </summary>
      this.vars = []; // [{name: , value: }, ...]
      this.vars.push({ name: "x", value: new Constant(NaN) });
      this.vars.push({ name: "y", value: new Constant(Math.PI)});
      this.vars.push({ name: "nth", value: new Constant(NaN)});
      this.vars.push({ name: "pi", value: new Constant(Math.PI)});
      this.vars.push({ name: "e", value: new Constant(Math.E)});
      this.vars.push({ name: "phi", value: new Constant(NaN)});
      
      this.funcs = [];
   }


}
