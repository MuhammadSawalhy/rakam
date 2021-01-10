export default function trunc(v) {
  return v < 0 ? Math.ceil(v) : Math.floor(v);
}
