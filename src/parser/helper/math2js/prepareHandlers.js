import addToHeader from "./addToHeader.js";
import randomName from '../../../helper/randomName.js';
import generateJs from './generateJs.js';

export default function prepareHandlers(handlers){
  for (let i = 0; i < handlers.length; i++) {
    if (typeof handlers[i] === 'string') {
      switch (handlers[i]) {
        case "sum":
          {
            handlers[i] = {
              test(node) {
                return node.check({ type: "function", name: 'sum' });
              },

              handle(parserTree, {params, scope, handlers, undef, header}) {
                // check validity of sum arguments
                let delimiter, sumVar, sumExpr, newParams, start, end, headerFuncName, _sum; 

                if (
                  parserTree.args[0].check({ type: "block", name: "()" }) &&
                  parserTree.args[0].args[0].check({ type: "delimiter", name: "," })
                ){
                  delimiter = parserTree.args[0].args[0];
                  if(!(delimiter.args.length === 4 && delimiter.args[1].checkType('id'))){
                    throw new Error('sum function has invalid arguments: "' + parserTree.match.text + '"');
                  }
                }

                sumVar = delimiter.args[1].name;
                newParams = [...params];
                newParams.push(sumVar);
                sumExpr = generateJs(delimiter.args[0], { params: newParams, scope, handlers, undef, header});
                start = generateJs(delimiter.args[2], { params, scope, handlers, undef, header});
                end = generateJs(delimiter.args[3], { params, scope, handlers, undef, header});

                headerFuncName = `__scicave_rakam_${randomName()}__`;
                _sum = [
                  `function ${headerFuncName}(${params.join(", ")}){`,
                  "  let _ = 0",
                  `  for(var ${sumVar} = ${start}; ${sumVar} <= ${end}; ${sumVar}++){`,
                  `    _ += ${sumExpr};`,
                  "  }",
                  "  return _; ",
                  "}",
                ];
                header.push(..._sum);

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
                return node.checkType("function") && (node.name === "integrate" || node.name === 'int');
              },

              handle(parserTree, {params, scope, handlers, undef, header}) {
                // adding function fact to header
                addToHeader.int(header);

                let arg = generateJs(parserTree.args[0], { params, scope, handlers, undef, header });
                if (parserTree.args[0].check({ type: "block", name: "()" })) return `__scicave_rakam_int__${arg}`;
                return `__scicave_rakam_int__(${arg})`;
              },
            };
          }
          break;

        case "diff":
          {
            handlers[i] = {
              test(node) {

                // if (automult enabled) and we found a differentiation
                let a = 
                  node.check({type: "operator", name: '/'}) && 
                  node.args[0].checkType('automult') && node.args[0].args[0].check({type: 'id', name: 'd'}) &&
                  node.args[1].checkType('automult') && node.args[1].args[0].check({type: 'id', name: 'd'})
                ;
                
                if(a){
                  // differentiation data
                  this.diffData = {
                    node,
                    deriveExpr: node.args[0].args[1],
                    withRespectTo: node.args[1].args[1],
                  }
                  return true;
                }

                // if (automult not enabled), the differentiation is defined
                // by explicit function derive(expr, withRespectTo)
                return node.check({ type: 'function', name: 'derive' });
              },

              handle(parserTree, {params, scope, handlers, undef, header}) {
                // on the test process, we saved the differentiation process data
                // TODO:
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

              handle(parserTree, {params, scope, handlers, undef, header}) {
                // adding function fact to header
                addToHeader.fact(header);

                let arg = generateJs(parserTree.args[0], { params, scope, handlers, undef, header });
                if (parserTree.args[0].check({ type: "block", name: "()" })) return `__scicave_rakam_fact__${arg}`;
                return `__scicave_rakam_fact__(${arg})`;
              },
            };
          }
          break;

        case "gamma":
          {
            handlers[i] = {
              test(node) {
                return node.check({ type: 'function', name: 'gamma' });
              },

              handle(parserTree, {params, scope, handlers, undef, header}) {
                // adding function fact to header
                addToHeader.gamma(header);

                let arg = generateJs(parserTree.args[0], { params, scope, handlers, undef, header });
                if (parserTree.args[0].check({ type: "block", name: "()" })) return `__scicave_rakam_gamma__${arg}`;
                return `__scicave_rakam_gamma__(${arg})`;
              },
            };
          }
          break;
      }
    }
  }
}
