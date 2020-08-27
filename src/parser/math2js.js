import mathParser from "@scicave/math-parser";
import UndefinedUsed from "../errors/UndefinedUsed.js";
import addToHeader from "./helper/math2js/addToHeader.js";
import prepareHandlers from "./helper/math2js/prepareHandlers.js";
import prepareScope from "./helper/math2js/prepareScope.js";

/**
 *
 * @param {String|this.mathParser.Node} math
 * @param {Array} params
 * @param {String} scope is the Object, [Object] or function
 * @param {Boolean} strict
 */
export default function math2jsFunction({
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
  // this have use-cases, e.g., some thing like "www.plotto.netlify.com" or "www.desmos.com/caluclator"
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
    "(scope) => {",
    ...header
      .map((h) => h.split("\n"))
      .flat()
      .map((h) => "  " + h),
    `  return (${params.join(", ")})=>${jsExpr};`,
    "}",
  ].join("\n");

  let func = eval(code);

  return {
    eval: func(),
    code,
  };
}

export function generateJs({parserTree: parserTree, params, scope, handlers, undef, header}) {
  for (let h of handlers) {
    if (h.test(parserTree)) {
      return h.handle(parserTree);
    }
  }

  if (parserTree.checkType("number")) {
    return parserTree.value;
  } else if (parserTree.checkType("id")) {
    if (!scope || params.find((param) => parserTree.name === param)) {
      return parserTree.name;
    }

    if (scope instanceof String) {
      return scope + "." + parserTree.name;
    }

    let found = false;
    for (let i = 0; i < scope.length; i++) {
      if (scope[i].hasOwnProperty(parserTree.name)) {
        found = true;
      }
    }
    if (!found) {
      undef.vars.push(parserTree.name);
    }
    if (scope instanceof Array) {
      // __scicave_rakam_getId__ is a function in header array
      return `__scicave_rakam_getId__(${parserTree.name})`;
    }
    return `scope.${parserTree.name}`;
  } else if (parserTree.checkType("member expression")) {
    let obj = generateJs({parserTree: parserTree.args[0], params, scope, handlers, undef, header});
    let mem = generateJs({parserTree: parserTree.args[1], params, scope, handlers, undef, header});
    return obj + "." + mem;
  } else if (parserTree.checkType("function")) {
    let callee = generateJs({parserTree: parserTree.callee, params, scope, handlers, undef, header});
    let args = generateJs({parserTree: parserTree.args[0], params, scope, handlers, undef, header});
    if (parserTree.args[0].check({ type: "block", name: "()", }))
      return `${callee}${args}`;
    return `${callee}(${args})`;
  } else if (parserTree.check({ type: "block", name: "()", })) {
    let opening = "(",
      closing = ")";
    return opening + generateJs({parserTree: parserTree.args[0], params, scope, handlers, undef, header}) + closing;
  } else if (parserTree.check({ type: "operator", operatorType: "infix", })) {
    let left = generateJs({parserTree: parserTree.args[0], params, scope, handlers, undef, header});
    let right = generateJs({parserTree: parserTree.args[1], params, scope, handlers, undef, header});
    let op = parserTree.name;

    switch (parserTree.name) {
      case "^": {
        op = "**";
      }
    }
    return left + " " + op + " " + right;
  } else if (parserTree.check({ type: "operator", operatorType: "postfix", })) {
    let arg = generateJs({parserTree: parserTree.args[0], params, scope, handlers, undef, header});
    return arg + parserTree.name;
  } else if (parserTree.check({ type: "operator", operatorType: "unary", })) {
    let arg = generateJs({parserTree: parserTree.args[0], params, scope, handlers, undef, header});
    return parserTree.name + arg;
  } else if (parserTree.checkType("delimiter")) {
    let args = [];
    for (let arg of parserTree.args) {
      args.push(generateJs({parserTree: arg, params, scope, handlers, undef, header}));
    }
    return args.join(parserTree.name + " ");
  } else {
    throw new Error("can't handle the math parser tree, hit: add handlers throw options");
  }
}

