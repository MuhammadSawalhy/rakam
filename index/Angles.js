class Angles{

   //#region calculations ///////////////////////////////////////////////////
   
   /**
    * return angle between 0 and 2*PI (one round)
    * @param {vector} p1 instanceof {x: ..., y: ...},
    * @param {vector} p2 instanceof {x: ..., y: ...};
    * @param {object} options instanceof '{}' that defines 'type'.
    */
   static minAngle(p1, p2, options = {}) {
      options = {
         type: 'vectors',
         ...options
      }
      if (options.type === 'vectors') {
         let s = p1.dot(p2) / (p1.mag * p2.mag);
         let a = Math.acos(Core.constrain(s, -1, 1));

         return Angles.constrainAngle(a);
      }
      else if (options.type === 'lines') {
         let a = Angles.minAngle(p1, p2);
         return Math.min(a, Math.PI - a);  // notice that {(a) and (Math.PI - a)} are always positive.
      }
   }
   
   /**
    * return angle between 0 and 2*PI (one round)
    * @param {vector} p1 instanceof ,
    * @param {vector} p2 instanceof ;
    * @param {object} options instanceof '{}' that defines 'type'.
   */
   static maxAngle(p1, p2, options = {}) {
      options = {
         type: 'vectors',
         ...options
      }
      if (options.type === 'vectors') {
         let min = Angles.minAngle(p1, p2);
         return Math.max(2 * Math.PI - min, min);
      }
      else if (options.type === 'lines') {
         let a = Angles.minAngle(p1, p2);
         return Math.max(a, Math.PI - a);  // notice that {(a) and (Math.PI - a)} are always positive.
      }
   }
   
   /**
    * return angle between 0 and 2*PI (one round)
    * @param {vector} p1 instanceof {x: ..., y: ...},
    * @param {vector} p2 instanceof {x: ..., y: ...};
    * @param {object} options instanceof '{}' that defines 'type', 'dir'.
    */
   static angle(p1, p2, options = {}) {
      
      options = {
         type: 'vectors',
         dir: 'counterclockwise',
         ...options
      }

      if (options.type === 'vectors') {
         var a1 = Angles.minAngle(p1, new vector(1, 0));
         a1 = p1.y >= 0 ? a1 : -a1;
         var a2 = Angles.minAngle(p2, new vector(1, 0));
         a2 = p2.y >= 0 ? a2 : -a2;
         let a = options.dir === 'counterclockwise' || options.dir === '+' ? a2 - a1 : a1 - a2;
   
         return Angles.constrainAngle(a);
      }
      else if (options.type === 'lines') {
         let a1 = Angles.angle(p1, p2, { type: 'vectors', dir });
         let a2 = Angles.angle(p1, p2.mult(-1), { type: 'vectors', dir });
         return Math.min(a1, a2); // that is a wonderful optimization for getting the angle of rotation when you rotate the 1st line to fit it on the other one, consider the dir of rotation inside options.
      }
   }
   
   /**
    * the returned angle instanceof constrined between 0 and 2*Math.PI
    * @param {number} angle, 
    * @param {number} type, if 0 the your angle will be inside [-pi, pi]
    *                     - else if 1 your angle will be inside [0, 2pi]
    */

   static constrainAngle(angle, type = 0) {
      if(type === 1){
         let sin_ = Math.sin(angle);
         let cos_ = Math.cos(angle);
         let a = Math.asin(Math.abs(sin_)); // the same as Math.abs(Math.asin(sin_));
         return sin_ >= 0 ?
            (cos_ >= 0 ?
               a :  // first quarter, sin + , cos +
               Math.PI - a // second quarter, sin + , cos -
            ) :
            (cos_ >= 0 ?
               2 * Math.PI - a : // second quarter, sin - , cos +
               Math.PI + a // second quarter, sin - , cos -
            );
      }
      else if(type === 0){ // default
         let sin_ = Math.sin(angle);
         let cos_ = Math.cos(angle);
         let a = Math.asin(Math.abs(sin_)); // the same as Math.abs(Math.asin(sin_));
         return sin_ >= 0 ?
            (cos_ >= 0 ?
               a :  // first quarter, sin + , cos +
               Math.PI - a // second quarter, sin + , cos -
            ) :
            (cos_ >= 0 ?
                -a : // fourth quarter, sin - , cos +
               -Math.PI + a // third quarter, sin - , cos -
            );
      }
   }

   static snapAngle(a, valuesTOsnapTO) {
   let margin = angles.deg(2.5); /// 2.5deg
   /// sanp to 30 or 210 deg, and so on.
   if (!valuesTOsnapTO) {
      let snapTo = [Math.PI / 6, Math.PI / 4, Math.PI / 3, Math.PI / 2]; /// four special angles
      for (let i = 0; i < 4; i++) {
         snapTo.push(Math.PI - snapTo[i]);
         snapTo.push(Math.PI + snapTo[i]);
         snapTo.push(2 * Math.PI - snapTo[i]);
      }
      snapTo.push(0); snapTo.push(Math.PI);
      valuesTOsnapTO = snapTo;
   }
   for (let s of valuesTOsnapTO) {
      let a1 = angles.minAngle(vector.fromAngle(a), vector.fromAngle(s)); // angles between two vectors not lines.
      if (a1 <= margin) {
         return s;
      }
   }
   return a;
   }

   
   //#endregion
   
   //#region conversion ///////////////////////////////////////////////////

   /**
    * return an object with degress, seconds and minutes properities
    * @param {*} angle ::: in radian form
    */
   static degAngle(angle) {
      if (Core.isNumeric(angle)) {
         let splitted;
         angle = angle * 180 / Math.PI;
         let deg, min, sec;
         let getTerm = (a, b) => {
            a = '0.' + a.toString();
            a *= b;
            splitted = a.toString().split('.');
            splitted = [parseInt(splitted[0]), parseInt(splitted[1])];
            return [...splitted];
         }
         
         if (Math.round(angle) != angle) {
            splitted = angle.toString().split('.');
            splitted = [parseInt(splitted[0]), parseInt(splitted[1])];
            deg = splitted[0];
            min = getTerm(splitted[1], 60);
            sec = getTerm(min[1], 60);

            if (Math.abs(sec[0] - 60) <= 1) { min[0]++; sec[0] = 0;}
            if (min[0] === 60) { deg += 1 * Math.sign(deg); min[0] = 0}
            return { degrees: deg, minutes: min[0], seconds: sec[0] };
         } 
         return { degrees: angle, minutes: 0, seconds: 0 };

      } else {
         let cAngle = calculateString(angle);
         if (Core.isNumeric(cAngle)) {
            return this.degAngle(cAngle);
         }
         else throw new Error('your angle value (' + angle + ') is not valid. :"(');
      }
   }
   
   static stringDegAngle(angle) {
      let deg = this.degAngle(angle);
      if (deg.degrees != 0) {
         if (deg.minutes != 0) {
            // nothing is zero
            if (deg.seconds != 0) {
               return deg.degrees + '° ' + deg.minutes + "' " + deg.seconds.toFixed(2) + '"';
            }
            // sec is zero
            else {
               return deg.degrees + '° ' + deg.minutes + "'";
            }
         }
         else {
            // min is zero
            if (deg.seconds != 0) {
               return deg.degrees + '° ' + deg.seconds.toFixed(2) + '"';
            }
            // min and sec is zero
            else {
               return deg.degrees + '°';
            }
         }
      }
      else {
         if (deg.minutes != 0) {
            // deg is zero
            if (deg.seconds != 0) {
               return deg.minutes + "' " + deg.seconds.toFixed(2) + '"';
            }
            // deg and sec is zero
            else {
               return deg.minutes + "'";
            }
         }
         else {
            // deg and min is zero
            if (deg.seconds != 0) {
               return deg.seconds.toFixed(2) + '"';
            }
            // all is zero
            else {
               return 0 + '°';
            }
         }
      }
   }

   static deg(a, to = 'rad') {
      switch (to) {
         case 'rad': // from deg to rad
            return a * Math.PI / 180
      }
   }
   static toDeg(a, from = 'rad') {
      switch (from) {
         case 'rad': // from deg to rad
            return a / Math.PI * 180
      }
   }

   //#endregion

}
