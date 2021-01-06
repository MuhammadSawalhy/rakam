# math2latex

To convert ASCII-math expressions into latex representation. Let me rephrase it, `12sinx*2/3` => `12\sin{x} \cdot \frac{2}{3}`.

```js
const { engine: { math2latex } } = require("rakam");
const math2latex = require("rakam").engine.math2latex;
const math2latex = require("rakam/main/engine/math2latex");
// using ES-modules `import`
import math2latex from 'rakam/module/engine/math2latex';

// use it
// math2latex:
// 		(math: string, options: Math2LatexOptions, parserOptions)=>string
math2latex(math, options, parserOptions);
```

----

Examples: 

| ASCII-math              | LaTex                       | Options           |
| ----------------------- | --------------------------- | ----------------- |
| `3abc`                  | `3 \cdot a \cdot b \cdot c` | `autoMult: false` |
| `3abc`                  | `3 * a * b * c` | `autoMult: false, cdot: false` |
| `sinx`                  | `\sin{x}`                   |                   |
| `1+ (sinx)/(tany) >= 6` | `1 + \frac{\sin{x}}{\tan{y}} \geq 6` |                   |
| `[1,2,3; 4,5,6]` | `\begin{matrix} 1 & 2 & 3 \\ 4 & 5 & 6 \end{matrix}` | `matrixType: "matrix"` |
| `(x,y,z)` | `\left(x, y, z\right)` |  |

## math

Type: `string`.

A maths expression that can be parsed by [math-parser][math-parser].

## options
Type: `Math2LatexOptions`.
```typescript
type Math2LatexOptions = {
    autoMult: boolean, // default `true`
    cdot: boolean, // default `true`
    matrixType: "matrix" | "pmatrix" | "bmatrix", // default `"bmatrix"`
};
```

* `autoMult`: to output latex with multiplication operator `\cdot`, or keep them auto-multiplied.

* `cdot`: use `\cdot` instead of `*` when handling a `mathParser.Node` = `{ type: "operator", name: "*", args: [] }`.

  When `autoMult: false, cdot: false`, multiplication will be with `*`.

## parserOptions

Take a look at [math-parser][math-parser] package.

[math-parser]: https://github.com/scicave/math-parser
