# Angles.js 

[![NPM Package](https://img.shields.io/npm/v/angles.svg?style=flat&version=0.2.4)](https://npmjs.org/package/angles "View this project on npm")
[![Build Status](https://travis-ci.org/infusion/Angles.js.svg)](https://travis-ci.org/infusion/Angles.js)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)


Angles.js is a collection of functions to work with angles. The aim is to have a fast and correct library, which can effortlessly convert between different units and can seamlessly work within different units. The result is a static library, which works on a configurable scale.

Examples
===

```javascript
var angles = require('angles');
angles.SCALE = 360;
console.log(angles.normalize(365)); // 5
console.log(angles.normalize(-365)); // 355
```

Simply calculate the linear interpolation of the smaller angle.

```javascript
var a = -30; // 330°
var b = 30;
var pct = 0.5; // Percentage between a and b

angles.SCALE = 360;

var dir = angles.shortestDirection(a, b); // -1 => Rotate CCW

console.log(angles.lerp(a, b, pct, dir)); // => 0


```

Having the scale configurable opens a lot of possibilities, like calculating clock-angles:

```javascript
angles.SCALE = 60;
var time = new Date;
var s = time.getSeconds();
var m = time.getMinutes();
var h = time.getHours() / 23 * 59;
console.log(angles.between(s, m, h)); // true or false, if seconds clockhand is between the minutes and hours clockhand
```


Functions
===

normalizeHalf(n)
---
Normalizes an angle to be in the interval [-180, 180), if `SCALE` is 360 or [-π, π) if `SCALE` is 2π.

normalize(n)
---
Normalizes an angle to be in the interval [0, 360), if `SCALE` is 360 or [0, 2π) if `SCALE` is 2π.

shortestDirection(from, to)
---
Determines what the shortest rotation direction is to go from one angle to another. The result is positive if it's clock-wise.

between(n, a, b)
---
Determines if an angle `n` is between two other angles `a, b`. The angles don't have to be normalized.

diff(a, b)
---
Calculates the angular difference between two angles

lerp(a, b, p[, dir=-1])
---
Calculates the linear interpolation of two angles

distance(a, b)
---
Calculate the minimal distance between two angles

toRad(n)
---
Calculate radians from current angle (Unit 2PI)

toDeg(n)
---
Calculate degrees from current angle (Unit 360)

toGon(n)
---
Calculate gons from current angle (Unit 400)

fromSlope(p1, p2)
---
Calculates the angle between the x-axis and the line formed by two points.

fromSinCos(sin, cos)
---
Calculates the original angle (in full resolution) based on the sine and co-sine of the angle.

quadrant(x, y[k=4[, shift=0]])
---
Calculates the quadrant (with `k=4`, or octant with `k=8`) in which a point with coordinates `x,y` falls. Optionally, the coordinate system can be rotated with the `shift` parameter, which follows the `SCALE`-attribute. A positive value rotates counter-clockwise.

compass(angle)
---
Translates the angle to a point of the compass ("N", "NE", "E", "SE", "S", "SW", "W", "NW") in the normal windrose way (N=0, E=90, S=180, W=270). If you want to want to have the major directions only, remove every second element from the array `DIRECTIONS`.

Installation
===
Installing Angles.js is as easy as cloning this repo or use one of the following commands:

```
bower install angle
```
or

```
npm install angles
```


Using Angles.js with the browser
===
```html
<script src="angles.js"></script>
<script>
console.log(Angles.normalize(128));
</script>
```

Using Angles.js with require.js
===
```html
<script src="require.js"></script>
<script>
requirejs(['angles.js'],
function(Angles) {
    console.log(Angles.normalize(128));
});
</script>
```

Coding Style
===
As every library I publish, Angles.js is also built to be as small as possible after compressing it with Google Closure Compiler in advanced mode. Thus the coding style orientates a little on maxing-out the compression rate. Please make sure you keep this style if you plan to extend the library.

Testing
===
If you plan to enhance the library, make sure you add test cases and all the previous tests are passing. You can test the library with

```
npm test
```

Copyright and licensing
===
Copyright (c) 2016, [Robert Eisele](http://www.xarg.org/)
Dual licensed under the MIT or GPL Version 2 licenses.
