
export default function constrain(v, min, max) {
  return Math.min(max, Math.max(min, v));
}
