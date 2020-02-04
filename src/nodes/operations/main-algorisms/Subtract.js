
import Node from '../../inherited/Node.js';
class Subtract extends Node {
    constructor(children) {
        super(children, 2);
        this.type = 'operator';
    }

    calculate(cs, tempVars) {
        return this.children[0].calculate(cs, tempVars) - this.children[1].calculate(cs, tempVars);
    }

    derivative(cs) {
        return new Subtract(this.children[0].derivative(cs), this.children[1].derivative(cs));
    }

    simplify() {
        let sChild1 = this.children[0].simplify(),
            sChild2 = this.children[1].simplify();

        if (sChild1.isEqual(new Constant(0))) {
            return new Neg(sChild2);
        }
        else if (sChild2.isEqual(new Constant(0))) {
            return sChild1;
        }
        else if (sChild1 instanceof Constant && sChild2 instanceof Constant) {
            return new Constant(sChild1.value + sChild2.value);
        }
        else if (sChild2 instanceof Neg) {
            return new Add(sChild1, sChild2.children[0]);
        }


        return new Subtract(sChild1, sChild2);
    }

    isEqual(node) {
        if (!this.containsVariable) {
            if (!node.containsVariable) {
                let cal = new calculationSettings();
                if (calculate(cal) == node.calculate(cal)) {
                    return true;
                }
            }
            else return false;
        }
        else if (fromTheSame(this, node)) {
            for (let i = 0; i < this.children.length; i++) {
                if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
            }
            return true;
        }
        return false;
    }

    toString() {
        let child1 = "", child2 = "";

        child1 = this.children[0].toString();

        if (this.children[1].syntaxType == 'literal' || this.children[1].syntaxType == 'function')
            child2 = this.children[1].toString();
        else
            child2 = "(" + this.children[1].toString() + ")";

        return child1 + " - " + child2;
    }
}
