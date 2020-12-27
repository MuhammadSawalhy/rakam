
# RAKAM ➕ ➗ 📐

[![NPM Package](https://img.shields.io/npm/v/rakam?style=for-the-badge&color=orange)](https://npmjs.com/package/rakam "View this project on npm")
![npm downloads](https://img.shields.io/npm/dm/rakam?style=for-the-badge)
![github workflow tests](https://img.shields.io/github/workflow/status/scicave/rakam/Node.js%20CI?style=for-the-badge)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=for-the-badge)](https://opensource.org/licenses/Apache-2.0)


Rakam or (رقم) in Arabic, which means "number". This is a math library. One of the reasons to give this package a try is that, the **_performance_** is in our considerations. As some great projects such as [plotto](https://plotto.netlify.com) and [desmos](https://www.desmos.com) make __intense__ calculations in tons of iterations to generate the graph. The need of such an open-source project cares about these situations arises, so that we can cooperate and contribute to reach the optimal performance 🚀.

### Features:
- Compile math expression from a string into js function, ready for evaluation, considering the performance as the main goal.
- Parse math expression.
- The same for latex.
- Convert between latex and math expression.
- Geometric shapes and properties and intersections: now [lines](#lines) are avaliable.
- Get a float number as a numerator over a denomerator `{ s: sign<1|-1>, n: integer, d: integer }`.
- As well as getting the quotient, the reminder and the denomerator of a fraction, `{ s: sign<1|-1>, q: integer, r: integer, d: integer }`. AKA: quotient is the whole number, and the decimal part will be converted to a numerator and a denomerator. 

> You can get any import any of the APIs elements directly, saving load time and bundle size.

### Documentations tree (API):
- core
  lcm, gcd, lcm2, gcd2, dist, constrain, trunc, toFixed, random, randomInt
- engine
  - [math2js][engine-math2js]
  - math2latex
  - mathParser
  - latexParser
  - latex2js
  - latex2math
- geometry
  - [angles][geometry-angles]
  - [lines][geometry-lines]
- [fraction][fraction]

<!-- 

# 🤝 Contribution

 -->

# 🛠 engine

## math2js
<!-- CAUTION: the same as the description in the documentations -->

Rakam uses [@scicave/math-parser](https://npmjs.com/package/@scicave/math-parser) library to parse math expression, then handle the AST, or say the parser tree, to generate the equivalent js code, in a very customizable way. After all of these steps, we easily use [Function constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function#Constructor), `new Function(...)`.

See documentations for more about [math2js][engine-math2js].


# 📐 geometry

## angles
<!-- CAUTION: the same as the description in the documentations -->

You can:

- Convert angles from unit to another one (e.g. from deg to red, or rad to grad, etc...).
- Calculate the angle between two vectors, `{ x: number, y: number }`. You can also calculate the angle between two lines.
- In both cases, between vectors or lines, you can get the minimal or maximal angle or get the angle by which the first vector (or line) rotates to reach the other vector (or line).
- Calculate the angle in degree (as float number), and get it as `{deg: number, min: number, sec: number}`, degree, minutes and seconds respectively.
- Or get it as `12° 26' 53.48"`


Documentations: [angles][geometry-angles].


## lines

You can:
- Get a line equation parameters: "a", "b" and "c" in `ax + by + c = 0 `.
- Get the 2 lines intersection point.
- Project a point onto a line.
- Get the distance between a point ad a line.

Documentations: [lines][geometry-lines].

# ➗ fraction

Documentation: [fraction][fraction].

# 📜 License

Copyright (&copy;) 2020 sciCave™ <scicaveteam@gmail.com>

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.



[engine-math2js]: https://github.com/scicave/rakam/blob/master/docs/engine/math2js.md
[ geometry-angles ]: https://github.com/scicave/rakam/blob/master/docs/geometry/angles.md
[ geometry-lines ]: https://github.com/scicave/rakam/blob/master/docs/geometry/lines.md
[ fraction ]: https://github.com/scicave/rakam/blob/master/docs/fraction/index.md
