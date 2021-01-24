export default {
  test(node) {
    // if (automult enabled) and we found a differentiation
    let a =
      node.check({ type: 'operator', name: '/' }) &&
      node.args[0].checkType('automult') &&
      node.args[0].args[0].check({ type: 'id', name: 'd' }) &&
      node.args[1].checkType('automult') &&
      node.args[1].args[0].check({ type: 'id', name: 'd' });
    if (a) {
      // differentiation data
      this.diffData = {
        node,
        deriveExpr: node.args[0].args[1],
        withRespectTo: node.args[1].args[1],
      };
      return true;
    }

    // if (automult not enabled), the differentiation is defined
    // by explicit function derive(expr, withRespectTo)
    return node.check({ type: 'function', name: 'derive' });
  },

  // eslint-disable-next-line no-unused-vars
  handle(parserTree, { params, scope, handlers, undef, header }) {
    // on the test process, we saved the differentiation process data
    // TODO:
  },
};
