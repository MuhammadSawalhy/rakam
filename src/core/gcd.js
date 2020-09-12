
export default function gcd(...values) {
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
