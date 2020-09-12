
# RAKAM

[![NPM Package](https://img.shields.io/npm/v/rakam.svg?style=flat)](https://npmjs.org/package/angles "View this project on npm")
[![Build Status](https://travis-ci.org/scicave/rakam.svg)](https://travis-ci.org/infusion/Angles.js)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Rakam or (رقم) in Arabic, which means "number". This is a math library. Lots of new, breaking, unprecedented features such as `parser`, which provides the method [math2js](#math2js). You can find the package useful when dealing with geometric chapes and angles, use [geometry](#geometry).

-------------------------------
Here is some ready-to-use features:
# parser

```js
let {parser} = require('rakam');
```

## math2js

Rakam is using [@scicave/math-parser](https://npmjs.com/package/@scicave/math-parser) library to parse math expression, then handle the AST, or say the parser tree, to generate the equivalent js code, in a very customizable way. After all of these steps, we easily use `new Function(...)` in vanilla js (the native js).

```js
let {math2js} = require('rakam').parser;
// math2js(math, options, parserOptions);
```

> See documentations for more about [math2js](https://github.com/scicave/rakam/blob/master/docs/parser/math2js.md)


# geometry

## angles
You can:

- Convert angles from unit to another one (e.g. from deg to red or rad to grad, etc...).
- Calculate the angle between two vectors, `{ x: number, y: number }`. You can also calculate the angle between two lines.
- In both cases, between vectors or lines, you can get the minimal or maximal angle, or get the angle when the first vector (or line) rotates by it reaching the other vector (or line).
- Calculate the angle in degree (as float number), and get it as `{deg: number, min: number, sec: number}`, degree, minutes and seconds.
- Or get it as `12° 26' 53.48"`


Usage:

```js
const angles = require('rakam').geometry.angles;
```


> Documentations: [angles](https://github.com/scicave/rakam/blob/master/docs/geometry/angles.md)


# License

Copyright (C) 2020 sciCave™ <scicaveteam@gmail.com>

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

