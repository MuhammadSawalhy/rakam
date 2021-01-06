# latex2math

To convert latex expressions into ASCII-math expressions. Let me rephrase it, `12\sin x\cdot\frac 23` =>  `12sin(x)*2/3`.

```js
const { engine: { latex2math } } = require("rakam");
const latex2math = require("rakam").engine.latex2math;
const latex2math = require("rakam/main/engine/latex2math");
// using ES-modules `import`
import latex2math from 'rakam/module/engine/latex2math';

// use it
// latex2math:
//     (latex: string, options: Latex2MathOptions, parserOptions)=>string
latex2math(math, options, parserOptions);
```

----

Examples: 

| LaTex                       | ASCII-math              | Options           |
| --------------------------- | ----------------------- | ----------------- |
| `3ab\cdot c` | `3abc`                  |                   |
| `3ab\cdot c` | `3*a*b*c`               | `autoMult: false` |
| `\sin{x}`                   | `sin(x)`                |                   |
| `1 + \frac{\sin{x}}{\tan{y}} \geq 6` | `1+ sin(x)/tan(y) >= 6` |                   |
| `\begin{matrix} 1 & 2 & 3 \\ 4 & 5 & 6 \end{matrix}` | `[ 1, 2, 3 ; 4, 5, 6 ]` |  |
| `\left(x, y, z\right)` | `(x, y, z)` |  |

## math

Type: `string`.

A latex expression that can be parsed by [math-latex-parser][math-latex-parser].

## options
Type: `Latex2MathOptions`.
```typescript
type Latex2MathOptions = {
    autoMult: boolean, // default `true`
};
```

* `autoMult`: to output latex with multiplication operator `\cdot`, or keep them auto-multiplied.

## parserOptions

Take a look at [math-latex-parser][math-parser] package.

[math-latex-parser]: https://github.com/scicave/math-latex-parser	"" math-latex-parser github repo ""
