# lines

### You can:
- Get a line equation parameters: "a", "b" and "c" in (ax + by + c = 0).
- Get the 2 lines intersection point
- Project a point onto a line
- Get the distance between a point ad a line

### Usage:
```js
const lines = require('rakam').geometry.lines;
// or
const lines = require('rakam').lines;
// or
const lines = require('rakam/main/geometry/lines');
// or if you use a bundler, e.g., rollup or webpack
import lines from 'rakam/module/geometry/lines';
```

# Methods

## equation

Arguments: 1st arg is the slope angle in radians, the 2nd is any point lies on the line.

Returns: an object containing "a", "b" and "c" parameters in the equation "ax+by+c=0".

Example: 
```js
const { angles, vector } = require('rakam'); 
let lineEquation = lines.equation(angles.toRad(30), new vector(1, 2));
```

## intersection

Arguments: two arguments recieving the 2 lines' equation.

Returns: the intersection point as object, { x: number, y: number }.

Example: 
```js
const { angles, vector } = require('rakam'); 
let lineEq1 = lines.equation(angles.toRad(30), new vector(1, 2));
let lineEq2 = lines.equation(angles.toRad(-50), new vector(5, 6));
let inters = lines.intersection(lineEq1, lineEq2);
```

## distance

Arguments: 1st arg is the point, the 2nd arg is a line [equation](#equation).

Returns: the distance as number, in other words, the segment length between the point and its [projection](#projection) onto the line.

Example: 
```js
const { angles, vector } = require('rakam'); 
let lineEquation = lines.equation(angles.toRad(30), new vector(1, 2));
let dist = lines.distance(new vector(-1, 5), lineEquation);
```


## projection

Arguments: 1st arg is the point to be projected in a line whose [equation](#equation) is the 2nd arg.

Returns: an object, { x: number, y: number }.

Example: 
```js
const { angles, vector } = require('rakam'); 
let lineEquation = lines.equation(angles.toRad(30), new vector(1, 2));
let proj = lines.projection(new vector(-1, 5), lineEquation);
```
