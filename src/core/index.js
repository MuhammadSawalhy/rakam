/**
 * TODO: add comments
 */

// TODO: fill this function with a fast algorithm

// TODO:

// export default function newtonMethod(intialGuess, F, F_prime, cs) {
//   let x = intialGuess, x_;
//   do {
//     x_ = x;
//     cs.vars[0].value = new Constant(x_);
//     x = x_ - F.calculate(cs) / F_prime.calculate(cs);
//     if (Math.abs(x_) < Math.abs(x)) {
//       return NaN;
//     }
//   } while (Math.abs(F.calculate(cs)) > Math.pow(10, -15));
//   return x;
// }

// export default function evaluate(){

// }

export { default as constrain } from './constrain';
export { default as dist } from './dist';
export { default as gcd } from './gcd';
export { default as gcd2 } from './gcd2';
export { default as lcm } from './lcm';
export { default as random } from './random';
export { default as randomInt } from './randomInt';
export { default as snap } from './snap';
export { default as toFixed } from './toFixed';
export { default as trunc } from './trunc';

import constrain from './constrain';
import dist from './dist';
import gcd from './gcd';
import gcd2 from './gcd2';
import lcm from './lcm';
import random from './random';
import randomInt from './randomInt';
import snap from './snap';
import toFixed from './toFixed';
import trunc from './trunc';

export default {
  constrain,
  dist,
  gcd,
  gcd2,
  lcm,
  random,
  randomInt,
  snap,
  toFixed,
  trunc,
};
