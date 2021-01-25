import { Math2JsHandler } from '../../../types';
import generateJs from '../generateJs';

const intHandler: Math2JsHandler = {
  test(node) {
    return node.checkType('function') && (node.name === 'integral' || node.name === 'int');
  },

  handle(parserTree, options) {
    // adding function int to header
    options.header.add.int();
    let arg = generateJs(parserTree.args[0], options);
    return `__scicave_rakam_int__(${arg})`;
  },
};

export default intHandler;
