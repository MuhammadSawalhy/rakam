/**
 * get the mathematical modulo, which differ from js `%` operator.
 * https://stackoverflow.com/questions/55671058/understanding-mod-operator-in-math-vs-programming
 */
export default function mod(dividend: number, divisor: number) {
  return dividend < 0
    ? ((dividend % divisor) + divisor) % divisor
    : dividend % divisor;
}
