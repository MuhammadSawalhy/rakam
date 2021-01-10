// TODO: contribute to fraction.js with quotRem 


import Fraction from 'fraction.js';

/**
 * get the quotient and the reminder of a fraction
 * @param {*} num valid argument to pass to fraction.js
 */
export default function quotRem(num) {
  let f = new Fraction(num);
  let m = f.n % f.d;
  let re = new Fraction([m, f.d]);
  return {
    s: f.s,
    q: ~~((f.n - m) / f.d),
    r: re.n,
    d: re.d,
  };
}

// my approach
/*
// export function quotientRemainder(num) {
//   if (num.toString().indexOf(".") > -1) {
//     let num1 = parseInt(num.toString().split(".")[1]),
//       num2 = Math.pow(10, num1.toString().length);

//     num = parseInt(num.toString().split(".")[0]);
//     let gcd_ = gcd2(num1, num2);

//     return { quotient: num, numerator: num1 / gcd_, denominator: num2 / gcd_ };
//   } else return { quotient: num, numerator: 0, denominator: 1 };
// }
*/
