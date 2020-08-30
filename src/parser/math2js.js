import mathParser from "@scicave/math-parser";
import UndefinedUsed from "../errors/UndefinedUsed.js";
import addToHeader from "./helper/math2js/addToHeader.js";
import prepareHandlers from "./helper/math2js/prepareHandlers.js";
import prepareScope from "./helper/math2js/prepareScope.js";
import generateJs from './helper/math2js/generateJs.js';

// the  default handler will be exported in some cases
export const defaultHandlers = ["sum", "gamma", "fact", "int", "diff"]; 

/**
 * @param {String|this.mathParser.Node} math
 * @param {Array} params
 * @param {String} scope is the Object, [Object] or function
 * @param {Boolean} strict
 */
export default function math2js({
  math,
  params = [],
  scope = Math,
  handlers = defaultHandlers,
  header,
  throwUndefError = false
}) {
  if (typeof math === 'string') {
    math = mathParser.parse(math);
  }

  header = header instanceof Array ? header : header ? [header] : []; /// ? : is left to right 
  header.addedFuncs = [];
  header.addedVars = [];
  addToHeader.header = header;

  // the argument to be passed to func, the outer function
  let funcArgs = prepareScope(scope, header);
  console.log('after prepareScope');
  console.log('scope', scope);
  console.log('header', header);

  prepareHandlers(handlers);

  // to know the undefined scope varaibles and functions found in the math expression
  // this have use-cases, e.g., some thing like "https://www.plotto.netlify.com" or "https://www.desmos.com/caluclator"
  let undef = {
    vars: [],
    funcs: [],
  };

  // header may be modifies to add some helper of sub functions
  // "func" will be called to return the ready-to-use eval function.....
  let jsExpr = generateJs({parserTree: math, params, scope, handlers, undef, header});

  if (undef.vars.length || undef.funcs.length) {
    if (throwUndefError) throw new UndefinedUsed("trying to use undefined variables in the generated js function.", undef);
    // handling repeatition
    undef.vars = undef.vars.reduce((b, a) => {
      if (!b.find((e) => e === a)) b.push(a);
      return b;
    }, []);

    // handling repeatition
    undef.funcs = undef.funcs.reduce((b, a) => {
      if (!b.find((e) => e === a)) b.push(a);
      return b;
    }, []);
  }

  let code = [
    // "(scope) => {",
    ...header
      .map(h => h.split("\n"))
      .flat()
      .map(h => "  " + h),
    `  return (${params.join(", ")})=>${jsExpr};`,
    // "}",
  ].join("\n");

  let funcParams = [typeof scope === 'function' ? '__scicave_rakam_getId__' :  'scope'];

  // using function instead of eval, see https://rollupjs.org/guide/en/#avoiding-eval
  let func = new Function(...funcParams, code);

  return {
    eval: func(...funcArgs),
    code: `(${funcParams.join(', ')})=>{\n${code}\n}`,
  };
}

math2js.defaultHandlers = defaultHandlers;
