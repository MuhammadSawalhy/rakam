export default function gcd2(a: number, b: number): number {
  if (b == 0) return a;
  return gcd2(b, a % b);
}
