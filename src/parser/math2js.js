import addToHeader from './helper/addToHeader.js';

/**
 *
 * @param {String|this.mathParser.Node} math
 * @param {Array} params
 * @param {String} scope is the (object name related to window, default: "Math" or "window.Math" ) containing the functions and the variables that is not a parameter.
 * @param {Boolean} strict
 */
export default function math2jsFunction({ math, params = [], scope = "Math", handlers = ["sum", "gamma", "fact", "int", "diff"], header = "", throwUndefError = false }) {
  if (math instanceof String) {
    math = this.mathparser.parse(math);
  }

  header = header instanceof Array ? header : [header];
  header.addedFuncs = [];
  header.addedVars = [];
  addToHeader.header = header;

  if (scope instanceof Array) {
    header.concat([
      "function __scicave_rakam_getId__(id) {",
      "  if (scope[0].hasOwnProperty(id)) {",
      "    return scope[0][id];",
      ...new Array(scope.length - 1).map((s, i) => `  } else if (scope[${i}].hasOwnProperty(id)) {\n    return scope[${i}][id];`).concat(["  }"]),
      "}",
    ]);

    // another way to do this
    // header.push([
    //    "function __scicave_rakam_getId__(id) {",
    //    "  for (let i = 0; i < scope.length; i++) {",
    //    "    if(scope[i].hasOwnProperty(id)) return scope[i][id];",
    //    "  }",
    //    "}",
    // ].join('\n'));
  } else if (scope && typeof scope !== "object") {
    throw new Error('"scope" has to be type of object');
  }

  for (let i = 0; i < handlers.length; i++) {
    if (handlers[i] instanceof String) {
      switch (handlers[i]) {
        case "sum":
          {
            handlers[i] = {
              test(node) {
                return node.checkType("function") && node.callee.checkType("id") && node.callee.name === "sum";
              },

              handle(node) {
                // check validity of sum arguments
                if (!(node.args[0].check({ type: "delimiter", name: "," }) && node.args.length === 4) || !node.args[0].args[1].checkType("id"))
                  throw new Error('sum function has invalid arguments: "' + node.match.text + '"');

                let sumVar = node.args[0].args[1].name;
                let newParams = [...params];
                newParams.push(sumVar);
                let sumExpr = __generateJs_math__(node.args[0].args[0], newParams, scope, handlers, undef, header);
                let start = __generateJs_math__(node.args[0].args[2], params, scope, handlers, undef, header);
                let end = __generateJs_math__(node.args[0].args[3], params, scope, handlers, undef, header);

                let headerFuncName = `__scicave_rakam_${randomName()}__`;
                let _sum = [
                  `function ${headerFuncName}(${params.join(", ")}){`,
                  "  let _ = 0",
                  `  for(var ${sumVar} = ${start}; ${sumVar} <= ${end}; ${sumVar}++){`,
                  `    _ += ${sumExpr};`,
                  "  }",
                  "  return _; ",
                  "}",
                ];
                header.concat(_sum);

                header.addedFuncs.push(headerFuncName);
                return headerFuncName + "(" + params.join(", ") + ")";
              },
            };
          }
          break;

        case "int":
            {
              handlers[i] = {
                test(node) {
                  return node.checkType("function") && node.callee.checkType("id") && node.callee.name === "int";
                },
  
                handle(node) {
                  // adding function fact to header
                  addToHeader.int();
  
                  let arg = __generateJs_math__(node.args[0], params, scope, handlers, undef, header);
                  if (node.args[0].check({ type: "block", name: "()" })) return `__scicave_rakam_int__${arg}`;
                  return `__scicave_rakam_int__(${arg})`;
                },
              };
            }
            break;
            
        case "fact":
          {
            handlers[i] = {
              test(node) {
                return node.check({ type: "operator", operatorType: "postfix", name: "!" });
              },

              handle(node) {
                // adding function fact to header
                addToHeader.fact();

                let arg = __generateJs_math__(node.args[0], params, scope, handlers, undef, header);
                if (node.args[0].check({ type: "block", name: "()" })) return `__scicave_rakam_fact__${arg}`;
                return `__scicave_rakam_fact__(${arg})`;
              },
            };
          }
          break;

        case "gamma":
          {
            handlers[i] = {
              test(node) {
                return node.checkType("function") && node.callee.checkType("id") && node.callee.name === "gamma";
              },

              handle(node) {
                // adding function fact to header
                addToHeader.gamma();

                let arg = __generateJs_math__(node.args[0], params, scope, handlers, undef, header);
                if (node.args[0].check({ type: "block", name: "()" })) return `__scicave_rakam_gamma__${arg}`;
                return `__scicave_rakam_gamma__(${arg})`;
              },
            };
          }
          break;
        
      }
    }
  }

  /// to know the undefined scope varaibles and functions found in the math expression
  /// this help developers to know if the
  let undef = {
    vars: [],
    funcs: [],
  };

  // header may be modifies to add some helper of sub functions
  // "func" will be called to return the ready-to-use eval function.....
  let jsExpr = __generateJs_math__(math, params, scope, handlers, undef, header);

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

function __generateJs_math__(parserTree, params, scope, handlers, undef, header) {
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
    let obj = __generateJs_math__(parserTree.args[0], params, scope, handlers, undef, header);
    let mem = __generateJs_math__(parserTree.args[1], params, scope, handlers, undef, header);
    return obj + "." + mem;
  } else if (parserTree.checkType("function")) {
    let callee = __generateJs_math__(parserTree.callee, params, scope, handlers, undef, header);
    let args = __generateJs_math__(parserTree.args[0], params, scope, handlers, undef, header);
    if (
      parserTree.args[0].check({
        type: "block",
        name: "()",
      })
    )
      return `${callee}${args}`;
    return `${callee}(${args})`;
  } else if (
    parserTree.check({
      type: "block",
      name: "()",
    })
  ) {
    let opening = "(",
      closing = ")";
    return opening + __generateJs_math__(parserTree.args[0], params, scope, handlers, undef, header, header) + closing;
  } else if (
    parserTree.check({
      type: "operator",
      operatorType: "infix",
    })
  ) {
    let left = __generateJs_math__(parserTree.args[0], params, scope, handlers, undef, header);
    let right = __generateJs_math__(parserTree.args[1], params, scope, handlers, undef, header);
    let op = parserTree.name;

    switch (parserTree.name) {
      case "^": {
        op = "**";
      }
    }
    return left + " " + op + " " + right;
  } else if (
    parserTree.check({
      type: "operator",
      operatorType: "postfix",
    })
  ) {
    let arg = __generateJs_math__(parserTree.args[0], params, scope, handlers, undef, header);
    return arg + parserTree.name;
  } else if (
    parserTree.check({
      type: "operator",
      operatorType: "unary",
    })
  ) {
    let arg = __generateJs_math__(parserTree.args[0], params, scope, handlers, undef, header);
    return parserTree.name + arg;
  } else if (parserTree.checkType("delimiter")) {
    let args = [];
    for (let arg of parserTree.args) {
      args.push(__generateJs_math__(arg, params, scope, handlers, undef, header));
    }
    return args.join(parserTree.name + " ");
  } else {
    throw new Error("can't handle the math parser tree, hit: add handlers throw options");
  }
}
