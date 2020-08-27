import mathParser from "@scicave/math-parser";
import UndefinedUsed from "../errors/UndefinedUsed.js";
import addToHeader from "./helper/math2js/addToHeader.js";
import prepareHandlers from "./helper/math2js/prepareHandlers.js";
import prepareScope from "./helper/math2js/prepareScope.js";
import generateJs from './helper/math2js/generateJs.js';

/**
 *
 * @param {String|this.mathParser.Node} math
 * @param {Array} params
 * @param {String} scope is the Object, [Object] or function
 * @param {Boolean} strict
 */
export default function math2js({
  math,
  params = [],
  scope = Math,
  handlers = ["sum", "gamma", "fact", "int", "diff"],
  header = "",
  throwUndefError = false
}) {
  if (math instanceof String) {
    math = mathParser.parse(math);
  }

  header = header instanceof Array ? header : [header];
  header.addedFuncs = [];
  header.addedVars = [];
  addToHeader.header = header;

  prepareScope(scope, header);

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
      .map((h) => h.split("\n"))
      .flat()
      .map((h) => "  " + h),
    `  return (${params.join(", ")})=>${jsExpr};`,
    // "}",
  ].join("\n");

  // using function instead of eval, see https://rollupjs.org/guide/en/#avoiding-eval
  let func = new Function('scope', code);

  return {
    eval: func(),
    code,
  };
}
