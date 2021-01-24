import randomName from '../../../../utils/randomName';
import { Math2JsHandler } from '../../../types';
import generateJs from '../generateJs';

const sumHandler: Math2JsHandler = {
  test(node) {
    return node.check({ type: 'function', name: 'sum' });
  },

  handle(parserTree, options) {
    let { params, scope, handlers, throwUndefError } = options;
    // check validity of sum arguments
    let delimiter;

    if (
      !(
        parserTree.args[0] &&
        parserTree.args[0].check({ type: 'block', name: '()' }) &&
        (delimiter = parserTree.args[0].args[0]) &&
        delimiter.check({ type: 'delimiter', name: ',' }) &&
        delimiter.args.length === 4 &&
        delimiter.args[1].checkType('id')
      )
    ) {
      throw new Error('sum function has invalid arguments: "' + parserTree.match.text + '"');
    }

    let sumVar, sumExpr, newParams, start, end, headerFuncName, _sum;

    sumVar = delimiter.args[1].name;
    newParams = [...params];
    newParams.push(sumVar);
    sumExpr = generateJs(delimiter.args[0], options);
    start = generateJs(delimiter.args[2], options);
    end = generateJs(delimiter.args[3], options);

    headerFuncName = `__scicave_rakam_${randomName()}__`;
    _sum = [
      `function ${headerFuncName}(${params.join(', ')}){`,
      '  let _ = 0',
      `  for(var ${sumVar} = ${start}; ${sumVar} <= ${end}; ${sumVar}++){`,
      `    _ += ${sumExpr};`,
      '  }',
      '  return _; ',
      '}',
    ];
    header.push(..._sum);

    header.addedFuncs.push(headerFuncName);
    return headerFuncName + '(' + params.join(', ') + ')';
  },
};

export default sumHandler;
