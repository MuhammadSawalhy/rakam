(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.MathPackage = factory());
}(this, (function () { 'use strict';

  class Core {

    // #region checking, bool, is_

    static isNumeric(value) {
      return !isNaN(value);
      // return value.toString().replace(/^\s*(\-?\d+|\-?\d+\.\d*|\-?\d*\.\d+)\s*$/, '123') === '123';
    }

    static isInteger(value) {
      return value % 1 === 0;
      // return value.toString().replace(/^\s*(\-?\d+|\-?\d+\.\d*|\-?\d*\.\d+)\s*$/, '123') === '123';
    }

    static isPrime(number) {    // determines if number is prime
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
      return Math.sqrt(Math.pow(y1 - y2, 2) + Math.pow(x1 - x2, 2));
    }

    static distVectors(v1, v2) {
      return this.dist(v1.x, v1.y, v2.x, v2.y);
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

  class Angles {

     //#region calculations ///////////////////////////////////////////////////

     /**
      * return angle between 0 and 2*PI (one round)
      * @param {vector} p1 instanceof {x: ___, y: ___},
      * @param {vector} p2 instanceof {x: ___, y: ___};
      * @param {object} options instanceof '{}' that defines 'type'.
      */
     static minAngle(p1, p2, options = {}) {
        options.type = options.type || 'vectors';
        if (options.type === 'vectors') {
           let s = p1.dot(p2) / (p1.mag * p2.mag);
           let a = Math.acos(Core.constrain(s, -1, 1));

           return this.constrainAngle(a);
        }
        else if (options.type === 'lines') {
           let a = this.minAngle(p1, p2);
           return Math.min(a, Math.PI - a);  // notice that {(a) and (Math.PI - a)} are always positive.
        }
     }

     /**
      * return angle between 0 and 2*PI (one round)
      * @param {vector} p1 instanceof ,
      * @param {vector} p2 instanceof ;
      * @param {object} options instanceof '{}' that defines 'type'.
     */
     static maxAngle(p1, p2, options = {}) {
        options.type = options.type || 'vectors';
        if (options.type === 'vectors') {
           let min = this.minAngle(p1, p2);
           return Math.max(2 * Math.PI - min, min);
        }
        else if (options.type === 'lines') {
           let a = this.minAngle(p1, p2);
           return Math.max(a, Math.PI - a);  // notice that {(a) and (Math.PI - a)} are always positive.
        }
     }

     /**
      * return angle between 0 and 2*PI (one round)
      * @param {vector} p1 instanceof {x: ___, y: ___},
      * @param {vector} p2 instanceof {x: ___, y: ___}
      * @param {object} options instanceof '{}' that defines 'type', 'dir'.
      */
     static angle(p1, p2, options = {}) {
        options.type = options.type || 'vectors';
        options.dir = options.dir || 'counterclockwise';

        if (options.type === 'vectors') {
           var a1 = this.minAngle(p1, new vector(1, 0));
           a1 = p1.y >= 0 ? a1 : -a1;
           var a2 = this.minAngle(p2, new vector(1, 0));
           a2 = p2.y >= 0 ? a2 : -a2;
           let a = options.dir === 'counterclockwise' || options.dir === '+' ? a2 - a1 : a1 - a2;

           return this.constrainAngle(a);
        }
        else if (options.type === 'lines') {
           let a1 = this.angle(p1, p2, { type: 'vectors', dir });
           let a2 = this.angle(p1, p2.mult(-1), { type: 'vectors', dir });
           return Math.min(a1, a2); // that is a wonderful optimization for getting the angle of rotation when you rotate the 1st line to fit it on the other one, consider the dir of rotation inside options.
        }
     }

     /**
      * the returned angle instanceof constrined between 0 and 2*Math.PI
      * @param {number} angle, 
      * @param {number} type, if 0 the your angle will be inside [-pi, pi]
      *                     - else if 1 your angle will be inside [0, 2pi]
      */

     static constrainAngle(angle, type = 0) {
        if (type === 1) {
           let sin_ = Math.sin(angle);
           let cos_ = Math.cos(angle);
           let a = Math.asin(Math.abs(sin_)); // the same as Math.abs(Math.asin(sin_));
           return sin_ >= 0 ?
              (cos_ >= 0 ?
                 a :  // first quarter, sin + , cos +
                 Math.PI - a // second quarter, sin + , cos -
              ) :
              (cos_ >= 0 ?
                 2 * Math.PI - a : // second quarter, sin - , cos +
                 Math.PI + a // second quarter, sin - , cos -
              );
        }
        else if (type === 0) { // default
           let sin_ = Math.sin(angle);
           let cos_ = Math.cos(angle);
           let a = Math.asin(Math.abs(sin_)); // the same as Math.abs(Math.asin(sin_));
           return sin_ >= 0 ?
              (cos_ >= 0 ?
                 a :  // first quarter, sin + , cos +
                 Math.PI - a // second quarter, sin + , cos -
              ) :
              (cos_ >= 0 ?
                 -a : // fourth quarter, sin - , cos +
                 -Math.PI + a // third quarter, sin - , cos -
              );
        }
     }

     static snapAngle(a, valuesTOsnapTO) {
        let margin = angles.deg(2.5); /// 2.5deg
        /// sanp to 30 or 210 deg, and so on.
        if (!valuesTOsnapTO) {
           let snapTo = [Math.PI / 6, Math.PI / 4, Math.PI / 3, Math.PI / 2]; /// four special angles
           for (let i = 0; i < 4; i++) {
              snapTo.push(Math.PI - snapTo[i]);
              snapTo.push(Math.PI + snapTo[i]);
              snapTo.push(2 * Math.PI - snapTo[i]);
           }
           snapTo.push(0); snapTo.push(Math.PI);
           valuesTOsnapTO = snapTo;
        }
        for (let s of valuesTOsnapTO) {
           let a1 = angles.minAngle(vector.fromAngle(a), vector.fromAngle(s)); // angles between two vectors not lines.
           if (a1 <= margin) {
              return s;
           }
        }
        return a;
     }


     //#endregion

     //#region conversion ///////////////////////////////////////////////////

     /**
      * return an object with degress, seconds and minutes properities
      * @param {*} angle ::: in radian form
      */
     static degAngle(angle) {
        if (Core.isNumeric(angle)) {
           let splitted;
           angle = angle * 180 / Math.PI;
           let deg, min, sec;
           let getTerm = (a, b) => {
              a = '0.' + a.toString();
              a *= b;
              splitted = a.toString().split('.');
              splitted = [parseInt(splitted[0]), parseInt(splitted[1])];
              return [...splitted];
           };

           if (Math.round(angle) != angle) {
              splitted = angle.toString().split('.');
              splitted = [parseInt(splitted[0]), parseInt(splitted[1])];
              deg = splitted[0];
              min = getTerm(splitted[1], 60);
              sec = getTerm(min[1], 60);

              if (Math.abs(sec[0] - 60) <= 1) { min[0]++; sec[0] = 0; }
              if (min[0] === 60) { deg += 1 * Math.sign(deg); min[0] = 0; }
              return { degrees: deg, minutes: min[0], seconds: sec[0] };
           }
           return { degrees: angle, minutes: 0, seconds: 0 };

        } else {
           let cAngle = calculateString(angle);
           if (Core.isNumeric(cAngle)) {
              return this.degAngle(cAngle);
           }
           else throw new Error('your angle value (' + angle + ') is not valid. :"(');
        }
     }

     static stringDegAngle(angle) {
        let deg = this.degAngle(angle);
        if (deg.degrees != 0) {
           if (deg.minutes != 0) {
              // nothing is zero
              if (deg.seconds != 0) {
                 return deg.degrees + '° ' + deg.minutes + "' " + deg.seconds.toFixed(2) + '"';
              }
              // sec is zero
              else {
                 return deg.degrees + '° ' + deg.minutes + "'";
              }
           }
           else {
              // min is zero
              if (deg.seconds != 0) {
                 return deg.degrees + '° ' + deg.seconds.toFixed(2) + '"';
              }
              // min and sec is zero
              else {
                 return deg.degrees + '°';
              }
           }
        }
        else {
           if (deg.minutes != 0) {
              // deg is zero
              if (deg.seconds != 0) {
                 return deg.minutes + "' " + deg.seconds.toFixed(2) + '"';
              }
              // deg and sec is zero
              else {
                 return deg.minutes + "'";
              }
           }
           else {
              // deg and min is zero
              if (deg.seconds != 0) {
                 return deg.seconds.toFixed(2) + '"';
              }
              // all is zero
              else {
                 return 0 + '°';
              }
           }
        }
     }

     static deg(a, to = 'rad') {
        switch (to) {
           case 'rad': // from deg to rad
              return a * Math.PI / 180;
        }
     }
     static toDeg(a, from = 'rad') {
        switch (from) {
           case 'rad': // from deg to rad
              return a / Math.PI * 180;
        }
     }

     //#endregion

  }

  class Lines {

     //#region relates to lines

     /**
      * returns the distance to a line whose equation instanceof 'a*x + b*y + c = 0'.
      * @param {vector} v instanceof vector
      * @param {number} a param of x in 'a*x + b*y + c = 0'.
      * @param {number} b param of y in 'a*x + b*y + c = 0'.
      * @param {number} c the absolute in 'a*x + b*y + c = 0'.
      * @param {number} angle instanceof the sloop angle of the line from 0 to 2*Pi
      * @param {number} trans instanceof the translation of the line according to the orign point.
      */
     static distToLine(v, le) {
        if (v) {
           return Math.abs(le.a * v.x + le.b * v.y + le.c) / Math.sqrt(le.a ** 2 + le.b ** 2);
        }
     }

     /**
      * return the lineIntersection of the line which equation instanceof a1*x + b1*x + c1 and the perpendiuclar line crossing through v
      * @param {Object} le instanceof {a: ___, b: ___, c: ___} in "a*x+b*y+c=0"
      */
     static projectionToLine(v, le) {
        if (v && le) {
           return Lines.lineIntersection(le, Lines.lineEquation(le.angle + Math.PI / 2, v));
        }
     }

     /**
      * return {a: ___, b: ___, c: ___} in "a*x+b*y+c=0"
      * @param {*} angle instanceof the sloopAngle
      * @param {*} trans instanceof any point or vector that the line crossing through.
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
      * @param {*} lineEquation1 instanceof {a: ___, b: ___, c: ___} in "a*x+b*y+c=0"
      * @param {*} lineEquation2 instanceof {a: ___, b: ___, c: ___} in "a*x+b*y+c=0"
      */
     static lineIntersection(le1, le2) {
        let y = -(le1.c / le1.a - le2.c / le2.a) / (le1.b / le1.a - le2.b / le2.a);
        return new vector(
           (-le1.b * y - le1.c) / le1.a,
           y
        );
     }

     //#endregion

  }

  /**
   * Using Parser.js we can do incredible things ::: {<>}
   */

  class Parser {

     constructor(mathParserLib) {
        this.mathParserLib = mathParserLib;
        this.maximaTOlatex = new tex2max({ disallowDecimalCommas: false, addTimesSign: false });
     }

     //#region  parserNode to ___

     parsedTOnode(snode) {
        let expr = snode;
        if (expr.type === 'number') {
           return new Constant(parseFloat(expr.value));
        } else if (expr.type === 'variable')
           return new Variable(expr.name);

        else if (expr.args.length == 2) {
           {

              if (expr.calls('&&', 2) && (expr.args[0]) && (expr.args[1]) ||
                 expr.calls("and", 2) && (expr.args[0]) && (expr.args[1])) return new And(snodeTOnode(expr.args[1]), snodeTOnode(expr.args[2]));
              else if (expr.calls('||', 2) && (expr.args[0] = expr.args[0]) && (expr.args[1]) ||
                 expr.calls("or", 2) && (expr.args[0] = expr.args[0]) && (expr.args[1])) {
                 let a = snodeTOnode(expr.args[0]), b = snodeTOnode(expr.args[1]);
                 if ((a.type === 'boolop' || b.type === 'bool') && (b.type === 'boolop' || b.type === 'bool')) return new Or(expr.args[0], expr.args[1]);
                 else return new NullCoalesce(expr.args[0], expr.args[1]);
              }
              else if (expr.calls('>', 2) && (expr.args[0]) && (expr.args[1])) return new GreaterThan([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);
              else if (expr.calls('<', 2) && (expr.args[0]) && (expr.args[1])) return new LowerThan([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);
              else if (expr.calls('>=', 2) && (expr.args[0]) && (expr.args[1])) return new GreaterEquals([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);
              else if (expr.calls('<=', 2) && (expr.args[0]) && (expr.args[1])) return new LowerEquals([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);
              else if (expr.calls('=', 2) && (expr.args[0]) && (expr.args[1])) return new Equals([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);
              else if (expr.calls('!=', 2) && (expr.args[0]) && (expr.args[1])) return new NotEqual([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);
              else if (expr.calls('&', 2) && (expr.args[0]) && (expr.args[1])) return new Band([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);
              else if (expr.calls('|', 2) && (expr.args[0]) && (expr.args[1])) return new Bor([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);
              else if (expr.calls("xor", 2) && (expr.args[0]) && (expr.args[1])) return new Xor([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);
              else if (expr.calls("xor", 2) && (expr.args[0]) && (expr.args[1])) return new Bxor([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);


              else if (expr.calls('+', 2) && (expr.args[0]) && (expr.args[1])) return new Add([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);
              else if (expr.calls('*', 2) && (expr.args[0]) && (expr.args[1])) return new Multiply([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);
              else if (expr.calls('-', 2) && (expr.args[0]) && (expr.args[1])) return new Subtract([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);
              else if (expr.calls('/', 2) && (expr.args[0]) && (expr.args[1])) return new Divide([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);
              else if (expr.calls('mod', 2) && (expr.args[0]) && (expr.args[1])) return new Mod([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);
              else if (expr.calls('^', 2) && (expr.args[0]) && (expr.args[1])) return new Power([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);
              else if (expr.calls('>>', 2) && (expr.args[0]) && (expr.args[1])) return new ShiftRight([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);
              else if (expr.calls('<<', 2) && (expr.args[0]) && (expr.args[1])) return new ShiftLeft([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);

              else if (expr.calls("log", 2) && (expr.args[0]) && (expr.args[1])) return new Log([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);

              else if (expr.calls("in", 2) && (expr.args[0]) && (expr.args[1]) && expr.args[1].calls('()', 2) && (lo = tmp_10.args[0]) && (hi = tmp_10.args[1]))
                 return new In(snodeTOnode(expr.args[0]), snodeTOnode(lo), snodeTOnode(hi));

              else if (expr.calls("in", 2) && (expr.args[0]) && (expr.args[1]) && (expr.args[1].calls("[]", 2)) && (lo = tmp_10.args[0]) && (hi = tmp_10.args[1]))
                 return new In(snodeTOnode(a, calculationSettings), snodeTOnode(lo), snodeTOnode(hi));

              else if (expr.calls("constrain", 2) && (expr.args[0]) && (expr.args[1]) && (expr.args[1].calls('()', 2) || expr.args[1].calls("[]", 2)) && (expr.args[1].args[0]) && (expr.args[1].args[1]))
                 return new Constrain([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1].args[0]), snodeTOnode(expr.args[1].args[1])]);

              else if (expr.calls("P", 2) && (expr.args[0]) && (expr.args[1])) return new nPr([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);
              else if (expr.calls("C", 2) && (expr.args[0]) && (expr.args[1])) return new nCr([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);

           }
        }

        {
           if (expr.calls('-', 1, 'preop') && (expr.args[0])) return new Neg(snodeTOnode(expr.args[0]));
           else if (expr.calls('not', 1, 'preop') && (expr.args[0])) return new Not(snodeTOnode(expr.args[0]));
           else if (expr.calls('bnot', 1, 'preop') && (expr.args[0])) return new BNot(snodeTOnode(expr.args[0]));

           else if (expr.calls('?', 2, 'op') && (expr.args[0]) && (expr.args[1]))
              return new If([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1]), null]);
           else if (expr.calls("if", 2, 'func') && (expr.args[0]) && (expr.args[1]))
              return new If([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1]), null]);
           else if (expr.calls("if", 3, 'func') && (expr.args[0]) && (expr.args[1]) && (expr.args[2]))
              return new If([snodeTOnode(a), snodeTOnode(expr.args[1]), snodeTOnode(expr.args[2])]);

           else if (expr.calls("sqrt", 1, 'func') && (expr.args[0])) return new Sqrt([snodeTOnode(expr.args[0])]);
           else if (expr.calls("sin", 1, 'func') && (expr.args[0])) return new Sin([snodeTOnode(expr.args[0])]);
           else if (expr.calls("cos", 1, 'func') && (expr.args[0])) return new Cos([snodeTOnode(expr.args[0])]);
           else if (expr.calls("tan", 1, 'func') && (expr.args[0])) return new Tan([snodeTOnode(expr.args[0])]);
           else if (expr.calls("asin", 1, 'func') && (expr.args[0])) return new Asin([snodeTOnode(expr.args[0])]);
           else if (expr.calls("acos", 1, 'func') && (expr.args[0])) return new Acos([snodeTOnode(expr.args[0])]);
           else if (expr.calls("atan", 1, 'func') && (expr.args[0])) return new Atan([snodeTOnode(expr.args[0])]);
           else if (expr.calls("sec", 1, 'func') && (expr.args[0])) return new Sec([snodeTOnode(expr.args[0])]);
           else if (expr.calls("csc", 1, 'func') && (expr.args[0])) return new Csc([snodeTOnode(expr.args[0])]);
           else if (expr.calls("cot", 1, 'func') && (expr.args[0])) return new Cot([snodeTOnode(expr.args[0])]);
           else if (expr.calls("exp", 1, 'func') && (expr.args[0])) return new Exp([snodeTOnode(expr.args[0])]);
           else if (expr.calls("ln", 1, 'func') && (expr.args[0])) return new Ln([snodeTOnode(expr.args[0])]);
           else if (expr.calls("log", 1, 'func') && (expr.args[0])) return new Log([snodeTOnode(expr.args[0]), new Constant(10)]);
           else if (expr.calls("ceil", 1, 'func') && (expr.args[0])) return new Ceil([snodeTOnode(expr.args[0])]);
           else if (expr.calls("floor", 1, 'func') && (expr.args[0])) return new Floor([snodeTOnode(expr.args[0])]);
           else if (expr.calls("Round", 1, 'func') && (expr.args[0])) return new Round([snodeTOnode(expr.args[0])]);
           else if (expr.calls("sign", 1, 'func') && (expr.args[0])) return new Sign([snodeTOnode(expr.args[0])]);
           else if (expr.calls("abs", 1, 'func') && (expr.args[0])) return new Abs([snodeTOnode(expr.args[0])]);
           else if (expr.calls("fact", 1, 'func') && (expr.args[0])) return new Factorial([snodeTOnode(expr.args[0])]);
           else if (expr.calls("!", 'sufop') && (expr.args[0])) return new Factorial([snodeTOnode(expr.args[0])]);
           else if (expr.calls("random", 'func'))
              return _getRandom(expr);
           else if (expr.calls("min", 'func')) {
              let childres = new Array(expr.args.length);
              for (let i = 0; i < expr.args.length; i++) {
                 if (expr.args[i] == null)
                    throw new Exception("Passed argument musn't be void.");
                 childres[i] = snodeTOnode(expr.args[i]);
              }
              return new Min(new Set(childres, true));
           }
           else if (expr.calls("max", 'func')) {
              let childres = new Array(expr.args.length);
              for (let i = 0; i < expr.args.length; i++) {
                 if (expr.args[i] == null)
                    throw new Exception("Passed argument musn't be void.");
                 childres[i] = snodeTOnode(expr.args[i]);
              }
              return new Max(new Set(childres, true));
           }
           else if (expr.calls("constrain", 3, 'func') && (expr.args[0]) && (expr.args[1]) && (expr.args[2])) {
              return new Constrain([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1]), snodeTOnode(expr.args[2])]);
           }

           /// gcm, hcm, gcf, hcf, gcd, hcd
           else if (expr.calls("gcm") || expr.calls("hcm") || expr.calls("gcf") || expr.calls("hcf") || expr.calls("gcd") || expr.calls("hcd")) {
              let childres = new Array(expr.args.length);
              for (let i = 0; i < expr.args.length; i++) {
                 if (expr.args[i] == null)
                    throw new Exception("Passed argument musn't be void.");
                 childres[i] = snodeTOnode(expr.args[i]);
              }
              return new GCD(new Set(childres, true));
           }
           /// lcm, lcd
           else if (expr.calls("lcm") || expr.calls("lcd")) {
              let childres = new Array(expr.args.length);
              for (let i = 0; i < expr.args.length; i++) {
                 if (expr.args[i] == null)
                    throw new Exception("Passed argument musn't be void.");
                 childres[i] = snodeTOnode(expr.args[i]);
              }
              return new GCD(new Set(childres, true));
           }

           else if (expr.calls("sum", 4, 'func') && (expr.args[0]) && (expr.args[1]) && (expr.args[2]) && (expr.args[3])) {
              if (expr.args[0].type === 'id') {
                 //Here temp vars will be added
                 return new Sum(expr.args[0].value, [snodeTOnode(expr.args[1]), snodeTOnode(expr.args[2]), new Constant(1), snodeTOnode(expr.args[3])]);
              }
           }
           else if (expr.calls("sum", 5, 'func') && (expr.args[0]) && (expr.args[1]) && (expr.args[2]) && (expr.args[3]) && (expr.args[4])) {
              if (expr.args[0].type === 'id') {
                 //Here temp vars will be added
                 return new Sum(expr.args[0].value, [snodeTOnode(expr.args[1]), snodeTOnode(expr.args[2]), snodeTOnode(expr.args[3]), snodeTOnode(expr.args[4])]);
              }
           }

           else if (expr.calls("derivate", 1) && (expr.args[0])) {
              return new Derivate(snodeTOnode(expr.args[0]));
           }

           // to get a list of numbers ::: [0,1,2]     [0,...,5]
           else if (expr.calls("{}")) {
              if (expr.toString().Contains("...")) ;
              else {
                 let items = [];
                 for (let arg of expr.args) {
                    let i = snodeTOnode(arg);
                    items.push(i);
                 }
                 let list = new Set(items, true);
                 return list;
              }
           }

           else if (expr.calls(".")) {
              if (expr.dotType === 'id') {
                 return new Variable(expr.extension);
              }
              else if (expr.dotType === 'func') {
                 return new Func(expr.extension, expr.args[1].args);
              }
           }

           // to get functions
           else if (expr.type === 'func') {
              let args = [];
              for (let i = 0; i < expr.args.length; i++) {
                 args.push(snodeTOnode(expr.args[i]));
              }
              return new Func(expr.name, args);
           }

        }

        throw new Error("Expression not understood: " + expr.toString());

     }

     _getRandom(expr) {
        let type = 'double';
        let TypeAssigned = false;
        if (expr.args.length > 0)
           if (expr.args[expr.args.length - 1].type === 'id') {
              if (expr.args[expr.args.length - 1].name === "int") {
                 type = 'int';
                 TypeAssigned = true;
              }
           }

        if (TypeAssigned) {
           expr.args.pop();
        }

        if (expr.args.length == 0) {
           return new Random([], type);
        }
        if (expr.args.length == 1) {
           return new Random([snodeTOnode(expr.args[0])], type);
        }
        if (expr.args.length == 2) {
           return new Random([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])], type);
        }
        return null;
     }

     /**
      * 
      * @param {MagicalParser.Node} parsed 
      * @param {Array} params 
      * @param {String} math is the math object containing the functions and the variables that is not a parameter.
      * @param {Boolean} strict
      */
     parsedTOjsFunction(parsed, params = [], math = 'Math', strict = true) {
        let undef = { vars: [], funcs: [] };
        let func = new Function(...params, `${strict ? '"use strict";\n' : ''}return ${this.__generateJS(parsed, params, math, undef)};`);
        undef.vars = undef.vars.reduce((b, a) => {
           if (!b.find(e => e.name === a.name)) b.push(a);
           return b;
        }, []);
        undef.funcs = undef.funcs.reduce((b, a) => {
           if (!b.find(e => e.name === a.name)) b.push(a);
           return b;
        }, []);
        return { func, undef };
     }

     __generateJS(parsed, params = [], math = "Math", undef = null) {
        if (parsed.type === 'number') {
           return parsed.value;
        } else if (parsed.type === 'functionCalling') {
           switch (parsed.name) {
              case 'sum':
                 if (!parsed.args[0].check({ type: 'separator', name: ',', length: 4 }) || !parsed.args[0].args[1].type === 'variable') throw new Error('sum function has not valid arguments: "' + parsed.match + '"');
                 let sumParam = parsed.args[0].args[1].name;
                 let newParams = [...params];
                 newParams.push(sumParam);
                 let sumExpr = this.__generateJS(parsed.args[0].args[0], newParams, math, undef);
                 let start = this.__generateJS(parsed.args[0].args[2], params, math, undef);
                 let end = this.__generateJS(parsed.args[0].args[3], params, math, undef);
                 return `(()=>{
                  let _ = 0;
                  for(let ${sumParam} = ${start}; ${sumParam} <= ${end}; ${sumParam}++){
                     _ += ${sumExpr};
                  }
                  return _; 
               })()`;
              default:
                 if (params.find(param => parsed.name === param)) {
                    return parsed.name + `(${this.__generateJS(parsed.args[0], params, math, undef)})`;
                 }
                 if (!window[math].hasOwnProperty(parsed.name)) undef.funcs.push(parsed.name);
                 return math + `.${parsed.name}(${this.__generateJS(parsed.args[0], params, math, undef)})`;
           }
        } else if (parsed.type === 'variable') {
           if (params.find(param => parsed.name === param)) {
              return parsed.name;
           }
           if (!window[math].hasOwnProperty(parsed.name)) undef.vars.push(parsed.name);
           return math + '.' + parsed.name;
        } else if (parsed.type === 'block') {
           let opening, closing;
           switch (parsed.name) {
              case '()':
                 opening = '(';
                 closing = ')';
                 break;
              case '[]':
                 opening = '[';
                 closing = ']';
                 break;
              case '{}':
                 opening = '{';
                 closing = '}';
                 break;
           }
           return opening + this.__generateJS(parsed.args[0], params, math, undef) + closing;
        } else if (parsed.type === 'operator') {
           switch (parsed.name) {
              case '.':
                 return this.__generateJS(parsed.args[0], params, math, undef) + '.' + parsed.args[1].match;
              case '^':
                 return this.__generateJS(parsed.args[0], params, math, undef) + ' ** ' + this.__generateJS(parsed.args[1], params, math, undef);
              case '=':
                 return this.__generateJS(parsed.args[0], params, math, undef) + ' == ' + this.__generateJS(parsed.args[1], params, math, undef);
              default:
                 return this.__generateJS(parsed.args[0], params, math, undef) + ' ' + parsed.name + ' ' + this.__generateJS(parsed.args[1], params, math, undef);
           }
        } else if (parsed.type === 'suffixOperator') {
           switch (parsed.name) {
              case '!':
                 return 'Math.fact(' + this.__generateJS(parsed.args[0], params, math, undef) + ')';
              default:
                 return this.__generateJS(parsed.args[0], params, math, undef) + parsed.name;
           }
        } else if (parsed.type === 'prefixOperator') {
           return parsed.name + this.__generateJS(parsed.args[0], params, math, undef);
        } else if (parsed.type === 'separator') {
           let args = [];
           for (let arg of parsed.args) {
              args.push(this.__generateJS(arg, params, math, undef));
           }
           return args.join(parsed.name + ' ');
        } else {
           return parsed.match;
        }
     }

     //#endregion

     //#region : latex to ___

     latexTOmaxima(tex) {
        return this.maximaTOlatex.toMaxima(tex);
     }

     latexTOnode(tex) {
        return this.parserNodeTOnode(this.mathParserLib.parse(this.latexTOmaxima(tex)));
     }

     latexTOjsfunction(tex, params = [], noparse = false) {
        return this.maximaTOjsFunction(this.latexTOmaxima(tex), params, noparse);
     }

     //#endregion

     //#region : maxima(string) to ___

     maximaTOnode(str) {
        return this.parserNodeTOnode(this.mathParserLib.parse(str));
     }
     maximaTOjsFunction(str, params = [], math = 'Math', strict = true) {
        return this.parsedTOjsFunction(this.mathParserLib.parse(str), params, math, strict);
     }

     maximaTOlatex(str) {

     }

     //#endregion

  }

  class Vector {
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

  var entities = {
     Vector,

  };

  class Node {

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

     derivative(cs) { }

     simplify() { }

     isEqual(node) { }

     toString() { }

     // #endregion

     // #region Common functions

     get isBoolean() {
        return this instanceof Boolean;
     }

     get containsVariable() {
        if (this instanceof Variable) {
           return true;
        }
        if (this.children)
           for (let child of this.children) {
              if (child.containsVariable) {
                 return true;
              }
           }
        return false;
     }

     /** this won't work in all situations */
     get containsListOfNumbers() {
        if (this instanceof Set || this instanceof ArithmeticSequence) {
           return true;
        }
        if (this instanceof Variable) return this.value.containsListOfNumbers;
        for (let child of this.children) {
           if (child.containsListOfNumbers) {
              return true;
           }
        }
        return false;
     }

     get isConstantOrVariable() {
        return this instanceof Variable || this instanceof ConstantSourceNode;
     }

     // #endregion

  }

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
        if (this.constructor === node.contructor) {
           if (this.name == node.name) {
              return true;
           }
        }
        return false;
     }
  }

  class Constant$1 extends Node {

      constructor(value, name_ = null) {
          super([], 0);
          this.syntaxType = 'literal';
          this.name = name_;
          this.value = value;
      }

      calculate(cs, tempVars) {
          return this.value;
      }

      derivative(cs) {
          return new Constant$1(0);
      }

      simplify() {
          return this;
      }

      isEqual(node) {
          if (this.constructor === node.contructor) {
              if (this.value === node.value) {
                  return true;
              }
          }
          return false;
      }

      toString() {
          return this.value.toString();
      }

  }

  class Variable$1 extends Node {
      constructor(name) {
          super([], 0);
          this.name = name;
          this.syntaxType = 'literal';
      }

      calculate(cs, tempVars) {
          /// Searching for temporary variables, like the variables that passed from a segma notation or passed into a function.
          for (let i = 0; i < tempVars.length; i++) {
              if (tempVars[i].key == this.name)
                  return tempVars[i].value.calculate(cs, tempVars);
          }
          /// Searching for existing varaibles in the <see cref="MathPackage.CalculationSettings">
          for (let i = 0; i < cs.vars.length; i++) {
              if (cs.vars[i].name == this.name)
                  return cs.vars[i].value.calculate(cs);
          }
          throw new Error(`\"${this.name}\" doesn't exist. :(`);
      }

      derivative(cs) {
          if (cs.derivatingVariable == this.name) return new Constant(1);

          for (let i = 0; i < cs.vars.length; i++) {
              if (cs.vars[i].name == this.name) {
                  return cs.vars[i].value.derivative(cs);
              }
          }

          return new Constant(0);
      }

      toString() {
          return this.name;
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

  class Vector$1 extends Node {

      constructor(x, y, _get = undefined, name_ = null) {
          super([], 0);
          this.syntaxType = 'literal';
          this.name = name_;
          this.x = x;
          this.y = y;
          this.get = _get;
      }

      calculate(cs, tempVars) {
          switch (get) {
              case 'x':
                  return this.x.calculate(cs, tempVars);
              case 'y':
                  return this.y.calculate(cs, tempVars);
          }
          return NaN;
      }

      derivative(cs) {
          return new Constant(0);
      }

      simplify() {
          return this;
      }

      isEqual(node) {
          return false;
      }

      toString() {
          return `(${this.x.toString()}, ${this.y.toString()})`;
      }

  }

  class ArithmeticSequence$1 extends Node {
      constructor(script, start, end, step) {
          super([], 0);
          this.syntaxType = 'literal';
          this.script = script;
          this.start = start;
          this.end = end;
          this.step = step;
      }

      calculate(cs, tempVars) {
          if (cs.vars[3].value.calculate(cs) <= this.length(cs, tempVars) && cs.vars[3].value.calculate(cs) >= 0)
              return this.start.calculate(cs, tempVars) + this.step.calculate(cs, tempVars) * cs.vars[3].value.calculate(cs);
          else throw new OutOfRangeException(`Index ${cs.vars[3].value.calculate(cs)} is out of the range ${"[" + 0 + "," + (Count(cs, tempVars) - 1) + "]"}`);
      }

      length(cs, tempVars) {
          return Math.floor((end.calculate(cs, tempVars) - this.start.calculate(cs, tempVars)) / this.step.calculate(cs, tempVars) + 1);
      }

      derivative(cs) {
          throw new NotImplementedException();
      }

      simplify() {
          return this;
      }

      isEqual(node) {
          if (this.constructor === node.contructor) {
              let arithmeticSequence = node;
              if (this.start.isEqual(arithmeticSequence.start) && this.end.isEqual(arithmeticSequence.end) && this.step.isEqual(arithmeticSequence.step)) {
                  return true;
              }
          }
          return false;
      }

      toString() {
          return this.script.toString();
      }
  }

  class Sum$1 extends Node {


      /**
       * 
       * @param {let} param 
       * @param {Array<Node>} this.children 
       */
      constructor(param, children)
      {
          super(children, 4);
          this.syntaxType = 'function';

          this.param = param;
          this.children = this.children;
      }
      calculate(cs, tempVars = [])
      {
          let sum = 0,
              start = this.children[0].calculate(cs, tempVars),
              end = this.children[1].calculate(cs, tempVars),
              step = this.children[2].calculate(cs, tempVars),
              valueToAdd;
          sum = start;
          //#region Preparing tempVars

          let tempvars = [...tempVars, { key: this.param, value: null}];

          //#endregion

          for (let i = 1; i <= Math.round((end-start)/step); i++)
          {
              tempvars[tempvars.length - 1].value = new Constant(start + (i * step));
              valueToAdd = this.children[3].calculate(cs, tempvars);
              if (isNaN(valueToAdd))
                  return NaN;
              sum += valueToAdd;
          }

          return sum;
      }

      derivative(cs)
      {
          return new Sum$1(
              this.param,
              [
                  this.children[0],
                  this.children[1],
                  this.children[2],
                  this.children[3].derivative(cs)
              ]);
      }
      
      simplify()
      {
          let children = [];
          for(let i = 0; i < this.children.length; i++)
          {
              this.children.push(this.children[i].simplify());
          }
          return new Sum$1(this.param , children);
      }

      isEqual(node)
      {
          if (node instanceof Sum$1)
          {
              for (let i = 0; i < this.children.length; i++)
              {
                  if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
              }
              return true;
          }
          return false;
      }

      toString()
      {
          if(this.children[2].toString() == "1")
              return this.type.toLowerCase() + "(" + this.param.toString() + ", " + this.children[0].toString() + ", " + this.children[1].toString() + ", " + this.children[3].toString() + ")";
          else
              return this.type.toLowerCase() + "(" + this.param.toString() + ", " + this.children[0].toString() + ", " + this.children[1].toString() + ", " + this.children[2].toString() + ", " + this.children[3].toString() + ")";
      }

  }

  class Sqrt$1 extends Node {

      constructor(children)
      {
          super(children, 1);
          this.syntaxType = 'function';
      }

      calculate(cs, tempVars) {
          return this.children[0].calculate(cs, tempVars) ** 0.5;
      }

      derivative(cs)
      {
          return new Divide(this.children[0].derivative(cs), new Multiply(new Constant(2), this));
      }

      toString()
      {
          return this.type.toLowerCase() + "(" + this.children[0].toString() + ")";
      }

      simplify()
      {
          return new Sqrt$1(this.children[0].simplify());
      }

      isEqual(node)
      {
          if(this.constructor === node.contructor)
          {
              for(let i = 0; i < this.children.length; i++)
              {
                  if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
              }
              return true;
          }
          return false;
      }

  }

  class Sign$1 extends Node {
      constructor(children){
          super(children, 1);
          this.syntaxType = 'function';
      }

      calculate(cs, tempVars) {
          return Math.sign(this.children[0].calculate(cs, tempVars));
      }

      derivative(cs) { new Constant(0); }

      simplify()
      {
          return new Sign$1(this.children[0].simplify());
      }

      isEqual(node)
      {
          if (this.constructor === node.contructor)
          {
              for (let i = 0; i < this.children.length; i++)
              {
                  if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
              }
              return true;
          }
          return false;
      }

      toString()
      {
          return this.type.toLowerCase() + "(" + this.children[0].toString() + ")";
      }

  }

  class Set$1 extends Node {
      
      constructor(items, allowRepetition_)
      {
          this.items = items;
          this.allowRepetition = allowRepetition_;

          // if there instanceof not repetition, go on.
          if (!allowRepetition)
          {
              if (this.simplifiedItems.length > 1)
              {
                  for (let i = 0; i < this.simplifiedItems.length - 1; i++)
                  {
                      for (let ii = i + 1; ii < items.length; ii++)
                      {
                          if (this.simplifiedItems[i].isEqual(this.simplifiedItems[ii]))
                          {
                              this.items = null;
                              throw new Error("There musn't be repetition in a Set of expressions.");
                          }
                      }
                  }
              }
          }
      }

      // #region Varaibles

      get items() {
          return this._items;
      }
      
      set items(value) {
          this._items = value;
          this.simplifiedItems = [];
          for(let item of value)
          {
              SimplifiedItems.push(item.simplify());
          }
      }

      get length() { return this.items != null ? this.items.length : 0;}              

      // #endregion

      calculate(cs, tempVars)
      {
          if (cs.vars[2].value.calculate(cs) < this.length && cs.vars[2].value.calculate(cs) >= 0)
              return this.items[cs.vars[2].value.calculate(cs)].calculate(cs, tempVars);
          else throw new OutOfRangeException(`Index ${ cs.vars[2].value.calculate(cs) } instanceof out of the range ${ "[" + 0 + "," + (this.length - 1) + "]" }`);
      }

      derivative(cs)
      {
          let items = [];
          for(let item of Items)
          {
              items.push(item.derivative(cs));
          }
          return new Set$1(items, allowRepetition);
      }

      simplify()
      {
          let items = [];
          for(let i = 0; i < this.length; i++)
          {
              items.Add(this.items[i].simplify());
          }

          return new Set$1(items, allowRepetition);
      }

      contains(item)
      {
          let sItem = item.simplify();
          for(let i = 0; i < this.length; i++)
          {
              if (this.simplifiedItems[i].isEqual(sItem))
              {
                  return true;
              }
          }
          return false;
      }

      /// <summary>
      /// This function for counting the given <see cref="Node"/>.
      /// </summary>
      /// <returns>return how many of the <see cref="Node"/> instanceof in the <see cref="Set"/></returns>
      count(node)
      {
          let num = 0;
          for(let item of this.items)
          {
              if (item.isEqual(node))
              {
                  num++;
              }
          }

          return num;
      }

      getItem(index)
      {
          return this.items[index];
      }

      isEqual(node)
      {
          if (this.constructor === node.contructor)
          {
              let set_ = node;
              if(this.length == set_.length)
              {
                  for (let i = 0; i < this.length; i++)
                  {
                      if (count(this.items[i]) != set_.count(this.items[i]))
                      {
                          return false;
                      }
                  }
                  return true;
              }
          }
          return false;
      }

      toString()
      {
          let Script = "{";

          if (this.length > 0)
          { 
              for (let i = 0; i < this.length; i++)
              {
                  Script += `${this.items[i]}, `;
              }
              Script = Script.Remove(Script.length - 2);
          }

          return Script + "}";
      }
      
  }

  class Round$1 extends Node {

      constructor(children)
      {
          super(children, 1);
          this.syntaxType = 'function';
      }

      calculate(cs, tempVars) {
          return Math.round(this.children[0].calculate(cs, tempVars));
      }

      derivative(cs)
      {
          return  new If(
                      new Equals(
                          new Mod(new Multiply(this.children[0], new Constant(2)),
                                  new Constant(1)),
                          new Constant(0)),
                  new Constant(NaN), new Constant(0));
      }

      simplify()
      {
          let sChild = this.children[0].simplify();

          if (sChild instanceof Floor || sChild instanceof Ceil || sChild instanceof Round$1)
          {
              return sChild;
          }
          if (sChild instanceof Constant) {
              return new Constant(Math.floor(sChild.value));
          }
          return new Round$1(sChild);
      }

      isEqual(node)
      {
          if (this.constructor === node.contructor)
          {
              for (let i = 0; i < this.children.length; i++)
              {
                  if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
              }
              return true;
          }
          return false;
      }

      toString()
      {
          return this.type.toLowerCase() + "(" + this.children[0].toString()  + ")";
      }

  }

  class Root extends Node {

      constructor(children){ 
          super(children, 2); 
          this.syntaxType = 'function';
      }
      
      calculate(cs, tempVars)
      {
          return Math.pow(this.children[0].calculate(cs, tempVars), 1 / this.children[1].calculate(cs, tempVars) );
      }

      derivative(cs)
      {
          return new Subtract(
                          // the first child of the subtraction
                          new Divide(
                              new Multiply(
                                  this.children[0].derivative(cs),
                                  new Power(this.children[0], new Divide(new Subtract(new Constant(1), this.children[1]), this.children[1]))
                                  ),
                              this.children[1]),
                      
                          // the second child of the subtraction
                          new Divide(
                              new Multiply(
                                  this.children[1].derivative(cs),
                                  new Multiply(
                                      this,
                                      new Ln(new Abs(this.children[0]))
                                      )
                                  ),
                              new Power(
                                  this.children[1],
                                  new Constant(2)
                                  )
                              )
              );
      }

      simplify()
      {
          return new Root(this.children[0].simplify(), this.children[1].simplify());
      }

      isEqual(node)
      {
          if (this.constructor === node.contructor)
          {
              for (let i = 0; i < this.children.length; i++)
              {
                  if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
              }
              return true;
          }
          return false;
      }

      toString()
      {
          return this.type.toLowerCase() + "(" + this.children[0].toString() + ", " + this.children[1].toString() + ")";
      }

  }

  class Random$1 extends Node {
      /**
       * @param {*} children 
       * @param {string} type 'double' or 'int' 
       */
      constructor(children, type = 'double') {
          super(children, -1);
          this.syntaxType = 'function';
          this.myType = type;
          if (this.children.length === 1 && this.children[0] instanceof Set) {
              this.myType = 'Set';            
          }
          if (this.children.length > 2) {
              this.myType = 'set';
          }
          this.limits = children.length;
      }
      
      calculate(cs, tempVars)
      {
          switch (this.myType) {
              case 'double':
                  if (this.children) {
                      if (this.limits === 1) {
                          let child1 = this.children[0].calculate(cs, tempVars);
                          return child1 > 0 ? random(0, child1) : random(child1, 0);
                      }
                      else if (this.limits === 2) {
                          let child1 = this.children[0].calculate(cs, tempVars),
                              child2 = this.children[0].calculate(cs, tempVars);
                          return random(child1, child2);
                      }
                  }
                  return random();
              case 'int':
                  if (this.children) {
                      if (this.limits === 1) {
                          let child1 = this.children[0].calculate(cs, tempVars);
                          return child1 > 0 ? Math.round(random(0, child1)) : Math.round(random(child1, 0));
                      }
                      else if (this.limits === 2) {
                          let child1 = this.children[0].calculate(cs, tempVars),
                              child2 = this.children[0].calculate(cs, tempVars);
                          return Math.round(random(child1, child2));
                      }
                  }
                  return Math.round(random()*10);
              case 'set':
                  {
                      let index = Math.round(random(0, this.children[0].length));
                      return this.children[index].calculate(cs, tempVars);
                  }
              case 'Set':
                  {
                      let index = Math.round(random(0, this.children[0].length));
                      return this.children[0].items[index].calculate(cs, tempVars);
                  }
          }
      }

      derivative(cs)
      {
          return new Constant(NaN);
      }

      simplify()
      {
          switch (this.children.length)
          {
              case 0:
                  return new Random$1(this.myType);
              case 1:
                  return new Random$1([this.children[0].simplify()], this.myType);
              //case 2:
              default:
                  return new Random$1([this.children[0].simplify(), this.children[1].simplify()], this.myType);
          }
      }

      isEqual(node)
      {
          if (this.constructor === node.contructor && this.myType === node.myType)
          {
              for (let i = 0; i < this.children.length; i++)
              {
                  if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
              }
              return true;
          }
          return false;
      }

      toString()
      {
          if (this.children.length === 0)
          {
              let type = myType === 'double' ? "" : myType.toString();
              return `random(${type})`;
          }
          else if (this.children.length === 1)
          {
              let type = myType === 'double' ? "" : ", " + myType.toString();
              return `random(${children[0]}${type})`;
          }
          else
          {
              let type = myType === 'double' ? "" : ", " + myType.toString();
              return this.type.toLowerCase() + "(" + this.children[0].toString() + ", " + this.children[1].toString() + this.myType + ")";
          }
      }
  }

  class Neg$1 extends Node {

      constructor(children){
          super(children, 1);
          this.syntaxType = 'function';
      }

      calculate(cs, tempVars)
      {
          return -this.children[0].calculate(cs, tempVars);
      }

      derivative(cs)
      {
          return new Neg$1(this.children[0].derivative(cs));
      }

      simplify()
      {
          let sChild = this.children[0].simplify();
          if(sChild instanceof Constant)
          {
              if(sChild.value === 0)
              {
                  return new Constant(0);
              } 
          }
          else if (sChild instanceof Neg$1)
          {
              return sChild.children[0];
          }
          return new Neg$1(sChild);
      }

      isEqual(node)
      {
          // Here we use this.simplify() - rather than this in the if condition - as Neg(0) instanceof the same as 0 and Neg(Neg(Node) instanceof the same as Node, so after simplification it will be the same.  
          let sMe = this.simplify(),
              sNode = node.simplify();
          if (sMe.this.type === sNode.this.type)
          {
              // as it may be Constant(0) or variable ___, there will be an Exception unless we do this.
              if (sMe instanceof Variable)
              {
                  if (sMe.isEqual(sNode)) return true;
              }
              else if (sMe.children != null)
              {
                  for (let i = 0; i < this.children.length; i++)
                  {
                      if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
                  }
              }
              return true;
          }
          return false;
      }

      toString()
      {
          let child = "";
          if (this.children[0].syntaxType == 'literal' || this.children[0].syntaxType == 'function')
              child = this.children[0].toString();
          else
              child = "(" + this.children[0].toString() + ")";
          return "-" + child;
      }

  }

  class Min$1 extends Node {
      constructor(set_)
      {
          super([set_], 1);
          this.syntaxType = 'function';
          this.items = set_.items;
      }

      calculate(cs, tempVars)
      {
          let min = 0, v = 0;
          for(let i = 0; i < this.children.length; i++)
          {
              v = this.children[i].calculate(cs, tempVars);
              if (v < min)
              {
                  min = v;
              }
          }
          return min;
      }

      derivative(cs)
      {
          if (this.children.length == 2)
          {
              return new If(new GreaterThan(this.children[0], this.children[1]), this.children[1].derivative(cs), this.children[0].derivative(cs));
          }
          else
          {
              return this.sub_process_1(0, cs);
          }
      }
      sub_process_1(index, cs)
      {
          if(index < this.children.length - 1)
          {
              return new If(new Equals(this, this.items[index]), this.items[index].derivative(cs), sub_process_1(index + 1, cs));
          }
          // if equals this.children.length - 1 "the last child index"
          else
          {
              return new If(new Equals(this, this.items[index]), this.items[index].derivative(cs), null);
          }
      }

      simplify()
      {
          return new Min$1(this.children[0].simplify());
      }

      isEqual(node)
      {
          if (this.constructor === node.contructor)
          {
              if (this.children[0].isEqual(node.children[0]))
                  return true;
          }
          return false;
      }

      toString()
      {
          return this.type.toLowerCase() + "(" + this.children[0].toString() + ")";
      }

  }

  class Max$1 extends Node {


      constructor(set_) {
          super([set_], 1);
          this.syntaxType = 'function';
          this.items = set_.items;
          this.children = set_;
    }

      calculate(cs, tempVars)
      {
          let max = this.items[0].calculate(cs, tempVars), v = 0;
          for (let i = 1; i < this.items.length; i++)
          {
              v = this.items[i].calculate(cs, tempVars);
              if (v > max)
              {
                  max = v;
              }
          }
          return max;
      }

      derivative(cs)
      {
          if (this.children.length == 2)
          {
              return new If(new GreaterThan(this.children[0], this.children[1]), this.children[0].derivative(cs), this.children[1].derivative(cs));
          }
          else
          {
              return this.sub_process_1(0, cs);
          }
      }
      sub_process_1(index, cs)
      {
          if (index < this.children.length - 1)
          {
              return new If(new Equals(this, this.children[index]), this.children[index].derivative(cs), sub_process_1(index + 1, cs));
          }
          // if equals this.children.length - 1 "the last child index"
          else
          {
              return new If(new Equals(this, this.children[index]), this.children[index].derivative(cs), null);
          }
      }

      simplify()
      {
          return new Max$1(this.children[0].simplify());
      }

      isEqual(node)
      {
          if (this.constructor === node.contructor)
          {
              if (this.children[0].isEqual(node.children[0]))
                  return true;
          }
          return false;
      }

      toString()
      {
          return this.type.toLowerCase() + "(" + this.children[0].toString() + ")";
      }

  }

  class Log$1 extends Node {
      constructor(children)
      {
          super(children, 2);
          this.syntaxType = 'function';
      }

      calculate(cs, tempVars)
      {
          return Math.Log(this.children[0].calculate(cs, tempVars), this.children[1].calculate(cs, tempVars));
      }

      derivative(cs)
      {
              return new Multiply(new Log$1(new Constant(Math.E) , this.children[1]), new Divide(this.children[0].derivative(cs), this.children[0]));
      }

      simplify()
      {
          return new Log$1(this.children[0].simplify(), this.children[1].simplify());
      }

      isEqual(node)
      {
          if (this.constructor === node.contructor)
          {
              for (let i = 0; i < this.children.length; i++)
              {
                  if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
              }
              return true;
          }
          else if (node.type == "Ln")
          {
              if (this.children[1].simplify().isEqual(new Constant(Math.E)))
                  if (this.children[0].simplify().isEqual(node.children[0].simplify()))
                      return true;
          }
          return false;
      }

      toString()
      {
          if (this.children[1] instanceof Constant && this.children[1].value == 10)
          {
              return this.type.toLowerCase() + "(" + this.children[0].toString() + ")";
          }
          else if (this.children[1] instanceof Constant && children[1].value == Math.E)
          {
              return "ln(" + this.children[1].toString() + ")";
          }
          else
              return this.type.toLowerCase() + "(" + this.children[0].toString() + ", " + this.children[1].toString() + ")";
      }
  }

  class Ln$1 extends Node {

      constructor(children)
      {
          super(children, 1);
          this.syntaxType = 'function';
      }

      calculate(cs, tempVars)
      {
          return Math.Log(this.children[0].calculate(cs, tempVars));
      }

      derivative(cs)
      {
          return new Divide(this.children[0].derivative(cs), this.children[0]);
      }

      simplify()
      {
          return new Ln$1(this.children[0].simplify());
      }

      isEqual(node)
      {
          if (this.constructor === node.contructor)
          {
              for (let i = 0; i < this.children.length; i++)
              {
                  if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
              }
              return true;
          }
          else if(node.type == "Log")
          {
              if (node.children[1].simplify().isEqual(new Constant(Math.E)))
                  if (node.children[0].simplify().isEqual(this.children[0].simplify()))
                      return true;
          }
          return false;
      }

      toString()
      {
          return this.type.toLowerCase() + "(" + this.children[0].toString() + ")";
      }


  }

  class LCM extends Node {
      constructor(children){
          super(children, 0);
          this.syntaxType = 'function';
          this.GCD = new GCD(children[0]);
      }
      get items() {
          return this.children.items;
      }

      calculate(cs, tempVars)
      {
          let product = 1;
          let a;
          for(let i = 0; i < this.items.length; i++)
          {
              a = this.items[i].calculate(cs, tempVars);
              if (mod(a, 1) != 0)
                  return NaN;
              product *= a;
          }
          return Math.abs(product) / Math.pow(this.GCD.calculate(cs, tempVars), this.items.length - 1);
      }
      mod(a, b)
      {
          if (b == 0)
          {
              return NaN;
          }
          return a - b * Math.floor(a / b);
      }

      derivative(cs)
      {
          return new Constant(NaN);
      }

      simplify()
      {
          return new LCM(this.children[0].simplify());
      }

      isEqual(node)
      {
          if (this.constructor === node.contructor)
          {
              if (this.children[0].isEqual(node.children[0]))
                  return true;
          }
          return false;
      }

      toString()
      {
          return this.type.toLowerCase() + "(" + this.children[0].toString() + ")";
      }

  }

  class If$1 extends Node {

      /**
       * condition, iftrue, iffalse
       */
      constructor()
      {
          super([condition, iftrue, iffalse], 3);
          this.syntaxType = 'function';
      }

      calculate(cs, tempVars)
      {
          let condition = this.children[0].calculate(cs, tempVars);
          if(isNaN(condition))
              return NaN;
          if (condition == 1)
          {
              return this.children[1].calculate(cs, tempVars);
          }
          else if (this.children[2] != null)
          {
              return this.children[2].calculate(cs, tempVars);
          }
          return NaN;
      }

      derivative(cs)
      {
              if (this.children[2] != null)
                  return new If$1(this.children[0], this.children[1].derivative(cs), this.children[2].derivative(cs));
              else
                  return new If$1(this.children[0], this.children[1].derivative(cs), null);
      }

      simplify()
      {
          return new If$1(this.children[0].simplify(), this.children[1].simplify(), this.children[2].simplify());
      }

      isEqual(node)
      {
          if (this.constructor === node.contructor)
          {
              for (let i = 0; i < this.children.length; i++)
              {
                  if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
              }
              return true;
          }
          return false;
      }

      toString()
      {
          if (this.children[2])
              return `if(${this.children[0]}, ${this.children[1]}, ${this.children[2]})`;
          else
              return `if(${this.children[0]}, ${this.children[1]})`;
      }

  }

  class GCD$1 extends Node {


      constructor(children) 
      {
          super(children, 2);
          this.syntaxType = 'function';
      }

      get items(){
          return this.children.items;
      }

      calculate(cs, tempVars)
      {
          let gcd_ = Math.abs(this.items[0].calculate(cs, tempVars));
          let a = Math.abs(this.items[1].calculate(cs, tempVars));
          if (mod(gcd_, 1) != 0 || mod(a, 1) != 0)
              return NaN;
          gcd_ = a > gcd_ ? this.gcd(a, gcd_) : this.gcd(gcd_, a);

          for (let i = 2; i < this.items.length; i++)
          {
              a = Math.round(Math.abs(this.items[i].calculate(cs, tempVars)));
              if (mod(a, 1) != 0)
                  return NaN;
              gcd_ = a > gcd_ ? gcd(a, gcd_) : gcd(gcd_, a);
          }

          return gcd_;
      }
      
      /// <summary>
      /// a instanceof greater than b
      /// </summary>
      gcd(a, b)
      {
          if(b == 0 || a == 0)
          {
              return a;
          }
          else if(a == b)
          {
              return a;
          }
          else if(mod(a ,b) == 0)
          {
              return b;
          }
          else
          {
              if(a - b > b)
              {
                  return gcd(a - b, b);
              }
              else
              {
                  return gcd(b, a - b);
              }
          }
      }
      mod(a, b)
      {
          if (b == 0)
          {
              return NaN;
          }
          return a - b * Math.floor(a / b);
      }

      derivative(cs)
      {
          return new Constant(NaN);
      }

      simplify()
      {
          return new GCD$1(this.children[0].simplify());
      }

      isEqual(node)
      {
          if (this.constructor === node.contructor)
          {
              if (this.children[0].isEqual(node.children[0]))
                  return true;
          }
          return false;
      }

      toString()
      {
          return this.type.toLowerCase() + "(" + this.children[0].toString() + ")";
      }

  }

  class Func$1 extends Node {

      constructor(name, args) {
          super(args, 0);
          this.syntaxType = 'function';
          this.name = name;
      }

      calculate(cs, tempVars) {

          // Searching in the {Functions}
          for (let i = 0; i < cs.funcs.length; i++) {
              if (cs.funcs[i].name == this.name) {
                  return cs.funcs[i].calculate(this.children, cs, tempVars);
              }
          }

          throw new Error(`Your function ${this.name} does not exist.`);
      }

      derivative(cs) {
          // Searching in the {Functions}
          for (let i = 0; i < cs.funcs.length; i++) {
              if (cs.funcs[i].name == name) {
                  return this.replace(cs.funcs[i].process, cs.funcs[i].args, this.children).derivative(cs);
              }
          }
          return new Constant(NaN);
      }
      replace(node, variablesToReplace, NodeToReplaceWith) {
          if (node instanceof Variable) {
              for (let i = 0; i < variablesToReplace.length; i++) {
                  if (variablesToReplace[i] == node.name) {
                      return NodeToReplaceWith[i];
                  }
              }
          }
          else if (node.children && node.children.length > 0) {
              for (let i = 0; i < node.children.length; i++) {
                  node.children[i] = this.replace(node.children[i], variablesToReplace, NodeToReplaceWith);
              }
              return node;
          }
          return node;
      }

      simplify() {
          return new Func$1(this.name, this.children[0].simplify());
      }

      isEqual(node) {
          if (this.constructor === node.contructor) {
              if (this.name === node.name) {
                  if (this.children && node.children && this.children.length == node.children.length) {
                      for (let i = 0; i < this.children.length; i++) {
                          if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
                      }
                      return true;
                  }
                  else return true;
              }
          }
          return false;
      }

      toString() {
          let args = "";
          for (let i = 0; i < this.children.length; i++) {
              if (args == "") {
                  args += this.children[i].toString();
              }
              else {
                  args += ", " + this.children[i].toString();
              }
          }
          return this.name + "(" + args + ")";
      }


  }

  class CalcFunc
  {

      get args(){
          return this._args;
      }

      set args(value) {
          this._args = value;
          if(value)
              for (let sy of value)
              {
                  this.argsDic = [];
                  this.argsDic.push({ key: sy, value: null});
              }
      }
      
      constructor(name, argsNames, process)
      {
          this.name = name;
          this.args = argsNames;
          this.process = process;
      }

      calculate(argsValues, cs, tempVars)
      {
          
          // #region Preparing tempVars
          
          for(let i = 0; i < this.args.length;i++)
          {
              this.argsDic[i].value = new Constant(argsValues[i].calculate(cs, tempVars));
          }

          // #endregion

          return Process.calculate(cs, this.argsDic);

      }

      toString()
      {
          let args = "";
          for (let arg of this.args)
          {
              if (args == "")
                  args += arg.toString();
              else
                  args += ", " + arg.toString();
          }
          return `${this.name.toString()}(${args}) = ${Process.toString()}`;
      }
  }

  class Floor$1 extends Node {

      constructor(children) {
          super(children, 1);
          this.syntaxType = 'function';
      }
      calculate(cs, tempVars) {
          return Math.floor(this.children[0].calculate(cs, tempVars));
      }

      derivative(cs) {
          return new If(new Equals(new Mod(this.children[0], new Constant(1)), new Constant(0)), new Constant(NaN), new Constant(0));
      }

      simplify() {
          let sChild = this.children[0].simplify();

          if (sChild instanceof Floor$1 || sChild instanceof Ceil || sChild instanceof Round) {
              return sChild;
          }

          return new Floor$1(sChild);
      }

      isEqual(node) {
          if (this.constructor === node.contructor) {
              for (let i = 0; i < this.children.length; i++) {
                  if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
              }
              return true;
          }
          return false;
      }

      toString() {
          return this.type.toLowerCase() + "(" + this.children[0].toString() + ")";
      }

  }

  class Exp$1 extends Node {

      constructor(children) {
          super(children, 1);
          this.syntaxType = 'function';
      }

      calculate(cs, tempVars) {
          return Math.exp(this.children[0].calculate(cs, tempVars));
      }

      derivative(cs) {
          return new Multiply(this.children[0].derivative(cs), this);
      }

      simplify() {
          return new Exp$1(this.children[0].simplify());
      }

      isEqual(node) {
          if (this.constructor === node.contructor) {
              for (let i = 0; i < this.children.length; i++) {
                  if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
              }
              return true;
          }
          else if (node.type == "Power") {
              if (node.children[0].simplify().isEqual(new Constant(Math.E))) {
                  if (node.children[1].simplify().isEqual(this.children[0].simplify())) return true;
              }
          }
          return false;
      }

      toString() {
          return this.type.toLowerCase() + "(" + this.children[0].toString() + ")";
      }

  }

  class Derivate$1 extends Node {

      constructor(expression, cs)
      {
          super(expression, 1);
          this.syntaxType = 'function';
          this.derivative = this.children[0].derivative(cs);
          this.cs = cs;
      }

      calculate(cs, tempVars)
      {
          return this.derivative.calculate(cs, tempVars);
      }

      derivative(cs)
      {
              return this.derivative.derivative(cs);
      }

      simplify()
      {
          return new Derivate$1(this.children[0].simplify(), this.cs);
      }

      isEqual(node)
      {
          if (this.constructor === node.contructor)
          {
              for (let i = 0; i < this.children.length; i++)
              {
                  if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
              }
              return true;
          }
          return false;
      }

      toString()
      {
          let args = "";
          for (let i = 0; i < this.children.Count(); i++)
          {
              if (args == "")
              {
                  args += this.children[i].toString();
              }
              else
              {
                  args += ", " + this.children[i].toString();
              }
          }
          return this.name + "(" + args + ")";
      }


  }

  class Constrain$1 extends Node {
      constructor(children)
      {
          super(children, 3);
          this.syntaxType = 'function';
          this.num = new Array(3).fill(0);
      }

      calculate(cs, tempVars)
      {
          this.num[0] = this.children[0].calculate(cs, tempVars);
          this.num[1] = this.children[1].calculate(cs, tempVars);
          this.num[2] = this.children[2].calculate(cs, tempVars);
          if(num[1] <= num[2])
          {
              return Math.Min(Math.Max(num[1], num[0]), num[2]);
          }
          else
          {
              return num[0];
          }
      }

      derivative(cs)
      {
          return new Constrain$1([ this.children[0].derivative(cs), this.children[1], this.children[2] ]);
      }

      simplify()
      {
          return new Constrain$1([ this.children[0].simplify(), this.children[1].simplify(), this.children[2].simplify() ]);
      }

      isEqual(node)
      {
          if (this.constructor === node.contructor)
          {
              for (let i = 0; i < this.children.length; i++)
              {
                  if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
              }
              return true;
          }
          return false;
      }

      toString()
      {
          return this.type.toLowerCase() + "(" + this.children[0].toString()  + ")";
      }

  }

  class Abs$1 extends Node {

      constructor(children)
      {
          super(children, 1);
          this.syntaxType = 'function';
      }

      calculate(cs, tempVars)
      {
          return Math.abs(this.children[0].calculate(cs, tempVars));
      }

      derivative(cs) {
              return new Multiply(
                  new If(new GreaterEquals(this.children[0], new Constant(0)),
                         new Constant(1), new Constant(-1)),
                         this.children[0].derivative(cs));
      }

      simplify()
      {
          let sChild = this.children[0].simplify();
          if (sChild instanceof Abs$1)
          {
              return sChild;
          }
          else if (sChild instanceof Constant)
          {
              if (sChild.value >= 0)
              {
                  return sChild;
              }
              else
              {
                  return new Constant(-sChild.value);
              }
          }
          return new Abs$1(sChild);
      }

      isEqual(node)
      {
          if (this.constructor === node.contructor)
          {
              for (let i = 0; i < this.children.length; i++)
              {
                  if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
              }
              return true;
          }
          return false;
      }

      toString()
      {
          return this.type.toLowerCase() + "(" + this.children[0].toString() + ")";
      }

  }

  class Acos$1 extends Node {
      constructor(children) {
          super(children, 1);
          this.syntaxType = 'function';
      }
      calculate(cs, tempVars) {
          switch (cs.angleType) {
              case 'DEG':
                  return Math.acos(this.children[0].calculate(cs, tempVars)) * 180 / Math.PI;
              case 'GRAD':
                  return Math.acos(this.children[0].calculate(cs, tempVars)) * 200 / Math.PI;
              default:
                  return Math.acos(this.children[0].calculate(cs, tempVars));
          }
      }

      derivative(cs) {
          return new Neg(new Multiply(this.children[0].derivative(cs), new Csc(this)));
      }

      simplify() {
          return new Acos$1(this.children[0].simplify());
      }

      isEqual(node) {
          if (this.constructor === node.contructor) {
              for (let i = 0; i < this.children.length; i++) {
                  if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
              }
              return true;
          }
          return false;
      }

      toString() {
          return this.type.toLowerCase() + "(" + this.children[0].toString() + ")";
      }

  }

  class Asin$1 extends Node {
      constructor(children) {
          super(children, 1);
          this.syntaxType = 'function';
      }

      calculate(cs, tempVars) {
          switch (cs.angleType) {
              case 'DEG':
                  return Math.asin(this.children[0].calculate(cs, tempVars)) * 180 / Math.PI;
              case 'GRAD':
                  return Math.asin(this.children[0].calculate(cs, tempVars)) * 200 / Math.PI;
              default:
                  return Math.asin(this.children[0].calculate(cs, tempVars));
          }
      }

      derivative(cs) {
          return new Multiply(this.children[0].derivative(cs), new Sec(this));
      }

      simplify() {
          return new Asin$1(this.children[0].simplify());
      }

      isEqual(node) {
          if (this.constructor === node.contructor) {
              for (let i = 0; i < this.children.length; i++) {
                  if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
              }
              return true;
          }
          return false;
      }

      toString() {
          return this.type.toLowerCase() + "(" + this.children[0].toString() + ")";
      }

  }

  class Atan$1 extends Node {

      constructor(children) {
          super(children, 1);
          this.syntaxType = 'function';
      }

      calculate(cs, tempVars) {
          switch (cs.angleType) {
              case 'DEG':
                  return Math.atan(this.children[0].calculate(cs, tempVars)) * 180 / Math.PI;
              case 'GRAD':
                  return Math.atan(this.children[0].calculate(cs, tempVars)) * 200 / Math.PI;
              default:
                  return Math.atan(this.children[0].calculate(cs, tempVars));
          }
      }

      derivative(cs) {
          return new Multiply(this.children[0].derivative(cs), new Power(new Cos(this), new Constant(2)));
      }

      simplify() {
          return new Atan$1(this.children[0].simplify());
      }

      isEqual(node) {
          if (this.constructor === node.contructor) {
              for (let i = 0; i < this.children.length; i++) {
                  if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
              }
              return true;
          }
          return false;
      }

      toString() {
          return this.type.toLowerCase() + "(" + this.children[0].toString() + ")";
      }

  }

  class Cos$1 extends Node {
      constructor(children) {
          super(children, 1);
          this.syntaxType = 'function';
      }

      calculate(cs, tempVars) {
          switch (cs.angleType) {
              case 'DEG':
                  return Math.cos(this.children[0].calculate(cs, tempVars) / 180 * Math.PI);
              case 'GRAD':
                  return Math.cos(this.children[0].calculate(cs, tempVars) / 200 * Math.PI);
              default:
                  return Math.cos(this.children[0].calculate(cs, tempVars));
          }
      }

      derivative(cs) {
          return new Neg(new Multiply(this.children[0].derivative(cs), new Sin(this.children[0])));
      }

      simplify() {
          return new Cos$1(this.children[0].simplify());
      }

      isEqual(node) {
          if (this.constructor === node.contructor) {
              for (let i = 0; i < this.children.length; i++) {
                  if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
              }
              return true;
          }
          return false;
      }

      toString() {
          return this.type.toLowerCase() + "(" + this.children[0].toString() + ")";
      }
  }

  class Cot$1 extends Node {
      constructor(children) {
          super(children, 1);
          this.syntaxType = 'function';
      }

      calculate(cs, tempVars) {
          switch (cs.angleType) {
              case 'DEG':
                  return 1 / Math.tan(this.children[0].calculate(cs, tempVars) / 180 * Math.PI);
              case 'GRAD':
                  return 1 / Math.tan(this.children[0].calculate(cs, tempVars) / 200 * Math.PI);
              default:
                  return 1 / Math.tan(this.children[0].calculate(cs, tempVars));
          }
      }

      derivative(cs) {
          return new Multiply(this.children[0].derivative(cs), new Neg(new Power(new Csc(this.children[0]), new Constant(2))));
      }

      simplify() {
          return new Cot$1(this.children[0].simplify());
      }

      isEqual(node) {
          if (this.constructor === node.contructor) {
              for (let i = 0; i < this.children.length; i++) {
                  if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
              }
              return true;
          }
          return false;
      }

      toString() {
          return this.type.toLowerCase() + "(" + this.children[0].toString() + ")";
      }
  }

  class Csc$1 extends Node {
      constructor(children) {
          super(children, 1);
          this.syntaxType = 'function';
      }

      calculate(cs, tempVars) {
          switch (cs.angleType) {
              case 'DEG':
                  return 1 / Math.sin(this.children[0].calculate(cs, tempVars) / 180 * Math.PI);
              case 'GRAD':
                  return 1 / Math.sin(this.children[0].calculate(cs, tempVars) / 200 * Math.PI);
              default:
                  return 1 / Math.sin(this.children[0].calculate(cs, tempVars));
          }
      }

      derivative(cs) {
          return new Multiply(this.children[0].derivative(cs), new Neg(new Multiply(new Csc$1(this.children[0]), new Cot(this.children[0]))));
      }

      simplify() {
          return new Csc$1(this.children[0].simplify());
      }

      isEqual(node) {
          if (this.constructor === node.contructor) {
              for (let i = 0; i < this.children.length; i++) {
                  if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
              }
              return true;
          }
          return false;
      }

      toString() {
          return this.type.toLowerCase() + "(" + this.children[0].toString() + ")";
      }
  }

  class Sec$1 extends Node {
      constructor(children) {
          super(children, 1);
          this.syntaxType = 'function';
      }

      calculate(cs, tempVars) {
          switch (cs.angleType) {
              case 'DEG':
                  return 1 / Math.cos(this.children[0].calculate(cs, tempVars) / 180 * Math.PI);
              case 'GRAD':
                  return 1 / Math.cos(this.children[0].calculate(cs, tempVars) / 200 * Math.PI);
              default:
                  return 1 / Math.cos(this.children[0].calculate(cs, tempVars));
          }
      }

      derivative(cs) {
          return new Multiply(this.children[0].derivative(cs), new Multiply(new Sec$1(this.children[0]), new Tan(this.children[0])));
      }

      simplify() {
          return new Sec$1(this.children[0].simplify());
      }

      isEqual(node) {
          if (this.constructor === node.contructor) {
              for (let i = 0; i < this.children.length; i++) {
                  if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
              }
              return true;
          }
          return false;
      }

      toString() {
          return this.type.toLowerCase() + "(" + this.children[0].toString() + ")";
      }
  }

  class Sin$1 extends Node {

      constructor(children) {
          super(children, 1);
          this.syntaxType = 'function';
      }

      calculate(cs, tempVars) {
          switch (cs.angleType) {
              case 'DEG':
                  return Math.sin(this.children[0].calculate(cs, tempVars) / 180 * Math.PI);
              case 'GRAD':
                  return Math.sin(this.children[0].calculate(cs, tempVars) / 200 * Math.PI);
              default:
                  return Math.sin(this.children[0].calculate(cs, tempVars));
          }
      }

      derivative(cs) {
          return new Multiply(this.children[0].derivative(cs), new Cos(this.children[0]));
      }

      simplify() {
          return new Sin$1(this.children[0].simplify());
      }

      isEqual(node) {
          if (this.constructor === node.contructor) {
              for (let i = 0; i < this.children.length; i++) {
                  if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
              }
              return true;
          }
          return false;
      }

      toString() {
          return this.type.toLowerCase() + "(" + this.children[0].toString() + ")";
      }
  }

  class Tan$1 extends Node {
      constructor(children) {
          super(children, 1);
          this.syntaxType = 'function';
      }
      calculate(cs, tempVars) {
          switch (cs.angleType) {
              case 'DEG':
                  return Math.tan(this.children[0].calculate(cs, tempVars) / 180 * Math.PI);
              case 'GRAD':
                  return Math.tan(this.children[0].calculate(cs, tempVars) / 200 * Math.PI);
              default:
                  return Math.tan(this.children[0].calculate(cs, tempVars));
          }
      }

      derivative(cs) {
          return new Multiply(this.children[0].derivative(cs), new Power(new Sec(this.children[0]), new Constant(2)));
      }

      simplify() {
          return new Tan$1(this.children[0].simplify());
      }

      isEqual(node) {
          if (this.constructor === node.contructor) {
              for (let i = 0; i < this.children.length; i++) {
                  if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
              }
              return true;
          }
          return false;
      }

      toString() {
          return this.type.toLowerCase() + "(" + this.children[0].toString() + ")";
      }
  }

  class Add$1 extends Node {
      constructor(children) {
          super(children, 2);
          this.type = 'operator';
      }

      calculate(cs, tempVars) {
          return this.children[0].calculate(cs, tempVars) + this.children[1].calculate(cs, tempVars);
      }

      derivative(cs) {
          return new Add$1(this.children[0].derivative(cs), this.children[1].derivative(cs));
      }

      simplify() {
          let sChild1 = this.children[0].simplify(),
              sChild2 = this.children[1].simplify();

          if (sChild1.isEqual(new Constant(0))) {
              return sChild2;
          }
          else if (sChild2.isEqual(new Constant(0))) {
              return sChild1;
          }
          else if (sChild1 instanceof Constant && sChild2 instanceof Constant) {
              return new Constant(sChild1.value + sChild2.value);
          }
          else if (sChild1 instanceof Neg) {
              return new Subtract(sChild2, sChild1.children[0]);
          }
          else if (sChild2 instanceof Neg) {
              return new Subtract(sChild1, sChild2.children[0]);
          }


          return new Add$1(sChild1, sChild2);
      }

      isEqual(node) {
          if (!this.containsVariable) {
              if (!node.containsVariable) {
                  let cal = new calculationSettings();
                  if (calculate(cal) == node.calculate(cal)) {
                      return true;
                  }
              }
              else return false;
          }
          else if (this.constructor === node.contructor) {
              for (let i = 0; i < this.children.length; i++) {
                  if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
              }
              return true;
          }
          return false;
      }

      toString() {
          let child1 = "", child2 = "";
          child1 = this.children[0].toString();
          child2 = this.children[1].toString();
          return child1 + " + " + child2;
      }

  }

  class Divide$1 extends Node {
      constructor(children) {
          super(children, 2);
          this.type = 'operator';
      }

      calculate(cs, tempVars) {
          try {
              return this.children[0].calculate(cs, tempVars) / this.children[1].calculate(cs, tempVars);
          }
          catch (e) {
              return NaN;
          }
      }

      derivative(cs) {
          return new Divide$1(
              new Subtract(
                  new Multiply(this.children[1], this.children[0].derivative(cs)),
                  new Multiply(this.children[0], this.children[1].derivative(cs))),

              new Power(this.children[1], new Constant(2)));
      }

      simplify() {
          let numerator;
          let denominator;

          let fraction = this.Get_Num_Denom(this);
          numerator = fraction[0].simplify();
          denominator = fraction[1].simplify();

          /// there will be a sequence of multiplication and the denomirator will be {Constant(1);}
          if (denominator.Sequence.Count == 0) ;

          let sChild1 = this.children[0].simplify();
          let sChild2 = this.children[1].simplify();

          if (sChild1.isEqual(new Constant(0))) {
              return new Constant(0);
          }
          else if (sChild2.isEqual(new Constant(1))) {
              return sChild1;
          }
          else if (sChild1.isEqual(sChild2)) {
              return new Constant(1);
          }

          // #region Trigonmetric functions

          // Checking for the this.children
          if (sChild1.children != null && sChild2.children != null && sChild1.children.length == sChild2.children.length && sChild1.children[0].isEqual(sChild2.children[0])) {
              // Sin
              if (sChild1 instanceof Sin && sChild2 instanceof Cos) {
                  return new Tan(sChild1.children[0]);
              }
              else if (sChild1 instanceof Sin && sChild2 instanceof Tan) {
                  return new Cos(sChild1.children[0]);
              }
              else if (sChild1 instanceof Sin && sChild2 instanceof Csc) {
                  return new Power(sChild1, new Constant(2));
              }

              // Cos
              if (sChild1 instanceof Cos && sChild2 instanceof Sin) {
                  return new Cot(sChild1.children[0]);
              }
              else if (sChild1 instanceof Cos && sChild2 instanceof Csc) {
                  return new Cot(sChild1.children[0]);
              }
              else if (sChild1 instanceof Cos && sChild2 instanceof Sec) {
                  return new Power(sChild1, new Constant(2));
              }
              else if (sChild1 instanceof Cos && sChild2 instanceof Cot) {
                  return new Cot(sChild1.children[0]);
              }

              // Tan
              if (sChild1 instanceof Tan && sChild2 instanceof Sin) {
                  return new Tan(sChild1.children[0]);
              }
              else if (sChild1 instanceof Tan && sChild2 instanceof Cos) {
                  return new Cot(sChild1.children[0]);
              }
              else if (sChild1 instanceof Tan && sChild2 instanceof Csc) {
                  return new Cot(sChild1.children[0]);
              }
              else if (sChild1 instanceof Tan && sChild2 instanceof Sec) {
                  return new Cot(sChild1.children[0]);
              }
              else if (sChild1 instanceof Tan && sChild2 instanceof Cot) {
                  return new Power(sChild1, new Constant(2));
              }

              // Csc
              if (sChild1 instanceof Csc && sChild2 instanceof Sin) {
                  return new Power(sChild1, new Constant(2));
              }
              else if (sChild1 instanceof Csc && sChild2 instanceof Cos) {
                  return new Cot(sChild1.children[0]);
              }
              else if (sChild1 instanceof Csc && sChild2 instanceof Tan) {
                  return new Cot(sChild1.children[0]);
              }
              else if (sChild1 instanceof Csc && sChild2 instanceof Sec) {
                  return new Cot(sChild1.children[0]);
              }
              else if (sChild1 instanceof Csc && sChild2 instanceof Cot) {
                  return new Cot(sChild1.children[0]);
              }

              // Sec
              if (sChild1 instanceof Sec && sChild2 instanceof Sin) {
                  return new Tan(sChild1.children[0]);
              }
              else if (sChild1 instanceof Sec && sChild2 instanceof Cos) {
                  return new Power(sChild1, new Constant(2));
              }
              else if (sChild1 instanceof Sec && sChild2 instanceof Tan) {
                  return new Cot(sChild1.children[0]);
              }
              else if (sChild1 instanceof Sec && sChild2 instanceof Csc) {
                  return new Cot(sChild1.children[0]);
              }
              else if (sChild1 instanceof Sec && sChild2 instanceof Cot) {
                  return new Cot(sChild1.children[0]);
              }

              // Cot
              if (sChild1 instanceof Cot && sChild2 instanceof Sin) {
                  return new Tan(sChild1.children[0]);
              }
              else if (sChild1 instanceof Cot && sChild2 instanceof Cos) {
                  return new Cot(sChild1.children[0]);
              }
              else if (sChild1 instanceof Cot && sChild2 instanceof Tan) {
                  return new Power(sChild1, new Constant(2));
              }
              else if (sChild1 instanceof Cot && sChild2 instanceof Csc) {
                  return new Cot(sChild1.children[0]);
              }
              else if (sChild1 instanceof Cot && sChild2 instanceof Sec) {
                  return new Cot(sChild1.children[0]);
              }
          }
          //#endregion

          //#region Division of Mult  :  (.1. * .2.)/(.3. * .4.)

          if (sChild1 instanceof Multiply) ;
          else if (sChild2 instanceof Multiply) ;


          //#endregion

          if (sChild2 instanceof Neg) {
              return new Divide$1(new Neg(sChild1), sChild2.children[0]).simplify();
          }

          return new Divide$1(sChild1, sChild2);
      }

      Get_Num_Denom(multOrDiv) {
          let numerator, denominator;
          [numerator, denominator] = this.sub_Get_Num_Denom(multOrDiv, numerator, denominator, true);
          return [new SequenceOfMult(numerator), new SequenceOfMult(denominator)];
      }
      /// <summary>
      /// 
      /// </summary>
      /// <param name="atNumerator">it instanceof a property for the multOrDiv</param>
      /// <returns></returns>
      sub_Get_Num_Denom(multOrDiv, numerator, denominator, atNumerator) {

          if (multOrDiv.children[0] instanceof Multiply || multOrDiv.children[0] instanceof Divide$1) {
              if (atNumerator) {
                  [numerator, denominator] = this.sub_Get_Num_Denom(multOrDiv.children[0], numerator, denominator, true);
              }
              else {
                  [numerator, denominator] = this.sub_Get_Num_Denom(multOrDiv.children[0], numerator, denominator, false);
              }
          }
          else {
              if (atNumerator) {
                  numerator.Add(multOrDiv.children[0]);
              }
              else {
                  denominator.Add(multOrDiv.children[0]);
              }
          }

          if (multOrDiv.children[1] instanceof Multiply || multOrDiv.children[1] instanceof Divide$1) {
              if (multOrDiv instanceof Multiply) {
                  if (atNumerator) {
                      [numerator, denominator] = this.sub_Get_Num_Denom(multOrDiv.children[1], numerator, denominator, true);
                  }
                  else {
                      [numerator, denominator] = this.sub_Get_Num_Denom(multOrDiv.children[1], numerator, denominator, false);
                  }
              }
              else {
                  if (atNumerator) {
                      [numerator, denominator] = this.sub_Get_Num_Denom(multOrDiv.children[1], numerator, denominator, false);
                  }
                  else {
                      [numerator, denominator] = this.sub_Get_Num_Denom(multOrDiv.children[1], numerator, denominator, true);
                  }
              }
          }
          else {
              if (multOrDiv instanceof Multiply) {
                  if (atNumerator) {
                      numerator.Add(multOrDiv.children[1]);
                  }
                  else {
                      denominator.Add(multOrDiv.children[1]);
                  }
              }
              else {
                  if (atNumerator) {
                      denominator.Add(multOrDiv.children[1]);
                  }
                  else {
                      numerator.Add(multOrDiv.children[1]);
                  }
              }
          }

      }

      isEqual(node) {
          if (!this.containsVariable) {
              if (!node.containsVariable) {
                  let cal = new calculationSettings();
                  if (calculate(cal) == node.calculate(cal)) {
                      return true;
                  }
              }
              else return false;
          }
          else if (this.constructor === node.contructor) {
              for (let i = 0; i < this.children.length; i++) {
                  if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
              }
              return true;
          }
          return false;
      }

      toString() {
          let child1 = "", child2 = "";

          if (this.children[0].syntaxType == 'literal' || this.children[0].syntaxType == 'function')
              child1 = this.children[0].toString();
          else
              child1 = "(" + this.children[0].toString() + ")";

          if (this.children[1].syntaxType == 'literal' || this.children[1].syntaxType == 'function')
              child2 = this.children[1].toString();
          else
              child2 = "(" + this.children[1].toString() + ")";


          return child1 + " / " + child2;
      }
  }

  class Factorial$1 extends Node {

      constructor(children) {
          super(children, 1);
          this.type = 'literal';
      }

      calculate(cs, tempVars) {
          return this.F(this.children[0].calculate(cs, tempVars));
      }
      F(n) { return n <= 1 ? 1 : n * this.F(n - 1); }

      derivative(cs) { return new Constant(NaN); }

      simplify() {
          return this;
      }

      isEqual(node) {
          return false;
      }

      toString() {
          return `(${this.children[0]})!`;
      }

  }

  class Mod$1 extends Node {

      constructor(children) {
          super(children, 2);
          this.type = 'operator';
      }

      calculate(cs, tempVars) {
          return this.mod(this.children[0].calculate(cs, tempVars), this.children[1].calculate(cs, tempVars));
      }

      mod(a, b) {
          return a - b * Math.floor(a / b);
      }

      derivative(cs) {
          return new Subtract(
              this.children[0].derivative(cs),
              new Multiply(this.children[1].derivative(cs), new Floor(new Divide(this.children[0], this.children[1])))
          );
      }

      simplify() {
          return new Mod$1(this.children[0].simplify(), this.children[1].simplify());
      }

      isEqual(node) {
          if (this.constructor === node.contructor) {
              for (let i = 0; i < this.children.length; i++) {
                  if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
              }
              return true;
          }
          return false;
      }

      toString() {
          let child1 = "", child2 = "";

          if (this.children[0].syntaxType == 'literal' || this.children[0].syntaxType == 'function')
              child1 = this.children[0].toString();
          else
              child1 = "(" + this.children[0].toString() + ")";

          if (this.children[1].syntaxType == 'literal' || this.children[1].syntaxType == 'function')
              child2 = this.children[1].toString();
          else
              child2 = "(" + this.children[1].toString() + ")";


          return child1 + " mod " + child2;
      }
  }

  class Multiply$1 extends Node {
      constructor(children) {
          super(children, 2);
          this.type = 'operator';
      }

      calculate(cs, tempVars) {
          return this.children[0].calculate(cs, tempVars) * this.children[1].calculate(cs, tempVars);
      }

      derivative(cs) {
          return new Add(
              new Multiply$1(this.children[0], this.children[1].derivative(cs)),
              new Multiply$1(this.children[1], this.children[0].derivative(cs))
          );
      }

      toString() {
          let child1 = "", child2 = "";

          if (this.children[0].syntaxType == 'literal' || this.children[0].syntaxType == 'function')
              child1 = this.children[0].toString();
          else
              child1 = "(" + this.children[0].toString() + ")";

          if (this.children[1].syntaxType == 'literal' || this.children[1].syntaxType == 'function')
              child2 = this.children[1].toString();
          else
              child2 = "(" + this.children[1].toString() + ")";

          return child1 + " * " + child2;
      }

      simplify() {
          return this;
      }

      isEqual(node) {
          return false;
      }
  }

  class nCr$1 extends Node {
      constructor(children) {
          super(children, 2);
          this.type = 'operator';
      }

      calculate(cs, tempVars) {
          return this.C_(this.children[0].calculate(cs, tempVars), this.children[1].calculate(cs, tempVars));
      }

      C_(n, k) {
          if (k > n)
              return 0;
          k = Math.Min(k, n - k);
          let result = 1;
          for (let d = 1; d <= k; ++d) {
              result *= n--;
              result /= d;
          }
          return result;
      }

      derivative(cs) { return new Constant(NaN); }

      simplify() {
          return new nCr$1(this.children[0].simplify(), this.children[1].simplify());
      }

      isEqual(node) {
          if (this.constructor === node.contructor) {
              for (let i = 0; i < this.children.length; i++) {
                  if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
              }
              return true;
          }
          return false;
      }

      toString() {
          let child1 = "", child2 = "";

          if (this.children[0].syntaxType == 'literal' || this.children[0].syntaxType == 'function')
              child1 = this.children[0].toString();
          else
              child1 = "(" + this.children[0].toString() + ")";

          if (this.children[1].syntaxType == 'literal' || this.children[1].syntaxType == 'function')
              child2 = this.children[1].toString();
          else
              child2 = "(" + this.children[1].toString() + ")";


          return child1 + " C " + child2;
      }

  }

  class nPr$1 extends Node {
      constructor(children) {
          super(children, 2);
          this.type = 'operator';
      }
      calculate(cs, tempVars) {
          return this.P_(this.children[0].calculate(cs, tempVars), this.children[1].calculate(cs, tempVars));
      }
      P_(n, k) {
          return k <= 0 ? 1 : k > n ? 0 : n * P_(n - 1, k - 1);
      }


      derivative(cs) { return new Constant(NaN); }

      simplify() {
          return new nPr$1(this.children[0].simplify(), this.children[1].simplify());
      }

      isEqual(node) {
          if (this.constructor === node.contructor) {
              for (let i = 0; i < this.children.length; i++) {
                  if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
              }
              return true;
          }
          return false;
      }

      toString() {
          let child1 = "", child2 = "";

          if (this.children[0].syntaxType == 'literal' || this.children[0].syntaxType == 'function')
              child1 = this.children[0].toString();
          else
              child1 = "(" + this.children[0].toString() + ")";

          if (this.children[1].syntaxType == 'literal' || this.children[1].syntaxType == 'function')
              child2 = this.children[1].toString();
          else
              child2 = "(" + this.children[1].toString() + ")";


          return child1 + " P " + child2;
      }
  }

  class Power$1 extends Node {
      constructor(children) {
          super(children, 2);
          this.type = 'operator';
      }

      calculate(cs, tempVars) {
          return Math.pow(this.children[0].calculate(cs, tempVars), this.children[1].calculate(cs, tempVars));
      }

      derivative(cs) {
          return new Add(
              // the first child of the Add process
              new Multiply(
                  new Multiply(
                      this.children[0].derivative(cs),
                      new Power$1(this.children[0], new Subtract(this.children[1], new Constant(1)))
                  ),
                  this.children[1]),

              // the second child of the Add process
              new Multiply(
                  this.children[1].derivative(cs),
                  new Multiply(
                      this,
                      new Ln(new Abs(this.children[0])))
              )
          );
      }

      simplify() {
          return this;
      }

      isEqual(node) {
          return false;
      }

      toString() {
          let child1 = "", child2 = "";

          if (this.children[0].syntaxType == 'literal' || this.children[0].syntaxType == 'function')
              child1 = this.children[0].toString();
          else
              child1 = "(" + this.children[0].toString() + ")";

          if (this.children[1].syntaxType == 'literal' || this.children[1].syntaxType == 'function')
              child2 = this.children[1].toString();
          else
              child2 = "(" + this.children[1].toString() + ")";


          return child1 + " ^ " + child2;

      }
  }

  class Subtract$1 extends Node {
      constructor(children) {
          super(children, 2);
          this.type = 'operator';
      }

      calculate(cs, tempVars) {
          return this.children[0].calculate(cs, tempVars) - this.children[1].calculate(cs, tempVars);
      }

      derivative(cs) {
          return new Subtract$1(this.children[0].derivative(cs), this.children[1].derivative(cs));
      }

      simplify() {
          let sChild1 = this.children[0].simplify(),
              sChild2 = this.children[1].simplify();

          if (sChild1.isEqual(new Constant(0))) {
              return new Neg(sChild2);
          }
          else if (sChild2.isEqual(new Constant(0))) {
              return sChild1;
          }
          else if (sChild1 instanceof Constant && sChild2 instanceof Constant) {
              return new Constant(sChild1.value + sChild2.value);
          }
          else if (sChild2 instanceof Neg) {
              return new Add(sChild1, sChild2.children[0]);
          }


          return new Subtract$1(sChild1, sChild2);
      }

      isEqual(node) {
          if (!this.containsVariable) {
              if (!node.containsVariable) {
                  let cal = new calculationSettings();
                  if (calculate(cal) == node.calculate(cal)) {
                      return true;
                  }
              }
              else return false;
          }
          else if (this.constructor === node.contructor) {
              for (let i = 0; i < this.children.length; i++) {
                  if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
              }
              return true;
          }
          return false;
      }

      toString() {
          let child1 = "", child2 = "";

          child1 = this.children[0].toString();

          if (this.children[1].syntaxType == 'literal' || this.children[1].syntaxType == 'function')
              child2 = this.children[1].toString();
          else
              child2 = "(" + this.children[1].toString() + ")";

          return child1 + " - " + child2;
      }
  }

  //import { Node } from './../../Node.js';
  class Bool extends Node {
         constructor(children){ 
             super(children); 
         }

         derivative(cs) { return null }
  }

  //import { Boolean } from './Boolean.js';
  class And$1 extends Bool {

      constructor(children) {
          super(children, 2);
          this.syntaxType = 'operator';
      }

      calculate(cs, tempVars) {
          let num1 = this.children[0].calculate(cs, tempVars),
              num2 = this.children[1].calculate(cs, tempVars);
          if (isNaN(num1) || isNaN(num2)) {
              return NaN;
          }
          if (num1 == 1 && num2 == 1)
              return 1;
          return 0;
      }

      simplify() {
          let sChild1 = children[0].simplify(),
              sChild2 = children[1].simplify();
          if (sChild1 instanceof Not && sChild2 instanceof Not)
              return new Nor(sChild1.children[0], sChild2.children[1]);
          return new And$1(sChild1, sChild2);
      }

      isEqual(node) {
          if (this.constructor === node.contructor) {
              let sChild1 = children[0].simplify(),
                  sChild2 = children[1].simplify();
              let sChild1_ = children[0].simplify(),
                  sChild2_ = children[1].simplify();
              if ((sChild1.isEqual(sChild1_) && (sChild2.isEqual(sChild2_))) || (sChild1.isEqual(sChild2_) && (sChild2.isEqual(sChild1_)))) {
                  return true;
              }
          }
          return false;
      }

      toString() {
          let child1 = "", child2 = "";

          if (this.children[0].syntaxType == 'literal' || this.children[0].syntaxType == 'function')
              child1 = this.children[0].toString();
          else
              child1 = "(" + this.children[0].toString() + ")";

          if (this.children[1].syntaxType == 'literal' || this.children[1].syntaxType == 'function')
              child2 = this.children[1].toString();
          else
              child2 = "(" + this.children[1].toString() + ")";

          return child1 + " && " + child2;
      }
  }

  //import { Boolean } from './Boolean.js';
  class Equals$1 extends Bool {

      constructor(children) {
          super(children, 2);
          this.syntaxType = 'operator';
      }

      calculate(cs, tempVars) {
          let num1 = this.children[0].calculate(cs, tempVars),
              num2 = this.children[1].calculate(cs, tempVars);
          if (!isFinite(num1) || isNaN(num1) || !isFinite(num2) || isNaN(num2)) {
              return NaN;
          }
          if (num1 == num2)
              return 1;
          return 0;
      }

      simplify() {
          let sChild1 = this.children[0].simplify(),
              sChild2 = this.children[1].simplify();
          return new Equals$1(sChild1, sChild2);
      }

      isEqual(node) {
          if (this.constructor === node.contructor) {
              let sChild1 = this.children[0].simplify(),
                  sChild2 = this.children[1].simplify();
              let sChild1_ = this.children[0].simplify(),
                  sChild2_ = this.children[1].simplify();
              if ((sChild1.isEqual(sChild1_) && sChild2.isEqual(sChild2_)) || (sChild1.isEqual(sChild2_) && sChild2.isEqual(sChild1_))) {
                  return true;
              }
          }
          return false;
      }

      toString() {
          let child1 = "", child2 = "";

          if (this.children[0].syntaxType == 'literal' || this.children[0].syntaxType == 'function')
              child1 = this.children[0].toString();
          else
              child1 = "(" + this.children[0].toString() + ")";

          if (this.children[1].syntaxType == 'literal' || this.children[1].syntaxType == 'function')
              child2 = this.children[1].toString();
          else
              child2 = "(" + this.children[1].toString() + ")";


          return child1 + " = " + child2;
      }

  }

  //import { Boolean } from './Boolean.js';
  class GreaterThan$1 extends Bool {

      constructor(children) {
          super(children, 2);
          this.syntaxType = 'operator';
      }

      calculate(cs, tempVars) {
          let num1 = this.children[0].calculate(cs, tempVars),
              num2 = this.children[1].calculate(cs, tempVars);
          if (!isFinite(num1) || isNaN(num1) || !isFinite(num2) || isNaN(num2)) {
              return NaN;
          }
          if (num1 > num2)
              return 1;
          return 0;
      }

      simplify() {
          let sChild1 = this.children[0].simplify(),
              sChild2 = this.children[1].simplify();
          return new GreaterThan$1(sChild1, sChild2);
      }

      isEqual(node) {
          if (this.constructor === node.contructor) {
              let sChild1 = this.children[0].simplify(),
                  sChild2 = this.children[1].simplify();
              let sChild1_ = this.children[0].simplify(),
                  sChild2_ = this.children[1].simplify();
              if (sChild1.isEqual(sChild1_) && sChild2.isEqual(sChild2_)) {
                  return true;
              }
          }
          else if (node.type == "LowerThan") {
              let sChild1 = this.children[0].simplify(),
                  sChild2 = this.children[1].simplify();
              let sChild1_ = this.children[0].simplify(),
                  sChild2_ = this.children[1].simplify();
              if (sChild2.isEqual(sChild1_) && sChild1.isEqual(sChild2_)) {
                  return true;
              }
          }


          return false;
      }

      toString() {
          let child1 = "", child2 = "";

          if (this.children[0].syntaxType == 'literal' || this.children[0].syntaxType == 'function')
              child1 = this.children[0].toString();
          else
              child1 = "(" + this.children[0].toString() + ")";

          if (this.children[1].syntaxType == 'literal' || this.children[1].syntaxType == 'function')
              child2 = this.children[1].toString();
          else
              child2 = "(" + this.children[1].toString() + ")";


          return child1 + " > " + child2;
      }

  }

  //import { Boolean } from './Boolean.js';
  class GreaterEquals$1 extends Bool {

      constructor(children) {
          super(children, 2);
          this.syntaxType = 'operator';
      }

      calculate(cs, tempVars) {
          let num1 = this.children[0].calculate(cs, tempVars),
              num2 = this.children[1].calculate(cs, tempVars);
          if (!isFinite(num1) || isNaN(num1) || !isFinite(num2) || isNaN(num2)) {
              return NaN;
          }
          if (num1 >= num2)
              return 1;
          return 0;
      }

      simplify() {
          let sChild1 = this.children[0].simplify(),
              sChild2 = this.children[1].simplify();
          return new GreaterEquals$1(sChild1, sChild2);
      }

      isEqual(node) {
          if (this.constructor === node.contructor) {
              let sChild1 = this.children[0].simplify(),
                  sChild2 = this.children[1].simplify();
              let sChild1_ = this.children[0].simplify(),
                  sChild2_ = this.children[1].simplify();
              if (sChild1.isEqual(sChild1_) && sChild2.isEqual(sChild2_)) {
                  return true;
              }
          }
          else if (node.type == "LowerEquals") {
              let sChild1 = this.children[0].simplify(),
                  sChild2 = this.children[1].simplify();
              let sChild1_ = this.children[0].simplify(),
                  sChild2_ = this.children[1].simplify();
              if (sChild2.isEqual(sChild1_) && sChild1.isEqual(sChild2_)) {
                  return true;
              }
          }
          return false;
      }

      toString() {
          let child1 = "", child2 = "";

          if (this.children[0].syntaxType == 'literal' || this.children[0].syntaxType == 'function')
              child1 = this.children[0].toString();
          else
              child1 = "(" + this.children[0].toString() + ")";

          if (this.children[1].syntaxType == 'literal' || this.children[1].syntaxType == 'function')
              child2 = this.children[1].toString();
          else
              child2 = "(" + this.children[1].toString() + ")";


          return child1 + " >= " + child2;
      }
  }

  //import { Boolean } from './Boolean.js';
  class In$1 extends Bool {

      /// <summary>
      /// this.children:
      /// this.children[0] instanceof the bounded value it self.
      /// this.children[1] and this.children[2] are the boundaries.
      /// </summary>
      /// <param name="children">the length instanceof 3 .</param>
      constructor(children) {
          super(children, 3);
          this.syntaxType = 'function';
      }

      BetWeen(cs, tempVars) {
          return (this.children[0].calculate(cs, tempVars) > this.children[1].calculate(cs, tempVars) && this.children[0].calculate(cs, tempVars) < this.children[2].calculate(cs, tempVars));
      }

      ///// if (this.children[1] <= this.children[0] <= this.children[2]) return 1, otherwise return 0;
      calculate(cs, tempVars) {
          if (BetWeen(cs, tempVars))
              return 1;
          return 0;
      }

      simplify() {
          let sChild1 = this.children[0].simplify(),
              sChild2 = this.children[1].simplify(),
              sChild3 = this.children[2].simplify();
          return new In$1([sChild1, sChild2, sChild3]);
      }

      isEqual(node) {
          if (this.constructor === node.contructor) {
              let sChild1 = this.children[0].simplify(),
                  sChild2 = this.children[1].simplify(),
                  sChild3 = this.children[2].simplify();
              let sChild1_ = this.children[0].simplify(),
                  sChild2_ = this.children[1].simplify(),
                  sChild3_ = this.children[2].simplify();
              if (sChild1.isEqual(sChild1_) &&
                  sChild2.isEqual(sChild2_) &&
                  sChild3.isEqual(sChild3_)) {
                  return true;
              }
          }
          return false;
      }

      toString() {
          return null;
      }

  }

  //import { Boolean } from './Boolean.js';
  class LowerThan$1 extends Bool {

      constructor(children) {
          super(children, 2);
          this.syntaxType = 'operator';
      }

      calculate(cs, tempVars) {
          let num1 = this.children[0].calculate(cs, tempVars),
              num2 = this.children[1].calculate(cs, tempVars);
          if (!isFinite(num1) || isNaN(num1) || !isFinite(num2) || isNaN(num2)) {
              return NaN;
          }
          if (num1 < num2)
              return 1;
          return 0;
      }

      simplify() {
          let sChild1 = this.children[0].simplify(),
              sChild2 = this.children[1].simplify();
          return new LowerThan$1(sChild1, sChild2);
      }

      isEqual(node) {
          if (this.constructor === node.contructor) {
              let sChild1 = this.children[0].simplify(),
                  sChild2 = this.children[1].simplify();
              let sChild1_ = this.children[0].simplify(),
                  sChild2_ = this.children[1].simplify();
              if (sChild1.isEqual(sChild1_) && sChild2.isEqual(sChild2_)) {
                  return true;
              }
          }
          else if (node.type == "GreaterThan") {
              let sChild1 = this.children[0].simplify(),
                  sChild2 = this.children[1].simplify();
              let sChild1_ = this.children[0].simplify(),
                  sChild2_ = this.children[1].simplify();
              if (sChild2.isEqual(sChild1_) && sChild1.isEqual(sChild2_)) {
                  return true;
              }
          }


          return false;
      }

      toString() {
          let child1 = "", child2 = "";

          if (this.children[0].syntaxType == 'literal' || this.children[0].syntaxType == 'function')
              child1 = this.children[0].toString();
          else
              child1 = "(" + this.children[0].toString() + ")";

          if (this.children[1].syntaxType == 'literal' || this.children[1].syntaxType == 'function')
              child2 = this.children[1].toString();
          else
              child2 = "(" + this.children[1].toString() + ")";


          return child1 + " <= " + child2;
      }
  }

  //import { Boolean } from './Boolean.js';
  class LowerEquals$1 extends Bool {

      constructor(children) {
          super(children, 2);
          this.syntaxType = 'operator';
      }

      calculate(cs, tempVars) {
          let num1 = this.children[0].calculate(cs, tempVars),
              num2 = this.children[1].calculate(cs, tempVars);
          if (!isFinite(num1) || isNaN(num1) || !isFinite(num2) || isNaN(num2)) {
              return NaN;
          }
          if (num1 <= num2)
              return 1;
          return 0;
      }

      simplify() {
          let sChild1 = this.children[0].simplify(),
              sChild2 = this.children[1].simplify();
          return new LowerEquals$1(sChild1, sChild2);
      }

      isEqual(node) {
          if (this.constructor === node.contructor) {
              let sChild1 = this.children[0].simplify(),
                  sChild2 = this.children[1].simplify();
              let sChild1_ = this.children[0].simplify(),
                  sChild2_ = this.children[1].simplify();
              if (sChild1.isEqual(sChild1_) && sChild2.isEqual(sChild2_)) {
                  return true;
              }
          }
          else if (node.type == "GreaterEquals") {
              let sChild1 = this.children[0].simplify(),
                  sChild2 = this.children[1].simplify();
              let sChild1_ = this.children[0].simplify(),
                  sChild2_ = this.children[1].simplify();
              if (sChild2.isEqual(sChild1_) && sChild1.isEqual(sChild2_)) {
                  return true;
              }
          }
          return false;
      }

      toString() {
          let child1 = "", child2 = "";

          if (this.children[0].syntaxType == 'literal' || this.children[0].syntaxType == 'function')
              child1 = this.children[0].toString();
          else
              child1 = "(" + this.children[0].toString() + ")";

          if (this.children[1].syntaxType == 'literal' || this.children[1].syntaxType == 'function')
              child2 = this.children[1].toString();
          else
              child2 = "(" + this.children[1].toString() + ")";


          return child1 + " <= " + child2;
      }

  }

  //import { Boolean } from './Boolean.js';
  class Nand$1 extends Bool {

      constructor(children) {
          super(children, 2);
          this.syntaxType = 'operator';
      }

      calculate(cs, tempVars) {
          let num1 = this.children[0].calculate(cs, tempVars),
              num2 = this.children[1].calculate(cs, tempVars);
          if (isNaN(num1) || isNaN(num2)) {
              return NaN;
          }
          if (!(num1 == 1 && num2 == 1))
              return 1;
          else
              return 0;
      }

      simplify() {
          let sChild1 = children[0].simplify(),
              sChild2 = children[1].simplify();
          if (sChild1 instanceof Not && sChild2 instanceof Not)
              return new Or(sChild1.children[0], sChild2.children[0]);
          return new Nand$1(sChild1, sChild2);
      }

      isEqual(node) {
          if (this.constructor === node.contructor) {
              let sChild1 = children[0].simplify(),
                  sChild2 = children[1].simplify();
              let sChild1_ = children[0].simplify(),
                  sChild2_ = children[1].simplify();
              if ((sChild1.isEqual(sChild1_) && (sChild2.isEqual(sChild2_))) || (sChild1.isEqual(sChild2_) && (sChild2.isEqual(sChild1_)))) {
                  return true;
              }
          }
          return false;
      }

      toString() {
          let child1 = "", child2 = "";

          if (this.children[0].syntaxType == 'literal' || this.children[0].syntaxType == 'function')
              child1 = this.children[0].toString();
          else
              child1 = "(" + this.children[0].toString() + ")";

          if (this.children[1].syntaxType == 'literal' || this.children[1].syntaxType == 'function')
              child2 = this.children[1].toString();
          else
              child2 = "(" + this.children[1].toString() + ")";


          return child1 + " xor " + child2;
      }
  }

  //import { Boolean } from './Boolean.js';
  class Nor$1 extends Bool {

      constructor(children) {
          super(children, 2);
          this.syntaxType = 'operator';
      }

      calculate(cs, tempVars) {
          let num1 = this.children[0].calculate(cs, tempVars),
              num2 = this.children[1].calculate(cs, tempVars);
          if (isNaN(num1) || isNaN(num2)) {
              return NaN;
          }
          if (!(num1 == 1 || num2 == 1))
              return 1;
          else
              return 0;
      }

      simplify() {
          let sChild1 = children[0].simplify(),
              sChild2 = children[1].simplify();
          if (sChild1 instanceof Not && sChild2 instanceof Not)
              return new And(sChild1.children[0], sChild2.children[0]);
          return new Nor$1(sChild1, sChild2);
      }

      isEqual(node) {
          if (this.constructor === node.contructor) {
              let sChild1 = children[0].simplify(),
                  sChild2 = children[1].simplify();
              let sChild1_ = children[0].simplify(),
                  sChild2_ = children[1].simplify();
              if ((sChild1.isEqual(sChild1_) && (sChild2.isEqual(sChild2_))) || (sChild1.isEqual(sChild2_) && (sChild2.isEqual(sChild1_)))) {
                  return true;
              }
          }
          return false;
      }

      toString() {
          let child1 = "", child2 = "";

          if (this.children[0].syntaxType == 'literal' || this.children[0].syntaxType == 'function')
              child1 = this.children[0].toString();
          else
              child1 = "(" + this.children[0].toString() + ")";

          if (this.children[1].syntaxType == 'literal' || this.children[1].syntaxType == 'function')
              child2 = this.children[1].toString();
          else
              child2 = "(" + this.children[1].toString() + ")";


          return child1 + " xor " + child2;
      }
  }

  //import { Boolean } from './Boolean.js';
  class Not$1 extends Bool {
      constructor(children) {
          super(children, 1);
          this.syntaxType = 'literal';
      }

      calculate(cs, tempVars) {
          let num = this.children[0].calculate(cs, tempVars);
          if (isNaN(num)) {
              return NaN;
          }
          if (num == 0)
              return 1;
          return 0;
      }

      simplify() {
          let sChild1 = children[0].simplify();
          if (sChild1 instanceof Not$1)
              return sChild1.children[0];

          else if (sChild1 instanceof And)
              return new Nand(sChild1.children[0], sChild1.children[1]);
          else if (sChild1 instanceof Or)
              return new Nor(sChild1.children[0], sChild1.children[1]);

          else if (sChild1 instanceof Nand)
              return new And(sChild1.children[0], sChild1.children[1]);
          else if (sChild1 instanceof Nor)
              return new Or(sChild1.children[0], sChild1.children[1]);

          else if (sChild1 instanceof NotEqual)
              return new Equals(sChild1.children[0], sChild1.children[1]);
          else if (sChild1 instanceof Equals)
              return new NotEqual(sChild1.children[0], sChild1.children[1]);

          return new Not$1(sChild1);
      }

      isEqual(node) {
          if (this.constructor === node.contructor) {
              let sChild1 = children[0].simplify();
              let sChild1_ = node.children[0].simplify();
              if (sChild1.isEqual(sChild1_)) {
                  return true;
              }
          }
          return false;
      }

      toString() {
          let child = "";
          if (this.children[0].syntaxType == 'literal' || this.children[0].syntaxType == 'function')
              child = this.children[0].toString();
          else
              child = "(" + this.children[0].toString() + ")";
          return `!${child}`;
      }

  }

  //import { Boolean } from './Boolean.js';
  class NotEqual$1 extends Bool {
      constructor(children) {
          super(children, 2);
          this.syntaxType = 'operator';
      }

      calculate(cs, tempVars) {
          let num1 = this.children[0].calculate(cs, tempVars),
              num2 = this.children[1].calculate(cs, tempVars);
          if (!isFinite(num1) || isNaN(num1) || !isFinite(num2) || isNaN(num2)) {
              return NaN;
          }
          if (num1 != num2)
              return 1;
          return 0;
      }

      simplify() {
          let sChild1 = this.children[0].simplify(),
              sChild2 = this.children[1].simplify();
          return new NotEqual$1(sChild1, sChild2);
      }

      isEqual(node) {
          if (this.constructor === node.contructor) {
              let sChild1 = this.children[0].simplify(),
                  sChild2 = this.children[1].simplify();
              let sChild1_ = this.children[0].simplify(),
                  sChild2_ = this.children[1].simplify();
              if ((sChild1.isEqual(sChild1_) && sChild2.isEqual(sChild2_)) || (sChild1.isEqual(sChild2_) && sChild2.isEqual(sChild1_))) {
                  return true;
              }
          }

          return false;
      }

      toString() {
          let child1 = "", child2 = "";

          if (this.children[0].syntaxType == 'literal' || this.children[0].syntaxType == 'function')
              child1 = this.children[0].toString();
          else
              child1 = "(" + this.children[0].toString() + ")";

          if (this.children[1].syntaxType == 'literal' || this.children[1].syntaxType == 'function')
              child2 = this.children[1].toString();
          else
              child2 = "(" + this.children[1].toString() + ")";


          return child1 + " != " + child2;
      }
  }

  //import { Boolean } from './Boolean.js';
  class Or$1 extends Bool {
      constructor(children) {
          super(children, 2);
          this.syntaxType = 'operator';
      }

      calculate(cs, tempVars) {
          let num1 = this.children[0].calculate(cs, tempVars),
              num2 = this.children[1].calculate(cs, tempVars);
          if (isNaN(num1) || isNaN(num2)) {
              return NaN;
          }
          if (num1 == 1 || num2 == 1)
              return 1;
          return 0;
      }

      simplify() {
          let sChild1 = children[0].simplify(),
              sChild2 = children[1].simplify();
          if (sChild1 instanceof Not && sChild2 instanceof Not)
              return new Nand(sChild1.children[0], sChild2.children[0]);
          return new Or$1(sChild1, sChild2);
      }

      isEqual(node) {
          if (this.constructor === node.contructor) {
              let sChild1 = children[0].simplify(),
                  sChild2 = children[1].simplify();
              let sChild1_ = children[0].simplify(),
                  sChild2_ = children[1].simplify();
              if ((sChild1.isEqual(sChild1_) && (sChild2.isEqual(sChild2_))) || (sChild1.isEqual(sChild2_) && (sChild2.isEqual(sChild1_)))) {
                  return true;
              }
          }
          return false;
      }

      toString() {
          let child1 = "", child2 = "";

          if (this.children[0].syntaxType == 'literal' || this.children[0].syntaxType == 'function')
              child1 = this.children[0].toString();
          else
              child1 = "(" + this.children[0].toString() + ")";

          if (this.children[1].syntaxType == 'literal' || this.children[1].syntaxType == 'function')
              child2 = this.children[1].toString();
          else
              child2 = "(" + this.children[1].toString() + ")";

          return child1 + " || " + child2;
      }
  }

  //import { Boolean } from './Boolean.js';
  class Out extends Bool {

      /// <summary>
      /// this.children:
      /// this.children[0] instanceof the bounded value it self.
      /// this.children[1] and this.children[2] are the boundaries.
      /// </summary>
      /// <param name="children">the length instanceof 3 .</param>

      constructor(children) {
          super(children, 3);
          this.syntaxType = 'function';
      }

      betWeen(cs, tempVars) {
          return this.children[0].calculate(cs, tempVars) >= this.children[1].calculate(cs, tempVars) && this.children[0].calculate(cs, tempVars) <= this.children[2].calculate(cs, tempVars);
      }

      ///// if (this.children[1] > this.children[0] > this.children[2]) return 1, otherwise return 0;
      calculate(cs, tempVars) {
          if (!this.betWeen(cs, tempVars))
              return 1;
          return 0;
      }

      simplify() {
          let sChild1 = this.children[0].simplify(),
              sChild2 = this.children[1].simplify(),
              sChild3 = this.children[2].simplify();
          return new Out([sChild1, sChild2, sChild3]);
      }

      isEqual(node) {
          if (this.constructor === node.contructor) {
              let sChild1 = this.children[0].simplify(),
                  sChild2 = this.children[1].simplify(),
                  sChild3 = this.children[2].simplify();
              let sChild1_ = this.children[0].simplify(),
                  sChild2_ = this.children[1].simplify(),
                  sChild3_ = this.children[2].simplify();
              if (sChild1.isEqual(sChild1_) &&
                  sChild2.isEqual(sChild2_) &&
                  sChild3.isEqual(sChild3_)) {
                  return true;
              }
          }
          return false;
      }

      toString() {
          return null;
      }

  }

  //import { Boolean } from './Boolean.js';
  class Xor$1 extends Bool {

      constructor(children) {
          super(children, 2);
          this.syntaxType = 'operator';
      }

      calculate(cs, tempVars) {
          let num1 = this.children[0].calculate(cs, tempVars),
              num2 = this.children[1].calculate(cs, tempVars);
          if (isNaN(num1) || isNaN(num2)) {
              return NaN;
          }
          // here if one of the two conditions only instanceof true, 0 and 1  ,   1 and 0
          // if both are 0 or 1 the the result will be 0
          if (num1 != num2)
              return 1;
          return 0;
      }

      simplify() {
          let sChild1 = children[0].simplify(),
              sChild2 = children[1].simplify();
          if (sChild1 instanceof Not && sChild2 instanceof Not)
              return new Xor$1(sChild1.children[0], sChild2.children[0]);
          return new Xor$1(sChild1, sChild2);
      }

      isEqual(node) {
          if (this.constructor === node.contructor) {
              let sChild1 = children[0].simplify(),
                  sChild2 = children[1].simplify();
              let sChild1_ = children[0].simplify(),
                  sChild2_ = children[1].simplify();
              if ((sChild1.isEqual(sChild1_) && (sChild2.isEqual(sChild2_))) || (sChild1.isEqual(sChild2_) && (sChild2.isEqual(sChild1_)))) {
                  return true;
              }
          }
          return false;
      }

      toString() {
          let child1 = "", child2 = "";

          if (this.children[0].syntaxType == 'literal' || this.children[0].syntaxType == 'function')
              child1 = this.children[0].toString();
          else
              child1 = "(" + this.children[0].toString() + ")";

          if (this.children[1].syntaxType == 'literal' || this.children[1].syntaxType == 'function')
              child2 = this.children[1].toString();
          else
              child2 = "(" + this.children[1].toString() + ")";


          return child1 + " xor " + child2;
      }
  }

  //import { Node } from './../../Node.js';
  class Binary extends Node {

      constructor(children){
          super(children, 2); 
          this.syntaxType = 'function';
      }


      calculate(cs, tempVars)
      {
          return NaN;
      }

      derivative(cs)
      {
          throw new NotImplementedException();
      }

      simplify()
      {
          throw new NotImplementedException();
      }

      isEqual(node)
      {
          throw new NotImplementedException();
      }

  }

  //import { Binary } from './Binary.js';
  class Bnot extends Binary {

      constructor(children) {
          super(children, 2);
      }

      calculate(cs, tempVars) {
          let a = this.children[0].calculate(cs, tempVars);
          if (a % 1 != 0)
              return NaN;
          return ~(a);
      }

      toString() {
          return null;
      }

  }

  //import { Binary } from './Binary.js';
  class Bor$1 extends Binary {

      constructor(children) {
          super(children);
      }

      calculate(cs, tempVars) {
          return (this.children[0].calculate(cs, tempVars) | this.children[1].calculate(cs, tempVars));
      }
      toString() {
          return null;
      }

  }

  //import { Binary } from './Binary.js';
  class Bxor$1 extends Binary {
      constructor(children) {
          super(children);
      }

      calculate(cs, tempVars) {
          return (this.children[0].calculate(cs, tempVars) ^ this.children[1].calculate(cs, tempVars));
      }
      toString() {
          return null;
      }

  }

  //import { Binary } from './Binary.js';
  class Band$1 extends Binary {

      constructor(children) {
          super(children);
      }

      calculate(cs, tempVars) {
          let a = this.children[0].calculate(cs, tempVars),
              b = this.children[1].calculate(cs, tempVars);
          if (a % 1 != 0 || b % 1 != 0)
              return NaN;
          return (a & b);
      }

      toString() {
          return null;
      }
  }

  //import { Binary } from './Binary.js';
  class NullCoalesce$1 extends Binary {

      constructor(children) {
          super(children);
      }

      calculate(cs, tempVars) {
          var a2 = this.children[0].calculate(cs, tempVars);
          return isNaN(a2) || !isFinite(a2) ?
              this.children[1].calculate(cs, tempVars) :
              a2;
      }
      toString() {
          return null;
      }

  }

  //import { Binary } from './Binary.js';
  class ShiftLeft$1 extends Binary {

      constructor(children) {
          super(children);
      }

      calculate(cs, tempVars) {
          let a = this.children[0].calculate(cs, tempVars),
              b = this.children[1].calculate(cs, tempVars);
          if (b % 1 != 0)
              return NaN;

          return (a << b);
      }

      toString() {
          return null;
      }

  }

  //import { Binary } from './Binary.js';
  class ShiftRight$1 extends Binary {
      constructor(children) {
          super(children);
      }

      calculate(cs, tempVars) {
          let a = this.children[0].calculate(cs, tempVars),
              b = this.children[1].calculate(cs, tempVars);
          if (b % 1 != 0)
              return NaN;

          return (a >> b);
      }

      toString() {
          return null;
      }

  }

  var Nodes = {
     Constant: Constant$1, Variable: Variable$1, Vector: Vector$1, ArithmeticSequence: ArithmeticSequence$1, NAN,
     Sum: Sum$1, Sqrt: Sqrt$1, Sign: Sign$1, Set: Set$1, Round: Round$1, Root, Random: Random$1, Neg: Neg$1, Min: Min$1, Max: Max$1, Log: Log$1,
     Ln: Ln$1, LCM, If: If$1, GCD: GCD$1, Func: Func$1, CalcFunc, Floor: Floor$1, Exp: Exp$1, Derivate: Derivate$1, Constrain: Constrain$1,
     Abs: Abs$1, Acos: Acos$1, Asin: Asin$1, Atan: Atan$1, Cos: Cos$1, Cot: Cot$1, Csc: Csc$1, Sec: Sec$1, Sin: Sin$1, Tan: Tan$1, Add: Add$1, Divide: Divide$1, Factorial: Factorial$1,
     Mod: Mod$1, Multiply: Multiply$1, nCr: nCr$1, nPr: nPr$1, Power: Power$1, Subtract: Subtract$1, Boolean: Bool, And: And$1, Equals: Equals$1,
     GreaterThan: GreaterThan$1, GreaterEquals: GreaterEquals$1, In: In$1, LowerThan: LowerThan$1, LowerEquals: LowerEquals$1, Nand: Nand$1, Nor: Nor$1, Not: Not$1,
     NotEqual: NotEqual$1, Or: Or$1, Out, Xor: Xor$1, Binary, Bnot, Bor: Bor$1, Bxor: Bxor$1, Band: Band$1, NullCoalesce: NullCoalesce$1,
     ShiftLeft: ShiftLeft$1, ShiftRight: ShiftRight$1
  };

  let __MMP = new MagicalParser.CustomParsers.Math();

  var MathPackage = {

     //#region classes
     Nodes,
     //#endregion

     //#region properties

     Angles,
     Lines,
     Core,
     entities,
     MMP /* magical math parser */: __MMP,
     Parser: new Parser(__MMP),
     
     //#endregion
     
     //#region methods

     compile: function (input) {
        // if(input instanceof this.Parser.Node){
        //    return this.Parser.stringT
        // }
     }

     //#endregion

  };

  return MathPackage;

})));
//# sourceMappingURL=MathPackage.js.map
