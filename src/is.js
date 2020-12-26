export function isNumeric(value) {
  return !isNaN(value);
  // return value.toString().replace(/^\s*(\-?\d+|\-?\d+\.\d*|\-?\d*\.\d+)\s*$/, '123') === '123';
}

export function isInteger(value) {
  return value % 1 === 0;
  // return value.toString().replace(/^\s*(\-?\d+|\-?\d+\.\d*|\-?\d*\.\d+)\s*$/, '123') === '123';
}

export function isPrime(number) {
  var divisor = Math.floor(number / 2);
  var prime = true;
  if (number % 1 === 0) {
    while (divisor > 1) {
      if (number % divisor === 0) {
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
