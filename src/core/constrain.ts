export default function constrain(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}
