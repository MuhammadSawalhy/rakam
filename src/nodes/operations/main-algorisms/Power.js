
import Node from '../../inherited/Node.js';
class Power extends Node {
    constructor(children) {
        super(children, 2);
        this.type = 'operator';
    }

    calculate(cs, tempVars) {
        return Math.pow(this.children[0].calculate(cs, tempVars), this.children[1].calculate(cs, tempVars));
    }

    derivative(cs) {
        return new Add(
            // the first child of the Add process
            new Multiply(
                new Multiply(
                    this.children[0].derivative(cs),
                    new Power(this.children[0], new Subtract(this.children[1], new Constant(1)))
                ),
                this.children[1]),

            // the second child of the Add process
            new Multiply(
                this.children[1].derivative(cs),
                new Multiply(
                    this,
                    new Ln(new Abs(this.children[0])))
            )
        );
    }

    simplify() {
        return this;
    }

    isEqual(node) {
        return false;
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


        return child1 + " ^ " + child2;

    }
}
