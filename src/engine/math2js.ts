import UndefinedUsed from '../error/UndefinedUsed';
import prepareScope from './gears/prepareScope';
import generateJs from './gears/math2js/generateJs';
import defaultHandlers from './gears/math2js/defaultHandlers';
import type { Math2JsHandlingOptions, Math2JsOptions } from './types';
import HeaderUtils from './gears/HeaderUtils';

export default function math2js(math: string | MathParserNode, options: Math2JsOptions = {}, parserOptions = {}) {
  let defaultOptions: Math2JsOptions = {
    params: [],
    scope: Math,
    handlers: defaultHandlers,
    throwUndefError: false,
  };

  options = Object.assign(defaultOptions, options);

  let { params, scope, handlers, header, throwUndefError } = options;

  // parse if it is a string, we need AST
  let ast: MathParserNode = typeof math === 'string' ? mathParser.parse(math, parserOptions) : math;

  // to know the undefined scope varaibles and functions found in the math expression
  // this have use-cases, e.g., some thing like:
  // "https://www.plotto.netlify.com" or "https://www.desmos.com/caluclator"
  let undefs = {
    vars: [],
    funcs: [],
  };

  // create HeaderUtils instance to manage code inside the outer function 
  let headerUtils = new HeaderUtils(options);

  let handlingOptions: Math2JsHandlingOptions = {
    params, scope, header: headerUtils, undefs, handlers
  };

  // the argument to be passed to func, the outer function
  // the args to be passed when calling it, `CallExpression`
  let [outerFuncParams, outerFuncArgs] = prepareScope(scope, headerUtils);

  // header may be modified to add some helper functions and constants
  // the outer function will be called to return the ready-to-use eval function.....
  let jsExpr = generateJs(ast, handlingOptions);

  if (undefs.vars.length || undefs.funcs.length) {
    if (throwUndefError)
      throw new UndefinedUsed('trying to use undefined variables.', undefs);
    // we filter repeated ids
    undefs.vars = undefs.vars.reduce((set: Set<string>, id: string) => {
      set.add(id);
      return set;
    }, new Set());

    // we filter repeated ids
    undefs.funcs = undefs.funcs.reduce((set: Set<string>, id: string) => {
      set.add(id);
      return set;
    }, new Set());

  }

  let code = 
    `${headerUtils.getCode()}\n  return (${params.join(', ')})=>${jsExpr};`;

  // using function instead of eval, see
  // https://rollupjs.org/guide/en/#avoiding-eval
  // technically, the same vulnerability still exists, but rollup negected it 👌.
  // more over this is more efficient than using `eval`
  // I think there is no vulnerability as we parse the expression
  // the expression has to be valid, we then generate the code ourselves.
  let func = new Function(...outerFuncParams, code);

  return {
    eval: func(...outerFuncArgs),
    code: `(${params.join(', ')})=>{\n${code}\n}`,
  };
}

math2js.defaultHandlers = defaultHandlers;
math2js.generateJs = generateJs;
