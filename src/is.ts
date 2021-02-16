export function isNumeric(num: number) {
  return !isNaN(num);
  // return value.toString().replace(/^\s*(\-?\d+|\-?\d+\.\d*|\-?\d*\.\d+)\s*$/, '123') === '123';
}

export function isInteger(num: number) {
  return num % 1 === 0;
  // return value.toString().replace(/^\s*(\-?\d+|\-?\d+\.\d*|\-?\d*\.\d+)\s*$/, '123') === '123';
}

export function isPrime(num: number) {
  var divisor = Math.floor(num / 2);
  var prime = true;
  if (num % 1 === 0) {
    while (divisor > 1) {
      if (num % divisor === 0) {
        prime = false;
        divisor = 0;
      } else {
        divisor -= 1;
      }
    }
  } else {
    prime = false;
  }
  return prime;
}
