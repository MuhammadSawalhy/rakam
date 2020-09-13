
export default function gcd2(a, b) {
  if (b == 0)
    return a;
  return gcd2(b, a % b);
}
