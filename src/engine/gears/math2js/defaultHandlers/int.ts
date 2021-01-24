import { Math2JsHandler } from '../../../types';
import addToHeader from '../../addToHeader';
import generateJs from '../generateJs';

const intHandler: Math2JsHandler = {
  test(node) {
    return node.checkType('function') && (node.name === 'integrate' || node.name === 'int');
  },

  handle(parserTree, options) {
    // adding function fact to header
    addToHeader.int();
    let arg = generateJs(parserTree.args[0], options);
    if (parserTree.args[0].check({ type: 'block', name: '()' })) return `__scicave_rakam_int__${arg}`;
    return `__scicave_rakam_int__(${arg})`;
  },
};

export default intHandler;

