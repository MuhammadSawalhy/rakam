import { Math2JsHandler, Math2JsHandlingOptions } from '../../../types';
import generateJs from '../generateJs';

const sumHandler: Math2JsHandler = {
  test(node) {
    return node.check({ type: 'function', name: 'sum' });
  },

  handle(parserTree, options: Math2JsHandlingOptions) {
    // parserTree.args: [expr, var, from, to]
    let { params, header } = options;

    // check validity of sum arguments
    if (!(parserTree.args[0] && parserTree.args.length === 4 && parserTree.args[1].checkType('id'))) {
      throw new Error('sum function has invalid arguments: "' + parserTree.match.text + '"');
    }

    let sumVar: string, sumExpr: string, start: string, end: string, headerFuncName: string, sumFunc: string[];

    sumVar = parserTree.args[1].name;
    sumExpr = generateJs(parserTree.args[0], options);
    start = generateJs(parserTree.args[2], options);
    end = generateJs(parserTree.args[3], options);

    headerFuncName = header.getRandomId();
    sumFunc = [
      `function ${headerFuncName}(${params.join(', ')}){`,
      '  let _ = 0;',
      `  for(var ${sumVar} = ${start}; ${sumVar} <= ${end}; ${sumVar}++){`,
      `    _ += ${sumExpr};`,
      '  }',
      '  return _; ',
      '}',
    ];

    header.pushLines(...sumFunc);
    header.declaredFuncs.push(headerFuncName);
    return headerFuncName + '(' + params.join(', ') + ')';
  },
};

export default sumHandler;
