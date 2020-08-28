
/**
 * return an object with degress, seconds and minutes properities
 * @param {*} angle ::: in radian form
 */
export function degAngle(angle) {
  if (Core.isNumeric(angle)) {
    let splitted;
    angle = (angle * 180) / Math.PI;
    let deg, min, sec;
    let getTerm = (a, b) => {
      a = "0." + a.toString();
      a *= b;
      splitted = a.toString().split(".");
      splitted = [parseInt(splitted[0]), parseInt(splitted[1])];
      return [...splitted];
    };

    if (Math.round(angle) != angle) {
      splitted = angle.toString().split(".");
      splitted = [parseInt(splitted[0]), parseInt(splitted[1])];
      deg = splitted[0];
      min = getTerm(splitted[1], 60);
      sec = getTerm(min[1], 60);

      if (Math.abs(sec[0] - 60) <= 1) {
        min[0]++;
        sec[0] = 0;
      }
      if (min[0] === 60) {
        deg += 1 * Math.sign(deg);
        min[0] = 0;
      }
      return { degrees: deg, minutes: min[0], seconds: sec[0] };
    }
    return { degrees: angle, minutes: 0, seconds: 0 };
  } else {
    let cAngle = calculateString(angle);
    if (Core.isNumeric(cAngle)) {
      return this.degAngle(cAngle);
    } else throw new Error("your angle value (" + angle + ') is not valid. :"(');
  }
}

export function stringDegAngle(angle) {
  let deg = this.degAngle(angle);
  if (deg.degrees != 0) {
    if (deg.minutes != 0) {
      // nothing is zero
      if (deg.seconds != 0) {
        return deg.degrees + "° " + deg.minutes + "' " + deg.seconds.toFixed(2) + '"';
      }
      // sec is zero
      else {
        return deg.degrees + "° " + deg.minutes + "'";
      }
    } else {
      // min is zero
      if (deg.seconds != 0) {
        return deg.degrees + "° " + deg.seconds.toFixed(2) + '"';
      }
      // min and sec is zero
      else {
        return deg.degrees + "°";
      }
    }
  } else {
    if (deg.minutes != 0) {
      // deg is zero
      if (deg.seconds != 0) {
        return deg.minutes + "' " + deg.seconds.toFixed(2) + '"';
      }
      // deg and sec is zero
      else {
        return deg.minutes + "'";
      }
    } else {
      // deg and min is zero
      if (deg.seconds != 0) {
        return deg.seconds.toFixed(2) + '"';
      }
      // all is zero
      else {
        return 0 + "°";
      }
    }
  }
}

export function deg(a, to = "rad") {
  switch (to) {
    case "rad": // from deg to rad
      return (a * Math.PI) / 180;
  }
}

export function toDeg(a, from = "rad") {
  switch (from) {
    case "rad": // from deg to rad
      return (a / Math.PI) * 180;
  }
}
