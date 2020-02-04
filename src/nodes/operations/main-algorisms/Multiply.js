
import Node from '../../inherited/Node.js';
class Multiply extends Node {
    constructor(children) {
        super(children, 2);
        this.type = 'operator';
    }

    calculate(cs, tempVars) {
        return this.children[0].calculate(cs, tempVars) * this.children[1].calculate(cs, tempVars);
    }

    derivative(cs) {
        return new Add(
            new Multiply(this.children[0], this.children[1].derivative(cs)),
            new Multiply(this.children[1], this.children[0].derivative(cs))
        );
    }

    toString() {
        let child1 = "", child2 = "";

        if (this.children[0].syntaxType == 'literal' || this.children[0].syntaxType == 'function')
            child1 = this.children[0].toString();
        else
            child1 = "(" + this.children[0].toString() + ")";

        if (this.children[1].syntaxType == 'literal' || this.children[1].syntaxType == 'function')
            child2 = this.children[1].toString();
        else
            child2 = "(" + this.children[1].toString() + ")";

        return child1 + " * " + child2;
    }

    simplify() {
        return this;
    }

    isEqual(node) {
        return false;
    }
}
