export default function random(start, end) {
  if (end) {
    return start + Math.random() * (end - start);
  } else {
    return Math.random() * start;
  }
}
