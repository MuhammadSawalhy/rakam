//import { Boolean } from './Boolean.js';

import Boolean from './Boolean.js';
export default class GreaterThan extends Boolean {

    constructor(children) {
        super(children, 2);
        this.syntaxType = 'operator';
    }

    calculate(cs, tempVars) {
        let num1 = this.children[0].calculate(cs, tempVars),
            num2 = this.children[1].calculate(cs, tempVars);
        if (!isFinite(num1) || isNaN(num1) || !isFinite(num2) || isNaN(num2)) {
            return NaN;
        }
        if (num1 > num2)
            return 1;
        return 0;
    }

    simplify() {
        let sChild1 = this.children[0].simplify(),
            sChild2 = this.children[1].simplify();
        return new GreaterThan(sChild1, sChild2);
    }

    isEqual(node) {
        if (this.constructor === node.contructor) {
            let sChild1 = this.children[0].simplify(),
                sChild2 = this.children[1].simplify();
            let sChild1_ = this.children[0].simplify(),
                sChild2_ = this.children[1].simplify();
            if (sChild1.isEqual(sChild1_) && sChild2.isEqual(sChild2_)) {
                return true;
            }
        }
        else if (node.type == "LowerThan") {
            let sChild1 = this.children[0].simplify(),
                sChild2 = this.children[1].simplify();
            let sChild1_ = this.children[0].simplify(),
                sChild2_ = this.children[1].simplify();
            if (sChild2.isEqual(sChild1_) && sChild1.isEqual(sChild2_)) {
                return true;
            }
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


        return child1 + " > " + child2;
    }

}
