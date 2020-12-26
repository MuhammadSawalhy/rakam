export default function toFixed(v, decimalDigitsNum) {
  return Math.round(v * 10 ** decimalDigitsNum) / 10 ** decimalDigitsNum;
}
