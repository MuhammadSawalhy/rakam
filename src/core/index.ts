/**
 * TODO: add comments
 */

// TODO: fill this function with a fast algorithm

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

import constrain from './constrain';
import distance from './dist';
import gcd from './gcd';
import gcd2 from './gcd2';
import lcm from './lcm';
import random from './random';
import randomInt from './randomInt';
import snap from './snap';
import toFixed from './toFixed';
import trunc from './trunc';

const aliases = {
  rnd: random,
  rndi: randomInt,
  dist: distance,
};

export default {
  ...aliases,
  constrain,
  distance,
  gcd,
  gcd2,
  lcm,
  random,
  randomInt,
  snap,
  toFixed,
  trunc,
};
