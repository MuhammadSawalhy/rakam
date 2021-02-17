export default function random(start: number, end: number) {
  if (end) {
    return start + Math.random() * (end - start);
  } else {
    return Math.random() * start;
  }
}
