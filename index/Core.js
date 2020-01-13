
class Core{

  // #region checking, bool, is_...
  
  static isAlpha(input)
  {
    return input.toString().replace(/\d/g, '@').replace(/\w/g, '') === '';
  }
  
  static isSymbol(char)
  {
    return (char.replace(/\W/, '') === '')
  }

  static isNumeric(value)
  {
    return !isNaN(value);
    // return value.toString().replace(/^\s*(\-?\d+|\-?\d+\.\d*|\-?\d*\.\d+)\s*$/, '123') === '123';
  }
  
  static fromTheSame(a, b) {
    return a.fromTheSame === b.fromTheSame;
  }
  
  // #endregion
  
  // #region SimplifiedFraction
  
  static simplifiedFraction_1(num)
  {
    if (num.toString().shearch(".") > 1) {
      let
      num1 = parseInt(num.toString().replace(".", "")),
        num2 = Math.pow(10, num.toString().split('.')[1].length);
      let gcd = new GCD(new Set([new Constant(num1), new Constant(num2)], true));
      let gcd_ = gcd.calculate(new CalculationSettings());
      return [(num1 / gcd_), (num2 / gcd_)];
    }
    else
      return [num, 1];
  }
  static simplifiedFraction_2(num)
  {
    if (num.toString().Contains(".")) {
      let
      num1 = parseInt(num.toString().replace(".", "")),
        num2 = Math.pow(10, num.toString().split('.')[1].length);
      num1 = mod(num1, num2);
      let gcd = new GCD(new Set([new Constant(num1), new Constant(num2)], true));
      let gcd_ = gcd.calculate(new CalculationSettings());
      return [Math.floor(num), (num1 / gcd_), (num2 / gcd_)];
    }
    else
      return [num, 0, 1];
  }
  
  // #endregion
  
  // #region Finding Roots
  
  static newtonMethod(intialGuess, F, F_prime, cs)
  {
    let x = intialGuess, x_;
    do {
      x_ = x;
      cs.vars[0].value = new Constant(x_);
      x = x_ - F.calculate(cs) / F_prime.calculate(cs);
      if (Math.abs(x_) < Math.abs(x)) {
        return NaN;
      }
    } while (Math.abs(F.calculate(cs)) > Math.pow(10, -15));
    return x;
  }
  
  // #endregion
  
  //#region Methods

  static sqrt(x) {
    return Math.sqrt(x);
  }

  static mod(num1, num2) {
    return (num1 - num2 * Math.floor(num1 / num2));
  }

  static max(...params) {
    let max = params[0];
    for (let param of params) {
      max = Math.max(param, max);
    }
    return max;
  }
  
  static min(...params) {
    let min = params[0];
    for (let param of params) {
      min = Math.min(param, min);
    }
    return min;
  }
  
  static dist(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(y1-y2, 2) + Math.pow(x1-x2, 2));
  }

  static distVectors(v1, v2) {
    return this.dist(v1.x, v1.y, v2.x, v2.y);
  }

  static constrain(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  static snap(value, options = {snapTo: { type: 'num', value: '' }, a:{ }}) {
    
  }

  //#endregion
  
  static calculateString(txt) {
    let node = stringTOnode(txt);
    return node.caluclate(CalculationSettings(), new Map());
  }

}
