/**
 * TODO: add comments
 */


export function dist(a, b, c, d) {
  if((c && d) || (typeof a === 'object' && typeof b === 'object')){
    return this.dist(v1.x, v1.y, v2.x, v2.y);
  } else {
    throw new Error('can\'t calculate the distance, check that you passed two vectors or 4 numbers x1,y1,x2,y2');
  }
}

export function constrain(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

// TODO: fill this function with a fast algorithm 
export function snap(value, options = { snapTo: { type: 'num', value: '' }, a: {} }) {

}

export function random(start, end) {
  if (end) {
    return start + Math.random() * (end - start);
  } else {
    return Math.random() * start;
  }
}

export function randomInt(start, end) {
  return Math.round(this.random(start, end))
}

export function gcd(...values) {
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

export function gcd2(a, b) {
  if (b == 0)
    return a;
  return this.gcd2(b, a % b);
}

export function lcm(...values) {
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

export function newtonMethod(intialGuess, F, F_prime, cs) {
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

export function evaluate(){

}