import Fraction from 'fraction.js';
import { hasOwnProperty } from '../utils/prototypeBuiltins';

/**
 * @param {string | number} num valid argument to pass to fraction.js
 */
export default function frac(num) {
  if (typeof num === 'object' && hasOwnProperty(num, 'q')) {
    return new Fraction([num.s * num.r, num.d]).add(num.s * num.q);
  }
  return new Fraction(num);
}

// my approach
/*
// import { gcd2 } from "../core/index";
// export function fraction(num) {
//   if (num % 1 !== 0) {
//     let num1 = parseInt(num.toString().replace(".", "")),
//       num2 = Math.pow(10, num.toString().split(".")[1].length);
//     let gcd_ = gcd2(num1, num2);
//     return { numerator: num1 / gcd_, denominator: num2 / gcd_ };
//   } else return { numerator: num, denominator: 1 };
// }
*/
