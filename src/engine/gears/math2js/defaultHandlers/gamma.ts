import { Math2JsHandler } from '../../../types';
import generateJs from '../generateJs';

const intHandler: Math2JsHandler = {
  test(node) {
    return node.checkType('function') && (node.name === 'gamma');
  },

  handle(parserTree, options) {
    // adding function gamma to header
    options.header.add.gamma();
    let arg = generateJs(parserTree.args[0], options);
    return `__scicave_rakam_gamma__(${arg})`;
  },
};

export default intHandler;
