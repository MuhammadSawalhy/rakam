import Node from './Node.js';
export default class Constant extends Node {

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
        if (this.constructor === node.contructor) {
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
