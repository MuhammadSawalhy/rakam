
import Node from '../../Node.js';
export default class nPr extends Node {
    constructor(children) {
        super(children, 2);
        this.type = 'operator';
    }
    calculate(cs, tempVars) {
        return this.P_(this.children[0].calculate(cs, tempVars), this.children[1].calculate(cs, tempVars));
    }
    P_(n, k) {
        return k <= 0 ? 1 : k > n ? 0 : n * P_(n - 1, k - 1);
    }


    derivative(cs) { return new Constant(NaN); }

    simplify() {
        return new nPr(this.children[0].simplify(), this.children[1].simplify());
    }

    isEqual(node) {
        if (this.constructor === node.contructor) {
            for (let i = 0; i < this.children.length; i++) {
                if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
            }
            return true;
        }
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


        return child1 + " P " + child2;
    }
}
