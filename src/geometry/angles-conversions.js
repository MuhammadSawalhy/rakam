

/**
 * return an object with degress, seconds and minutes properities
 * @param {Number} angle ::: in degrees as float number
 */
export function degForm(angle) {
  if (!isNaN(angle)) {
    let deg, min = 0, sec = 0, num;

    if (Math.round(angle) !== angle) {
      deg = angle < 0 ? Math.ceil(angle) : Math.floor(angle); // the same as Math.trunc
      // get the decimal number only 0.1326548
      // then multiply by 60 and trunc
      num = (angle - deg) * 60;
      min = angle < 0 ? Math.ceil(num) : Math.floor(num);
      num = (num - min) * 60;
      sec = angle < 0 ? Math.ceil(num) : Math.floor(num);

      //#region avoid a tiny error resulting in a slitly different angle
      if (Math.abs(sec - 60) <= 1) {
        min++;
        sec = 0;
      }
      if (min === 60) {
        deg += 1 * Math.sign(deg);
        min[0] = 0;
      }
      //#endregion
    }

    return { deg, min, sec };

  }
  throw new Error(`can't convert ${angle} into degrees form, please pass a valid number.`);
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
