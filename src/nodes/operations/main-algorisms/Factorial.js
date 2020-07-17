
import Node from '../../Node.js';
export default class Factorial extends Node {

    constructor(children) {
        super(children, 1);
        this.type = 'literal';
    }

    calculate(cs, tempVars) {
        return this.F(this.children[0].calculate(cs, tempVars));
    }
    F(n) { return n <= 1 ? 1 : n * this.F(n - 1); }

    derivative(cs) { return new Constant(NaN); }

    simplify() {
        return this;
    }

    isEqual(node) {
        return false;
    }

    toString() {
        return `(${this.children[0]})!`;
    }

}
