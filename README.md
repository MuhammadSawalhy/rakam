# RAKAM ➕ ➗ 📐

[![NPM Package](https://img.shields.io/npm/v/rakam?color=blue)](https://npmjs.com/package/rakam "View this project on npm")
![npm downloads](https://img.shields.io/npm/dm/rakam "Downloads from npmjs")
[![circleci](https://circleci.com/gh/scicave/rakam.svg?style=shield)](https://app.circleci.com/pipelines/github/scicave/rakam)
[![Build Status](https://github.com/scicave/rakam/workflows/Node.js%20CI/badge.svg)](https://github.com/scicave/rakam/actions?query=workflow%3A%22Node.js+CI%22)
[![Codecov Coverage](https://codecov.io/gh/scicave/rakam/branch/develop/graph/badge.svg)](https://codecov.io/gh/scicave/rakam/)
[![CodeFactor](https://www.codefactor.io/repository/github/scicave/rakam/badge)](https://www.codefactor.io/repository/github/scicave/rakam)
[![Maintenance](https://img.shields.io/maintenance/yes/2021.svg)](https://github.com/scicave/rakam/graphs/commit-activity)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fscicave%2Frakam.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fscicave%2Frakam?ref=badge_shield)

Rakam or (رقم) in Arabic, which means "number". This is a math(s) library, one of the reasons to
give this package a try is that, the **_performance_** is the main goal. As some great projects
such as [plotto](https://plotto.netlify.com) and [desmos](https://www.desmos.com) make __intense__ calculations in tons of iterations to generate the graph. The need of such an open-source project
cares about these situations arises, don't forget to contribute by raising an issue at github or
optimizing some algorithms 🚀.

## Features

- Some helpful special maths functions in [core](#core). 
- Compile math expression from a string into js function, ready for evaluation, considering the performance as the main goal.
- Parse math expression.
- The same for latex.
- Convert between latex and math expression.
- Geometric shapes and properties and intersections: [lines](#lines) and [circles](#circles) are available now.
- Use it harmony with other packages such as [fraction.js](https://github.com/infusion/Fraction.js/) and [interval-arithmetics]().

> You can get and import any of Rakam's APIs directly, saving load time and bundle size.

## Table Of Content

<!--ts-->
- [RAKAM ➕ ➗ 📐](#rakam---)
  - [Features](#features)
  - [Table Of Content](#table-of-content)
- [Use It](#use-it)
  - [core](#core)
  - [🛠 engine](#-engine)
    - [math2js](#math2js)
    - [math2latex](#math2latex)
    - [latex2js](#latex2js)
    - [latex2math](#latex2math)
  - [📐 geometry](#-geometry)
    - [angles](#angles)
    - [lines](#lines)
    - [circles](#circles)
  - [➗ fraction](#-fraction)
  - [📜 License](#-license)
<!--te-->

# Use It

Browser.

```html
<script src="https://cdn.jsdelivr.net/npm/rakam/main/index.js"></script>
<script src="https://cdn.jsdelivr.net/npm/rakam/main/index.min.js"></script>
```

`Nodejs`, or import then bundle.

```sh
❯ npm i rakam
```

## core

## 🛠 engine

<!-- CAUTION: the same as the description in the documentations -->

### math2js

Rakam uses [@scicave/math-parser][math-parser] library to parse math expression, then handle the AST, or say the parser tree, to generate the equivalent js code, in a very customizable way. After all of these steps, we easily use [Function constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function#Constructor), `new Function(...)`.

See documentations for more about [math2js][engine-math2js].

### math2latex

To convert ASCII-math expressions into latex representation. Let me rephrase it, `12sinx*2/3` => `12\sin{x} \cdot \frac{2}{3}`.

See documentations for more about [math2latex][engine-math2latex].

### latex2js

Rakam uses [@scicave/math-latex-parser](https://npmjs.com/package/@scicave/math-latex-parser) library to parse latex expression. expression, then handle the AST, to generate the equivalent js code, in a very customizable way. After all of these steps, we easily use [Function constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function#Constructor), `new Function(...)`.

See documentations for more about [latex2js][engine-latex2js].

### latex2math

To convert latex expressions into ASCII-math expressions. Let me rephrase it, `12\sin x\cdot\frac 23` =>  `12sin(x) * 2 / 3`.

See documentations for more about [latex2math][engine-latex2math].

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

- Get a line equation parameters: "a", "b" and "c" in `ax + by + c = 0`.
- Get the intersection points between lines and any other geometric shape such as circles.
- Project a point onto a line.
- Get the distance between a point and a line.

Documentations: [lines][geometry-lines].

### circles

You can:

- Get a line equation parameters: "h", "k" and "r" in `(x-h)^2 + (y-k)^2 = r^2`.
- Get the intersection points between circles and any other geometric shape such as lines.
- Project a point onto a circle.
- Get the distance between a point and a line.

Documentations: [circles][geometry-circles].

## ➗ fraction

In order to adhere to the universal law "DON'T reinvent the wheel", [fraction.js](https://github.com/infusion/Fraction.js/) is a great and fast library to do computations on fractions. You can also use it with harmony with Rakam, see `math2js` and `latex2js`, and the options `chain: true, chainHead: (num)=>{ new Fraction(num) }, chainMap`.

## 📜 License

Copyright (&copy;) 2020 sciCave™ <scicaveteam@gmail.com>

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fscicave%2Frakam.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fscicave%2Frakam?ref=badge_large)

[math-parser]: https://github.com/scicave/math-parser
[math-latex-parser]: https://github.com/scicave/math-latex-parser
[core]: https://github.com/scicave/rakam/blob/master/docs/core.md
[engine-math2js]: https://github.com/scicave/rakam/blob/master/docs/engine/math2js.md
[engine-math2latex]: https://github.com/scicave/rakam/blob/master/docs/engine/math2latex.md
[engine-latex2math]: https://github.com/scicave/rakam/blob/master/docs/engine/latex2math.md
[engine-latex2js]: https://github.com/scicave/rakam/blob/master/docs/engine/latex2js.md
[geometry-angles]: https://github.com/scicave/rakam/blob/master/docs/geometry/angles.md
[geometry-lines]: https://github.com/scicave/rakam/blob/master/docs/geometry/lines.md
[geometry-circles]: https://github.com/scicave/rakam/blob/master/docs/geometry/circles.md
