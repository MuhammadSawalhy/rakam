import { Math2JsHandler } from '../../../types';
import generateJs from '../generateJs';

const intHandler: Math2JsHandler = {
  test(node) {
    return node.check({ type: "operator", operatorType: "postfix", name: "!" });
  },

  handle(parserTree, options) {
    // adding function fact to header
    options.header.add.fact();
    let arg = generateJs(parserTree.args[0], options);
    return `__scicave_rakam_fact__(${arg})`;
  },
};

export default intHandler;
