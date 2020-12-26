export default function lcm(...values) {
  let product = 1;
  let a;
  for (let i = 0; i < values.length; i++) {
    a = values[i];
    if (a % 1 !== 0) return NaN;
    product *= a;
  }
  return Math.abs(product) / Math.pow(this.gcd(...values), values.length - 1);
}
