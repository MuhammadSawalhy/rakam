(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.MathPackage = factory());
}(this, (function () { 'use strict';

  class Core {

    // #region checking, bool, is_...

    static isAlpha(input) {
      return input.toString().replace(/\d/g, '@').replace(/\w/g, '') === '';
    }

    static isSymbol(char) {
      return (char.replace(/\W/, '') === '');
    }

    static isNumeric(value) {
      return !isNaN(value);
      // return value.toString().replace(/^\s*(\-?\d+|\-?\d+\.\d*|\-?\d*\.\d+)\s*$/, '123') === '123';
    }

    static fromTheSame(a, b) {
      return a.fromTheSame === b.fromTheSame;
    }

    // #endregion

    // #region SimplifiedFraction

    static simplifiedFraction_1(num) {
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
    static simplifiedFraction_2(num) {
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
      * @param {vector} p1 instanceof {x: ..., y: ...},
      * @param {vector} p2 instanceof {x: ..., y: ...};
      * @param {object} options instanceof '{}' that defines 'type'.
      */
     static minAngle(p1, p2, options = {}) {
        options = {
           type: 'vectors',
           ...options
        };
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
        options = {
           type: 'vectors',
           ...options
        };
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
      * @param {vector} p1 instanceof {x: ..., y: ...},
      * @param {vector} p2 instanceof {x: ..., y: ...};
      * @param {object} options instanceof '{}' that defines 'type', 'dir'.
      */
     static angle(p1, p2, options = {}) {

        options = {
           type: 'vectors',
           dir: 'counterclockwise',
           ...options
        };

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
      * @param {Object} le instanceof {a: ..., b: ..., c: ...} in "a*x+b*y+c=0"
      */
     static projectionToLine(v, le) {
        if (v && le) {
           return Lines.lineIntersection(le, Lines.lineEquation(le.angle + Math.PI / 2, v));
        }
     }

     /**
      * return {a: ..., b: ..., c: ...} in "a*x+b*y+c=0"
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
      * @param {*} lineEquation1 instanceof {a: ..., b: ..., c: ...} in "a*x+b*y+c=0"
      * @param {*} lineEquation2 instanceof {a: ..., b: ..., c: ...} in "a*x+b*y+c=0"
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
     }

     //#region  parserNode to ...

     parserNodeTOnode(snode) {

        let _getRandom = (expr) => {
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
        };

        let expr = snode;
        if (expr.type === 'num') {
           return new Constant(parseFloat(expr.value));
        } else if (expr.type === 'id')
           return new Variable(expr.value);

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

     //#endregion

     //#region : latex to ...

     latexTOmaxima(tex) {
        let options = {};
        const converter = new TeX2Max(options);
        const str = converter.toMaxima(tex);
        console.log(str);
        return str;
     }

     latexTOnode(tex) {
        return snodeTOnode(latexTOsnode(tex));
     }

     //#endregion

     //#region : maxima(string) to ...

     maximaTOnode(str) {
        return this.parserNodeTOnode(this.mathParserLib.parse(str));
     }

     maximaTOjsFunction(params, str) {
        return new Function(...params, `return ${str}`);
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

  let __MMP = new MagicalParser.CustomParsers.Math();
  var MathPackage = {

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
