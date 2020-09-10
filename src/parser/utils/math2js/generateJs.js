
export default function generateJs(parserTree, { params, scope, handlers, undef, header }) {
  
  for (let h of handlers) {
    if (h.test(parserTree)) {
      return h.handle(parserTree, { params, scope, handlers, undef, header });
    }
  }

  if (parserTree.checkType("number")) {
    return parserTree.value;
  } else if (parserTree.checkType("id")) {
    return getScopedId(parserTree.name, { params, scope, handlers, undef, header });
  } else if (parserTree.checkType("member expression")) {
    let obj, mem;
    // parserTree.args[0] may be another member expression
    if(parserTree.args[0].checkType('id') || parserTree.args[0].checkType('function')){
      obj = generateJs(parserTree.args[0], { params, scope, handlers, undef, header });
    }
    if(parserTree.args[1].checkType('id')){
      mem = parserTree.name;
    } else if (parserTree.args[1].checkType('function')) {
      // this is the samp algorithm in generateJs of type function here below. 
      let args = generateJs(parserTree.args[1].args[0], { params, scope, handlers, undef, header });
      let name = parserTree.args[1].name;
      if (parserTree.args[0].check({ type: "block", name: "()" })) return `${name}${args}`;
      mem = `${name}(${args})`;
      generateJs(parserTree.args[1], { params, scope, handlers, undef, header });
    } else {
      throw new Error('unexpected error happend!');
    }

    return obj + "." + mem;
  } else if (parserTree.checkType("function")) {
    let args = generateJs(parserTree.args[0], { params, scope, handlers, undef, header });
    let name = getScopedId(parserTree.name, { params, scope, handlers, undef, header });
    if (parserTree.args[0].check({ type: "block", name: "()" })) return `${name}${args}`;
    return `${name}(${args})`;
  } else if (parserTree.check({ type: "block", name: "()" })) {
    let opening = "(",
      closing = ")";
    return opening + generateJs(parserTree.args[0], { params, scope, handlers, undef, header }) + closing;
  } else if (parserTree.check({ type: "automult" })) {
    let left = generateJs(parserTree.args[0], { params, scope, handlers, undef, header });
    let right = generateJs(parserTree.args[1], { params, scope, handlers, undef, header });
    let op = '*';
    return left + " " + op + " " + right;
  } else if (parserTree.check({ type: "operator", operatorType: "postfix" })) {
    let arg = generateJs(parserTree.args[0], { params, scope, handlers, undef, header });
    return arg + parserTree.name;
  } else if (parserTree.check({ type: "operator", operatorType: "infix" })) {
    let left = generateJs(parserTree.args[0], { params, scope, handlers, undef, header });
    let right = generateJs(parserTree.args[1], { params, scope, handlers, undef, header });
    let op = parserTree.name;

    switch (parserTree.name) {
      case "^": {
        op = "**";
      }
    }
    return left + " " + op + " " + right;
  } else if (parserTree.check({ type: "operator", operatorType: "unary" })) {
    let arg = generateJs(parserTree.args[0], { params, scope, handlers, undef, header });
    return parserTree.name + arg;
  } else if (parserTree.checkType("delimiter")) {
    let args = [];
    for (let arg of parserTree.args) {
      args.push(generateJs(arg, { params, scope, handlers, undef, header }));
    }
    return args.join(parserTree.name + " ");
  } else {
    throw new Error("can't handle the math parser tree, hint: add handlers throw options");
  }

}

function getScopedId(id, { params, scope, undef, header }){
  
  if (header.addedFuncs.indexOf(id) > -1 || header.addedVars.indexOf(id) > -1 ) {
    throw new Error(`identifier "${id} is used internally before, please change it"`);
  } else if (!scope || params.find((param) => id === param)) {
    return id;
  }

  if (typeof scope === "string") {
    return scope + "." + id;
  } // this (else if) has to be before typeof scope === 'object'
    else if (scope instanceof Array) {
    let found = false;
    for (let i = 0; i < scope.length; i++) {
      if (typeof scope[i] === 'object' && Object.prototype.hasOwnProperty.call(scope[i], id)) {
        found = true;
      } else if (typeof scope[i] === 'function'){
        if (scope[i](id) !== undefined) {
          found = true;
        }
      }
    }
    if (!found) {
      undef.vars.push(id);
    }
    // __scicave_rakam_getId__ is a function in header array iterating throw all scopes
    return `__scicave_rakam_getId__('${id}')`;
  } else if (typeof scope === 'function') {
    // __scicave_rakam_getId__ is the outer function parameter instead of scope by default
    return `__scicave_rakam_getId__('${id}')`;
  } else if (typeof scope === 'object') {
    // scope is the passed object to math2js or by default is Math
    return 'scope.' + id; 
  } else if (scope === null) {
    return id;
  }

  // else, error has been thrown in prepareScope(scope, header), and
  // you shouldn't be here. if statments hereinabove and in prepareScope
  // done all the work, the following thrown error musn't happen
  throw new Error('unexpected error happened'); 

}
