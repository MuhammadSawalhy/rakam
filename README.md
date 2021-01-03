
# RAKAM ➕ ➗ 📐

[![NPM Package](https://img.shields.io/npm/v/rakam?color=blue)](https://npmjs.com/package/rakam "View this project on npm")
![npm downloads](https://img.shields.io/npm/dm/rakam "Downloads from npmjs")
[![circleci](https://circleci.com/gh/scicave/rakam.svg?style=shield)](https://app.circleci.com/pipelines/github/scicave/rakam)
[![Build Status](https://github.com/scicave/rakam/workflows/Node.js%20CI/badge.svg)](https://github.com/scicave/rakam/actions?query=workflow%3A%22Node.js+CI%22)
[![Codecov Coverage](https://codecov.io/gh/scicave/rakam/branch/develop/graph/badge.svg)](https://codecov.io/gh/scicave/rakam/)
[![CodeFactor](https://www.codefactor.io/repository/github/scicave/rakam/badge)](https://www.codefactor.io/repository/github/scicave/rakam)
[![Maintenance](https://img.shields.io/maintenance/yes/2021.svg)](https://github.com/scicave/rakam/graphs/commit-activity)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)


Rakam or (رقم) in Arabic, which means "number". This is a math library, one of the reasons to
give this package a try is that, the **_performance_** is the main goal. As some great projects
such as [plotto](https://plotto.netlify.com) and [desmos](https://www.desmos.com) make __intense__
calculations in tons of iterations to generate the graph. The need of such an open-source project
cares about these situations arises, don't forget to contribute by raising an issue at github or
optimizing some algorithms 🚀.

## Features
- Compile math expression from a string into js function, ready for evaluation, considering the performance as the main goal.
- Parse math expression.
- The same for latex.
- Convert between latex and math expression.
- Geometric shapes and properties and intersections: now [lines](#lines) are available.
- Get a float number as a numerator over a denominator `{ s: sign<1|-1>, n: integer, d: integer }`.
- As well as getting the quotient, the reminder and the denominator of a fraction, `{ s: sign<1|-1>, q: integer, r: integer, d: integer }`. AKA: quotient is the whole number, and the decimal part will be converted to a numerator and a denomerator. 

> You can get and import any of Rakam's APIs directly, saving load time and bundle size.

## Documentations tree (API)
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


## Usage

### Browser

```html
<!-- contain url for source-maps -->
<script src="https://cdn.jsdelivr.net/npm/rakam/main/index.js"></script>
<script src="https://cdn.jsdelivr.net/npm/rakam/main/index.min.js"></script>
```

### Node.js, or with a bundler

```sh
❯ npm i rakam
```

<!-- 

# 🤝 Contribution

 -->

## 🛠 engine

### math2js
<!-- CAUTION: the same as the description in the documentations -->

Rakam uses [@scicave/math-parser](https://npmjs.com/package/@scicave/math-parser) library to parse math expression, then handle the AST, or say the parser tree, to generate the equivalent js code, in a very customizable way. After all of these steps, we easily use [Function constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function#Constructor), `new Function(...)`.

See documentations for more about [math2js][engine-math2js].


## 📐 geometry

### angles
<!-- CAUTION: the same as the description in the documentations -->

You can:

- Convert angles from unit to another one (e.g. from deg to red, or rad to grad, etc...).
- Calculate the angle between two vectors, `{ x: number, y: number }`. You can also calculate the angle between two lines.
- In both cases, between vectors or lines, you can get the minimal or maximal angle or get the angle by which the first vector (or line) rotates to reach the other vector (or line).
- Calculate the angle in degree (as float number), and get it as `{deg: number, min: number, sec: number}`, degree, minutes and seconds respectively.
- Or get it as `12° 26' 53.48"`


Documentations: [angles][geometry-angles].


### lines

You can:
- Get a line equation parameters: "a", "b" and "c" in `ax + by + c = 0 `.
- Get the 2 lines intersection point.
- Project a point onto a line.
- Get the distance between a point ad a line.

Documentations: [lines][geometry-lines].

## ➗ fraction

Documentation: [fraction][fraction].

## 📜 License

Copyright (&copy;) 2020 sciCave™ <scicaveteam@gmail.com>

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.



[ engine-math2js ]: https://github.com/scicave/rakam/blob/master/docs/engine/math2js.md
[ geometry-angles ]: https://github.com/scicave/rakam/blob/master/docs/geometry/angles.md
[ geometry-lines ]: https://github.com/scicave/rakam/blob/master/docs/geometry/lines.md
[ fraction ]: https://github.com/scicave/rakam/blob/master/docs/fraction/index.md
