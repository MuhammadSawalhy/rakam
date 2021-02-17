export default function toFixed(v: number, decimalDigitsNum: number) {
  return Math.round(v * 10 ** decimalDigitsNum) / 10 ** decimalDigitsNum;
}
