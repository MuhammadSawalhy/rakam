import CalculationSettings from '../CalculationSettings.js';

export default class Core {

  // #region checking, bool, is_

  static isNumeric(value) {
    return !isNaN(value);
    // return value.toString().replace(/^\s*(\-?\d+|\-?\d+\.\d*|\-?\d*\.\d+)\s*$/, '123') === '123';
  }

  static isInteger(value) {
    return value % 1 === 0;
    // return value.toString().replace(/^\s*(\-?\d+|\-?\d+\.\d*|\-?\d*\.\d+)\s*$/, '123') === '123';
  }

  static isPrime(number) {
    var divisor = Math.floor(number / 2);
    var prime = true;
    if (number % 1 === 0) {
      while (divisor > 1) {
        if (number % divisor === 0) {
          prime = false;
          divisor = 0;
        } else {
          divisor -= 1;
        }
      }
    } else {
      prime = false;
    }
    return prime;
  }

  // #endregion

  // #region SimplifiedFraction

  static fraction(num) {
    if (num.toString().indexOf(".") > -1) {
      let
        num1 = parseInt(num.toString().replace(".", "")),
        num2 = Math.pow(10, num.toString().split('.')[1].length);
      let gcd_ = this.gcd(num1, num2);
      return { numerator: (num1 / gcd_), denominator: (num2 / gcd_)};
    }
    else
      return { numerator: num, denominator:1 };
  }

  static quotientRemainder(num) {
    if (num.toString().indexOf(".") > -1) {
      let
        num1 = parseInt(num.toString().split('.')[1]),
        num2 = Math.pow(10, num1.toString().length);
      
      num = parseInt(num.toString().split('.')[0]);
      let gcd_ = this.gcd2(num1, num2);

      return { quotient: num, numerator: (num1 / gcd_), denominator: (num2 / gcd_) };
    }
    else
      return { quotient: num, numerator: 0, denominator: 1 };
  }

  // #endregion

  // #region Finding Roots

  static newtonMethod(intialGuess, F, F_prime, cs) {
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

  static dist(a, b, c, d) {
    if((c && d) || (typeof a === 'object' && typeof b === 'object')){
      return this.dist(v1.x, v1.y, v2.x, v2.y);
    } else {
      throw new Error('can\'t calculate the distance, check that you passed two vectors or 4 numbers x1,y1,x2,y2');
    }
  }

  static constrain(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  static snap(value, options = { snapTo: { type: 'num', value: '' }, a: {} }) {

  }

  static random(start, end) {
    if (end) {
      return start + Math.random() * (end - start);
    } else {
      return Math.random() * start;
    }
  }

  static randomInt(start, end) {
    return Math.round(this.random(start, end))
  }

  static gcd(...values) {
    let gcd_ = values[0];
    let a = values[1];
    if (gcd_ % 1 != 0 || a % 1 != 0)
      return NaN;
    gcd_ = a > gcd_ ? this.gcd2(a, gcd_) : this.gcd2(gcd_, a);

    for (let i = 2; i < values.length; i++) {
      a = Math.abs(values[i]);
      if (a % 1 != 0)
        return NaN;
      gcd_ = a > gcd_ ? this.gcd2(a, gcd_) : this.gcd2(gcd_, a);
    }

    return gcd_;
  }

  static gcd2(a, b) {
    if (b == 0)
      return a;
    return this.gcd2(b, a % b);
  }

  static lcm(...values) {
    let product = 1;
    let a;
    for (let i = 0; i < values.length; i++) {
      a = values[i];
      if (a % 1 !== 0)
        return NaN;
      product *= a;
    }
    return Math.abs(product) / Math.pow(this.gcd(...values), values.length - 1);
  }

  //#endregion

  static calculateString(txt) {
    let node = stringTOnode(txt);
    return node.caluclate(CalculationSettings(), new Map());
  }

}
