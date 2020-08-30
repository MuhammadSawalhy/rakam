export default function generateJs({ parserTree: parserTree, params, scope, handlers, undef, header }) {
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

    if (typeof scope === "string") {
      return scope + "." + parserTree.name;
    } else if (scope instanceof Array) {
      let found = false;
      for (let i = 0; i < scope.length; i++) {
        if (scope[i].hasOwnProperty(parserTree.name)) {
          found = true;
        }
      }
      if (!found) {
        undef.vars.push(parserTree.name);
      }
      // __scicave_rakam_getId__ is a function in header array iterating throw all scopes
      return `__scicave_rakam_getId__('${parserTree.name}')`;
    } else if (typeof scope === 'object') {
      // scope is the passed object to math2js or by default is Math
      return 'scope.' + parserTree.name; 
    } else if (typeof scope === 'function') {
      // __scicave_rakam_getId__ is the outer function parameter instead of scope by default
      return `__scicave_rakam_getId__('${parserTree.name}')`;
    } 
    // else, error has been thrown in prepareScope(scope, header), and
    // you shouldn't be here. if statments hereinabove and in prepareScope
    // done all the work, the following thrown error musn't happen
    throw new Error('unexpected error happened'); 

  } else if (parserTree.checkType("member expression")) {
    let obj = generateJs({ parserTree: parserTree.args[0], params, scope, handlers, undef, header });
    let mem = generateJs({ parserTree: parserTree.args[1], params, scope, handlers, undef, header });
    return obj + "." + mem;
  } else if (parserTree.checkType("function")) {
    let callee = generateJs({ parserTree: parserTree.callee, params, scope, handlers, undef, header });
    let args = generateJs({ parserTree: parserTree.args[0], params, scope, handlers, undef, header });
    if (parserTree.args[0].check({ type: "block", name: "()" })) return `${callee}${args}`;
    return `${callee}(${args})`;
  } else if (parserTree.check({ type: "block", name: "()" })) {
    let opening = "(",
      closing = ")";
    return opening + generateJs({ parserTree: parserTree.args[0], params, scope, handlers, undef, header }) + closing;
  } else if (parserTree.check({ type: "operator", operatorType: "infix" })) {
    let left = generateJs({ parserTree: parserTree.args[0], params, scope, handlers, undef, header });
    let right = generateJs({ parserTree: parserTree.args[1], params, scope, handlers, undef, header });
    let op = parserTree.name;

    switch (parserTree.name) {
      case "^": {
        op = "**";
      }
    }
    return left + " " + op + " " + right;
  } else if (parserTree.check({ type: "operator", operatorType: "postfix" })) {
    let arg = generateJs({ parserTree: parserTree.args[0], params, scope, handlers, undef, header });
    return arg + parserTree.name;
  } else if (parserTree.check({ type: "operator", operatorType: "unary" })) {
    let arg = generateJs({ parserTree: parserTree.args[0], params, scope, handlers, undef, header });
    return parserTree.name + arg;
  } else if (parserTree.checkType("delimiter")) {
    let args = [];
    for (let arg of parserTree.args) {
      args.push(generateJs({ parserTree: arg, params, scope, handlers, undef, header }));
    }
    return args.join(parserTree.name + " ");
  } else {
    throw new Error("can't handle the math parser tree, hit: add handlers throw options");
  }
}
