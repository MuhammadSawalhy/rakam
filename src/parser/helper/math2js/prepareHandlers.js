  
export default function prepareHandlers(handlers){

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
                let sumExpr = generateJs({parserTree: node.args[0].args[0], params: newParams, scope, handlers, undef, header});
                let start = generateJs({parserTree: node.args[0].args[2], params, scope, handlers, undef, header});
                let end = generateJs({parserTree: node.args[0].args[3], params, scope, handlers, undef, header});

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
                return node.checkType("function") && node.callee.checkType("id") && node.callee.name === "integrate";
              },

              handle(node) {
                // adding function fact to header
                addToHeader.int();

                let arg = generateJs({parserTree: node.args[0], params, scope, handlers, undef, header});
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

                let arg = generateJs({parserTree: node.args[0], params, scope, handlers, undef, header});
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

                let arg = generateJs({parserTree: node.args[0], params, scope, handlers, undef, header});
                if (node.args[0].check({ type: "block", name: "()" })) return `__scicave_rakam_gamma__${arg}`;
                return `__scicave_rakam_gamma__(${arg})`;
              },
            };
          }
          break;
      }
    }
  }

}
