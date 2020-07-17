
import Node from './Node.js';
export default class Vector extends Node {

    constructor(x, y, _get = undefined, name_ = null) {
        super([], 0);
        this.syntaxType = 'literal';
        this.name = name_;
        this.x = x;
        this.y = y;
        this.get = _get;
    }

    calculate(cs, tempVars) {
        switch (get) {
            case 'x':
                return this.x.calculate(cs, tempVars);
            case 'y':
                return this.y.calculate(cs, tempVars);
        }
        return NaN;
    }

    derivative(cs) {
        return new Constant(0);
    }

    simplify() {
        return this;
    }

    isEqual(node) {
        return false;
    }

    toString() {
        return `(${this.x.toString()}, ${this.y.toString()})`;
    }

}

