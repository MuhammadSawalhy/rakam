export default function trunc(v: number) {
  return v < 0 ? Math.ceil(v) : Math.floor(v);
}
