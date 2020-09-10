
# angles

You can:

- Convert angles from unit to another one (e.g. from deg to red or rad to grad, etc...).
- Calculate the angle between two vectors, `{ x: number, y: number }`. You can also calculate the angle between two lines.
- In both cases, between vectors or lines, you can get the minimal or maximal angle, or get the angle when the first vector (or line) rotates by it reaching the other vector (or line).
- Calculate the angle in degree (as float number), and get it as `{deg: number, min: number, sec: number}`, degree, minutes and seconds.
- Or get it as `12° 26' 53.48"`.


Usage:

```js
const angles = require('rakam').geometry.angles;
```

# Special thanks

In order not to reinvent the wheel, or do the same effort wasting time, Rakam uses the [angles.js](https://www.npmjs.com/package/angles)@v0.2.4, with its amazing APIs and methods.

```
@license Angles.js v0.2.4 08/04/2016
Copyright (c) 2015, Robert Eisele (robert@xarg.org)
Dual licensed under the MIT or GPL Version 2 licenses.
```

> See [README.md](https://github.com/scicave/rakam/blob/master/docs/geometry/angles.js.md) of angles.js

# Properties

## SCALE

The angle value that represents a complete turn, e.g., if you want to deal with angles as degrees, set it to 360.

## EPSILON

In some methods such as [equals](#equals), if the absolute difference between the two angles is less than or equals `angles.EPSILON`, then the returned value is `true`.

This property is used also in `angles.quadrant`, which is the method provided by angles.js. If the angle is shifted

## degMinSecSymbols, DMSSymbols

You can change the symbols (°), (') and (") that are used in some methods such as [strDMS](#strDegMinSec). If you want to change them set this property to an object `{deg: string, min: string, sec: string}`.

# Methods

Some new methods and properties are built upon the `angles.js@v0.2.4` package.

## equals

Know whether two angles are equivalent or not. `true` if the absolute difference between them is less than or equals [EPSILON](#EPSILON)

## fromDeg

Convert a given angle from the current SCALE into degrees (SCALE = 360).

## fromRad

Convert a given angle from the current SCALE into radians (SCALE = TAU = 2*PI).

## fromGon

Convert a given angle from the current SCALE into gradians, or gons, (SCALE = 400).

## degMinSec

> alias: `DMS`

Get a given angle in degrees unit, as an object has properties "deg", "min" and "sec". 

```js
angles.degMinSec(anglesInDegrees /* , secDecimalDigitsCount or say sec accuracy */);

console.log(angles.degMinSec(30.6346, -1)); // to get the exact computed sec
// { deg: 30, min: 38, sec: 4.559999999996194 }
```

## strDegMinSec

> alias: `strDMS`

Get a given angle in degrees unit, as a string like `12° 26' 53.48"`.

You can pass "secAccuracy" in the 2nd argument, to use on calculating the deg, min, sec in case you pass a float number. The 1st one is the angle in degrees as a float number or an object like `{deg: number, min: number, sec: number}`.

## fromDegMinSec

> alias: `fromDMS`

Reverts the method `degMinSec`.

So that:
```js
let a = 30.123;

// true
console.log(a === angles.fromDMS(angles.degMinSec(a)));

// note that, in some cases there may be a tiny float error so that it is false
// to encounter this float error
let epsilon = 10**-10;
console.log(
  a > angles.fromDMS(angles.degMinSec(a)) - epsilon &&
  a < angles.fromDMS(angles.degMinSec(a)) + epsilon
);

// or 
let a2 = angles.fromDMS(angles.degMinSec(a, -1));
console.log(angles.equals(a, a2));
```

## fromStrDegMinSec

> alias: `fromStrDMS`

Reverts the method `strDegMinSec`.
