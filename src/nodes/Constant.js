import Node from './inherited/Node.js';
class Constant extends Node {

    constructor(value, name_ = null) {
        super([], 0);
        this.syntaxType = 'literal';
        this.name = name_;
        this.value = value;
    }

    calculate(cs, tempVars) {
        return this.value;
    }

    derivative(cs) {
        return new Constant(0);
    }

    simplify() {
        return this;
    }

    isEqual(node) {
        if (fromTheSame(this, node)) {
            if (this.value === node.value) {
                return true;
            }
        }
        return false;
    }

    toString() {
        return this.value.toString();
    }

}
