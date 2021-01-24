import addToHeader from '../../addToHeader';
import generateJs from '../generateJs';

export default {
  test(node) {
    return node.check({ type: 'function', name: 'gamma' });
  },

  handle(parserTree, { params, scope, handlers, undef, header }) {
    // adding function fact to header
    addToHeader.gamma();
    let arg = generateJs(parserTree.args[0], { params, scope, handlers, undef, header });
    if (parserTree.args[0].check({ type: 'block', name: '()' })) return `__scicave_rakam_gamma__${arg}`;
    return `__scicave_rakam_gamma__(${arg})`;
  },
};
