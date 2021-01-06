# latex2js

Rakam uses [@scicave/math-latex-parser](https://npmjs.com/package/@scicave/math-latex-parser) library to parse latex expression.
expression, then handle the AST, to generate the equivalent js code,
in a very customizable way. After all of these steps, we easily use
[Function constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function#Constructor), `new Function(...)`.

```js
const latex2js = require('rakam').engine.latex2js;
// or
const latex2js = require('rakam').latex2js;
// or
const latex2js = require('rakam/main/engine/latex2js');
// or if you use a bundler, e.g., rollup or webpack
import latex2js from 'rakam/module/engine/latex2js';

let fn = latex2js(latex, options, parserOptions);
console.log(fn); // {eval: Function, code: String}
```

## Limitations

Actually, you can use [handlers](#options.handlers) to defeat these limitations. The following expressions can be parsed but they have special use cases, it is better to create articulated handlers in these cases.  

- Tuples: `1 + (1,2,pi)`.
- Matrices: `[ 1, 2; 3, 4 ]`.
- Ellipsis: `f(1,2, ...,6)`.
- Sets: `{ 1, 2, ..., 6 }`.

## latex

Type: `string | latexParser.Node`.

A latex expression to be parsed with [math-latex-parser][math-latex-parser].

## options

### options.scope
Type: `Scope = Object | Function | Array<Scope> `, Default: `Math`, to get the best performance, don't pass an array.

- passing array of scopes

  ```js
  let { engine } = require('rakam');
  let latex = '\frac yt -\sin x +z';
  let scope = [
    { t: 1, x: 180, },
    { x: 3, y: 4 },
    function getId(id){
      let vars = { z: 1, sin(x){ return Math.sin(x*Math.PI/180) } };
      return vars[id];
    }
  ];
  let generatedJs = engine.latex2js(latex, { scope });

  // testing the result!
  console.log(generatedJs.eval());
  // \frac yt -\sin x +z   ///////////
  // 4 / 1 - Math.sin(Math.PI) + 1
  // === 5                 ///////////
  ```

  <details><summary>This happens behind the scene:</summary>

  ```js
  // behind the scene
  let scope = [
    { t: 1, x: 180, },
    { x: 3, y: 4 },
    function getId(id){
      let vars = { z: 1, sin(x){ return Math.sin(x*Math.PI/180) } };
      return vars[id];
    }
  ];

  generatedJs.eval = (function anonymous(scope) {
    function __scicave_rakam_getId__(id) {
      if (typeof scope[0] === 'object' && scope[0].hasOwnProperty(id)) {
        return scope[0][id];
      }
      else if (typeof scope[0] === 'function' && (a = scope[0](id)) && a !== undefined) {
        return a;
      }
      else if (typeof scope[1] === 'object' && scope[1].hasOwnProperty(id)) {
        return scope[1][id];
      }
      else if (typeof scope[1] === 'function' && (a = scope[1](id)) && a !== undefined) {
        return a;
      }
      else if (typeof scope[2] === 'object' && scope[2].hasOwnProperty(id)) {
        return scope[2][id];
      }
      else if (typeof scope[2] === 'function' && (a = scope[2](id)) && a !== undefined) {
        return a;
      }
      else {
        throw new Error('the scope array has no valid scope in it.');
      }
    }
    return ()=>__scicave_rakam_getId__('y') * __scicave_rakam_getId__('t') - __scicave_rakam_getId__('sin')(__scicave_rakam_getId__('x')) + __scicave_rakam_getId__('z');
  })(scope);
  ```
  
  </details>

### options.handlers
Type: `Array<Handler>`, Default: ` engine.latex2js.defaultHandlers = ["sum", "fact", "gamma", "int"]`.

This default string array is converted into handlers array before starting parsing, you mustn't pass string values. So, what is a handler?

A handler is an ordinary object mainly contains two methods: `test` and `handle`. In other words: 

````typescript
type Handler = {
    test: (latexParser.Node)=> boolean,
    handle: (
    	latexParser.Node /* that passed the test */,
    	HandlingOptions
    ) => string,
};

// CAUTION: fill before release
type HandlingOptions = {
    
}
````

- `test`: receives `math-latex-parser` Node, returns a `boolean` value. It is used in `generateJs` found in `src/parser/utils/latex2js/generateJs.js`.

- `handle`: when the test method returns a `true`, the parser node will be handled here, then a string is returned, representing a portion of the final js expression.

Create your own handler

```js
const defaultHandlers = engine.latex2js.defaultHandlers;

function getTheId = (id)=>{
  //asdasd.....
};

const newHandler = {
  test(node){
    return node.checkType('id');
  },
  handle(node, generateOptions){
    return `getTheId(${node.name})`;
  }
};

const fn = latex2js(latex, { handlers: [...defaultHandlers, newHandler] });
// fn = {eval: Function, code: String}

console.log(fn.code);
```

Use existing handlers by default:

- `sum`, e.g.: `\sum_{n = 1}^{100}n`.

  ```js
  const { engine: { latex2js } } = require('rakam');
  
  let generatedJs = latex2js('\sum_{n = 1}^{100000}n');
  
  /// test the evaluation speed of sum expression iterating 100000 time.
  console.time('evaluation time ⌚');
  generatedJs.eval();
  console.timeEnd('evaluation time ⌚');
  
  // evaluation time ⌚: 0.103ms
  // when the code went hot in node engine in my pc. running it multiple times.
  // astonishing result!!! 💖 alhamdullah!
  ```

  <details><summary>This happens behind the scene:</summary>

  ```js
  // this happens behind the scene:
  let func = eval(generatedJs.code);
  // or
  let func = (scope)=>{
    // scope is the passed object to latex2js or by default is Math
    function __scicave_rakam_egvjeuqa__(){
      let _ = 0
      for(var n = 1; n <= 100000; n++){
        _ += n;
      }
      return _; 
    }
    return ()=>1 + 2 - __scicave_rakam_egvjeuqa__();
  }
  generatedJs.eval = func(Math);
  ```

  </details>

## parserOptions: object

Options for [`@scicave/math-latex-parser`][math-latex-parser].

[math-latex-parser]: https://github.com/scicave/math-parser