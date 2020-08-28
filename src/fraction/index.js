function fraction(num) {
  if (num.toString().indexOf(".") > -1) {
    let num1 = parseInt(num.toString().replace(".", "")),
      num2 = Math.pow(10, num.toString().split(".")[1].length);
    let gcd_ = this.gcd(num1, num2);
    return { numerator: num1 / gcd_, denominator: num2 / gcd_ };
  } else return { numerator: num, denominator: 1 };
}

function quotientRemainder(num) {
  if (num.toString().indexOf(".") > -1) {
    let num1 = parseInt(num.toString().split(".")[1]),
      num2 = Math.pow(10, num1.toString().length);

    num = parseInt(num.toString().split(".")[0]);
    let gcd_ = this.gcd2(num1, num2);

    return { quotient: num, numerator: num1 / gcd_, denominator: num2 / gcd_ };
  } else return { quotient: num, numerator: 0, denominator: 1 };
}
